---
title: "The Complete Guide to Building Skills for Claude"
source_url: "https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf"
source_type: "web-extracted"
fetched_at: "2026-03-11T00:00:00Z"
category: "skills"
format: "pdf-summary"
pages: 30
---

# The Complete Guide to Building Skills for Claude

> **Source:** [Official Anthropic PDF](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf) (30 pages)
> **Local PDF:** [building-skills-guide.pdf](building-skills-guide.pdf)

## Introduction

Skills are folders of instructions, scripts, and resources that Claude loads dynamically to perform specialized tasks. Two paths exist for building skills:

1. **Standalone skills** — Self-contained instruction sets that teach Claude specific workflows
2. **MCP-enhanced skills** — Skills that leverage MCP (Model Context Protocol) server tools for external integrations

**MCP vs. Skills analogy:** MCP is the connectivity layer (like kitchen appliances), while skills provide the knowledge layer (like recipes). Together they create complete workflows.

---

## Chapter 1: Skill Fundamentals

### Skill Structure

Every skill is a folder containing:

| Component | Required | Purpose |
|-----------|----------|---------|
| `SKILL.md` | Yes | Main instruction file with YAML frontmatter |
| `scripts/` | No | Executable scripts for validation, generation |
| `references/` | No | Detailed docs loaded on demand |
| `assets/` | No | Templates, images, config files |

### Critical Rules

- File **must** be named exactly `SKILL.md` (case-sensitive)
- Folder name must be **kebab-case** (lowercase, hyphens for spaces)
- **No** `README.md` inside skill folders (conflicts with skill loading)
- **No XML tags** (`< >`) anywhere in skill files

### YAML Frontmatter

Required fields:

```yaml
---
name: my-skill-name          # kebab-case, no spaces, no capitals
description: What it does and WHEN to use it
---
```

Optional fields: `version`, `compatibility`, `tools`, `triggers`, `examples`

### Progressive Disclosure (3 Levels)

1. **Level 1 — YAML frontmatter:** Always loaded. Name + description determine when Claude activates the skill.
2. **Level 2 — SKILL.md body:** Loaded when skill activates. Core instructions, workflows, examples.
3. **Level 3 — Linked files:** Loaded on demand via `references/` directory. Detailed docs, schemas, templates.

### Composability

Skills can reference other skills, creating modular skill ecosystems. A "project setup" skill might compose file creation, MCP tool calls, and notification skills.

### Portability

Skills are designed as an open standard (see [agentskills.io](http://agentskills.io)). The same skill should work across Claude platforms. Use the `compatibility` field to note platform-specific requirements.

---

## Chapter 2: Planning and Design

### Use Case Categories

| Category | Description | Example |
|----------|-------------|---------|
| **Document & Asset Creation** | Generate files from templates/specs | Reports, presentations, code scaffolds |
| **Workflow Automation** | Multi-step processes with decision logic | Onboarding, deployment, review cycles |
| **MCP Enhancement** | Augment MCP tools with best practices | Smart file routing, compliance checks |

### Define Success Criteria

**Quantitative metrics:**
- Task completion rate
- Number of back-and-forth messages needed
- API call success rate
- Token consumption

**Qualitative metrics:**
- Output quality and accuracy
- User satisfaction
- Consistency of results

### Writing Effective Descriptions

The `description` field is the **single most important field** — it determines when Claude loads your skill.

**Good:** Includes WHAT + WHEN + scope boundaries
```yaml
description: Processes PDF legal documents for contract review.
  Use specifically for online payment workflows, not for general
  financial queries.
```

**Bad:** Too generic
```yaml
description: Helps with projects
```

**Tips:**
- Include trigger phrases users would actually say
- Mention relevant file types if applicable
- Add negative triggers to prevent over-triggering ("Do NOT use for...")

### Writing Instructions

- Keep instructions concise — use bullet points and numbered lists
- Put critical instructions at the top
- Use `## Important` or `## Critical` headers for must-follow rules
- Move detailed reference material to `references/` directory
- Keep SKILL.md under 5,000 words
- Be specific, not ambiguous (e.g., "CRITICAL: Before calling create_project, verify: Project name is non-empty" vs. "Make sure to validate things properly")

---

## Chapter 3: Testing and Iteration

### Testing Methods

| Method | Surface | Best For |
|--------|---------|----------|
| **Manual testing** | Claude.ai | Quick iteration, UX testing |
| **Scripted testing** | Claude Code | Repeatable functional tests |
| **Programmatic testing** | Skills API | Automated CI/CD validation |

### Manual Testing in Claude.ai

1. Upload skill via Settings > Capabilities > Skills
2. Test with obvious trigger phrases
3. Test with paraphrased requests
4. Test with unrelated queries (should NOT trigger)

### Scripted Testing in Claude Code

Place skill in Claude Code skills directory, then test with specific prompts.

### Programmatic Testing via API

Use the `/v1/skills` endpoint and `container.skills` parameter in Messages API calls.

### Functional Test Structure

```
Test: Create project with 5 tasks
Given: Project name "Q4 Planning", 5 task descriptions
When: Skill executes workflow
Then:
    - Project created in ProjectHub
    - 5 tasks created with correct properties
    - All tasks linked to project
    - No API errors
```

### Performance Comparison

**Without skill:** 15 back-and-forth messages, 3 failed API calls, 12,000 tokens
**With skill:** 2 clarifying questions, 0 failed API calls, 6,000 tokens

### Using the skill-creator Skill

The `skill-creator` skill (built into Claude.ai and available for Claude Code) helps build and iterate on skills:
- Generate skills from natural language descriptions
- Produce properly formatted SKILL.md with frontmatter
- Suggest trigger phrases and structure
- Review skills for common issues
- Suggest test cases

**To use:** "Use the skill-creator skill to help me build a skill for [your use case]"

*Note: skill-creator helps design and refine skills but does not execute automated test suites or produce quantitative evaluation results.*

### Iteration Based on Feedback

**Undertriggering signals:**
- Skill doesn't load when it should
- Users manually enabling it
- Solution: Add more detail/nuance to description, include keywords

**Overtriggering signals:**
- Skill loads for irrelevant queries
- Users disabling it
- Solution: Add negative triggers, be more specific

**Execution issues:**
- Inconsistent results, API call failures
- Solution: Improve instructions, add error handling

---

## Chapter 4: Distribution and Sharing

### Current Distribution Model (January 2026)

**Individual users:**
1. Download the skill folder
2. Zip the folder (if needed)
3. Upload to Claude.ai via Settings > Capabilities > Skills
4. Or place in Claude Code skills directory

**Organization-level skills:**
- Admins can deploy skills workspace-wide (shipped December 18, 2025)
- Automatic updates
- Centralized management

### Agent Skills as an Open Standard

Skills are published as an open standard (like MCP). The same skill should be portable across tools and platforms. Use the `compatibility` field to note platform-specific capabilities.

### Using Skills via API

For programmatic use cases — building applications, agents, or automated workflows.

**Key capabilities:**
- `/v1/skills` endpoint for listing and managing skills
- Add skills to Messages API requests via `container.skills` parameter
- Version control and management through the Claude Console
- Works with the Claude Agent SDK

*Note: Skills in the API require the Code Execution Tool beta for the secure environment.*

**When to use API vs. Claude.ai:**

| Use Case | Best Surface |
|----------|-------------|
| End users interacting with skills directly | Claude.ai / Claude Code |
| Manual testing and iteration | Claude.ai / Claude Code |
| Individual, ad-hoc workflows | Claude.ai / Claude Code |
| Applications using skills programmatically | API |
| Production deployments at scale | API |
| Automated pipelines and agent systems | API |

### Recommended Distribution Approach

1. **Host on GitHub** — Public repo, clear README with installation instructions, example usage and screenshots
2. **Document in your MCP repo** — Link to skills from MCP docs, explain the value of using both together
3. **Create an Installation Guide** with step-by-step instructions

### Positioning Your Skill

**Focus on outcomes, not features:**
- Good: "The ProjectHub skill enables teams to set up complete project workspaces in seconds — including pages, databases, and templates — instead of spending 30 minutes on manual setup."
- Bad: "The ProjectHub skill is a folder containing YAML frontmatter and Markdown instructions that calls our MCP server tools."

**Highlight the MCP + skills story:**
- "Our MCP server gives Claude access to your Linear projects. Our skills teach Claude your team's sprint planning workflow. Together, they enable AI-powered project management."

---

## Chapter 5: Patterns and Troubleshooting

### Choosing Your Approach: Problem-first vs. Tool-first

- **Problem-first:** "I need to set up a project workspace" → Skill orchestrates the right MCP calls in the right sequence. Users describe outcomes; the skill handles the tools.
- **Tool-first:** "I have Notion MCP connected" → Skill teaches Claude optimal workflows and best practices. Users have access; the skill provides expertise.

### Pattern 1: Sequential Workflow Orchestration

**Use when:** Multi-step processes in a specific order.

Key techniques: Explicit step ordering, dependencies between steps, validation at each stage, rollback instructions for failures.

### Pattern 2: Multi-MCP Coordination

**Use when:** Workflows span multiple services.

Example: Design-to-development handoff across Figma MCP → Drive MCP → Linear MCP → Slack MCP.

Key techniques: Clear phase separation, data passing between MCPs, validation before moving to next phase, centralized error handling.

### Pattern 3: Iterative Refinement

**Use when:** Output quality improves with iteration.

Example: Report generation with initial draft → quality check → refinement loop → finalization.

Key techniques: Explicit quality criteria, iterative improvement, validation scripts, know when to stop iterating.

### Pattern 4: Context-aware Tool Selection

**Use when:** Same outcome, different tools depending on context.

Example: Smart file storage that routes to cloud storage (>10MB), Notion/Docs (collaborative), GitHub (code), or local storage (temporary) based on file type and size.

Key techniques: Clear decision criteria, fallback options, transparency about choices.

### Pattern 5: Domain-specific Intelligence

**Use when:** Your skill adds specialized knowledge beyond tool access.

Example: Financial compliance — payment processing with compliance checks (sanctions, jurisdiction, risk assessment) before executing transactions, with full audit trail.

Key techniques: Domain expertise embedded in logic, compliance before action, comprehensive documentation, clear governance.

### Troubleshooting

#### Skill won't upload

| Error | Cause | Fix |
|-------|-------|-----|
| "Could not find SKILL.md" | File not named exactly SKILL.md | Rename (case-sensitive), verify with `ls -la` |
| "Invalid frontmatter" | YAML formatting issue | Use `---` delimiters, close quotes |
| "Invalid skill name" | Name has spaces or capitals | Use kebab-case: `my-cool-skill` |

#### Skill doesn't trigger

- Revise description field — include trigger phrases users would say
- Ask Claude: "When would you use the [skill name] skill?" to test

#### Skill triggers too often

1. Add negative triggers in description
2. Be more specific (e.g., "Processes PDF legal documents for contract review" not "Processes documents")
3. Clarify scope with explicit boundaries

#### Instructions not followed

1. **Instructions too verbose** — Keep concise, use bullet points
2. **Instructions buried** — Put critical rules at the top with `## Important`
3. **Ambiguous language** — Be specific and deterministic
4. **Model "laziness"** — Add explicit encouragement: "Take your time, quality is more important than speed"

*Advanced technique:* For critical validations, bundle a script that performs checks programmatically rather than relying on language instructions.

*Note:* Adding performance notes to user prompts is more effective than in SKILL.md.

#### MCP connection issues

1. Verify MCP server is connected (Settings > Extensions)
2. Check authentication (API keys, permissions, OAuth tokens)
3. Test MCP independently without skill
4. Verify tool names are correct (case-sensitive)

#### Large context issues

**Symptom:** Skill seems slow or responses degraded.

**Solutions:**
1. Optimize SKILL.md size — move detailed docs to `references/`, link instead of inline, keep under 5,000 words
2. Reduce enabled skills — evaluate if >20-50 enabled simultaneously, consider skill "packs" for related capabilities

---

## Chapter 6: Resources and References

### Official Documentation

- [Best Practices Guide](https://docs.claude.com)
- [Skills Documentation](https://support.claude.com)
- [API Reference](https://docs.claude.com)
- [MCP Documentation](https://modelcontextprotocol.io)

### Blog Posts

- Introducing Agent Skills
- Engineering Blog: Equipping Agents for the Real World
- Skills Explained
- How to Create Skills for Claude
- Building Skills for Claude Code
- Improving Frontend Design through Skills

### Example Skills

- Public repository: [anthropics/skills](https://github.com/anthropics/skills)
- Contains Anthropic-created skills you can customize

### Getting Support

- **Technical questions:** [Claude Developers Discord](https://www.anthropic.com/discord)
- **Bug reports:** [anthropics/skills/issues](https://github.com/anthropics/skills/issues) — include skill name, error message, steps to reproduce

---

## Reference A: Quick Checklist

### Before You Start
- [ ] Identified 2-3 concrete use cases
- [ ] Tools identified (built-in or MCP)
- [ ] Reviewed this guide and example skills
- [ ] Planned folder structure

### During Development
- [ ] Folder named in kebab-case
- [ ] SKILL.md file exists (exact spelling)
- [ ] YAML frontmatter has `---` delimiters
- [ ] name field: kebab-case, no spaces, no capitals
- [ ] description includes WHAT and WHEN
- [ ] No XML tags (`< >`) anywhere
- [ ] Instructions are clear and actionable
- [ ] Error handling included
- [ ] Examples provided
- [ ] References clearly linked

### Before Upload
- [ ] Tested triggering on obvious tasks
- [ ] Tested triggering on paraphrased requests
- [ ] Verified doesn't trigger on unrelated topics
- [ ] Functional tests pass
- [ ] Tool integration works (if applicable)
- [ ] Compressed as .zip file

### After Upload
- [ ] Test in real conversations
- [ ] Monitor for under/over-triggering
- [ ] Collect user feedback
- [ ] Iterate on description and instructions
- [ ] Update version in metadata
