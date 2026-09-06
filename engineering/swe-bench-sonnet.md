---
title: "Raising the bar on SWE-bench Verified with Claude 3.5 Sonnet"
source_url: "https://www.anthropic.com/engineering/swe-bench-sonnet"
source_type: "web-extracted"
fetched_at: "2026-09-06T00:00:00Z"
category: "engineering"
published: "2025-01-06"
---

# Raising the bar on SWE-bench Verified with Claude 3.5 Sonnet

## Overview

Anthropic's upgraded Claude 3.5 Sonnet achieved 49% on SWE-bench Verified, surpassing the previous state-of-the-art score of 45%. The article explains the agent architecture built around the model and provides guidance for developers seeking optimal performance.

## What Is SWE-bench?

SWE-bench evaluates AI models' ability to resolve real GitHub issues from open-source Python repositories. The benchmark tests whether models can understand, modify, and test code, with solutions graded against actual unit tests from the original pull requests. Importantly, the evaluation assesses the entire "agent" system—combining the model with scaffolding that generates prompts, parses outputs, and manages interaction loops.

The article highlights three reasons SWE-bench gained prominence:

- Uses authentic engineering tasks rather than competition-style questions
- Remains unsaturated with room for improvement
- Measures complete agents, not isolated models

SWE-bench Verified comprises 500 human-reviewed solvable problems from the larger dataset.

## Agent Architecture

The design prioritizes giving the language model maximum control while maintaining minimal scaffolding. The agent includes:

**Bash tool:** Executes bash commands with detailed instructions about escaping, lack of internet access, and background operation guidance.

**Edit tool (str_replace_editor):** Handles file viewing, creation, and editing. The tool requires absolute paths and uses string replacement where models specify `old_str` to replace with `new_str`. Replacements only occur with exactly one match.

The system continues sampling until the model decides completion or reaches 200k context length. The prompt outlines a suggested approach for the model, but it's not overly long or too detailed.

## Performance Results

| Model                   | SWE-bench Verified Score |
| ----------------------- | ------------------------ |
| Claude 3.5 Sonnet (new) | 49%                      |
| Previous SOTA           | 45%                      |
| Claude 3.5 Sonnet (old) | 33%                      |
| Claude 3 Opus           | 22%                      |

## Model Behavior Improvements

The updated Claude 3.5 Sonnet demonstrates enhanced self-correction capabilities and attempts multiple solution approaches rather than repeating the same errors.

## Key Challenges

1. **Cost and duration:** Successful runs often require hundreds of turns exceeding 100k tokens
2. **Grading complexity:** Environment setup issues can obscure actual model performance
3. **Hidden tests:** Models may incorrectly believe they succeeded when tests fail due to abstraction levels or mismatched implementations
4. **Multimodal limitations:** Lack of filesystem file-viewing capability hampers debugging, particularly for visualization tasks

## Design Lessons

Developers should invest significant effort into tool interface design and descriptions, anticipating potential misunderstandings. The article notes that "error-proofing" tools—such as requiring absolute paths—improves reliability.
