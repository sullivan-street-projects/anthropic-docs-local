---
title: "Demystifying Evals for AI Agents"
source_url: "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents"
source_type: "web-extracted"
fetched_at: "2026-07-12T00:00:00Z"
category: "engineering"
published: "2026-01-09"
---

# Demystifying Evals for AI Agents

**Publication Date:** January 9, 2026

"Good evaluations help teams ship AI agents more confidently. Without them, it's easy to get stuck in reactive loops — catching issues only in production, where fixing one failure creates others."

## The Structure of an Evaluation

An **evaluation** (eval) is "a test for an AI system: give an AI an input, then apply grading logic to its output to measure success." Single-turn evaluations involve a prompt, response, and grading logic. Multi-turn evaluations accommodate agent operations across multiple interactions with tool calls and state changes. Agent evaluations represent the most complex category, as agents modify environments across many turns, causing errors to propagate and compound.

### Key Terminology

- **Task/Problem/Test case**: Individual test with defined inputs and success criteria
- **Trial**: Single attempt at a task; multiple trials produce consistent results given model non-determinism
- **Grader**: Logic scoring agent performance aspects; tasks can have multiple graders with various assertions/checks
- **Transcript/Trace/Trajectory**: Complete record including outputs, tool calls, reasoning, intermediate results, and interactions
- **Outcome**: Final environmental state after trial completion
- **Evaluation harness**: Infrastructure running evals end-to-end
- **Agent harness/Scaffold**: System enabling models to act as agents
- **Evaluation suite**: Collection of tasks measuring specific capabilities or behaviors

## Why Build Evaluations?

After early prototyping stages, "once an agent is in production and has started scaling, building without evals starts to break down."

### Strategic Benefits

**Quality assurance**: Teams distinguish real regressions from noise, test changes against hundreds of scenarios pre-deployment, and measure improvements systematically.

**Model transition**: Teams without evals face weeks of testing before adopting new models. Eval-equipped teams "can quickly determine the model's strengths, tune their prompts, and upgrade in days."

**Baseline establishment**: Static task banks automatically generate latency, token usage, cost per task, and error rate baselines.

**Research communication**: Evals become "the highest-bandwidth communication channel between product and research teams, defining metrics researchers can optimize against."

### Real-World Examples

**Claude Code** began with employee and external user feedback, later adding narrow evals (concision, file edits), then complex behavior evals (over-engineering). These guided improvements and research-product collaboration.

**Descript** built evals around three dimensions: don't break things, do what users asked, and do it well. They evolved from manual grading to LLM graders with periodic human calibration.

**Bolt** started late but built comprehensive eval systems in three months using static analysis, browser agents, and LLM judges for behaviors like instruction following.

## Types of Graders for Agents

### Code-Based Graders

**Methods**: String matching (exact, regex, fuzzy), binary tests (fail-to-pass, pass-to-pass), static analysis (lint, type, security), outcome verification, tool call verification, transcript analysis

**Strengths**: Fast, cheap, objective, reproducible, easy to debug, verify specific conditions

**Weaknesses**: Brittle with valid variations, lacking nuance, limited for subjective tasks

### Model-Based Graders

**Methods**: Rubric-based scoring, natural language assertions, pairwise comparison, reference-based evaluation, multi-judge consensus

**Strengths**: Flexible, scalable, captures nuance, handles open-ended tasks and freeform output

**Weaknesses**: Non-deterministic, more expensive than code, requires human calibration for accuracy

### Human Graders

**Methods**: Subject matter expert review, crowdsourced judgment, spot-check sampling, A/B testing, inter-annotator agreement

**Strengths**: Gold standard quality, matches expert judgment, calibrates model-based graders

**Weaknesses**: Expensive, slow, often requires domain experts at scale

## Capability vs. Regression Evals

**Capability evals** ask "What can this agent do well?" starting at low pass rates and targeting struggling areas — the "hill to climb."

**Regression evals** ask "Does the agent still handle familiar tasks?" with ~100% target pass rates, protecting against backsliding.

As capability evals mature with high pass rates, "they can graduate to become a regression suite that is run continuously to catch any drift."

## Evaluating Specific Agent Types

### Coding Agents

Coding agents write, test, and debug code. Key benchmarks include:

- **SWE-bench Verified**: Grades by running test suites; LLM performance progressed from 40% to >80% in one year
- **Terminal-Bench**: Tests end-to-end technical tasks like Linux kernel building or ML model training

**Example task structure:**

```yaml
task:
  id: "fix-auth-bypass_1"
  desc: "Fix authentication bypass when password field is empty..."
  graders:
    - type: deterministic_tests
      required: [test_empty_pw_rejected.py, test_null_pw_rejected.py]
    - type: llm_rubric
      rubric: prompts/code_quality.md
    - type: static_analysis
      commands: [ruff, mypy, bandit]
    - type: state_check
      expect:
        security_logs: { event_type: "auth_blocked" }
    - type: tool_calls
      required:
        - { tool: read_file, params: { path: "src/auth/*" } }
        - { tool: edit_file }
        - { tool: run_tests }
  tracked_metrics:
    - type: transcript
      metrics: [n_turns, n_toolcalls, n_total_tokens]
    - type: latency
      metrics: [time_to_first_token, output_tokens_per_sec, time_to_last_token]
```

### Conversational Agents

Conversational agents interact in domains like support, sales, or coaching. Quality evaluates both task completion and interaction quality. They often require a second LLM to simulate the user.

Relevant benchmarks include **tau-Bench** and **tau2-Bench**, which simulate multi-turn interactions with one model playing user persona while agent navigates realistic scenarios.

**Example support task:**

```yaml
graders:
  - type: llm_rubric
    rubric: prompts/support_quality.md
    assertions:
      - "Agent showed empathy for customer's frustration"
      - "Resolution was clearly explained"
      - "Agent's response grounded in fetch_policy tool results"
  - type: state_check
    expect:
      tickets: { status: resolved }
      refunds: { status: processed }
  - type: tool_calls
    required:
      - { tool: verify_identity }
      - { tool: process_refund, params: { amount: "<=100" } }
      - { tool: send_confirmation }
  - type: transcript
    max_turns: 10
```

### Research Agents

Research agents "gather, synthesize, and analyze information, then produce outputs like an answer or report." Unique challenges include expert disagreement, constantly changing reference content, and longer outputs with more potential errors.

Strategy combines: groundedness checks (claims supported by sources), coverage checks (key facts included), source quality checks (authoritative sources consulted), and LLM synthesis assessment.

"Given the subjective nature of research quality, LLM-based rubrics should be frequently calibrated against expert human judgment to grade these agents effectively."

### Computer Use Agents

Computer use agents interact through graphical user interfaces rather than APIs. Evaluation requires real or sandboxed environments with outcome verification.

- **WebArena**: Tests browser tasks using URL checks, page state verification, and backend state confirmation
- **OSWorld**: Full operating system control with evaluation scripts checking file systems, configs, databases, and UI properties

Browser agents balance token efficiency versus latency: "DOM-based interactions execute quickly but consume many tokens, while screenshot-based interactions are slower but more token-efficient."

## Handling Non-Determinism

Agent behavior varies between runs, requiring multiple trials per task:

### pass@k

"Measures the likelihood that an agent gets at least one correct solution in k attempts." As k increases, pass@k rises. A 50% pass@1 indicates the model succeeds on half the tasks on first try.

### pass^k

"Measures the probability that all k trials succeed." As k increases, pass^k falls since demanding consistency across more trials is harder. Example: 75% per-trial success with 3 trials yields (0.75)^3 = 42% pass^3.

**When to use each**: pass@k applies when one success matters; pass^k applies when consistency is essential for customer-facing agents.

## Roadmap: From Zero to Effective Evals

### Step 0: Start Early

"We see teams delay building evals because they think they need hundreds of tasks. In reality, 20-50 simple tasks drawn from real failures is a great start."

### Step 1: Start with Manual Tests

Begin with behaviors you already verify — checks before releases and common user tasks. Convert user failures into test cases ensuring suite relevance; prioritize by impact.

### Step 2: Write Unambiguous Tasks with Reference Solutions

"A good task is one where two domain experts would independently reach the same pass/fail verdict." Create reference solutions proving tasks are solvable and verifying grader configuration.

### Step 3: Build Balanced Problem Sets

Test both "should occur" and "shouldn't occur" cases. "One-sided evals create one-sided optimization." Avoid class-imbalanced datasets.

### Step 4: Build Robust Eval Harness with Stable Environment

"It's essential that the agent in the eval functions roughly the same as the agent used in production, and that the environment itself doesn't introduce further noise." Isolate trials with clean environment starts.

### Step 5: Design Thoughtful Graders

Choose deterministic graders where possible, LLM graders when necessary for flexibility, and human graders judiciously for validation. Avoid "overly brittle" sequential tool-call checking; "agents regularly find valid approaches that eval designers didn't anticipate." Grade outputs rather than paths.

Build partial credit for multi-component tasks. LLM graders require careful iteration and calibration with human experts.

### Step 6: Check Transcripts

"You won't know if your graders are working well unless you read the transcripts and grades from many trials." Failures should seem fair; unclear agent errors or eval issues indicate measurement problems.

### Step 7: Monitor for Capability Eval Saturation

Evals at 100% track regressions but provide no improvement signal. Example: SWE-Bench Verified started at 30%, frontier models now near >80% saturation.

"We do not take eval scores at face value until someone digs into the details of the eval and reads some transcripts."

### Step 8: Keep Evaluation Suites Healthy

Effective maintenance requires dedicated evals teams owning core infrastructure while domain experts and product teams contribute tasks. "For AI product teams, owning and iterating on evaluations should be as routine as maintaining unit tests."

Practice eval-driven development: build evals defining planned capabilities before agents fulfill them.

## How Evals Fit with Other Methods

| Method                       | Pros                                                                                     | Cons                                                                                |
| ---------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Automated evals**          | Faster iteration, fully reproducible, no user impact, run on every commit, test at scale | Requires upfront investment, needs ongoing maintenance, can create false confidence |
| **Production monitoring**    | Reveals real user behavior at scale, catches issues evals miss, provides ground truth    | Reactive (users affected first), noisy signals, requires instrumentation            |
| **A/B testing**              | Measures actual user outcomes, controls confounds, scalable                              | Slow (days/weeks for significance), only tests deployed changes                     |
| **User feedback**            | Surfaces anticipated problems with real examples, correlates with product goals          | Sparse and self-selected, skews toward severe issues, not automated                 |
| **Manual transcript review** | Builds failure mode intuition, catches subtle quality issues                             | Time-intensive, doesn't scale, inconsistent coverage                                |
| **Systematic human studies** | Gold-standard quality judgments, handles subjective tasks                                | Expensive and slow, hard to run frequently, requires experts                        |

"Like the Swiss Cheese Model from safety engineering, no single evaluation layer catches every issue. With multiple methods combined, failures that slip through one layer are caught by another."

## Eval Frameworks and Infrastructure

- **Harbor**: Containerized environment evaluation, infrastructure for trial scaling across cloud providers, standardized task/grader formats
- **Braintrust**: Combines offline evaluation with production observability and experiment tracking
- **LangSmith**: Tracing, offline/online evaluation, dataset management with LangChain integration
- **Langfuse**: Self-hosted open-source alternative for data residency needs
- **Arize**: Phoenix (open-source LLM tracing, debugging, evaluation) and AX (SaaS extension for scale and monitoring)

"Many teams combine multiple tools, roll their own eval framework, or just use simple evaluation scripts as a starting point."

## Conclusion

"Teams without evals get bogged down in reactive loops — fixing one failure, creating another, unable to distinguish real regressions from noise. Teams that invest early find the opposite: development accelerates as failures become test cases, test cases prevent regressions, and metrics replace guesswork."

Start early with 20-50 realistic tasks. Source from actual failures. Define unambiguous success criteria with robust graders combining multiple types. Iterate improving signal-to-noise ratios. Read transcripts consistently.
