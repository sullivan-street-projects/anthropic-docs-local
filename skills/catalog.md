---
title: "Skills Catalog"
source_url: "https://github.com/anthropics/skills"
source_type: "web-extracted"
fetched_at: "2026-07-27T00:00:00Z"
category: "skills"
---

# Skills Catalog

> **Source:** [anthropics/skills](https://github.com/anthropics/skills) -- 164.5k stars, 19.5k forks

Skills are folders of instructions, scripts, and resources that Claude loads dynamically to improve performance on specialized tasks.

**Note:** For information about the Agent Skills standard, see [agentskills.io](http://agentskills.io).

## What Are Skills?

Skills teach Claude how to complete specific tasks in a repeatable way, whether that's:

- Creating documents with your company's brand guidelines
- Analyzing data using your organization's specific workflows
- Automating personal tasks

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

| Category                             | Description                        |
| :----------------------------------- | :--------------------------------- |
| Creative & Design                    | Art, music, design skills          |
| Development & Technical              | Testing, MCP generation, coding    |
| Enterprise & Communication           | Branding, internal comms           |
| Document Skills (docx/pdf/pptx/xlsx) | Document creation and manipulation |

## Basic Skill Structure

Every skill requires a folder with `SKILL.md` containing YAML frontmatter:

```yaml
---
name: my-skill-name
description: A clear description of what this skill does and when to use it
---

# My Skill Name

[Add your instructions here that Claude will follow when this skill is active]

## Examples
- Example usage 1
- Example usage 2

## Guidelines
- Guideline 1
- Guideline 2
```

Required frontmatter fields:

- **name**: Unique identifier (lowercase, hyphens)
- **description**: What the skill does and when to use it

The markdown content contains instructions, examples, and guidelines Claude will follow.

## How to Use Skills

### Claude Code

```bash
/plugin marketplace add anthropics/skills
/plugin install document-skills@anthropic-agent-skills
/plugin install example-skills@anthropic-agent-skills
```

After installing, use skills by mentioning them. Example:

> "Use the PDF skill to extract the form fields from `path/to/some-file.pdf`"

### Claude.ai

Example skills are available to paid plans. To use any skill from this repository or upload custom skills, follow [Using skills in Claude](https://support.claude.com/en/articles/12512180-using-skills-in-claude#h_a4222fa77b).

### Claude API

Use pre-built skills or upload custom skills via the Claude API. See the [Skills API Quickstart](https://docs.claude.com/en/api/skills-guide#creating-a-skill).

## Partner Skills

Skills are ideal for teaching Claude how to use specific software. Featured partner skills:

- **Notion** -- [Notion Skills for Claude](https://www.notion.so/notiondevs/Notion-Skills-for-Claude-28da4445d27180c7af1df7d8615723d0)

## Licensing

- **Most skills**: Open source (Apache 2.0)
- **Document skills** (docx, pdf, pptx, xlsx): Source-available (not open source) -- provided as reference for complex, production-ready skills

### Disclaimer

These skills are provided for demonstration and educational purposes only. While some capabilities may be available in Claude, implementations and behaviors may differ from what is shown in these skills. Always test skills thoroughly before relying on them for critical tasks.

## Resources

- [What are skills?](https://support.claude.com/en/articles/12512176-what-are-skills)
- [Using skills in Claude](https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- [Creating custom skills](https://support.claude.com/en/articles/12512198-creating-custom-skills)
- [Equipping agents for the real world](https://anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Agent Skills Standard](http://agentskills.io)
- [Notion Skills for Claude](https://www.notion.so/notiondevs/Notion-Skills-for-Claude-28da4445d27180c7af1df7d8615723d0)
