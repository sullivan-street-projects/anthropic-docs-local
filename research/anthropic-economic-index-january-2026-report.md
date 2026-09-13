---
title: "Economic Index: Economic primitives"
source_url: "https://www.anthropic.com/research/anthropic-economic-index-january-2026-report"
source_type: "web-extracted"
fetched_at: "2026-09-07T00:00:00Z"
category: "research"
---

# Anthropic Economic Index Report: Economic Primitives

**Published:** January 15, 2026

## Overview

This report introduces five new "economic primitives"—foundational measures of AI usage—beyond the collaboration patterns tracked in previous reports. These primitives capture dimensions of human-AI interaction relevant to understanding AI's economic impact.

## Key Findings

### Usage Patterns

- The top 10 most common tasks represent 24% of Claude.ai conversations, a slight increase from prior reports
- Computer and mathematical tasks (primarily coding) dominate usage at 34% of Claude.ai conversations and 46% of API traffic
- Usage remains highly concentrated among specific tasks despite expanding capabilities

### Geographic Variation

- Claude usage correlates strongly with GDP per capita globally
- Within the US, workforce composition is the primary predictor—states with more computer and mathematical professionals show higher usage
- Regional convergence within the US is accelerating; if current trends continue, usage could equalize across states within 2-5 years
- Global usage remains persistently uneven with no evidence of convergence

### New Economic Primitives

The report introduces five dimensions:

1. **Task Complexity:** Measured by estimated human time to complete tasks
2. **Human and AI Skills:** Years of education needed to understand prompts and responses
3. **Use Case:** Distinguishes work, coursework, and personal use
4. **AI Autonomy:** Degree of decision-making delegated to Claude
5. **Task Success:** Assessment of successful task completion

### Use Case Insights

- Work use dominates overall (46% of Claude.ai usage)
- Coursework use is highest in lower-income countries (suggesting educational adoption patterns)
- Personal use is highest in wealthier nations
- API usage is overwhelmingly work-related (74%)

### Performance Trade-offs

- More complex tasks yield greater time savings (9-12x speedup for college-level vs. high school-level work)
- However, complex tasks show lower success rates (66% vs. 70%)
- API tasks show higher speedups but lower autonomy

### Interaction Patterns

- Augmented use (collaborative iteration) rose to 52% of Claude.ai conversations in November 2025, reversing a trend toward automation
- Automation remains higher on API platforms (75%), reflecting programmatic deployment
- Product changes (file creation, memory, skills) may have driven the shift toward collaboration

## Productivity Implications

**Baseline Impact:** Current usage patterns suggest AI could increase US labor productivity by 1.8 percentage points annually over the next decade.

**Adjusted for Reliability:** Incorporating task success rates reduces this to 1.2 percentage points for Claude.ai and 1.0 percentage point for API usage—still economically significant.

**Task Complementarity:** If tasks function as complements rather than substitutes (elasticity <1), productivity effects could be bottlenecked by non-AI-enhanced tasks, reducing impacts by half or more.

## Job Content Effects

- Claude covers higher-education tasks (averaging 14.4 years education vs. 13.2 for all tasks)
- Removing AI-covered tasks produces net deskilling across most occupations
- Travel agents would experience deskilling (routine planning replaced by basic ticket sales)
- Property managers would experience upskilling (bookkeeping replaced by negotiations)

## Effective AI Coverage

A new framework measuring successful automation potential reveals important distinctions:

- Data entry workers show exceptionally high effective coverage despite limited task coverage because AI succeeds on their most time-intensive work
- Some occupations (microbiologists, radiologists) appear lower in effective coverage because AI covers high-complexity tasks they spend less time performing

## Global Differences

- Higher per capita usage countries employ more augmentation (collaboration) rather than automation
- "Human education" (prompt sophistication) correlates nearly perfectly with AI response sophistication (r>0.92), suggesting output quality depends on input quality
- GDP predicts adoption at both country and US state levels; within the US, income alone is less predictive than workforce composition

## Data Quality

- Analysis based on 1 million Claude.ai conversations and 1 million API records from November 2025
- Privacy-preserving methods used throughout
- Classifiers validated for directional accuracy rather than perfection
- Limitations acknowledged: API data represents single input-output pairs, not full conversations; user selection affects observed success rates

## Methodological Notes

The report validates primitives through external benchmarks including:
- Correlation between Claude time estimates and actual software engineering time (0.68)
- Education year estimates correlating with actual worker education across occupations

## Conclusion

Claude usage reveals "striking geographic variation" in how AI adoption unfolds, with implications for labor markets and economic inequality. The concentration of higher-education task coverage among AI-assisted work may produce differential impacts by skill level and geography. Future improvements in model reliability and capability expansion will likely shift these patterns significantly.
