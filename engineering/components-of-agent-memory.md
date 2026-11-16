---
title: "The components of agent memory"
source_url: "https://www.anthropic.com/research/components-of-agent-memory"
source_type: "web-extracted"
fetched_at: "2026-11-16T00:00:00Z"
category: "engineering"
---

# The components of agent memory

**Published:** Nov 6, 2026 | **Team:** Engineering | **Topics:** Agents, Context engineering, Agent memory

**Author:** Lance Martin. Editorial guidance from Caitlin Love, Tom Chivers, Rebecca Hiscott, Jake Eaton, and Blake Wilson. Figures by Monika Tuchowska. About 17 further contributors are acknowledged.

## Contents

- Introduction
- Memory notes
- Memory can be a prediction about what the future will need
- Claude has learned to judge salience
- Steering Claude to write memory
- Dreaming can correct memory
- Dreaming can build new memory representations
- Dreaming can promote notes up the memory hierarchy
- Dreaming can focus memory on a specific goal
- Dreaming can fill in gaps a session leaves behind
- Thinking backward, looking forward

## Introduction

- The post opens with an analogy to human memory. The hippocampus captures experiences quickly, and only some of them are consolidated into long-term knowledge in the neocortex, largely during offline rest and sleep.
- It proposes a similar division of labor for agents. Agents record their work in transcripts, and an offline process called **"dreaming"** can reorganize those logs into memory.
- Precedent: sleep-time compute research from Letta and UC Berkeley.

## Memory notes

- **Definition:** Agent memory is knowledge Claude gains from experience and keeps between sessions as readable context. The definition excludes changes to model weights, in-context learning, and compaction.
- Claude can tag salient events in session logs, or write notes to a memory store such as a folder.
- Open question: how can Claude judge what is salient before it knows what will happen next?

## Memory can be a prediction about what the future will need

- Writing down a rule or a verified fact is a prediction that it will be useful later.
- **Setup:** The CL-Bench 1.0 database task, run on Claude Managed Agents. Each question ran in a fresh session, but Claude could read and write a persistent memory directory.
- **How each model used memory:**

| Model | Behavior |
|---|---|
| Sonnet 4.6 | Produced untested theories about wrong answers; notes were scattered. |
| Opus 4.7 | Consolidated notes into a single reference document and marked which facts were confirmed. |
| Sonnet 5 | Marked answers as confirmed after grading and wrote corrections. |
| Opus 5 | First model to "close the loop": rules, the reasoning behind them, answers to earlier questions, and warnings about traps. |
| Opus 5.5 / Sonnet 5.5 | Also closed the loop. Scored about the same as Opus 5 with memory; their no-memory baselines were slightly higher. |

**Mean reward on the CL-Bench database task**

| Model | Baseline | With memory |
|---|---|---|
| Opus 5.5 | 0.655 | 0.838 |
| Sonnet 5.5 | 0.644 | 0.833 |
| Opus 5 | 0.564 | 0.828 |
| Opus 4.7 | 0.383 | 0.700 |
| Sonnet 5 | 0.306 | 0.610 |
| Sonnet 4.6 | 0.330 | 0.364 |

## Claude has learned to judge salience

- **Setup:** Pokémon Red, a long-horizon game, was used to see what Claude chooses to save. Each model started with a writable memory folder.
- **Sonnet 3.7** (about 10,000 steps in):
  - Wrote indiscriminately: **413 files across 225 folders**, including a file per battle, per item, and per NPC.
  - Earned **one badge**.
  - Its records were based on game state and went stale. Around step 10,000 it spent 17 steps creating six files and deleting nine without taking any action in the game.
- **Fable 5:**
  - Wrote **9 files in two folders plus a top-level `global.md`** (10 files in total).
  - Earned **four badges**.
  - Saved only what couldn't be read off the screen: strategy, plans, and rules it had tested.
  - `global.md` worked as a dashboard (current goal, gym plan, memory rules). A `locations` folder held route plans, and a `gameplay` folder held strategies.
  - One rule it learned: after repeated failed catches, vary the timing of inputs.
- **Opus 5.5:** Kept a small folder tracking its goal and next steps, rewrote it as it played, and **beat the game**.

## Steering Claude to write memory

- Telling Claude what memory is *for*, without prescribing *how* to use it, was enough to give Opus 4.7 and Opus 5 a clear boost.
- **Fixed rules hurt stronger models.** A "record only failures" rule reduced the gain from memory:

| Model | Change in memory gain |
|---|---|
| Opus 5 | −0.234 |
| Opus 4.7 | −0.150 |
| Sonnet 4.6 | −0.020 |

- Stronger models did better when left free to judge salience.
- **Older models benefit most from steering.** Sonnet 4.6 often skipped reading memory and didn't test its theories. Prompting it to read memory first and to test theories explicitly nearly doubled its score, from **0.364 to 0.641**.
- Sonnet 5 reads memory before answering about **9 times out of 10** without being prompted. Sonnet 4.6 does so less than half the time.
- **Guidance for frontier models:** Give simple advice to create notes when asked, or when something is clearly worth keeping, and leave the judgment to Claude.

## Dreaming can correct memory

- Wrong notes may be trusted in later sessions. Dreaming checks notes against the original transcripts.
- **Example (Pokémon, Mt. Moon):** Claude noted that the Pokécenter was on the east side, but it was on the west. A one-way ledge near the entrance then dropped Claude back onto the route it had come from. The agent read the drop as overshooting and never recognized its mistake.

| Condition | Outcome |
|---|---|
| Memory + dreaming | Corrected the note, re-entered the cave, and reached Cerulean City at action 1,935. |
| Raw memory | Fell off the ledge three times, stopped looping, and drifted to Pewter City. Never reached Cerulean. |
| No memory | Never reached Cerulean. |

## Dreaming can build new memory representations

- Dreaming can build **wikis**: linked pages that Claude writes and maintains on a subject, which serve as a navigable map of memory.
- **Stainless corpus:**
  - About **350,000 internal files** (about **420M tokens**), with an evaluation set of **25 questions**.
  - Claude built the wiki over **128 dreaming sessions** using Opus 5, coordinating through a shared log.
  - Results:

| Setup | Share of graded criteria |
|---|---|
| Wiki alone | 13% → 48% |
| Search alone | 53% |
| Wiki + search | 54% → 61% |

  - Using the wiki and search together saved about **20,000 tokens per question**.
  - Wiki growth: **103 pages / 766 links** after 2 sessions; **222 pages / 12,893 links** after 128 sessions.
- **Harvey LAB merger task (24 questions):** On questions needing multiple documents, judgment, or math, the wiki scored **87%**, compared with **73%** for search alone.
- **Limitations:**
  - On a LAB task where most criteria sat in one document, the wiki gave no clear gain.
  - On another, the wiki grew to **1.77× the size of the corpus** (203 KB vs. 115 KB, 68 pages), with some pages left unlinked. The post invokes Borges's mapmakers as an analogy.

## Dreaming can promote notes up the memory hierarchy

- Notes in the top layer are preloaded into every session, so Claude doesn't need to search for them.
- Risks:
  - Injected notes use up tokens.
  - Errors spread to every session.
  - Longer instruction files reduce adherence (per the Claude Code docs).
- The top layer has to stay small. Dreaming moves details down to lower layers and leaves links in their place.
- Claude Code's auto memory loads only the first **200 lines or 25 KB** of `MEMORY.md`, which serves as an index.

## Dreaming can focus memory on a specific goal

- Dreaming can be tuned toward a goal. For example, a Claude Duet-style assistant benefits from memory organized around the person it helps.
- **Contracts task (LAB):**
  - Several agents wrote to a single shared contracts table at the same time, and their overwrites lost facts. Result: **41 of 57** graded facts (**72%**).
  - Through a reflect-revise-rebuild loop, Claude learned that contract terms were critical. The revised instructions gave each contract its own page, with terms quoted verbatim. Result: **57 of 57** facts (**100%** of criteria).

## Dreaming can fill in gaps a session leaves behind

- A single session sees only its own context, so dreaming can search across sessions to fix common problems.
- A second pass repaired **nine links** that pointed to a nonexistent "escrow-agreement" page, pointing them to an existing page instead. It also added three pages, including an index.
  - Entries: 38 → 41
  - Links: 225 → 278

## Thinking backward, looking forward

**Open questions:**

- **When to write memory:** Notes written during a task are available right away but take attention from the task. Dreaming runs in the background, but its outputs may not be readily accessible.
- **Keeping memory current:** Claude can write wrong rules, and memory drifts as environments change. Dreaming fixes this but costs compute. It may be better to focus dreaming on volatile information, or to set its cadence by how often memory is accessed.
- **Transcript search as a foundation:** Combining wikis with search can work, but maintaining these representations takes compute to keep errors and hallucinations out.

**Conclusion:** Even with better judgment about salience, Claude can't predict the future. Dreaming lets it look backward to organize memory and correct mistakes. Memory systems will keep evolving as Claude improves.

**Resources:** Cookbooks for getting started with dreaming and with knowledge wikis.
