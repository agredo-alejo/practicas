import { readdir, readFile, writeFile, stat, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const categories = ['machine-learning', 'simulations', 'graphics', 'math', 'games', 'web-practice', 'experiments', 'shared'];
export const categoryIds = categories;
export const defaultStages = { 'machine-learning': 5, simulations: 3, graphics: 2, math: 2, games: 3, 'web-practice': 1, experiments: 1, shared: 5 };

export function validateMetadata(metadata) {
  if (!metadata || typeof metadata !== 'object' || typeof metadata.title !== 'string' || !metadata.title.trim() || typeof metadata.description !== 'string' || !metadata.description.trim()) throw new Error('A project needs a title and description.');
  if (!Number.isInteger(metadata.stage) || metadata.stage < 1 || metadata.stage > 6) throw new Error('Stage must be a whole number from 1 to 6.');
  if (!Array.isArray(metadata.tags) || metadata.tags.some(tag => typeof tag !== 'string')) throw new Error('Tags must be a list of strings.');
  for (const field of ['url', 'source']) if (metadata[field] !== undefined) {
    const url = new URL(metadata[field]);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error(`${field} must use http or https.`);
  }
  return metadata;
}

export async function walk(folder) {
  const entries = await readdir(folder, { withFileTypes: true });
  const nested = await Promise.all(entries.filter(e => !e.name.startsWith('.')).map(async e => {
    const target = path.join(folder, e.name);
    return e.isDirectory() ? walk(target) : [target];
  }));
  return nested.flat().sort();
}

async function exists(file) {
  try { return (await stat(file)).isFile(); } catch { return false; }
}

export async function generateCatalog(workspace = root) {
  const archive = path.join(workspace, 'public', 'legacy');
  const notes = JSON.parse(await readFile(path.join(workspace, 'src/content/project-notes.json'), 'utf8'));
  const projects = [];
  for (const category of categories) {
    const folders = (await readdir(path.join(archive, category), { withFileTypes: true })).filter(e => e.isDirectory()).map(e => e.name).sort();
    // Include the original top-level collections and their nested runnable demos.
    const nested = Object.keys(notes).filter(key => key.startsWith('neuralnet/'));
    const paths = category === 'machine-learning' ? [...folders, ...nested] : folders;
    for (const folder of paths) {
      const directory = path.join(archive, category, folder);
      const oldNotes = notes[folder];
      let metadata = oldNotes ? { title: oldNotes[0], description: oldNotes[1], stage: oldNotes[2], tags: oldNotes[3] } : { title: folder.split('/').at(-1), description: 'A new experiment. Notes will take shape as I work on it.', stage: defaultStages[category], tags: [] };
      if (await exists(path.join(directory, 'project.json'))) metadata = { ...metadata, ...JSON.parse(await readFile(path.join(directory, 'project.json'), 'utf8')) };
      const { title, description, stage, tags, url, source } = validateMetadata(metadata);
      const files = (await walk(directory)).map(file => path.relative(directory, file).replaceAll('\\', '/'));
      let entry = files.includes('index.html') ? 'index.html' : null;
      if (files.includes('index.php')) {
        const php = await readFile(path.join(directory, 'index.php'), 'utf8');
        if (php.includes('<?')) throw new Error('PHP execution is not supported by this static site.');
        // The original PHP file is plain HTML. Preserve it and add a static entry.
        await copyFile(path.join(directory, 'index.php'), path.join(directory, 'index.html'));
        if (!files.includes('index.html')) files.push('index.html');
        entry = 'index.html';
      }
      const issues = [];
      if (entry) {
        const html = (await readFile(path.join(directory, entry), 'utf8')).replace(/<!--[\s\S]*?-->/g, '');
        for (const match of html.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/g)) {
          const ref = match[1];
          if (/^(?:[a-z]+:|\/\/|#)/i.test(ref)) continue;
          const target = path.resolve(directory, ref.split(/[?#]/)[0]);
          if (!await exists(target)) issues.push(ref);
        }
      }
      const sourceOnly = !entry || ['imaginary', 'fuck'].includes(folder);
      projects.push({
        slug: `${category}-${folder.replaceAll('/', '-').toLowerCase()}`,
        folder, category, title, description, stage, tags,
        path: `${category}/${folder}`,
        demo: sourceOnly || url ? null : `/legacy/${category}/${folder}/${entry}`,
        status: url ? 'linked' : sourceOnly ? 'source' : issues.length ? 'incomplete' : 'archived',
        ...(url ? { url } : {}),
        ...(source ? { source } : {}),
        issues: [...new Set(issues)],
        files,
        nested: folder.includes('/'),
      });
    }
  }
  await writeFile(path.join(workspace, 'src/content/projects.json'), JSON.stringify(projects, null, 2) + '\n');
  console.log(`Catalogued ${projects.length} entries, including ${projects.filter(p => p.nested).length} nested demos.`);
  return projects;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await generateCatalog();
