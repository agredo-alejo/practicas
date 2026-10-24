import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm, readdir } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { addProject } from '../scripts/add-project.mjs';
import { categoryIds, generateCatalog } from '../scripts/catalog.mjs';

async function workspace(t) {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'practicas-add-'));
  t.after(async () => {
    // Validate the exact disposable fixture before recursively removing it.
    assert.equal(path.dirname(directory), path.resolve(os.tmpdir()));
    assert.ok(path.basename(directory).startsWith('practicas-add-'));
    await rm(directory, { recursive: true, force: true });
  });
  await mkdir(path.join(directory, 'src/content'), { recursive: true });
  await writeFile(path.join(directory, 'src/content/project-notes.json'), '{}');
  for (const category of categoryIds) await mkdir(path.join(directory, 'public/legacy', category), { recursive: true });
  return directory;
}

test('a new local experiment becomes a catalogued demo without changing app code', async t => {
  const root = await workspace(t);
  const added = await addProject(['flow-field', '--category', 'simulations', '--title', 'A <field>', '--tags', 'vectors, particles'], root);
  const catalog = await generateCatalog(root);
  assert.equal(catalog.length, 1);
  assert.equal(catalog[0].demo, '/legacy/simulations/flow-field/index.html');
  assert.equal(catalog[0].stage, 3);
  assert.deepEqual(catalog[0].tags, ['vectors', 'particles']);
  assert.deepEqual(catalog[0].issues, []);
  assert.match(await readFile(path.join(added.directory, 'index.html'), 'utf8'), /A &lt;field&gt;/);
  assert.ok(catalog[0].files.includes('project.json'));
  await assert.rejects(addProject(['flow-field', '--category', 'simulations'], root), { code: 'EEXIST' });
  assert.equal(JSON.parse(await readFile(path.join(added.directory, 'project.json'), 'utf8')).title, 'A <field>');
});

test('linked projects join the notebook without creating a misleading local demo', async t => {
  const root = await workspace(t);
  const added = await addProject(['other-project', '--url', 'https://example.com', '--source', 'https://github.com/example/project'], root);
  const [entry] = await generateCatalog(root);
  assert.equal(entry.status, 'linked');
  assert.equal(entry.demo, null);
  assert.equal(entry.url, 'https://example.com');
  assert.equal(entry.source, 'https://github.com/example/project');
  assert.deepEqual(await readdir(added.directory), ['project.json']);
});

test('invalid paths, stages, categories, and unsafe links are rejected before writing', async t => {
  const root = await workspace(t);
  for (const args of [['../outside'], ['new', '--category', '../outside'], ['new', '--stage', '9'], ['new', '--url', 'javascript:alert(1)'], ['new', '--unknown', 'value']]) await assert.rejects(addProject(args, root));
  for (const category of categoryIds) assert.deepEqual(await readdir(path.join(root, 'public/legacy', category)), []);
});

test('dropping in a folder works even before writing project notes', async t => {
  const root = await workspace(t);
  const folder = path.join(root, 'public/legacy/experiments/quick-sketch');
  await mkdir(folder);
  await writeFile(path.join(folder, 'index.html'), '<!doctype html><title>A sketch</title>');
  const [entry] = await generateCatalog(root);
  assert.equal(entry.title, 'quick-sketch');
  assert.equal(entry.stage, 1);
  assert.equal(entry.demo, '/legacy/experiments/quick-sketch/index.html');
});
