#!/usr/bin/env node

/**
 * Validation script for anthropic-docs-local
 * Checks manifest.json and markdown frontmatter against schemas
 *
 * Usage: node scripts/validate.js [--fix]
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT, 'manifest.json');

// Valid enums from schemas
const VALID_CATEGORIES = [
  'api', 'models', 'sdks', 'claude-code', 'agent-sdk',
  'skills', 'cookbooks', 'release-notes', 'github-repos', 'research'
];

const VALID_SOURCE_TYPES = [
  'github-raw', 'github-api', 'web-extracted', 'manual', 'arxiv-pdfs'
];

// Tracking
let errors = [];
let warnings = [];

function error(msg) {
  errors.push(msg);
  console.error(`❌ ERROR: ${msg}`);
}

function warn(msg) {
  warnings.push(msg);
  console.warn(`⚠️  WARN: ${msg}`);
}

function ok(msg) {
  console.log(`✓ ${msg}`);
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

// Validate manifest.json structure
function validateManifest(manifest) {
  console.log('\n📋 Validating manifest.json...\n');

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
    return;
  }

  ok(`sources: ${manifest.sources.length} entries`);

  // Validate each source
  const ids = new Set();
  const paths = new Set();

  manifest.sources.forEach((source, i) => {
    const prefix = `sources[${i}]`;

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

    if (!source.name) {
      error(`${prefix} (${source.id}) missing name`);
    }

    if (!source.category) {
      error(`${prefix} (${source.id}) missing category`);
    } else if (!VALID_CATEGORIES.includes(source.category)) {
      error(`${prefix} (${source.id}) invalid category: ${source.category}`);
    }

    if (!source.local_path) {
      error(`${prefix} (${source.id}) missing local_path`);
    } else {
      if (paths.has(source.local_path)) {
        error(`${prefix} (${source.id}) duplicate local_path: ${source.local_path}`);
      }
      paths.add(source.local_path);
    }

    if (!source.source_url) {
      error(`${prefix} (${source.id}) missing source_url`);
    }

    if (!source.source_type) {
      error(`${prefix} (${source.id}) missing source_type`);
    } else if (!VALID_SOURCE_TYPES.includes(source.source_type)) {
      error(`${prefix} (${source.id}) invalid source_type: ${source.source_type}`);
    }

    if (!source.last_fetched) {
      error(`${prefix} (${source.id}) missing last_fetched`);
    }

    // Validate papers array for arxiv-pdfs type
    if (source.source_type === 'arxiv-pdfs' && source.papers) {
      source.papers.forEach((paper, j) => {
        if (!paper.file) {
          error(`${prefix}.papers[${j}] missing file`);
        }
        if (!paper.arxiv) {
          error(`${prefix}.papers[${j}] missing arxiv`);
        }
        if (!paper.title) {
          error(`${prefix}.papers[${j}] missing title`);
        }
      });
    }
  });

  return { ids, paths };
}

// Validate that all manifest paths exist and have valid frontmatter
function validateFiles(manifest, manifestPaths) {
  console.log('\n📁 Validating files...\n');

  let checked = 0;
  let skipped = 0;

  manifest.sources.forEach(source => {
    const filePath = path.join(ROOT, source.local_path);

    // Skip PDF files and directories
    if (source.local_path.endsWith('.pdf') || source.source_type === 'arxiv-pdfs') {
      if (source.source_type === 'arxiv-pdfs' && source.papers) {
        // Check that paper PDFs exist
        const paperDir = path.dirname(path.join(ROOT, source.local_path));
        source.papers.forEach(paper => {
          const pdfPath = path.join(paperDir, paper.file);
          if (!fs.existsSync(pdfPath)) {
            error(`Missing PDF: ${paper.file} (${source.id})`);
          }
        });
      }
      skipped++;
      return;
    }

    // Check file exists
    if (!fs.existsSync(filePath)) {
      error(`Missing file: ${source.local_path} (${source.id})`);
      return;
    }

    // Check frontmatter for markdown files
    if (source.local_path.endsWith('.md')) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const frontmatter = parseFrontmatter(content);

      if (!frontmatter) {
        error(`Missing frontmatter: ${source.local_path}`);
        return;
      }

      // Validate required frontmatter fields
      const required = ['title', 'source_url', 'source_type', 'fetched_at', 'category'];
      required.forEach(field => {
        if (!frontmatter[field]) {
          error(`${source.local_path} frontmatter missing: ${field}`);
        }
      });

      // Check category matches manifest
      if (frontmatter.category && frontmatter.category !== source.category) {
        warn(`${source.local_path} category mismatch: frontmatter=${frontmatter.category}, manifest=${source.category}`);
      }

      // Check source_type matches manifest
      if (frontmatter.source_type && frontmatter.source_type !== source.source_type) {
        warn(`${source.local_path} source_type mismatch: frontmatter=${frontmatter.source_type}, manifest=${source.source_type}`);
      }

      checked++;
    }
  });

  ok(`Checked ${checked} markdown files (skipped ${skipped} non-markdown)`);
}

// Check for orphan files (files with frontmatter not in manifest)
function checkOrphans(manifestPaths) {
  console.log('\n🔍 Checking for orphan files...\n');

  const dirs = ['api', 'models', 'sdks', 'claude-code', 'agent-sdk',
                'skills', 'cookbooks', 'release-notes', 'github-repos', 'research'];

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

// Main
function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  Anthropic Docs Local - Validation');
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

  // Run validations
  const { ids, paths } = validateManifest(manifest) || { ids: new Set(), paths: new Set() };
  validateFiles(manifest, paths);
  checkOrphans(paths);

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
