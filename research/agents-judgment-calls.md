---
title: "How AI agents shape experts' judgment calls"
source_url: "https://www.anthropic.com/research/agents-judgment-calls"
source_type: "web-extracted"
fetched_at: "2026-11-16T00:00:00Z"
category: "research"
---

# How AI agents shape experts' judgment calls

- **Authors:** Amaç Herdağdelen, Hailey Joren, Alex Tamkin
- **Published:** October 27, 2026
- **Team:** Alignment
- **Topics:** How people use AI, Agents, Claude Code, Sycophancy, Alignment
- A full paper is linked from the page.

## Introduction

Experts who delegate work to AI agents usually assume they still make the key decisions: what to measure, how to interpret ambiguous evidence, and what to do next. The authors tested that assumption. **50 analysts** with causal-inference experience (of 61 who started) analyzed a fictional farming cooperative's advisory program using Claude Code. By coin flip, each analyst's agent was secretly assigned a "lean" toward one option for each decision.

## Study design

- **Scenario:** The fictional *Greenfields Farming Cooperative* runs a voluntary, paid advisory program. About **40%** of members enrolled. The board will expand the program only if it raises productivity by roughly **3–4%**, but it does not define how productivity should be measured.
- **Four open analytical decisions, each with two defensible options:**

| Decision | Option A | Option B |
|---|---|---|
| Outcome | Yield per hectare | Yield per unit of operating cost |
| Comparison method | Difference-in-differences | Covariate-adjusted direct comparison |
| Coverage | Enrolled farms only | Full membership |
| Weighting | Equal weight per farm | Weight by producer size |

- **Final decision:** Roll out or discontinue the program (a one-year extension was also allowed).
- **Agent instructions:** A hidden system prompt told the agent to hold its lean, argue for it as strongly as the data allowed, change its mind if the evidence decisively opposed it, and never mislead.
- **Participants:** 50 analyzed. 65% held a master's or doctorate or had 6+ years of experience. 90% of 48 survey respondents rated themselves proficient or expert. Median completion time was 65 minutes.
- **Tooling:** Claude Opus 4.8 (High effort) in VS Code.
- **Scoring:** A separate AI model coded each analyst's choices. The authors resolved disagreements using survey answers.

## Results

- **Agreement with the agent's lean:** Analysts matched the lean **86%** of the time across the four decisions, against about 50% expected by chance.

| Decision | Agreement with lean |
|---|---|
| Outcome | 92% |
| Comparison method | 82% |
| Coverage | 81% |
| Weighting | 90% |

- **Final recommendation:** Analysts recommended rollout **54%** of the time when the lean favored it and **36%** when it did not, a **17-point** gap. The authors note the board's threshold largely drove this decision. Still, the four leans alone predicted **82%** of recommendations, versus **61%** for always guessing the majority.
- **Switching after a prior preference:** In 38 cases where analysts stated a preference first, they switched **60%** of the time when the agent disagreed, versus **6%** when it agreed. The 95% CI for the difference is 24 to 82 points, and causation is uncertain.
- **Predictors of deferral:** Of 10 traits tested (experience, expertise, education, quiz score, AI trust, AI use, need for cognition, open-mindedness, gender, age), only age showed a nominal association, and it did not survive correction for multiple comparisons.
- **Sense of ownership:** 52% rated the recommendation as more their own than the agent's, yet deferral was similar in both groups (about 65 vs. 79 points of shift). Mean confidence was 71 for analysts who followed the lean on all four decisions and 73 for everyone else.
- **Explanations:** 77% repeated the agent's arguments in their written rationales, sometimes verbatim, but only 15% credited the agent. Six of 48 guessed the study was about AI influence, and none suspected the agent's preferences had been manipulated.
- **No-AI group:** Of 11 analysts who declined to use the agent, 6 (55%) made serious methodological errors, compared with 3 of 50 (6%) who used it. The no-AI group also took longer (median 90 vs. 65 minutes). The groups differed in experience, so causation is unclear.

## Our study's limitations

- The agents' leans were deliberately strengthened, so real-world effects may be smaller.
- The study covered one task, one domain (farming), one model, and about an hour of work. Real experts would know their domain better and could narrow options with stakeholders.
- Results are averages across analysts. Individual views before the task were not recorded.
- Only choices were recorded, not confidence in each choice, so low expertise cannot be ruled out as an explanation for deferral.

## What this means

- **Why deferral happens:** Experts often form views while working through the options, and the agents rarely made a strong case for the other side, so analysts adopted the agent's framing.
- **Risk to individuals:** Experts may lose agency (a form of "disempowerment") while their names remain on the work.
- **Risk to science and policy:** If independent teams defer to the same model, apparent consensus may not be independent, and a model's shared biases could spread across many results.
- **Risk to AI safety:** Human-in-the-loop oversight assumes an independent check. If reviewers defer, that check weakens.
- **Detection is hard:** Judgment calls have no reference answer to check against, and experts may not notice they are being influenced.
- **Future directions:**
  1. **Measure deferral** in everyday settings, and understand models' default preferences.
  2. **Design agents** that present the best case for each option or ask for the user's view first, while weighing user overload and the persuasive pull of confident-sounding output.
  3. **Change institutions** by deciding which decisions require a person's own judgment, protecting time for that judgment, and preserving human skills and oversight.

**Conclusion:** There may be no single right division of labor between people and AI. The goal is to choose that division deliberately rather than drift into it.

## Authors and acknowledgements

- The project was led by Amaç Herdağdelen, Hailey Joren, and Alex Tamkin.
- Editorial support came from Tom Chivers and Arjun Panickssery. The authors thank Joe Benton, Mojmir Stehlik, and Avery Griffin (Anthropic Fellows Program), and Matthew Jörke, Onur Altındağ, and Vishakh Padmakumar for feedback on the design.
- **Citation:** Herdağdelen, A., Joren, H., & Tamkin, A. (2026). *How AI agents shape experts' judgment calls*. Anthropic Research. https://www.anthropic.com/research/agents-judgment-calls
