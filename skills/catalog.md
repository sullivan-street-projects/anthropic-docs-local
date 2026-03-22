---
title: "Skills Catalog"
source_url: "https://github.com/anthropics/skills"
source_type: "web-extracted"
fetched_at: "2026-03-22T00:00:00Z"
category: "skills"
---

# Skills Catalog

> **Source:** [anthropics/skills](https://github.com/anthropics/skills) — 70.5k stars, 7.2k forks

Skills are folders of instructions, scripts, and resources that Claude loads dynamically to improve performance on specialized tasks.

## Repository Structure

```
anthropics/skills/
├── .claude-plugin/          # Claude Code plugin configuration
├── skills/                  # Skill examples by category
│   ├── Creative & Design
│   ├── Development & Technical
│   ├── Enterprise & Communication
│   ├── docx/               # Document creation (DOCX)
│   ├── pdf/                # Document creation (PDF)
│   ├── pptx/               # Document creation (PPTX)
│   └── xlsx/               # Document creation (XLSX)
├── spec/                    # Agent Skills specification
├── template/                # Skill template
└── README.md
```

## Skill Categories

| Category | Description |
|:---------|:------------|
| Creative & Design | Art, music, design skills |
| Development & Technical | Testing, MCP generation, coding |
| Enterprise & Communication | Branding, internal comms |
| Document Skills (docx/pdf/pptx/xlsx) | Document creation and manipulation |

## Basic Skill Structure

Every skill requires a folder with `SKILL.md` containing YAML frontmatter:

```yaml
---
name: my-skill-name
description: What this skill does and when to use it
---

# My Skill Name
[Instructions Claude follows when this skill is active]
```

Required frontmatter fields:
- **name**: Unique identifier (lowercase, hyphens)
- **description**: What the skill does and when to use it

## How to Use Skills

### Claude Code
```bash
/plugin marketplace add anthropics/skills
/plugin install document-skills@anthropic-agent-skills
/plugin install example-skills@anthropic-agent-skills
```

### Claude.ai
Example skills are available to paid plans. Upload custom skills following the [Using skills in Claude](https://support.claude.com/en/articles/12512180-using-skills-in-claude) guide.

### Claude API
Use pre-built or custom skills via the [Skills API Quickstart](https://docs.claude.com/en/api/skills-guide#creating-a-skill).

## Partner Skills

Anthropic has launched a partner-built skills directory, with organizations creating skills that integrate their products with Claude. Partner skills are available through the plugin marketplace and Claude.ai for Team and Enterprise plans.

Key partner skill categories:
- **Productivity:** Notion, Google Workspace, Slack integrations
- **Development:** GitHub, Jira, Linear integrations
- **Data:** Database connectors, analytics tools
- **Design:** Figma, design system integrations

Skills are also available on the free tier for Claude.ai users (limited selection). The Claude API supports skills through the Skills API endpoint.

## Licensing

- **Most skills**: Open source (Apache 2.0)
- **Document skills** (docx, pdf, pptx, xlsx): Source-available (not open source) — provided as reference for complex, production-ready skills

## Resources

- [What are skills?](https://support.claude.com/en/articles/12512176-what-are-skills)
- [Using skills in Claude](https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- [Creating custom skills](https://support.claude.com/en/articles/12512198-creating-custom-skills)
- [Equipping agents for the real world](https://anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Agent Skills Standard](http://agentskills.io)
- [Notion Skills for Claude](https://www.notion.so/notiondevs/Notion-Skills-for-Claude-28da4445d27180c7af1df7d8615723d0)
