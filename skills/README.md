---
title: "Skills README"
source_url: "https://raw.githubusercontent.com/anthropics/skills/main/README.md"
source_type: "github-raw"
fetched_at: "2026-02-14T00:00:00Z"
category: "skills"
---

> **Note:** This repository contains Anthropic's implementation of skills for Claude. For information about the Agent Skills standard, see [agentskills.io](http://agentskills.io).

# Skills

Skills are folders of instructions, scripts, and resources that Claude loads dynamically to improve performance on specialized tasks. Skills teach Claude how to complete specific tasks in a repeatable way, whether that's creating documents with your company's brand guidelines, analyzing data using your organization's specific workflows, or automating personal tasks.

For more information, check out:
- [What are skills?](https://support.claude.com/en/articles/12512176-what-are-skills)
- [Using skills in Claude](https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- [How to create custom skills](https://support.claude.com/en/articles/12512198-creating-custom-skills)
- [Equipping agents for the real world with Agent Skills](https://anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)

# About This Repository

This repository contains skills that demonstrate what's possible with Claude's skills system. These skills range from creative applications (art, music, design) to technical tasks (testing web apps, MCP server generation) to enterprise workflows (communications, branding, etc.).

Each skill is self-contained in its own folder with a `SKILL.md` file containing the instructions and metadata that Claude uses. Browse through these skills to get inspiration for your own skills or to understand different patterns and approaches.

Many skills in this repo are open source (Apache 2.0). Document creation & editing skills that power [Claude's document capabilities](https://www.anthropic.com/news/create-files) are in the `skills/docx`, `skills/pdf`, `skills/pptx`, and `skills/xlsx` subfolders. These are source-available, not open source, but shared as a reference for complex production skills.

## Disclaimer

**These skills are provided for demonstration and educational purposes only.** Implementations and behaviors you receive from Claude may differ from what is shown in these skills. Always test skills thoroughly in your own environment before relying on them for critical tasks.

# Skill Sets
- [./skills](./skills): Skill examples for Creative & Design, Development & Technical, Enterprise & Communication, and Document Skills
- [./spec](./spec): The Agent Skills specification
- [./template](./template): Skill template

# Try in Claude Code, Claude.ai, and the API

## Claude Code
Register this repository as a Claude Code Plugin marketplace:
```
/plugin marketplace add anthropics/skills
```

Then install specific sets:
```
/plugin install document-skills@anthropic-agent-skills
/plugin install example-skills@anthropic-agent-skills
```

## Claude.ai
Example skills are all already available to paid plans in Claude.ai. To use any skill or upload custom skills, follow [Using skills in Claude](https://support.claude.com/en/articles/12512180-using-skills-in-claude#h_a4222fa77b).

## Claude API
Use pre-built or custom skills via the Claude API. See the [Skills API Quickstart](https://docs.claude.com/en/api/skills-guide#creating-a-skill).

# Creating a Basic Skill

Skills are simple to create - just a folder with a `SKILL.md` file containing YAML frontmatter and instructions:

```markdown
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

The frontmatter requires only two fields:
- `name` - A unique identifier for your skill (lowercase, hyphens for spaces)
- `description` - A complete description of what the skill does and when to use it

For more details, see [How to create custom skills](https://support.claude.com/en/articles/12512198-creating-custom-skills).

# Partner Skills

- **Notion** - [Notion Skills for Claude](https://www.notion.so/notiondevs/Notion-Skills-for-Claude-28da4445d27180c7af1df7d8615723d0)
