# Prácticas

A personal notebook by Alejandro Agredo: projects, sketches, loose ends, and connections to return to. Built with **Next.js App Router, TypeScript, and Tailwind CSS**. The dark neutral palette and faceted blue SVG identity follow Alejandro's own visual style.

## Run locally

Use Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). No environment variables, database, or API keys are required.

```sh
npm test           # Archive integrity, catalog coverage, demo references, journey links
npm run typecheck  # TypeScript
npm run build      # Regenerate the catalog and build production routes
npm start          # Serve the production build
```

## Using the notebook

- **Archive:** a compact list using original folder names. Search ideas, filter subjects or concept groups, and pin entries to revisit.
- **Connections:** six loose groups connecting web basics, visual math, simulations, and networks. They aren't an invented timeline.
- **Project pages:** run the original sketch, read the files, and leave a note about what clicked, what's confusing, or what to try next.
- **Personal notes and pins:** saved in this browser using local storage. They aren't published to the site, sent to a server, or synced between devices. Notes can be downloaded as Markdown. Browser storage can be cleared; export important notes. This is a convenience for personal use, not an authentication or access-control system for the site.
- **Add an entry:** `/add/` keeps the short instructions close by. New local sketches or links can be added with one command.
- **Original galleries:** still available under `/legacy/index.html` and `/legacy/first.html`.

The catalog currently has **74 entries**: all **67 original project/resource folders**, plus **7 nested demos** in the neural-network collection.

## Repository layout

```text
src/
  app/                    Next.js pages, global styles, and metadata
    add/                  Short guide for adding another entry
    journey/              Connections between ideas
    projects/[slug]/      A generated page for each catalog entry
  components/             Archive list, notes, sketch playground, demo player
  content/
    project-notes.json    Editable titles, descriptions, stages, and skill tags
    projects.json         Generated catalog of archive entries and files
    archive-manifest.json Preservation baseline for the original files
  lib/projects.ts         Typed catalog helpers, categories, and journey chapters
scripts/catalog.mjs       Catalog generator and active HTML reference audit
scripts/add-project.mjs   Local or linked project starter
tests/                    Preservation, catalog, and add-project checks
public/legacy/            Original sources, galleries, datasets, and trained models
public/identity/          Blue A identity as a vector SVG
```

The original category directories are now inside `public/legacy`. Their relative relationships and original content are preserved. All **365 original tracked files** were compared to the pre-migration Git blobs. Tests keep checking that baseline while allowing normal Git line-ending conversion. The root `.gitignore` was extended for Next.js output.

The new portfolio pages are React/TypeScript and Tailwind. The archived demos retain their original JavaScript/HTML implementation so the earlier work remains visible. They run in an iframe, isolated from the portfolio styles, and load only after a visitor chooses to start them. This migration does **not** rewrite every historical demo into React or TypeScript.

## Add another project

```sh
# Local canvas starter (defaults to the experiments category)
npm run add-project -- my-experiment

# Pick a subject and a few tags
node scripts/add-project.mjs flow-field --category simulations --stage 3 --tags "vectors,particles"

# A project that lives elsewhere
node scripts/add-project.mjs my-app --url https://example.com --source https://github.com/you/my-app
```

The command creates a folder and its own `project.json`, then refreshes the catalog. Local entries get an `index.html` and `main.js` canvas starter; linked entries get metadata only and open in their own tab. Existing folders are never overwritten.

Edit the entry's `project.json` for its public title, description, stage, and tags. Optional `url` links to an external project; optional `source` links to its code. Stages are numbers 1–6. The command selects a starting stage from the category if none is given.

You can also drop an existing folder directly into a category under `public/legacy`. A folder with `index.html` appears automatically with a basic description. Add `project.json` when you're ready to write some context. No application code needs to change. Catalog generation runs before development and production builds; after adding files to a running dev session, run `npm run catalog`.

The older curated descriptions remain in `src/content/project-notes.json`. A folder's `project.json` overrides those descriptions without modifying the original source. Browser notes on the project page are independent of this public metadata.

## Maintaining the original collection

1. Add a project folder under the appropriate category in `public/legacy`.
2. Add a `project.json` in that folder, or use the command above. For nested collection demos, the older `src/content/project-notes.json` uses relative paths as keys; register new nested paths in `scripts/catalog.mjs` if they are outside the existing neuralnet collection.
3. Run `npm run catalog` to update the typed app's catalog. It runs automatically before development and production builds.
4. Edit concept groups and selected connections in `src/lib/projects.ts` when useful. New ordinary entries need no layout edits.
5. Run the checks and commit the changes.

The preservation baseline covers the original archive; adding new experiments does not require changing it. Intentional edits to the historical source will fail the integrity test until the baseline is explicitly reviewed and updated.

## Deploy on Vercel

1. Push the repository to [GitHub](https://github.com/agredo-alejo/practicas).
2. In Vercel, select **Add New → Project** and import `agredo-alejo/practicas`.
3. Keep the repository root as the **Root Directory**. The included `vercel.json` selects Next.js, `npm ci`, and `npm run build`; leave the output directory at its framework default.
4. Use Node.js 22 or newer. No environment variables are needed.
5. Deploy. Later pushes to the production branch will trigger new deployments once the Git integration is connected.

The portfolio routes are prerendered during the build. The original demos and assets are served directly from `public/legacy`. GitHub source links point to `main/public/legacy`, so the migration must be pushed before those links are available remotely.

## Archive limitations

Some original experiments are incomplete, source/console-only, or reference missing files. The catalog checks active HTML references to local scripts, styles, images, and pages and displays missing ones on the project page. It does not claim that every archived sketch works: runtime-only errors, computed asset URLs, old external libraries, and training-heavy demos still need individual review.

The original CSS Grid exercise's `index.php` contains plain HTML and no PHP code. Catalog generation adds an equivalent `index.html` for static hosting, keeping the original `.php` file intact. Vercel does not need PHP to show it.

The original inventory and its historical notes remain in [public/legacy/README.md](public/legacy/README.md).
