#!/usr/bin/env node
/**
 * reconcile-manifest.js
 *
 * Single-writer reconciliation script for manifest.json.
 * After update agents write content files, this script:
 * 1. Reads manifest.json
 * 2. For each source, recomputes sha256 from the actual file on disk
 * 3. Reads fetched_at from the file's YAML frontmatter
 * 4. Updates manifest.json with correct sha256 and last_fetched
 *
 * Usage:
 *   node scripts/reconcile-manifest.js           # dry-run (show changes)
 *   node scripts/reconcile-manifest.js --write    # write changes to manifest.json
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT, 'manifest.json');

function computeSha256(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(content).digest('hex');
  } catch (e) {
    return null;
  }
}

function extractFetchedAt(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Look for fetched_at in YAML frontmatter
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) return null;
    const fmContent = fmMatch[1];
    const fetchedMatch = fmContent.match(/fetched_at:\s*"?([^"\n]+)"?/);
    if (fetchedMatch) return fetchedMatch[1].trim();
    return null;
  } catch (e) {
    return null;
  }
}

function main() {
  const writeMode = process.argv.includes('--write');
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

  let changes = 0;
  let errors = 0;

  for (const source of manifest.sources) {
    const filePath = path.join(ROOT, source.local_path);

    // Skip if file doesn't exist (e.g., PDFs we don't recompute)
    if (!fs.existsSync(filePath)) {
      console.log(`  SKIP ${source.id} — file not found: ${source.local_path}`);
      continue;
    }

    // Recompute sha256 from disk
    const diskHash = computeSha256(filePath);
    if (!diskHash) {
      console.log(`  ERROR ${source.id} — could not compute sha256`);
      errors++;
      continue;
    }

    // Read fetched_at from frontmatter
    const fetchedAt = extractFetchedAt(filePath);

    let changed = false;

    // Update sha256 if different
    if (diskHash !== source.sha256) {
      if (!writeMode) {
        console.log(`  SHA256 ${source.id}: ${source.sha256?.substring(0, 12)}... → ${diskHash.substring(0, 12)}...`);
      }
      source.sha256 = diskHash;
      changed = true;
    }

    // Update last_fetched to match frontmatter fetched_at
    if (fetchedAt && fetchedAt !== source.last_fetched) {
      if (!writeMode) {
        console.log(`  TIMESTAMP ${source.id}: ${source.last_fetched} → ${fetchedAt}`);
      }
      source.last_fetched = fetchedAt;
      changed = true;
    }

    if (changed) changes++;
  }

  if (writeMode && changes > 0) {
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
    console.log(`\nReconciled ${changes} sources in manifest.json (${errors} errors)`);
  } else if (!writeMode) {
    console.log(`\nDry run: ${changes} sources would be updated (${errors} errors)`);
    console.log('Run with --write to apply changes.');
  } else {
    console.log('\nNo changes needed.');
  }
}

main();
