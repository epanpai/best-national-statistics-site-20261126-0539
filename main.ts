// Hand-in program for the Meridia statistics site (Node 22, standard
// library only). The site itself is plain static files in app/ — an
// index.html, one stylesheet, ES modules and a few CSV downloads — with
// no build step and no network request at run time.
//
// This program gathers the entry for the grader: it copies app/ and
// screenshots/ from beside this file into the output directory and writes
// output/dossier.json with the vendored make.fun library, which is the
// summary the judge reads (screenshots, first-load bytes, source text).
// vendor/makefun-frontend.ts is the kit's copy, unchanged: the scorer
// rebuilds the dossier with its own copy and compares byte for byte.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR standing in for
// /output, e.g.:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });

const shotsDir = join(outputDir, 'screenshots');
mkdirSync(shotsDir, { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), shotsDir, { recursive: true });
}

// Caps mirror the scorer's own: at most 4 screenshots, each at most
// 256 KiB; app/ at most 993 files and directories and 16 MiB in all.
// The dossier text itself is capped at 160 KiB by the library.
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
