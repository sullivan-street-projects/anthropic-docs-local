---
title: "Introducing Claude Opus 4.7"
source_url: "https://www.anthropic.com/news/claude-opus-4-7"
source_type: "web-extracted"
fetched_at: "2026-07-20T00:00:00Z"
category: "models"
---

# Introducing Claude Opus 4.7

**Release Date:** April 16, 2026

Claude Opus 4.7 is Anthropic's latest model, now generally available. It builds on Opus 4.6 with particular gains in advanced software engineering, vision, design, and long-running agentic tasks.

## Key Improvements

### Advanced Software Engineering

Opus 4.7 represents "a notable improvement on Opus 4.6 in advanced software engineering, with particular gains on the most difficult tasks." Users can delegate complex coding work that previously required close supervision. The system handles extended tasks with consistency, follows instructions precisely, and validates its own outputs.

### Enhanced Vision

The model processes images at substantially higher resolution, supporting images up to 2,576 pixels on the long edge (approximately 3.75 megapixels) -- more than three times the capacity of earlier Claude versions. This enables:
- Computer-use agents reading dense screenshots
- Data extraction from intricate diagrams
- Detailed visual reference work

### Design and Interface Quality

Opus 4.7 demonstrates improved aesthetic judgment for professional deliverables, producing higher-quality interfaces, presentations, and documents.

### Instruction Following

A notable improvement involves literal adherence to instructions. Users should note that "prompts written for earlier models can sometimes now produce unexpected results" since the model takes instructions more literally. Users should re-tune existing prompts and evaluation frameworks.

## Pricing & Availability

Pricing remains unchanged from Opus 4.6:
- **Input tokens:** $5 per million
- **Output tokens:** $25 per million
- **API identifier:** `claude-opus-4-7`

Available across Claude products, API, Amazon Bedrock, Google Cloud Vertex AI, and Microsoft Foundry.

## Performance Highlights

### Real-World Performance

- State-of-the-art results on Finance Agent evaluations
- Functions as more effective analyst than predecessor
- Produces rigorous analyses, professional presentations, and integrated workflows
- State-of-the-art performance on GDPval-AA (third-party evaluation of economically valuable work)

### Coding

- Up to 3x more production tasks resolved vs Opus 4.6 (Rakuten-SWE-Bench)
- 13% lift in resolution on GitHub's 93-task coding benchmark over Opus 4.6
- Passed tasks that prior Claude models could not solve
- Enhanced code quality with fewer meaningless wrapper functions

### Vision and Documents

- 98.5% on XBOW visual-acuity benchmark (vs 54.5% for predecessors)
- 21% fewer errors than Opus 4.6 on Databricks' OfficeQA Pro
- Major improvements in reading chemical structures and interpreting complex technical diagrams

### Agent Performance

- 14% improvement over Opus 4.6 for complex multi-step workflows, at fewer tokens and a third of the tool errors
- Double-digit jump in accuracy of tool calls and planning in orchestrator agents
- Enhanced loop resistance, consistency, and graceful error recovery
- Stronger role fidelity and coordination in agent-team workflows

### Legal and Finance

- 90.9% at high effort on BigLaw Bench for Harvey
- Strongest efficiency baseline for multi-step research work

### Memory Systems

Enhanced file system-based memory capabilities: retains important notes across multi-session, long-running work, reducing required up-front context for subsequent tasks.

## Safety and Alignment Assessment

Opus 4.7 maintains a safety profile comparable to Opus 4.6, with low rates of concerning behaviors including deception, sycophancy, and cooperation with misuse. The model shows improvements in honesty and better resistance to malicious prompt injection attacks. It is modestly weaker on controlling detailed harm-reduction information regarding controlled substances.

The model is characterized as "largely well-aligned and trustworthy, though not fully ideal in its behavior." Mythos Preview remains the best-aligned model in Anthropic's portfolio. See the Claude Opus 4.7 System Card for comprehensive safety details.

## Cybersecurity Approach

Following the announcement of Project Glasswing, Anthropic is:
- Limiting Mythos Preview availability
- Testing cyber safeguards on less advanced models first
- Implementing automatic detection and blocking for high-risk cybersecurity requests
- Offering a Cyber Verification Program for legitimate security professionals

## Concurrent Launches

### Effort Level Controls

A new `xhigh` ("extra high") effort level provides finer control between `high` and `max` for reasoning-versus-latency tradeoff. Claude Code default effort raised to `xhigh` across all user plans. Recommended starting point: `high` or `xhigh` for coding and agentic applications.

### Claude Platform (API) Updates

- Support for higher-resolution image processing
- Task budgets in public beta (guides token allocation across longer operations)

### Claude Code Features

- New `/ultrareview` slash command provides dedicated review sessions identifying bugs and design issues
- Three free ultrareviews available for Pro and Max users
- Auto mode extended to Max tier users (enables Claude to make decisions on behalf of users for extended operations)

## Migration from Opus 4.6

Opus 4.7 serves as a direct successor to Opus 4.6, with two considerations affecting token usage:

### Tokenizer Changes

Updated tokenizer improves text processing. Same input may map to more tokens (approximately 1.0-1.35x depending on content type).

### Output Increases

Higher effort levels produce more output tokens, particularly noticeable in agentic settings on subsequent turns. This reflects enhanced reasoning on complex problems.

### Token Usage Management

- Adjust the effort parameter
- Modify task budgets
- Prompt for greater conciseness

Internal testing shows favorable overall token usage across effort levels on coding evaluations, though measurement on live traffic is recommended.

## Early Customer Feedback

- **Citi:** "We're seeing the potential for a significant leap for our developers with Claude Opus 4.7." -- Clarence Huang, VP of Technology
- **Sourcegraph:** "Anthropic has already set the standard for coding models, and Claude Opus 4.7 pushes that further." -- Igor Ostrovsky, Co-Founder and CTO
- **Hex:** "Claude Opus 4.7 is the strongest model Hex has evaluated. It correctly reports when data is missing instead of providing plausible-but-incorrect fallbacks." -- Caitlin Colgrove, Co-Founder and CTO
- **GitHub:** "On our 93-task coding benchmark, Claude Opus 4.7 lifted resolution by 13% over Opus 4.6." -- Mario Rodriguez, Chief Product Officer
- **Cursor:** "Claude Opus 4.7 is a very impressive coding model, particularly for its autonomy and more creative reasoning." -- Michael Truell, Co-Founder and CEO
- **Cognition:** "Claude Opus 4.7 extends the limit of what models can do to investigate and get tasks done." -- Scott Wu, CEO
- **Replit:** "For Replit, Claude Opus 4.7 was an easy upgrade decision. Same quality at lower cost." -- Michele Catasta, President
- **Harvey:** "Claude Opus 4.7 demonstrates strong substantive accuracy on BigLaw Bench, scoring 90.9% at high effort." -- Niko Grupen, Head of Applied Research
- **Hugging Face:** "Claude Opus 4.7 autonomously built a complete Rust text-to-speech engine from scratch." -- Sean Ward, CEO and Co-Founder
- **XBOW:** "For computer-use work at the heart of XBOW's autonomous penetration testing, the new Claude Opus 4.7 is a step change: 98.5% on our visual-acuity benchmark versus 54.5%." -- Oege de Moor, CEO
- **Rakuten:** "On Rakuten-SWE-Bench, Claude Opus 4.7 resolves 3x more production tasks than Opus 4.6." -- Yusuke Kaji, General Manager, AI for Business
- **Databricks:** "On Databricks' OfficeQA Pro, Claude Opus 4.7 shows meaningfully stronger document reasoning, with 21% fewer errors than Opus 4.6." -- Hanlin Tang, CTO of Neural Networks
- **Vercel:** "Claude Opus 4.7 is a solid upgrade with no regressions. It's phenomenal on one-shot coding tasks." -- Joe Haddad, Distinguished Software Engineer
