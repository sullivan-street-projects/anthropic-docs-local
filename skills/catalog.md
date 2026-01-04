---
title: "Skills Catalog"
source_url: "https://github.com/anthropics/skills"
source_type: "web-extracted"
fetched_at: "2026-01-04T06:25:00Z"
category: "skills"
---

# Claude Skills Catalog

Skills are folders of instructions and resources that Claude loads dynamically to improve performance on specialized tasks. They're part of the Agent Skills open standard adopted by both Anthropic and OpenAI.

## Official Anthropic Skills

Available from the `anthropic-agent-skills` marketplace:

### Document Skills

Skills for document creation and processing.

```bash
/plugin install document-skills@anthropic-agent-skills
```

| Skill | Description |
|-------|-------------|
| report-generator | Generate structured reports from data |
| proposal-writer | Create business proposals |
| technical-docs | Write technical documentation |
| meeting-notes | Summarize and format meeting notes |

### Development Skills

Skills for software development workflows.

```bash
/plugin install dev-skills@anthropic-agent-skills
```

| Skill | Description |
|-------|-------------|
| code-review | Comprehensive code review analysis |
| test-generator | Generate unit and integration tests |
| refactor-assistant | Safe refactoring suggestions |
| api-designer | Design RESTful and GraphQL APIs |

### Analysis Skills

Skills for data and content analysis.

```bash
/plugin install analysis-skills@anthropic-agent-skills
```

| Skill | Description |
|-------|-------------|
| data-analyzer | Statistical analysis and insights |
| sentiment-analysis | Analyze text sentiment |
| competitive-analysis | Market and competitor research |
| log-analyzer | Parse and analyze log files |

## Skill Structure

A skill is a folder containing a `SKILL.md` file:

```
my-skill/
├── SKILL.md           # Required: Instructions and metadata
├── examples/          # Optional: Example files
├── templates/         # Optional: Template files
└── scripts/           # Optional: Helper scripts
```

### SKILL.md Format

```yaml
---
name: my-skill
description: What this skill does
allowed-tools: Read, Write, Bash(python:*)
---

# Skill Name

## Overview

Brief description of the skill's purpose.

## Instructions

Step-by-step instructions for Claude to follow.

## Examples

Example inputs and outputs.
```

### Required Frontmatter

| Field | Description |
|-------|-------------|
| `name` | Unique skill identifier |
| `description` | Brief description (used for skill selection) |

### Optional Frontmatter

| Field | Description |
|-------|-------------|
| `allowed-tools` | Tools this skill can use |
| `version` | Semantic version number |
| `author` | Skill author information |
| `tags` | Keywords for discovery |

## Installing Skills

### From Marketplace

```bash
# Install a specific skill
/plugin install skill-name@marketplace-name

# List available skills
/plugin search skills

# Update skills
/plugin update skill-name@marketplace-name
```

### From Local Directory

```bash
# Test local skill
claude --skill-dir ./my-skill

# Add to project
cp -r ./my-skill .claude/skills/
```

### From GitHub

```bash
# Add custom marketplace
claude plugin add-marketplace my-skills --source github --repo user/repo

# Install from custom marketplace
/plugin install my-skill@my-skills
```

## Community Skill Collections

Several community-maintained skill collections are available:

### awesome-claude-skills

Curated list of Claude skills and resources.

- **GitHub**: https://github.com/travisvn/awesome-claude-skills
- Categories: Productivity, Development, Writing, Analysis

### claude-skills-marketplace

Software engineering workflow skills.

- **GitHub**: https://github.com/mhattingpete/claude-skills-marketplace
- Focus: Git automation, testing, code review

### claude-code-plugins-plus-skills

Large collection with 239+ skills.

- **GitHub**: https://github.com/jeremylongshore/claude-code-plugins-plus-skills
- Includes: Jupyter tutorials, interactive examples

### netresearch claude-code-marketplace

Automated skill syncing from individual repositories.

- **GitHub**: https://github.com/netresearch/claude-code-marketplace
- Features: Automatic updates, modular architecture

## Creating Custom Skills

### Step 1: Create Structure

```bash
mkdir -p my-skill
cat > my-skill/SKILL.md << 'EOF'
---
name: my-skill
description: Description of what my skill does
---

# My Skill

Instructions for Claude here...
EOF
```

### Step 2: Write Instructions

- Be specific and actionable
- Include examples
- Define expected outputs
- Handle edge cases

### Step 3: Test Locally

```bash
claude --skill-dir ./my-skill
```

### Step 4: Iterate

- Test with various inputs
- Refine instructions based on results
- Add examples for clarity

### Step 5: Share

- Publish to GitHub
- Submit to marketplaces
- Document usage

## Best Practices

### Skill Design

1. **Single responsibility** - One skill, one task
2. **Clear triggers** - Obvious when to use
3. **Detailed instructions** - Leave nothing ambiguous
4. **Include examples** - Show expected behavior

### Performance

1. **Minimal tool access** - Only request needed tools
2. **Efficient prompts** - Concise but complete
3. **Caching friendly** - Stable instruction text

### Security

1. **Validate inputs** - Check user-provided data
2. **Limit permissions** - Use `allowed-tools` appropriately
3. **No secrets** - Never hardcode credentials

## Skill Platforms

Skills work across multiple platforms:

| Platform | Support | Notes |
|----------|---------|-------|
| Claude Code | Full | Native marketplace integration |
| Claude.ai | Full | Pro, Max, Team, Enterprise users |
| Claude API | Full | Direct integration |
| Codex CLI | Full | OpenAI adopted Agent Skills standard |
| ChatGPT | Full | Via Agent Skills format |

## Resources

- **Official Repository**: https://github.com/anthropics/skills
- **Agent Skills Standard**: https://agentskills.io
- **Skills Template**: https://github.com/anthropics/skills/tree/main/template
- **Specification**: https://github.com/anthropics/skills/blob/main/SPECIFICATION.md
