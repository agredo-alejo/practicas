import { readdir, readFile, writeFile, stat, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const archive = path.join(root, 'public', 'legacy');
const categories = ['machine-learning', 'simulations', 'graphics', 'math', 'games', 'web-practice', 'experiments', 'shared'];

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

export async function generateCatalog() {
  const notes = JSON.parse(await readFile(path.join(root, 'src/content/project-notes.json'), 'utf8'));
  const projects = [];
  for (const category of categories) {
    const folders = (await readdir(path.join(archive, category), { withFileTypes: true })).filter(e => e.isDirectory()).map(e => e.name).sort();
    // Include the original top-level collections and their nested runnable demos.
    const nested = Object.keys(notes).filter(key => key.startsWith('neuralnet/'));
    const paths = category === 'machine-learning' ? [...folders, ...nested] : folders;
    for (const folder of paths) {
      const metadata = notes[folder];
      if (!metadata) throw new Error(`Add learning notes for ${category}/${folder}`);
      const [title, description, stage, tags] = metadata;
      const directory = path.join(archive, category, folder);
      const files = (await walk(directory)).map(file => path.relative(directory, file).replaceAll('\\', '/'));
      let entry = files.includes('index.html') ? 'index.html' : null;
      if (files.includes('index.php')) {
        const php = await readFile(path.join(directory, 'index.php'), 'utf8');
        if (php.includes('<?')) throw new Error('PHP execution is not supported by this static site.');
        // The original PHP file is plain HTML. Preserve it and add a static entry.
        await copyFile(path.join(directory, 'index.php'), path.join(directory, 'index.html'));
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
        demo: sourceOnly ? null : `/legacy/${category}/${folder}/${entry}`,
        status: sourceOnly ? 'source' : issues.length ? 'incomplete' : 'archived',
        issues: [...new Set(issues)],
        files,
        nested: folder.includes('/'),
      });
    }
  }
  await writeFile(path.join(root, 'src/content/projects.json'), JSON.stringify(projects, null, 2) + '\n');
  console.log(`Catalogued ${projects.length} entries, including ${projects.filter(p => p.nested).length} nested demos.`);
  return projects;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await generateCatalog();
