#!/usr/bin/env node

/**
 * Validation script for anthropic-docs-local
 *
 * Four-layer validation architecture (inspired by engineering/demystifying-evals):
 *   Layer 1 - Schema:    JSON structure, enum values, required fields
 *   Layer 2 - Reference: Manifest <-> file consistency, orphan detection
 *   Layer 3 - Content:   Frontmatter completeness, timestamp alignment
 *   Layer 4 - Integrity: Confidence types, staleness detection, hash verification
 *
 * Usage: node scripts/validate.js [--quick]
 *   --quick: Run only Layer 1 (schema) for fast sanity checks
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT, 'manifest.json');

const isQuick = process.argv.includes('--quick');

// Valid enums (single source of truth — must match schemas/)
const VALID_CATEGORIES = [
  'api', 'models', 'sdks', 'claude-code', 'agent-sdk',
  'skills', 'cookbooks', 'release-notes', 'github-repos', 'research',
  'news', 'engineering'
];

const VALID_SOURCE_TYPES = [
  'github-raw', 'github-api', 'web-extracted', 'manual', 'arxiv-pdfs'
];

const VALID_LIFECYCLE_STATUSES = ['active', 'legacy', 'deprecated', 'archived'];

// Tracking
let errors = [];
let warnings = [];

function error(msg) {
  errors.push(msg);
  console.error(`  ❌ ${msg}`);
}

function warn(msg) {
  warnings.push(msg);
  console.warn(`  ⚠️  ${msg}`);
}

function ok(msg) {
  console.log(`  ✓ ${msg}`);
}

// Parse YAML frontmatter from markdown
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const yaml = match[1];
  const result = {};

  // Simple YAML parser for flat key-value pairs
  yaml.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      result[key] = value;
    }
  });

  return result;
}

// ═══════════════════════════════════════════════════════════
// Layer 1: Schema Validation
// ═══════════════════════════════════════════════════════════

function validateSchema(manifest) {
  console.log('\n📋 Layer 1: Schema Validation\n');

  // Required top-level fields
  if (!manifest.schema_version) {
    error('manifest.json missing schema_version');
  } else if (!/^\d+\.\d+\.\d+$/.test(manifest.schema_version)) {
    error(`Invalid schema_version format: ${manifest.schema_version}`);
  } else {
    ok(`schema_version: ${manifest.schema_version}`);
  }

  if (!manifest.last_full_update) {
    error('manifest.json missing last_full_update');
  } else {
    ok(`last_full_update: ${manifest.last_full_update}`);
  }

  if (!Array.isArray(manifest.sources)) {
    error('manifest.json missing sources array');
    return null;
  }

  ok(`sources: ${manifest.sources.length} entries`);

  // Validate each source entry
  const ids = new Set();
  const paths = new Set();

  manifest.sources.forEach((source, i) => {
    const prefix = `sources[${i}]`;
    const label = source.id || `index ${i}`;

    // Required fields
    if (!source.id) {
      error(`${prefix} missing id`);
    } else {
      if (ids.has(source.id)) {
        error(`${prefix} duplicate id: ${source.id}`);
      }
      if (!/^[a-z0-9-]+$/.test(source.id)) {
        error(`${prefix} invalid id format: ${source.id}`);
      }
      ids.add(source.id);
    }

    if (!source.name) error(`${prefix} (${label}) missing name`);

    if (!source.category) {
      error(`${prefix} (${label}) missing category`);
    } else if (!VALID_CATEGORIES.includes(source.category)) {
      error(`${prefix} (${label}) invalid category: ${source.category}`);
    }

    if (!source.local_path) {
      error(`${prefix} (${label}) missing local_path`);
    } else {
      if (paths.has(source.local_path)) {
        error(`${prefix} (${label}) duplicate local_path: ${source.local_path}`);
      }
      paths.add(source.local_path);
    }

    if (!source.source_url) error(`${prefix} (${label}) missing source_url`);

    if (!source.source_type) {
      error(`${prefix} (${label}) missing source_type`);
    } else if (!VALID_SOURCE_TYPES.includes(source.source_type)) {
      error(`${prefix} (${label}) invalid source_type: ${source.source_type}`);
    }

    if (!source.last_fetched) error(`${prefix} (${label}) missing last_fetched`);

    // Optional field type checks
    if (source.confidence !== undefined && typeof source.confidence !== 'number') {
      error(`${prefix} (${label}) confidence must be a number, got ${typeof source.confidence}: ${JSON.stringify(source.confidence)}`);
    } else if (typeof source.confidence === 'number' && (source.confidence < 0 || source.confidence > 1)) {
      error(`${prefix} (${label}) confidence must be 0.0-1.0, got ${source.confidence}`);
    }

    if (source.lifecycle_status && !VALID_LIFECYCLE_STATUSES.includes(source.lifecycle_status)) {
      error(`${prefix} (${label}) invalid lifecycle_status: ${source.lifecycle_status}`);
    }

    // Validate papers array for arxiv-pdfs type
    if (source.source_type === 'arxiv-pdfs' && source.papers) {
      source.papers.forEach((paper, j) => {
        if (!paper.file) error(`${prefix}.papers[${j}] missing file`);
        if (!paper.arxiv) error(`${prefix}.papers[${j}] missing arxiv`);
        if (!paper.title) error(`${prefix}.papers[${j}] missing title`);
      });
    }
  });

  return { ids, paths };
}

// ═══════════════════════════════════════════════════════════
// Layer 2: Reference Validation
// ═══════════════════════════════════════════════════════════

function validateReferences(manifest, manifestPaths) {
  console.log('\n📁 Layer 2: Reference Validation\n');

  let checked = 0;
  let skipped = 0;
  let missing = 0;

  manifest.sources.forEach(source => {
    const filePath = path.join(ROOT, source.local_path);

    // Skip PDF files and arxiv-pdfs index entries
    if (source.local_path.endsWith('.pdf') || source.source_type === 'arxiv-pdfs') {
      if (source.source_type === 'arxiv-pdfs' && source.papers) {
        const paperDir = path.dirname(path.join(ROOT, source.local_path));
        source.papers.forEach(paper => {
          const pdfPath = path.join(paperDir, paper.file);
          if (!fs.existsSync(pdfPath)) {
            error(`Missing PDF: ${paper.file} (${source.id})`);
            missing++;
          }
        });
      }
      skipped++;
      return;
    }

    // Check file exists
    if (!fs.existsSync(filePath)) {
      error(`Missing file: ${source.local_path} (${source.id})`);
      missing++;
      return;
    }

    checked++;
  });

  ok(`${checked} files found (${skipped} non-markdown skipped${missing > 0 ? `, ${missing} missing` : ''})`);

  // Orphan detection — check all content directories
  console.log('');
  const dirs = [
    'api', 'models', 'sdks', 'claude-code', 'agent-sdk',
    'skills', 'cookbooks', 'release-notes', 'github-repos', 'research',
    'news', 'engineering'
  ];

  let orphans = 0;

  dirs.forEach(dir => {
    const dirPath = path.join(ROOT, dir);
    if (!fs.existsSync(dirPath)) return;

    function scanDir(currentPath, relativePath) {
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });
      entries.forEach(entry => {
        const fullPath = path.join(currentPath, entry.name);
        const relPath = path.join(relativePath, entry.name);

        if (entry.isDirectory()) {
          scanDir(fullPath, relPath);
        } else if (entry.name.endsWith('.md')) {
          if (!manifestPaths.has(relPath)) {
            warn(`Orphan file not in manifest: ${relPath}`);
            orphans++;
          }
        }
      });
    }

    scanDir(dirPath, dir);
  });

  if (orphans === 0) {
    ok('No orphan markdown files found');
  }
}

// ═══════════════════════════════════════════════════════════
// Layer 3: Content Validation
// ═══════════════════════════════════════════════════════════

function validateContent(manifest) {
  console.log('\n📝 Layer 3: Content Validation\n');

  let checked = 0;
  let timestampMismatches = 0;

  manifest.sources.forEach(source => {
    // Skip non-markdown
    if (!source.local_path.endsWith('.md')) return;
    if (source.source_type === 'arxiv-pdfs') return;

    const filePath = path.join(ROOT, source.local_path);
    if (!fs.existsSync(filePath)) return;

    const content = fs.readFileSync(filePath, 'utf-8');
    const frontmatter = parseFrontmatter(content);

    if (!frontmatter) {
      error(`Missing frontmatter: ${source.local_path}`);
      return;
    }

    // Required frontmatter fields
    const required = ['title', 'source_url', 'source_type', 'fetched_at', 'category'];
    required.forEach(field => {
      if (!frontmatter[field]) {
        error(`${source.local_path} frontmatter missing: ${field}`);
      }
    });

    // Category consistency
    if (frontmatter.category && frontmatter.category !== source.category) {
      warn(`${source.local_path} category mismatch: frontmatter=${frontmatter.category}, manifest=${source.category}`);
    }

    // Source type consistency
    if (frontmatter.source_type && frontmatter.source_type !== source.source_type) {
      warn(`${source.local_path} source_type mismatch: frontmatter=${frontmatter.source_type}, manifest=${source.source_type}`);
    }

    // Timestamp consistency (fetched_at vs last_fetched)
    if (frontmatter.fetched_at && source.last_fetched) {
      const fmDate = frontmatter.fetched_at.split('T')[0];
      const manDate = source.last_fetched.split('T')[0];
      if (fmDate !== manDate) {
        warn(`${source.local_path} timestamp mismatch: frontmatter=${fmDate}, manifest=${manDate}`);
        timestampMismatches++;
      }
    }

    checked++;
  });

  ok(`Checked ${checked} files for content consistency`);
  if (timestampMismatches > 0) {
    warn(`${timestampMismatches} timestamp mismatch(es) between frontmatter and manifest`);
  }
}

// ═══════════════════════════════════════════════════════════
// Layer 4: Integrity Validation
// ═══════════════════════════════════════════════════════════

function validateIntegrity(manifest) {
  console.log('\n🔒 Layer 4: Integrity Validation\n');

  const lastUpdate = new Date(manifest.last_full_update);
  const STALENESS_THRESHOLD_DAYS = 30;
  let staleCount = 0;
  let hashMismatches = 0;
  let hashesChecked = 0;

  manifest.sources.forEach(source => {
    // Staleness detection
    if (source.last_fetched) {
      const fetchDate = new Date(source.last_fetched);
      const daysBehind = Math.floor((lastUpdate - fetchDate) / (1000 * 60 * 60 * 24));
      if (daysBehind > STALENESS_THRESHOLD_DAYS) {
        warn(`Stale source: ${source.id} — ${daysBehind} days behind last_full_update`);
        staleCount++;
      }
    }

    // SHA-256 hash verification (for files that have hashes)
    if (source.sha256 && source.local_path.endsWith('.md')) {
      const filePath = path.join(ROOT, source.local_path);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath);
        const hash = crypto.createHash('sha256').update(content).digest('hex');
        if (hash !== source.sha256) {
          warn(`Hash mismatch: ${source.local_path} — file changed since last recorded hash`);
          hashMismatches++;
        }
        hashesChecked++;
      }
    }
  });

  if (staleCount === 0) {
    ok('No stale sources detected');
  } else {
    warn(`${staleCount} source(s) are >${STALENESS_THRESHOLD_DAYS} days behind last_full_update`);
  }

  if (hashesChecked > 0) {
    if (hashMismatches === 0) {
      ok(`${hashesChecked} SHA-256 hashes verified`);
    } else {
      warn(`${hashMismatches}/${hashesChecked} hash mismatch(es) — files modified since last hash`);
    }
  }
}

// ═══════════════════════════════════════════════════════════
// Main
// ═══════════════════════════════════════════════════════════

function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  Anthropic Docs Local - Validation');
  console.log(isQuick ? '  (Quick mode — Layer 1 only)' : '  (Full — Layers 1-4)');
  console.log('═══════════════════════════════════════════════════════════');

  // Load manifest
  if (!fs.existsSync(MANIFEST_PATH)) {
    error('manifest.json not found');
    process.exit(1);
  }

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  } catch (e) {
    error(`Failed to parse manifest.json: ${e.message}`);
    process.exit(1);
  }

  // Layer 1: Schema (always runs)
  const result = validateSchema(manifest);
  if (!result) {
    console.log('\n❌ Schema validation failed — cannot continue.\n');
    process.exit(1);
  }

  if (!isQuick) {
    // Layer 2: References
    validateReferences(manifest, result.paths);

    // Layer 3: Content
    validateContent(manifest);

    // Layer 4: Integrity
    validateIntegrity(manifest);
  }

  // Summary
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  Summary');
  console.log('═══════════════════════════════════════════════════════════\n');

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ All validations passed!\n');
    process.exit(0);
  }

  if (warnings.length > 0) {
    console.log(`⚠️  ${warnings.length} warning(s)\n`);
  }

  if (errors.length > 0) {
    console.log(`❌ ${errors.length} error(s)\n`);
    process.exit(1);
  }

  process.exit(0);
}

main();
