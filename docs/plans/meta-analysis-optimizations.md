# Meta-Analysis: anthropic-docs-local Optimizations

This plan combines **mechanical fixes** (schema drift, validation gaps) with **meta-lessons** drawn from Anthropic's own engineering content stored in this repo. The principle: if we're maintaining a knowledge base of Anthropic best practices, the knowledge base itself should follow those practices.

---

## Part A: Mechanical Fixes (bugs and drift)

### 1. Schema Drift — `news` and `engineering` missing from JSON schemas

**Files:** `schemas/manifest.schema.json:46-56`, `schemas/frontmatter.schema.json:37-48`

Both JSON schemas define a `category` enum with only 10 values. The project uses 12 — `news` and `engineering` are missing. validate.js has its own hardcoded list with all 12, which masks the problem.

**Fix:** Add `"news"` and `"engineering"` to category enum in both schema files.

### 2. Orphan scan doesn't check `news/` or `engineering/` directories

**File:** `scripts/validate.js:240-241`

The `checkOrphans` function hardcodes 10 directories, missing `news` and `engineering`.

**Fix:** Add `'news'` and `'engineering'` to the `dirs` array.

### 3. Architecture doc is massively stale (39 sources vs 79 actual)

**File:** `docs/architecture.md`

Generated on 2026-01-11. Shows 39 sources, 10 categories. Reality: 79 sources, 12 categories.

**Fix:** Regenerate now. Add regeneration to update skill Phase 3.

### 4. generate-architecture.js category coverage

**File:** `scripts/generate-architecture.js`

Reads from manifest directly so it technically works, but category descriptions and any hardcoded lists may not account for news/engineering.

**Fix:** Review and update to handle all 12 categories.

### 5. Manifest schema missing `notes` field

**File:** `schemas/manifest.schema.json`

Several entries use `notes` but it's not in the schema. Strict validation would reject them.

**Fix:** Add `notes` as optional string field.

### 6. Manifest schema missing `last_discovery_run` field

**File:** `schemas/manifest.schema.json`

Discovery mode references this top-level field but the schema doesn't define it.

**Fix:** Add as optional top-level field.

### 7. Confidence field type inconsistency

**Files:** `manifest.json`, `schemas/manifest.schema.json:89-94`

Schema says number (0.0-1.0). 12 manifest entries use strings ("high", "medium").

**Fix:** Convert string values to numbers in manifest.json. Add type validation to validate.js.

### 8. No `package.json`

No dependency management. Need it for js-yaml if we upgrade the YAML parser, and for standard `npm run` script entries.

**Fix:** Add minimal `package.json`.

---

## Part B: Meta-Lessons (applying Anthropic's own content to this repo)

Each item below cites the specific Anthropic content in this repo that motivates it.

### 9. Multi-tier validation (from `engineering/demystifying-evals-for-ai-agents.md`)

**Lesson:** Effective evals need three grader types: code-based (fast, objective), model-based (flexible), and human (gold standard).

**Current state:** validate.js is a single code-based grader. It checks structure but not semantics. It doesn't verify timestamp consistency or detect staleness — both stated quality criteria in CLAUDE.md.

**Fix:**
- **Code tier:** Add timestamp consistency check (frontmatter `fetched_at` vs manifest `last_fetched`), staleness detection (>30 days behind `last_full_update`), confidence type validation
- **Model tier (future):** Post-update subagent that spot-checks 5 random files for semantic issues (truncated content, garbled extraction, stale information)

### 10. Structured memory files (from `engineering/effective-context-engineering.md`)

**Lesson:** "Find the smallest set of high-signal tokens that maximize likelihood of desired outcome." Persistent external notes with minimal overhead.

**Current state:** `tasks/lessons.md` is 25 lines. No tracking of fetch failures, no discovery log. When an update fails, the failure context is lost — next session hits the same issue blind.

**Fix:**
- Create `tasks/update-failures.md` — source-specific failure history with resolutions
- Create `tasks/discovery-log.md` — new sources found per discovery run with inclusion/exclusion decisions
- Reference both from CLAUDE.md so every session loads this context

### 11. Session resumption (from `engineering/effective-harnesses-for-long-running-agents.md`)

**Lesson:** Long-running agents should have initializer + incremental pattern. Progress tracking enables resumption without re-doing completed work.

**Current state:** If an update fails mid-way (e.g., rate limited at source 40 of 79), restart from scratch.

**Fix:**
- Add `--resume` flag to update skill
- Write `.update-session.json` during updates tracking: current phase, sources completed, sources failed
- On `--resume`, read session state and skip completed sources

### 12. Deterministic hooks (from `claude-code/hooks.md`)

**Lesson:** Hooks are deterministic scripts that run on lifecycle events without LLM involvement. Zero tokens consumed, composable, fast.

**Current state:** No hooks. All quality checks depend on the LLM remembering to run validate.js.

**Fix:**
- Create `.claude/settings.json` with hooks:
  - `PostToolUse` on Bash containing `git commit` → run `node scripts/validate.js`
  - `SessionStart` → run `node scripts/validate.js --quick` (quick sanity check)

### 13. Skill description engineering (from `skills/building-skills-guide.md`)

**Lesson:** The description field is "the single most important field." Good descriptions include WHAT + WHEN + NOT triggers.

**Current state:** Description is `"Update local Anthropic documentation repository"` — vague enough to mis-trigger.

**Fix:** Rewrite to:
```
Fetch and update Anthropic documentation sources from external URLs (GitHub, anthropic.com, arXiv).
Use when: "refresh docs", "update sources", "sync documentation", "run discovery".
Do NOT use for: manually editing docs, reviewing content, answering questions about docs.
```

### 14. Architecture regeneration in update loop (from `engineering/writing-tools-for-agents.md`)

**Lesson:** Tool outputs should return "meaningful context, not technical identifiers."

**Current state:** `docs/architecture.md` is a high-signal artifact (category counts, source type distribution, overview metrics) but it's never regenerated during updates, so it becomes misleading.

**Fix:** Add `node scripts/generate-architecture.js` to update skill Phase 3, after validation passes.

### 15. Documentation constitution (from `research/alignment.md` — Constitutional AI)

**Lesson:** Constitutional AI trains systems to critique outputs against explicit principles. Scalable alignment without extensive human labeling.

**Current state:** Quality criteria exist in CLAUDE.md prose but aren't codified or enforced.

**Fix:** The validate.js improvements (timestamp consistency, staleness, confidence validation) effectively codify these principles. Each validation check maps to a constitutional principle:
- **Accuracy:** SHA-256 integrity check
- **Attribution:** Required frontmatter fields
- **Consistency:** Timestamp alignment
- **Completeness:** Orphan detection + missing file detection
- **Freshness:** Staleness warning
- **Integrity:** Valid JSON/YAML

### 16. Parallel orchestration (from `engineering/multi-agent-research-system.md`)

**Lesson:** Orchestrator-worker pattern with Opus leading Sonnet subagents achieved 90.2% improvement. Eight principles including "parallel tool calling reduces time by up to 90%."

**Current state:** Update skill Phase 2 launches 3 parallel agents (already good). But Phase 2.5 (discovery scan) could also run in parallel with those 3.

**Fix:** Already addressed in the discovery mode rewrite — Phase 2.5 launches 1 agent in parallel with Phase 2 agents. No additional change needed, but the update skill should explicitly note this follows the orchestrator-worker pattern from Anthropic's own research.

---

## Part C: Deep-Read Findings (additional patterns from full content analysis)

These were identified through complete reading of every content file in the repo.

### 17. Layered validation architecture (from `api/errors.md` + `engineering/postmortem-three-recent-issues.md`)

**Lesson:** The API uses structured error categories (rate limits, auth, validation, overload) with specific recovery instructions per type. The postmortem shows how subtle bugs (0.8% routing errors, bf16/fp32 precision mismatches) degrade quality without being caught by surface-level checks.

**Current state:** validate.js runs one flat pass. No distinction between structural errors (missing file), semantic errors (stale content), and integrity errors (hash mismatch). All treated equally.

**Fix:** Restructure validate.js into 4 explicit validation layers:
1. **Schema layer:** JSON structure, enum values, required fields
2. **Reference layer:** Manifest ↔ file consistency, orphan detection
3. **Content layer:** Frontmatter completeness, timestamp alignment
4. **Integrity layer:** SHA-256 hash verification, content drift detection

Each layer reports independently. A schema failure is blocking; a staleness warning is advisory.

### 18. Source lifecycle tracking (from `models/deprecations.md`)

**Lesson:** Anthropic tracks model lifecycle as Active → Legacy → Deprecated → Retired, with 60+ day advance notice and explicit migration paths.

**Current state:** No lifecycle tracking for documentation sources. If anthropic.com restructures a page, the source silently breaks. No way to mark a source as "deprecated — use new URL" or "archived — no longer maintained."

**Fix:** Add `lifecycle_status` field to manifest schema:
- `active` — actively fetched and maintained
- `legacy` — still valid but superseded by newer source
- `deprecated` — will be removed; replacement exists
- `archived` — historical reference only, not updated

### 19. Self-correction loop (from `claude-code/best-practices.md` — Boris Cherny pattern)

**Lesson:** "After every correction, end with: 'Update your CLAUDE.md so you don't make that mistake again.' Claude is eerily good at writing rules for itself."

**Current state:** `tasks/lessons.md` exists but only has 25 lines and hasn't been updated since February. CLAUDE.md doesn't reference it. There's no instruction telling Claude to update lessons after encountering problems.

**Fix:** Add to CLAUDE.md:
```
## After Any Update Failure
1. Log the failure in tasks/update-failures.md with: source_id, error, resolution
2. If it reveals a pattern, add a rule to tasks/lessons.md
3. If it's a recurring issue, add a check to scripts/validate.js
```

### 20. Progressive disclosure for the update skill (from `skills/building-skills-guide.md`)

**Lesson:** Skills should use three levels: frontmatter (always loaded), SKILL.md body (on activation), references/ directory (on demand). Keep SKILL.md under 5,000 words.

**Current state:** The update skill is a single 300+ line file with all instructions inline. Source type handling details, manual source protocol, error handling — everything lives in one file that gets fully loaded into context every time.

**Fix:** Restructure:
```
.claude/commands/update-anthropic-docs.md     — Core workflow (phases, modes, critical rules)
.claude/commands/references/
  ├── source-types.md        — Detailed handling for each source_type
  ├── discovery-patterns.md  — How to identify and evaluate new sources
  └── failure-patterns.md    — Common errors and resolutions
```

### 21. Checkpoint-heavy workflow (from `claude-code/how-anthropic-teams-use-claude-code.md`)

**Lesson:** Product and RL Engineering teams at Anthropic "commit checkpoints regularly so they can easily revert" and "starting over often has a higher success rate than trying to fix mistakes."

**Current state:** The update skill commits once at the end (Phase 3). If 75 sources update fine but 4 break, the entire batch is one commit. Can't easily revert the broken ones.

**Fix:** Add intermediate commits:
- After Phase 2 (fetch): commit fetched files with message "WIP: Fetched N sources"
- After Phase 2.5 (discovery): commit any new source additions
- After Phase 3 (verify): final commit with validation confirmation
- Use `git revert HEAD~1` if Phase 3 validation fails

### 22. Content drift detection (from `engineering/postmortem-three-recent-issues.md`)

**Lesson:** Infrastructure bugs degrade quality more subtly than people realize. The postmortem describes cases where outputs appeared correct but had precision mismatches causing subtle correctness issues.

**Current state:** SHA-256 hashes exist in manifest but are only used for initial integrity verification. No mechanism to detect when web-extracted content has subtly drifted (e.g., a page was restructured, key sections removed, or content was truncated during extraction).

**Fix:** Add a `--diff` flag to update skill that:
1. Fetches current content from source
2. Compares against local file using diff (not just hash)
3. Reports the nature of changes (additions, deletions, restructuring)
4. Flags suspicious patterns: content significantly shorter, key sections missing, format changes

### 23. Plan mode as validation gate (from `claude-code/best-practices.md` — Boris Cherny)

**Lesson:** "Start every complex task in plan mode. If something goes sideways, switch back to plan mode and re-plan. Don't keep pushing when stuck."

**Current state:** The update skill has no explicit plan mode step. It jumps straight into fetching without confirming the plan with the user.

**Fix:** Add Phase 0 to update skill:
```
Phase 0: Plan (always runs)
- Read manifest.json
- Count sources by type and category
- Present plan to user: "Will update X github-raw, Y web-extracted, Z manual sources"
- If --check or --discover, describe what will be checked/discovered
- Wait for user confirmation before proceeding
```

---

## Implementation Plan

### Phase 1: Schema + data fixes (items #1, #5, #6, #7, #18)
1. Add `news`, `engineering` to category enum in both schema files
2. Add `notes` optional field to manifest source schema
3. Add `last_discovery_run` optional field to manifest top-level schema
4. Add `lifecycle_status` optional field to manifest source schema (active/legacy/deprecated/archived)
5. Fix 12 string confidence values → numbers in `manifest.json`
6. Add `package.json` with script entries

### Phase 2: Validation improvements (items #2, #9, #17)
7. Add `news`, `engineering` to orphan scan dirs in validate.js
8. Restructure validate.js into 4 layers: schema → reference → content → integrity
9. Add timestamp consistency check (fetched_at vs last_fetched)
10. Add staleness detection (warn if source >30 days behind last_full_update)
11. Add confidence field type validation
12. Add SHA-256 hash verification (integrity layer)

### Phase 3: Architecture + automation (items #3, #4, #14)
13. Update generate-architecture.js for all 12 categories
14. Regenerate `docs/architecture.md`
15. Add architecture regeneration to update skill Phase 3

### Phase 4: Update skill improvements (items #13, #20, #21, #22, #23)
16. Improve skill description with WHAT/WHEN/NOT triggers
17. Add Phase 0 (plan confirmation before executing)
18. Add intermediate checkpoint commits (after fetch, after discovery, after verify)
19. Add `--diff` flag for content drift detection
20. Move detailed instructions to `references/` subdirectory (progressive disclosure)

### Phase 5: Structured memory + self-correction (items #10, #19)
21. Create `tasks/update-failures.md` — failure log with resolutions
22. Create `tasks/discovery-log.md` — discovery run history
23. Update CLAUDE.md to reference memory files + add self-correction protocol

### Phase 6: Session resilience + hooks (items #11, #12, future)
24. Add `--resume` flag and `.update-session.json` to update skill
25. Add hooks for deterministic validation (PostToolUse on git commit, SessionStart sanity check)

---

## Source References

Every item in this plan traces back to content stored in this repo:

| Plan Item | Source File | Anthropic Principle |
|-----------|-------------|---------------------|
| #9 Multi-tier validation | `engineering/demystifying-evals-for-ai-agents.md` | Three grader types |
| #10 Structured memory | `engineering/effective-context-engineering.md` | Smallest high-signal token set |
| #11 Session resumption | `engineering/effective-harnesses-for-long-running-agents.md` | Initializer + incremental pattern |
| #12 Deterministic hooks | `claude-code/hooks.md` | Zero-token lifecycle events |
| #13 Skill descriptions | `skills/building-skills-guide.md` | WHAT/WHEN/NOT triggers |
| #14 Architecture regen | `engineering/writing-tools-for-agents.md` | Meaningful context over IDs |
| #15 Doc constitution | `research/alignment.md` | Constitutional AI principles |
| #16 Parallel orchestration | `engineering/multi-agent-research-system.md` | Orchestrator-worker 90% improvement |
| #17 Layered validation | `api/errors.md` + `engineering/postmortem-three-recent-issues.md` | Structured error categories + subtle drift |
| #18 Source lifecycle | `models/deprecations.md` | Active → Legacy → Deprecated → Retired |
| #19 Self-correction loop | `claude-code/best-practices.md` | "Update CLAUDE.md after every correction" |
| #20 Progressive disclosure | `skills/building-skills-guide.md` | Three-level skill loading |
| #21 Checkpoint workflow | `claude-code/how-anthropic-teams-use-claude-code.md` | "Commit checkpoints regularly" |
| #22 Content drift detection | `engineering/postmortem-three-recent-issues.md` | Subtle quality degradation |
| #23 Plan mode gate | `claude-code/best-practices.md` | "Start every complex task in plan mode" |
