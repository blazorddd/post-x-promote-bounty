// Entry for post-x-promote-make-your-own-bounty-01, Node 22, standard library only.
//
// The entry is the X post itself. This program does one small job for the grader:
// it takes POST.json (the post's address) from the repository and places an exact
// copy at /output/POST.json. Before copying it checks the file is valid JSON and
// that its url really points at an X post, so a broken POST.json fails here with a
// clear message instead of handing the grader something it cannot use.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const repoDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const text = readFileSync(join(repoDir, 'POST.json'), 'utf8');

let data: unknown;
try {
  data = JSON.parse(text);
} catch {
  console.error('POST.json is not valid JSON');
  process.exit(1);
}

const url = (data as { url?: unknown } | null)?.url;
if (typeof url !== 'string' || !/^https:\/\/(x\.com|twitter\.com)\/[^/]+\/status\/\d+$/.test(url)) {
  console.error('POST.json must name an X post address in its "url" field');
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'POST.json'), text);

// Read the copy back and compare it with the source, so a partial or failed
// write is caught here instead of reaching the grader as a broken hand-in.
const copied = readFileSync(join(outDir, 'POST.json'), 'utf8');
if (copied !== text) {
  console.error('the copy of POST.json does not match the source');
  process.exit(1);
}
