import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { root, categoryIds, defaultStages, validateMetadata, generateCatalog } from './catalog.mjs';

export async function addProject(args, workspace = root) {
  const [slug, ...flags] = args;
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Use a folder name like flow-field (lowercase letters, numbers, hyphens).');
  const options = {};
  for (let i = 0; i < flags.length; i += 2) {
    const key = flags[i];
    if (!['--category', '--title', '--description', '--stage', '--tags', '--url', '--source'].includes(key) || !flags[i + 1] || flags[i + 1].startsWith('--')) throw new Error(`Unknown or incomplete option: ${key}`);
    options[key.slice(2)] = flags[i + 1];
  }
  const category = options.category ?? 'experiments';
  if (!categoryIds.includes(category)) throw new Error(`Category must be one of: ${categoryIds.join(', ')}`);
  const metadata = validateMetadata({
    title: options.title ?? slug,
    description: options.description ?? 'A new experiment. Notes will take shape as I work on it.',
    stage: options.stage ? Number(options.stage) : defaultStages[category],
    tags: options.tags ? options.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
    ...(options.url ? { url: options.url } : {}),
    ...(options.source ? { source: options.source } : {}),
  });
  const base = path.resolve(workspace, 'public', 'legacy');
  const directory = path.resolve(base, category, slug);
  if (!directory.startsWith(base + path.sep)) throw new Error('Project must stay within the archive.');
  await mkdir(path.dirname(directory), { recursive: true });
  // Exclusive creation protects any existing work, even with the same folder name.
  await mkdir(directory);
  await writeFile(path.join(directory, 'project.json'), JSON.stringify(metadata, null, 2) + '\n', { flag: 'wx' });
  if (!metadata.url) {
    const title = metadata.title.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
    await writeFile(path.join(directory, 'index.html'), `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title><style>body{margin:0;background:#1c1f23;color:#ccd1d8;font:14px system-ui}p{position:absolute;left:24px;top:12px;pointer-events:none}canvas{display:block}</style></head><body><p>${title} / click to leave a point</p><canvas aria-label="An experimental drawing canvas"></canvas><script src="main.js"></script></body></html>\n`, { flag: 'wx' });
    await writeFile(path.join(directory, 'main.js'), `// A small starting point. Make it your own.\nconst canvas = document.querySelector('canvas');\nconst context = canvas.getContext('2d');\nfunction resize() {\n  canvas.width = innerWidth;\n  canvas.height = innerHeight;\n}\naddEventListener('resize', resize);\nresize();\ncanvas.addEventListener('pointerdown', event => {\n  context.beginPath();\n  context.moveTo(event.clientX, event.clientY - 14);\n  context.lineTo(event.clientX + 12, event.clientY + 10);\n  context.lineTo(event.clientX - 12, event.clientY + 10);\n  context.closePath();\n  context.fillStyle = '#63afff';\n  context.fill();\n});\n`, { flag: 'wx' });
  }
  return { directory, metadata };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.includes('--help') || !args.length) {
    console.log('npm run add-project -- my-experiment [--category simulations] [--title "A title"] [--stage 3] [--tags "vectors,canvas"] [--description "A note"] [--url https://example.com] [--source https://github.com/you/repo]\n\nDefault: a local canvas starter in experiments. --url creates a linked entry instead. Edit project.json to change its notes. Existing projects are never overwritten.');
  } else {
    try { const result = await addProject(args); await generateCatalog(); console.log(`Created ${path.relative(root, result.directory)}\nEdit project.json and the starter files, then run npm run dev.`); }
    catch (error) { console.error(error.message); process.exitCode = 1; }
  }
}
