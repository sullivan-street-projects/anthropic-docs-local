#!/usr/bin/env node

/**
 * Generates docs/architecture.md from manifest.json analysis
 * Run: node scripts/generate-architecture.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT, 'manifest.json');
const OUTPUT_PATH = path.join(ROOT, 'docs', 'architecture.md');

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));

// Analyze manifest
const byCategory = {};
const bySourceType = {};
const byReviewStatus = {};
let totalFiles = 0;
let totalPapers = 0;

manifest.sources.forEach(source => {
  // By category
  byCategory[source.category] = byCategory[source.category] || [];
  byCategory[source.category].push(source);

  // By source type
  bySourceType[source.source_type] = (bySourceType[source.source_type] || 0) + 1;

  // By review status
  byReviewStatus[source.review_status] = (byReviewStatus[source.review_status] || 0) + 1;

  totalFiles++;

  // Count papers
  if (source.papers) {
    totalPapers += source.papers.length;
  }
});

// Generate markdown
const now = new Date().toISOString();

let md = `---
title: "Architecture Overview"
generated_at: "${now}"
generator: "scripts/generate-architecture.js"
---

# Anthropic Docs Local - Architecture

> Auto-generated from manifest.json on ${now.split('T')[0]}

## Overview

| Metric | Value |
|--------|-------|
| Total Sources | ${totalFiles} |
| Research Papers | ${totalPapers} |
| Categories | ${Object.keys(byCategory).length} |
| Schema Version | ${manifest.schema_version} |
| Last Full Update | ${manifest.last_full_update} |
| Last Discovery Run | ${manifest.last_discovery_run || 'N/A'} |

## Source Types Distribution

| Type | Count | Description |
|------|-------|-------------|
| github-raw | ${bySourceType['github-raw'] || 0} | Direct fetch from GitHub raw URLs |
| github-api | ${bySourceType['github-api'] || 0} | GitHub API endpoint parsing |
| web-extracted | ${bySourceType['web-extracted'] || 0} | WebFetch with content extraction |
| manual | ${bySourceType['manual'] || 0} | Agent-synthesized from internal docs |
| arxiv-pdfs | ${bySourceType['arxiv-pdfs'] || 0} | Downloaded PDF papers |

## Review Status Distribution

| Status | Count | Description |
|--------|-------|-------------|
| auto | ${byReviewStatus['auto'] || 0} | High-confidence sources, auto-trusted |
| needs-review | ${byReviewStatus['needs-review'] || 0} | Should be periodically human-verified |
| human-verified | ${byReviewStatus['human-verified'] || 0} | Recently verified by human |

## Categories

`;

// Add category details
Object.keys(byCategory).sort().forEach(category => {
  const sources = byCategory[category];
  md += `### ${category}\n\n`;
  md += `| File | Source Type | Confidence |\n`;
  md += `|------|-------------|------------|\n`;

  sources.forEach(source => {
    md += `| [${source.name}](../${source.local_path}) | ${source.source_type} | ${source.confidence} |\n`;
  });

  md += '\n';
});

// Add file tree
md += `## Directory Structure

\`\`\`
anthropic-docs-local/
├── manifest.json           # Central registry
├── CLAUDE.md               # Project constitution
├── schemas/
│   ├── manifest.schema.json
│   └── frontmatter.schema.json
├── scripts/
│   ├── validate.js
│   └── generate-architecture.js
├── docs/
│   └── architecture.md     # This file (auto-generated)
`;

Object.keys(byCategory).sort().forEach(category => {
  const sources = byCategory[category];
  md += `├── ${category}/\n`;
  sources.forEach((source, i) => {
    const prefix = i === sources.length - 1 ? '│   └──' : '│   ├──';
    const filename = path.basename(source.local_path);
    md += `${prefix} ${filename}\n`;
  });
});

md += `\`\`\`

## Validation

Run validation to ensure consistency:

\`\`\`bash
node scripts/validate.js
\`\`\`

## Regenerating This Document

\`\`\`bash
node scripts/generate-architecture.js
\`\`\`
`;

// Ensure docs directory exists
const docsDir = path.dirname(OUTPUT_PATH);
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

fs.writeFileSync(OUTPUT_PATH, md);

console.log(`✓ Generated ${OUTPUT_PATH}`);
