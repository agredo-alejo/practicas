import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { root } from '../scripts/catalog.mjs';

const archive = path.join(root, 'public/legacy');
const projects = JSON.parse(await readFile(path.join(root, 'src/content/projects.json'), 'utf8'));
const manifest = JSON.parse(await readFile(path.join(root, 'src/content/archive-manifest.json'), 'utf8'));

test('every original tracked file is preserved, allowing Git line-ending conversion', async () => {
  assert.equal(manifest.length, 365);
  for (const original of manifest) {
    let contents = await readFile(path.join(archive, original.path));
    if (original.text) contents = Buffer.from(contents.toString('latin1').replaceAll('\r\n', '\n'), 'latin1');
    const oid = createHash('sha1').update(`blob ${contents.length}\0`).update(contents).digest('hex');
    assert.equal(oid, original.gitBlob, original.path);
  }
});

test('every original project folder and nested demo is represented once', async () => {
  const slugs = new Set(projects.map(project => project.slug));
  assert.equal(slugs.size, projects.length, 'project URLs must be unique');
  assert.equal(projects.filter(project => !project.nested).length, 67);
  for (const category of ['machine-learning', 'simulations', 'graphics', 'math', 'games', 'web-practice', 'experiments', 'shared']) {
    for (const folder of await readdir(path.join(archive, category), { withFileTypes: true })) {
      if (folder.isDirectory()) assert.ok(projects.some(project => project.path === `${category}/${folder.name}`), folder.name);
    }
  }
  for (const project of projects) {
    assert.ok(project.stage >= 1 && project.stage <= 6, project.slug);
    assert.ok(project.description.length > 20, project.slug);
    for (const file of project.files) assert.ok((await stat(path.join(archive, project.path, file))).isFile(), file);
  }
});

test('every demo resolves and every missing active HTML reference is disclosed', async () => {
  for (const project of projects) {
    if (!project.demo) continue;
    const entry = path.join(root, 'public', project.demo);
    const html = (await readFile(entry, 'utf8')).replace(/<!--[\s\S]*?-->/g, '');
    for (const match of html.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/g)) {
      const ref = match[1];
      if (/^(?:[a-z]+:|\/\/|#)/i.test(ref)) continue;
      let exists = false;
      try { exists = (await stat(path.resolve(path.dirname(entry), ref.split(/[?#]/)[0]))).isFile(); } catch {}
      if (!exists) assert.ok(project.issues.includes(ref), `${project.slug}: undisclosed missing file ${ref}`);
    }
    assert.equal(project.status === 'incomplete', project.issues.length > 0, project.slug);
  }
});

test('the PHP-named CSS Grid exercise has an equivalent static HTML entry', async () => {
  const base = path.join(archive, 'web-practice/css-grid');
  assert.deepEqual(await readFile(path.join(base, 'index.php')), await readFile(path.join(base, 'index.html')));
  assert.equal(projects.find(project => project.folder === 'css-grid').demo, '/legacy/web-practice/css-grid/index.html');
});

test('the conceptual journey links only to catalogued projects', async () => {
  const source = await readFile(path.join(root, 'src/lib/projects.ts'), 'utf8');
  const picks = [...source.matchAll(/picks: \[([^\]]+)\]/g)];
  assert.equal(picks.length, 6);
  for (const pick of picks) for (const match of pick[1].matchAll(/"([^"]+)"/g)) {
    assert.ok(projects.some(project => project.slug === match[1]), match[1]);
  }
});
