---
title: "AI for scientific discovery: How researchers use Claude"
source_url: "https://www.anthropic.com/research/how-researchers-use-claude"
source_type: "web-extracted"
fetched_at: "2026-11-16T00:00:00Z"
category: "research"
---

# AI for scientific discovery: How researchers use Claude

**Published:** Nov 5, 2026 | **Team:** Economics | **Format:** The Anthropic Institute, Technical Report

**Authors:** Johannes Hermle\*, Ben Jones\*, Lukas Althoff\*, Ryan Heller, Thomas Lyttelton, Carolyn Stein, Nathan Wilmers, Maxim Massenkoff, Peter McCrory (\*lead authors)

> Note: The appendix (methods details) is published as a separate PDF and is not included in this mirror.

## Contents

1. Summary
2. Introduction
3. How we conducted this research
4. How Claude use varies across scientific fields
5. How Claude use varies across research tasks
6. How use relates to capabilities
7. Research acceleration scenarios with AI
8. Discussion
9. Appendix (separate PDF)
10. References

## 1. Summary

- **Data:** 207,000 research sessions on Claude and Claude Code, analyzed with privacy-preserving methods.
- **Fields:** Use is high relative to the number of researchers in formal sciences (computer science, mathematics, statistics), and low in health and lab-based physical sciences.
- **Tasks:** Data analysis makes up about a third of Claude sessions and nearly half of Claude Code sessions. Idea generation and data gathering see less use, although surveyed scientists rank them as the most important.
- **Specialized tools:** Idea generation makes up about twice as large a share of Claude Science use as of Claude use.
- **Capability link:** The tasks AI is best suited to get two to four times the expected use. The least-suited tasks, mostly physical work, get very little.
- **Acceleration scenarios:** Current capabilities could roughly double output in some fields. If all non-physical work were automated, output in computer science and statistics could rise up to about 15-fold, while bench sciences would reach about 3–4x.
- **Expectations:** About 40% of surveyed AI users expect AI to carry out full research projects on its own by 2030.

## 2. Introduction

- Science is described as an "endless frontier" (Bush 1945), with progress limited by researchers' time and talent. AI could ease that limit.
- Examples: AlphaFold predicted structures for more than 200 million proteins; GNoME predicted 380,000 stable crystals; AI systems have contributed to recent results in mathematics.
- Research is made up of many interlinked tasks that differ by field, so how much AI accelerates it depends on how AI is adopted across those tasks.
- The findings previewed: use varies by field and task, use tracks AI capability, and scenarios show how much research could accelerate.

## 3. How we conducted this research

- A language-model classifier labels each transcript using the **SciNet taxonomy** (7,262 tasks, 34 fields, 318 subfields). Only the labels are kept; open-ended content is not stored.
- Results are reported in aggregate, and only for cells with at least a minimum number of accounts.
- **Main sample:** 207,049 sessions on consumer plans, August 2 to September 30, 2026:
  - 128,914 from Claude (Chat and Cowork)
  - 78,135 from Claude Code
- A supplementary sample from **Claude Science** is also analyzed.

## 4. How Claude use varies across scientific fields

- **Claude:** The largest fields by share of sessions are computer science (11.9%), engineering (8.4%), and medicine (7.7%). On a log-log scale, use correlates with researcher counts at **0.79**.
- Use is relatively high in formal and social sciences, and low in lab-based physical sciences and medicine.
- **Claude Code:** The correlation with researcher counts is **0.62**. Computer science accounts for 4.3% of researchers but **32.7%** of Claude Code sessions. Arts, humanities, and most social sciences are low, with economics an exception.
- **Subfields:** AI and machine learning accounts for 1.2% of researchers but 5.0% of Claude sessions and 15.2% of Claude Code sessions. Computational subfields are generally heavy adopters.
- Transcripts are classified by the research being pursued, not the tools used, so computing done in other sciences isn't counted as computer science.

## 5. How Claude use varies across research tasks

Eight task categories, compared with the share of researcher time each one takes (estimated from SciNet):

| Category | Claude | Claude Code | Researcher time |
|---|---|---|---|
| Data analysis | 33.7% | 48.1% | 27.6% |
| Writing and communication | 32.0% | 17.6% | 16.0% |
| Data gathering | 11.5% | 11.9% | 28.6% |
| Reading and knowledge acquisition | 7.6% | 3.7% | — |
| Theoretical analysis | 5.0% | 4.7% | — |
| Design and development | 4.7% | 7.7% | — |
| Ideation and hypothesis generation | 4.2% | 2.1% | 7.1% |
| Other | 1.3% | 4.2% | — |

- Data gathering is most underrepresented where it involves physical barriers, such as clinical or biochemical data collection.
- The single most common task is drafting manuscripts: 18.6% of sessions on Claude and 11.1% on Claude Code.

### Survey of 528 scientists

- Respondents were mostly in the life and health sciences in the US and Canada, recruited from Anthropic grant programs, so they are likely heavier AI users than average.
- Self-reported AI use is highest for data analysis and writing, and lower for ideation and data gathering.
- Importance ranking (100 points allocated):

| Task | Points |
|---|---|
| Ideation | 35.6 |
| Data gathering | 23.6 |
| Data analysis | 23.3 |
| Writing | 17.5 |

- Possible explanations for the gap between importance and use: data gathering is physical, researchers may prefer to do it themselves, they may see AI as limited at it, or ideation may be undercounted.

### Claude Science

- Claude Science focuses on biology and biomedical sciences and connects Claude to many research databases and tools.
- Top fields: biomedical sciences (31.1%), biology (24.1%), medicine and clinical sciences (8.7%).
- Overrepresented task example: proposing mechanistic models of protein interactions is **5.6x** more typical than on Claude. Underrepresented example: coordinating with collaborators (**0.15x**).
- Ideation is about **8%** of sessions, roughly matching its share of researcher time.

| Measure | Claude Science | Claude | Claude Code |
|---|---|---|---|
| Hours a human alone would need for the task | 10.3 | 4.9 | 5.9 |
| Sessions with doctoral-level content | 82.7% | 48.0% | 67.7% |
| Sessions with high AI autonomy | 73.3% | 23.7% | 64.1% |

- The authors caution that differences in who chooses to use each product may explain some of this.

### Artifacts

- Across research sessions on Claude, **52%** produce written artifacts and **21%** produce technical artifacts.
- Biology is the only field where technical artifacts are more common than written ones. Written artifacts dominate in the social sciences and humanities.

## 6. How use relates to capabilities

- **Method:** An LLM classifier compares pairs of task steps and judges which one AI performs better. A Bradley–Terry model (the same family as Elo ratings) turns these comparisons into step scores, which are averaged into a task-level "theoretical AI capability" score.
- **Use ratio** = share of use ÷ share of researcher time:

| Tasks by capability | Use ratio | Examples |
|---|---|---|
| Bottom 20% | Near zero | Purifying reaction mixtures |
| Median | About 1 (in line with time spent) | — |
| Top 20% | About 2.1 (Claude), about 3.9 (Claude Code) | Visualizing data, statistical tests |

- **Correlations of task characteristics with capability:**

| Characteristic | Correlation |
|---|---|
| Reinforcement learning (RL) suitability index | +0.78 |
| Cognitive work | +0.69 |
| Interpersonal work | −0.31 |
| Regulatory restriction | −0.38 |
| Physical work | −0.57 |

- Use rises with RL suitability and with the cognitive share of a task. It falls as physical, interpersonal, and regulatory-restriction intensity rise.
- **Subfields:** Use per researcher correlates with average capability (0.45 on Claude; 0.57 on Claude Code). Health sciences use Claude less than their capability scores would predict, possibly because of regulation. Formal sciences, social sciences, and humanities use it more than predicted, likely because their work is based on text and code.
- **Autonomy:** Subfield autonomy correlates with capability (0.47 on Claude; 0.31 on Claude Code).

## 7. Research acceleration scenarios with AI

- **Two channels:** AI can take on existing work (freeing up researcher time), or it can generate ideas researchers might not otherwise find. The paper focuses on the first, which is easier to measure.
- **Measures:**
  - *AI share:* the fraction of researcher time AI could take on.
  - *Acceleration:* the increase in output for a fixed budget.
- **Model:** An "ideas production function" (Jones 2026) in which complementary tasks create bottlenecks, calibrated with Ahmadpoor and Jones (2019).
- **Illustrative cost assumptions:** AI costs $30 per agent hour versus $95 per researcher hour, and AI runs 0.2 hours for each researcher hour it saves.

### Scenario 1: Current capabilities, widely adopted

- AI share: 27–52% of research time (median 38%).
- Acceleration:

| Field | Acceleration |
|---|---|
| Arts | 1.35x |
| Anthropology | 1.36x |
| Chemistry | 1.41x |
| Computer science | 1.96x |
| Statistics | 2.02x |

- Physical steps take up 38–41% of time in lab and field sciences, compared with a median of 4%, which explains much of the variation.
- AI share correlates with the Claude use ratio at 0.58, even though AI share was computed without Claude data.

### Scenario 2: 75% of non-physical steps automated (hypothetical)

| Fields | Acceleration |
|---|---|
| Computer science | ~8x |
| Statistics, library science | ~7x |
| Economics | ~6x |
| Most other social sciences, mathematics, physics and astronomy | 4–5x |
| Bench and medical sciences | 2–3x |

### Scenario 3: All non-physical steps automated (hypothetical)

| Fields | Acceleration |
|---|---|
| Low-physical fields (statistics, computer science, economics, mathematics, psychology, most social sciences and humanities) | ~15–16x |
| Bench and lab fields (biology, chemistry, materials science, agricultural and biomedical sciences) | 3–4x, limited by physical work (~40% of time) |

- **Ceiling:** AI costs about one-sixteenth as much as human time, so halving the cost of AI would roughly double the rate of progress.
- **Two lessons:** Physical bottlenecks are powerful, and where they are absent, the cost of AI becomes the main limit.
- **Not modeled:** constraints at the team rather than field level, the cost of machinery and inputs, simulations, and the quality of ideas.

### Researcher expectations (life and health sciences survey)

- **Matching top researchers at data analysis:** more than half expect this by 2027, and 38% say it is already possible.
- **By 2030:** 94% expect this for data analysis, 89% for writing, and 72% each for ideation and data gathering.
- **AI completing full research projects without humans:** about 40% expect this by 2030 and about 64% by 2035; 16% say never.
- **Autonomous major breakthroughs:** about half expect these only after 2035, if ever.
- Past forecasts have underestimated AI progress. Gold-medal-level performance at the IMO was forecast for 2030–2035 and achieved in 2025.

## 8. Discussion

Five constraints on realizing the acceleration:

1. **Adoption lag:** Diffusion is slow, and productivity gains often require organizational change.
2. **Persistent bottlenecks:** Physical experiments and the choice of research questions may limit gains.
3. **Quantity vs. quality:** More output could overwhelm the capacity to verify it, though better tools could also raise quality.
4. **Reorganized research:** AI could take on verification, refereeing, and communication, and might eventually run research autonomously.
5. **Alignment and safety:** Humans may need to stay involved in key decisions, and biosafety checkpoints may be needed, even if that slows progress.

- **Effects on careers:** Job satisfaction may rise or fall depending on which tasks AI takes over. Administrative work takes up about **44%** of research time for US federally funded principal investigators (Schneider et al. 2020), making it a possible target.
- The authors conclude that AI may be "a new vessel" for exploring the endless frontier.

## 9. Appendix

Published as a separate PDF and not included here.

## 10. References

About 40 references, including Bush (1945), Jumper et al. (2021), Jones (2026), Ahmadpoor and Jones (2019), Comin and Hobijn (2010), Liang et al. (2025), Hao et al. (2026), Karger et al. (2023), and Schneider et al. (2020), plus related research posts from Anthropic and OpenAI (2026).

## Footnotes and acknowledgements

- **Footnotes (9):** Cover the countries excluded from researcher counts, noise in subfield estimates, the scope of non-research tasks, survey sampling, user selection on Claude Science, and how artifacts are classified.
- **Acknowledgements:** More than 30 named contributors, including Jack Clark.
