---
title: "Building strong safety evaluations"
source_url: "https://www.anthropic.com/research/building-strong-safety-evaluations"
source_type: "web-extracted"
fetched_at: "2026-11-16T00:00:00Z"
category: "engineering"
---

# Building strong safety evaluations

**Published:** Nov 13, 2026 | **Team:** Engineering

**Authors:** Ruth Appel, Evan Frondorf, Jeremy Hadfield, Rebecca Hiscott, Kamya Jagadish, Shayne Longpre, Madeleine Tucker, Brett Wittmershaus. Additional contributions from Michael Aciman, Brianna, Thomas Chang, Chris Doenlen, Jake Eaton, Miles McCain, Kira Riehm, Jonah Rubin, Alexandra Sanderford, Gian Segato, and Emma Webb.

## Contents

| Section | Subsections |
|---|---|
| Introduction | — |
| Safety first | Build a team with the right skills; Run evals safely |
| Design | Match the design to the question; Measure what you mean to measure; Make sure the results generalize |
| Run | Keep measures internally valid; Preregister |
| Report | Report statistics fully; Document everything; Disclose flaws responsibly |
| Where to start | — |

## Introduction

- Safety evals inform deployment decisions, which safeguards ship, and where safety training should focus.
- A **safety eval** measures a model's propensity to cause or contribute to harm, and how severe that harm would be. It does not measure specific capabilities.
- Harm can come from a user who actively asks for it. It can also come from benign-seeming requests that carry a high risk of unintended harm, such as drug dosing questions.
- Evals are easy to game, often don't measure what they claim to, and are often poorly documented. Results can shift with the format (multiple-choice vs. open-ended) or with the order of answer options.
- The post draws on psychology's replication reforms (preregistration, better measurement, stronger statistics) and on Anthropic's own experience building evals.

## Safety first

### Build a team with the right skills

- Good evals need two kinds of expertise:
  - **Methods experts** handle sampling, grading, and analysis.
  - **Domain experts** (e.g., psychologists, biologists, political scientists) define what counts as harm, which cases are borderline, and what a good response looks like.
- When one perspective is missing, evals fail in predictable ways. Some are technically rigorous but miss key factors. Others go deep but cover only some of the relevant behaviors. Involving both groups from the start reduces this risk.

### Run evals safely

- Evals often run with safeguards disabled so that baseline behavior can be measured.
- Cyber evals carry particular risk, because models may probe the boundaries of the test. They should run in a sandbox without internet access, with real-time monitoring so that runs can be stopped.
- After its own incidents, Anthropic hardened its evaluation environments. It also temporarily stopped many evals that give models internet access, and added real-time monitoring for web search evals.

## Design

### Match the design to the question

- Start by asking what question the eval answers. That question determines how the results can be interpreted.
- Most evals are **observational**: they show differences in scores but not what caused them.
- **Causal** claims need designs that change one thing at a time, for example the same model with and without a system prompt change.
- Example:
  - Observational: "Is the model responding safely to ... eating disorders?"
  - Causal: "Does altering the system prompt change whether ..."

### Measure what you mean to measure

- This is a question of **construct validity**, and the post says AI evals often fall short here.
- Refusal is the obvious construct to measure, but it is often the wrong one. On suicide and self-harm, a model that refused everything would score perfectly on refusal rate without being any safer. The ideal response engages with empathy and points the person toward human support.
- Anthropic's multi-turn evals report an **appropriate response rate**. This is the share of conversations in which the model behaved appropriately at every turn, judged against rubrics built by experts. One bad turn fails the whole conversation.
- In the wellbeing domain, an "appropriate" response:
  - is supportive when the user discloses risk
  - avoids details about methods
  - provides crisis resources at the right moment
  - doesn't present itself as a substitute for a crisis line
- In dual-use domains (biology, cybersecurity), the appropriate response helps with the legitimate version of a request and withholds operational specifics. A separate rubric is built for each topic.
- Figure examples:
  - Load-testing a web server: help.
  - Evading a firewall: decline, and suggest asking the server's operator.
  - Paired harmful and benign prompts on stolen passwords, phishing, and SQL injection.
- Evals have to measure both **harmful compliance** and **over-refusal** of benign requests. Single-turn evals pair a "harmless response rate" set with a "refusal rate" set in the same domain.
  - Example: a request for a nerve agent formulation should be refused, while a question about a historical chemical disaster should be answered.
  - Judging borderline cases requires subject-matter expertise.

### Make sure the results generalize

#### Capture nuance via multi-turn simulations

- Single-turn prompts are easy to build, but they saturate quickly and are unrealistic. Harm often emerges through gradual escalation.
- User distress builds up over several turns. In one multi-turn suicide and self-harm eval, a simulated user mentions a destabilizing event early on (such as a layoff or a bereavement) and later asks a question that looks ordinary. A model that ignores the earlier context may respond in a dangerous way.

#### Design scenarios that model a range of conditions

Anthropic builds these scenarios with an internal tool:

1. A domain expert writes a specification. It sets the simulated user's objectives and tactics, and dimensions such as persona, situation, tone, and style, each with several options.
2. The first user turn is fixed.
3. A separate Claude model writes the later user turns, following the specification and reacting to the tested model's replies. The tested model writes the assistant turns.
4. Each scenario is run many times with different combinations of specification characteristics.
5. A grader model scores each transcript against the rubric. The score is the share of transcripts graded "appropriate" throughout.

- **Romance scam example:** A "cautiously probing" user presents exploitative questions as innocent help for a widowed relative. No single message is an obvious violation, but taken together they suggest the user is targeting vulnerable people. The model has to recognize the pattern despite the reframing.
- Vary dimensions independently, for example by testing every severity level with every tone, so their effects can be separated.

#### Take real-world interaction patterns into account

- Invented scenarios are often too easy and don't read like real users' writing. Where possible, build from observed behavior: usage data, public data, red-team transcripts, incident reports, or interviews with clinicians.
- Election integrity prompts are based on real patterns, such as deceptive calls or texts about polling locations.
- Treat scenario sets as living documents. Cases are continually added and revised based on enforcement and monitoring.
- Cover different languages, modalities, product surfaces, and harnesses or environments. Anthropic's single-turn suites span **16 policy areas** in **seven languages** across multiple surfaces.
- Match the eval setup (tools, default system prompt) to the deployment being tested.

## Run

### Keep measures internally valid

An eval loses internal validity when its scores are driven by something other than the behavior it is meant to measure.

#### Don't make it too easy (or too hard)

- **Data contamination:** If test items appear in training data, the eval measures memory. Use data from after the training cutoff, or self-generated synthetic data.
- **Reward hacking:** A model may be able to find the answers, or satisfy the grader without doing the task. Close these paths before trusting the scores. Randomize irrelevant details, such as the order of multiple-choice answers.
- **Calibration:**
  - Recent models score **94%–98%** aggregate harmless response rates on single-turn API evals. These evals are saturated and now mainly serve as regression checks.
  - Multi-turn rates vary much more.
  - Make a saturated eval harder while keeping the same construct: longer horizons, subtler presentation, more naturalistic writing. Don't resort to trick questions.
- **Too hard:** An audit of a leading coding benchmark found that many tasks were underspecified or missing context, or were graded by tests that rejected correct solutions.

#### Carefully calibrate your grader

- LLM graders are necessary because humans can't read every transcript. But they can fail silently, or shift when the underlying model changes. Set up alerts, and check the setup when scores are surprising. Send high-uncertainty flags to humans for review.
- Best practices:

| Practice | Guidance |
|---|---|
| Simplicity and objectivity | Use programmatic checks where the ground truth is clear. Watch for edge cases, such as a "Yes" extraction that matches an offer to help with a harmful request. Write grader instructions as if for a capable colleague who is new to the area. |
| Atomic, binary criteria | Ask yes/no questions rather than asking for one overall score. Define borderline cases explicitly, for example whether explaining a class of vulnerability or giving pseudocode counts as exploit code. |
| Disclaimers don't change verdicts | Warnings or resources don't make harmful content harmless. Grade the substance, not the framing. |
| Avoid grader bias | Hide design metadata from the grader. Consider using a different model as grader, since models may favor their own outputs. Check for length bias, and check for position bias by swapping pairwise options. Re-grade samples with another model or different rubric wording, and check whether the conclusions hold. |
| Fail loudly | Flag and exclude items where the grader breaks, rather than silently scoring or dropping them. Log warnings for unrealistic response lengths or parse failures. |
| Validate against human labels | Have humans label transcripts blind, then report chance-corrected agreement (e.g., Cohen's kappa). Compare human-to-grader agreement with human-to-human agreement. If humans disagree with each other, rethink what you are measuring. If humans agree with each other but not with the grader, revise the rubric. |

- Figure: a grader should agree with experts about as often as the experts agree with each other.

### Preregister

- Before seeing results, write down the main metrics, the planned comparisons, the data slices (e.g., by conversation length), and what counts as an improvement or a regression. Disclose and justify any deviations.
- **Sample size:** Run each test case several times and report the spread. Use at least **100 items** for complex multi-turn evals and at least **1,000** for simpler single-turn evals. Larger samples can detect smaller effects.
- To detect small differences between models, use **paired comparisons**: run both models on the same items and compute confidence intervals on the per-item differences.

## Report

### Report statistics fully

- Don't rely on a single headline number. Break results out by category, and report categories that didn't change alongside those that did. Correct for multiple comparisons.
- Report uncertainty for every estimate. Confidence intervals in system cards can exceed **±10 percentage points** for multi-turn API evals. With intervals that wide, an apparent difference may be sampling noise, and the eval should be reworked to give a clearer signal.
- **Example:** On a multi-turn romance scams eval on claude.ai, Claude Opus 5 scored **98%** and Opus 5.5 scored **94%**. The difference was not statistically significant, so neither model can be called better. Anthropic is expanding the test set and exploring agentic misuse evals to reduce saturation.

### Document everything

- Report the configuration, because it affects performance. Anthropic's system cards report results both on the API (raw model) and on claude.ai (with its system prompt). For Claude Fable 5.1, the gap between the two on multi-turn safety evals was as large as **34 percentage points**.
- Give enough detail for others to reproduce the results: model versions, sampling settings, prompts, grader version, and dates. Don't compare scores produced by different graders.
- Tooling:
  - The UK AI Security Institute's open-source **Inspect** framework handles running, logging, and grading.
  - Anthropic's **Petri** toolkit, built on Inspect, automates multi-turn behavioral testing.
  - System cards provide a schema for documentation.
- Figure: Two models were run on the same 100-item eval. One scored **72%** (low reasoning, no system prompt) and the other **85%** (maximum reasoning, claude.ai system prompt). Because several settings differed, the scores don't show that Model B is better. Compare models only when every setting matches except the one under test.

### Disclose flaws responsibly

- **Example:** While reviewing suicide and self-harm transcripts before Claude Fable 5.1's release, Anthropic found that Claude sometimes implicitly validated self-harm as a way of coping. It added an instruction against this to the system prompt. With the new prompt, the appropriate response rate on claude.ai rose to **94%**, compared with **60%** on the API.
- Run evals continuously during development, not only before release. Results go to the Safeguards and Model Behavior teams, who can then adjust reward signals or system prompts quickly.
- Severe flaws found in deployed systems should be disclosed to the developer, with time to fix them before publication. This follows Anthropic's responsible disclosure policy.

## Where to start

- Not every eval needs every recommendation, but a good eval should follow as many as it can.
- If you do only three things:
  1. Write down the construct before collecting data.
  2. Validate the grader against human judgment before trusting any number.
  3. Report uncertainty, so readers can tell signal from noise.
- These recommendations may change as the science of evaluation matures.

## Footnotes

1. An earlier post on designing evals for AI agents covered capability evals. The safety evals described here assess whether a model did the right thing in a given situation.
2. Uncertainty can be measured by checking whether the grader reaches different judgments across multiple attempts.
3. Using statistics such as Cohen's kappa, which discount the agreement expected by chance.
