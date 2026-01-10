---
title: "Skills README"
source_url: "https://raw.githubusercontent.com/anthropics/skills/main/README.md"
source_type: "github-raw"
fetched_at: "2026-01-10T00:00:00Z"
category: "skills"
---

# Skills: Extending Claude Capabilities

Skills are folders containing instructions and resources that enhance Claude's capabilities for specialized tasks. They enable Claude to handle specific workflows consistently, from document creation with brand guidelines to data analysis using organizational processes.

## Key Resources

The repository provides:
- "What are skills?" documentation
- Instructions for using and creating custom skills
- Engineering insights on deploying agent skills

## Repository Contents

Skills span multiple domains:
- **Creative**: art, music, design
- **Technical**: web app testing, server generation
- **Enterprise**: communications, branding
- **Documents**: DOCX, PDF, PPTX, XLSX manipulation

Each skill includes a `SKILL.md` file with instructions Claude follows. Document manipulation skills are source-available references for production implementations.

## Skill Structure

A minimal skill requires:
1. A folder containing a `SKILL.md` file
2. YAML frontmatter with name and description
3. Markdown instructions for Claude

### Example SKILL.md

```yaml
---
name: my-skill
description: What this skill does and when to use it
---

# Instructions
Your instructions here...
```

## Access Methods

**Claude Code**: Register the repository as a plugin marketplace
```
/plugin install document-skills@anthropic-agent-skills
```

**Claude.ai**: Available to paid plan users; upload custom skills via the interface

**Claude API**: Integrate pre-built or custom skills programmatically

## Creating Custom Skills

1. Start with the template skill in the repository
2. Define `name` (lowercase, hyphen-separated) and `description` in YAML frontmatter
3. Write clear instructions in Markdown
4. Test in Claude Code or via API
5. Share with the community
