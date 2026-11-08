---
title: "The components of agent memory"
source_url: "https://www.anthropic.com/research/components-of-agent-memory"
source_type: "web-extracted"
fetched_at: "2026-11-08T00:00:00Z"
category: "research"
---

# The components of agent memory

Anthropic (Engineering team; Lance Martin), **November 6, 2026**. The article defines agent memory as knowledge Claude gains from experience and keeps between sessions (excluding weight updates, in-context learning, and compaction), and proposes **"dreaming"** — an agent reflecting offline on its logs to fix mistakes, write notes, and build new memory representations, analogous to hippocampal replay.

## Key findings

- **Memory as prediction.** On CL-Bench 1.0 (database task), memory sharply raised mean reward: Opus 5.5 rose from **0.655 to 0.838**, Opus 4.7 from 0.383 to 0.700, Sonnet 5 from 0.306 to 0.610. Sonnet 4.6 improved most when told to read memory and test theories (0.364 to 0.641).
- **Salience (Pokémon Red).** Sonnet 3.7 wrote **413 files across 225 folders** and earned one badge (recording stale on-screen state); Claude Fable 5 wrote **nine files** plus a dashboard and earned **four badges**, saving only what the game didn't state.
- **Steering.** Telling Claude what memory is *for* beats prescribing how to use it; a rigid "record only failures" rule cut Opus 5's memory gain by 0.234.
- **Dreaming corrects memory.** Fixing a wrong note let Claude escape Mt. Moon and reach Cerulean City (~action 1,935); the uncorrected run never did.
- **Dreaming builds wikis.** On ~350,000 files (~420M tokens) over 128 sessions, wiki-only accuracy rose from **13% to 48%**; wiki+search from 54% to 61% (vs. 53% search alone), saving ~20,000 tokens per question.
- **Structure matters.** Contract terms in one shared table kept 41 of 57 facts (**72%**); one page per contract with verbatim quotes kept all **57 (100%)**.

## Open questions

When to write memory (during a task vs. background dreaming), how to keep it current given drift and compute cost, and whether transcript search should be the foundation. Injected top-layer context is loaded every session, so Claude Code loads only the first 200 lines or 25 KB of its memory index. Dreaming lets Claude "look backward" to organize memory, though the design is still evolving.
