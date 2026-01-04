---
title: "Skills README"
source_url: "https://raw.githubusercontent.com/anthropics/skills/main/README.md"
source_type: "github-raw"
fetched_at: "2026-01-04T05:43:46Z"
category: "skills"
---

# Skills: Extending Claude Capabilities

Skills are folders of instructions, scripts, and resources that Claude loads dynamically to improve performance on specialized tasks.

## Key Components

- **Skills folder**: Practical examples across creative, technical, enterprise, and document domains
- **Specification**: Details the Agent Skills standard
- **Template**: Starting point for custom skill development

## Skill Structure

A minimal skill requires:
1. A folder containing a `SKILL.md` file
2. YAML frontmatter with name and description
3. Markdown instructions for Claude

### Example SKILL.md

```yaml
---
name: my-skill
description: What this skill does
---

# Instructions
Your instructions here...
```

## Platforms

Skills work in:
- **Claude Code**: Via plugin marketplace
- **Claude.ai**: For paid users
- **Claude API**: Through direct integration

## Installation

```
/plugin install document-skills@anthropic-agent-skills
```

Then reference skills naturally in conversations.

## Creating Custom Skills

1. Start with the repository template
2. Define name and description in YAML frontmatter
3. Write clear instructions in Markdown
4. Test in Claude Code or via API
5. Share with the community
