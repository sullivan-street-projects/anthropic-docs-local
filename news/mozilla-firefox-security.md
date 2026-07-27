---
title: "Partnering with Mozilla to improve Firefox's security"
source_url: "https://www.anthropic.com/news/mozilla-firefox-security"
source_type: "web-extracted"
fetched_at: "2026-07-27T00:00:00Z"
category: "news"
---

# Partnering with Mozilla to improve Firefox's security

**Published:** March 6, 2026

## Overview

Anthropic collaborated with Mozilla researchers to demonstrate AI's capability in identifying security vulnerabilities. Claude Opus 4.6 discovered 22 vulnerabilities in Firefox over two weeks, with Mozilla classifying 14 as high-severity—representing "almost a fifth of all high-severity Firefox vulnerabilities that were remediated in 2025."

## Key Findings

### Vulnerability Discovery

- Claude identified more than 500 zero-day vulnerabilities in open-source software
- The Firefox collaboration involved scanning nearly 6,000 C++ files
- 112 unique vulnerability reports were submitted to Mozilla
- Most fixes shipped in Firefox 148.0 to hundreds of millions of users

### Exploit Development

Testing showed Claude could develop primitive browser exploits in limited cases:

- Successfully created exploits in only 2 out of several hundred attempts
- Exploits worked only in testing environments lacking modern security features like sandboxing
- Vulnerability discovery proved significantly cheaper than exploit creation

## From Model Evaluations to Partnership

The research began by testing whether Claude could reproduce known Firefox vulnerabilities from historical CVE data. To avoid relying on potentially memorized training data, the team shifted focus to finding novel bugs in the current Firefox codebase, starting with the JavaScript engine.

After just twenty minutes, Claude identified a Use After Free vulnerability. This prompted Mozilla to encourage bulk submission of findings without individual validation.

## Best Practices for AI-Assisted Security

### Task Verifiers

Claude performs best when given tools to self-check work. These verifiers should confirm:

- Vulnerabilities are actually removed
- Program functionality remains intact

### Submission Standards

Effective vulnerability reports include:

1. Minimal test cases
2. Detailed proofs-of-concept
3. Candidate patches

## Looking Forward

The gap between frontier models' discovery and exploitation abilities currently favors defenders. However, Anthropic acknowledges this advantage may be temporary and calls for:

- Developers to accelerate security improvements
- Coordinated vulnerability disclosure following established norms
- Continued expansion of AI-enabled security research partnerships

The organization has published formal Coordinated Vulnerability Disclosure operating principles and released Claude Code Security in limited research preview.
