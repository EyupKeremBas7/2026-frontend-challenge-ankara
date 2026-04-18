import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const FILES = [
  ['checkins', 'checkins.json'],
  ['messages', 'messages.json'],
  ['sightings', 'sightings.json'],
  ['personalNotes', 'personalNotes.json'],
  ['anonymousTips', 'anonymousTips.json'],
];

async function main() {
  const repoRoot = process.cwd();
  const exportsDir = path.join(repoRoot, 'exports');
  const outDir = path.join(repoRoot, 'public', 'mock');

  await mkdir(outDir, { recursive: true });

  for (const [name, filename] of FILES) {
    const from = path.join(exportsDir, filename);
    const to = path.join(outDir, filename);
    const buf = await readFile(from);
    await writeFile(to, buf);
    console.log(`${name}: copied ${path.relative(repoRoot, from)} → ${path.relative(repoRoot, to)}`);
  }
}

main().catch((err) => {
  console.error(err?.stack || String(err));
  process.exitCode = 1;
});

