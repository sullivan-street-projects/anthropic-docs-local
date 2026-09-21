---
title: "What we learned mapping AI-enabled cyber threats"
source_url: "https://www.anthropic.com/news/AI-enabled-cyber-threats-mitre-attack"
source_type: "web-extracted"
fetched_at: "2026-09-21T00:00:00Z"
category: "news"
---

# What we learned mapping a year's worth of AI-enabled cyber threats

**Date:** Jun 3, 2026

## Overview

Anthropic analyzed 832 accounts banned for malicious cyber activity between March 2025 and March 2026, mapping their techniques onto the MITRE ATT&CK framework. The research reveals how AI is transforming cyberattacks and where existing security models fall short.

## Key Findings

### How AI makes attackers more dangerous

The analysis identified a significant shift in how threat actors employ AI:

- **Initial preparation:** 67.3% of actors used AI for malware writing and related preparation tasks
- **Post-compromise activities:** 6.5% employed AI for lateral movement inside compromised networks

A concerning trend emerged across the study period: actors classified as medium-risk or higher increased from 33% in the first six months to 56% in the second period—a 1.7x increase.

Attackers increasingly shifted from using AI for initial system access toward deploying it for activities executed after compromise. Account discovery rose 8.9% while AI-assisted phishing decreased 8.6%, suggesting attackers are applying AI "deeper in the attack life cycle."

### Reassessing threat levels

Traditional risk assessment metrics are becoming unreliable:

- Least-skilled actors averaged approximately 16 techniques; most-skilled used roughly 20
- The platform used (Claude Code, API, or chat interface) showed no correlation with actor risk level
- Higher-risk actors concentrate AI use on operationally demanding techniques requiring significant oversight or real-time decision-making

The most durable differentiator involves architectural design: sophisticated actors build systems enabling models to orchestrate sequential attack stages with minimal human intervention.

### Security framework limitations

The MITRE ATT&CK framework lacks coverage for critical AI-enabled behaviors, particularly autonomous agent orchestration. The November 2025 state-sponsored operation Anthropic disrupted demonstrated this gap—it mapped to 30 techniques across 13 tactics (comparable to medium-risk actors), yet merited a maximum risk score of 100 when evaluated using updated methodology.

## Forward Direction

Anthropic has deployed cyber safeguards on capable models to detect and block malware development and mass data exfiltration. The company is collaborating with MITRE on framework evolution to capture AI-enabled attack patterns, while continuing research through Project Glasswing and related cybersecurity initiatives.
