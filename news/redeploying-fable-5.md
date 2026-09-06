---
title: "Redeploying Claude Fable 5"
source_url: "https://www.anthropic.com/news/redeploying-fable-5"
source_type: "web-extracted"
fetched_at: "2026-09-06T00:00:00Z"
category: "news"
published: "2026-06-30"
---

# Redeploying Claude Fable 5

## Overview

Following US government export control restrictions imposed on June 12, Anthropic suspended access to Claude Fable 5 and Mythos 5. As of June 30, these controls were lifted, and both models are being redeployed globally starting July 1, 2026.

## Key Announcements

**Model availability:** Fable 5 will be accessible through Claude Platform, Claude.ai, Claude Code, and Claude Cowork. For Pro, Max, Team, and select Enterprise plans, it will be included for up to 50% of weekly usage limits through July 7, then available via usage credits. Cloud platform re-enablement (AWS, Google Cloud, Microsoft Foundry) is underway.

**Mythos 5 status:** Access has been restored for approved US organizations following government authorization on June 26. Anthropic continues coordinating with government to expand access through the Project Glasswing program.

## Export Control Context

Amazon researchers discovered a method for bypassing Fable 5's safeguards: prompting it so that it identified a number of software vulnerabilities. This triggered immediate government action requiring nationality verification for access.

Anthropic's testing revealed that less capable models could identify the same vulnerabilities, and multiple models produced identical exploit demonstrations. The reported technique did not expose unique Mythos-level capabilities.

## Safety Improvements

Anthropic deployed an improved safety classifier targeting the reported bypass technique, blocking it in over 99% of cases. The classifier may flag benign requests more frequently during routine coding tasks but represents an enhancement validated by the Department of Commerce's Center for AI Standards and Innovation.

## Safeguard Approach

Fable 5 launches with "defense in depth"—multiple layered safety mechanisms including automated classifiers detecting potentially harmful cybersecurity requests. These classifiers operate with intentional safety margins, blocking ambiguous requests that are probably benign but have some small chance of being harmful.

The post distinguishes jailbreak severity levels: minor jailbreaks remain within safety margins, narrow harmful ones unblock specific behaviors, and universal jailbreaks (not yet discovered for Fable 5) would unblock broader harmful capabilities.

## Industry Framework Proposal

Anthropic proposes a consensus jailbreak severity framework, developed with Amazon, Microsoft, Google, and other Glasswing partners. Four scoring criteria are proposed:

1. **Capability gain:** How far the jailbreak extends beyond existing tools
2. **Breadth of capability gain:** Number of distinct offensive tasks affected
3. **Ease of weaponization:** Human effort required to deploy the jailbreak
4. **Discoverability:** Accessibility of the technique

A new HackerOne program enables security researchers to submit discovered cyber jailbreaks for review.

## Government Collaboration

Anthropic commits to:

- **Pre-release access:** Providing designated government partners early model access for independent capability and safeguard evaluation
- **Rapid information sharing:** Quick investigation and notification of significant jailbreaks; advance threat intelligence sharing
- **Joint research resources:** Scaling collaborative work on AI security with dedicated Anthropic teams and compute allocation
- **Common industry standards:** Developing shared voluntary security and evaluation standards for frontier model providers

The company emphasizes that government involvement in AI releases requires a durable, transparent process, and advocates for regulation applied equally across frontier model developers.
