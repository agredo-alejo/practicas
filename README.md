# Prácticas

A programming learning archive by Alejandro Agredo. Built with **Next.js App Router, TypeScript, and Tailwind CSS**, with the original experiments preserved alongside the new portfolio.

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

## What visitors can explore

- **Home:** selected experiments, an overview of the learning chapters, and the complete project index.
- **Project index:** search by name, original folder name, concept, or skill; filter by topic and learning stage; sort by learning order or title.
- **Learning journey:** six conceptual chapters, from web foundations to convolution, tensors, and neuroevolution. These are a reading path, not claims about exact dates.
- **Project pages:** original demo loaded only when requested, restart/stop/fullscreen controls, learning context, original source links, related work, and missing-reference notes.
- **Original galleries:** still available under `/legacy/index.html` and `/legacy/first.html`.

The catalog currently has **74 entries**: all **67 original project/resource folders**, plus **7 nested demos** in the neural-network collection.

## Repository layout

```text
src/
  app/                    Next.js pages, global styles, and metadata
    journey/              Conceptual learning progression
    projects/[slug]/      A generated page for each catalog entry
  components/             Search, project cards, demo player, concept sketches
  content/
    project-notes.json    Editable titles, descriptions, stages, and skill tags
    projects.json         Generated catalog of archive entries and files
    archive-manifest.json Preservation baseline for the original files
  lib/projects.ts         Typed catalog helpers, categories, and journey chapters
scripts/catalog.mjs       Catalog generator and active HTML reference audit
tests/archive.test.mjs    Preservation and catalog checks
public/legacy/            Original sources, galleries, datasets, and trained models
```

The original category directories are now inside `public/legacy`. Their relative relationships and original content are preserved. All **365 original tracked files** were compared to the pre-migration Git blobs. Tests keep checking that baseline while allowing normal Git line-ending conversion. The root `.gitignore` was extended for Next.js output.

The new portfolio pages are React/TypeScript and Tailwind. The archived demos retain their original JavaScript/HTML implementation so the earlier work remains visible. They run in an iframe, isolated from the portfolio styles, and load only after a visitor chooses to start them. This migration does **not** rewrite every historical demo into React or TypeScript.

## Update the collection

1. Add a project folder under the appropriate category in `public/legacy`.
2. Add its entry to `src/content/project-notes.json`: `[title, description, stageNumber, [tags]]`. For nested collection demos, use the relative folder path as the key and register it in `scripts/catalog.mjs` if it is outside the existing neuralnet collection.
3. Run `npm run catalog` to update the typed app's catalog. It runs automatically before development and production builds.
4. Optionally add a featured project in `src/app/page.tsx`, or edit chapter selections in `src/lib/projects.ts`.
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
