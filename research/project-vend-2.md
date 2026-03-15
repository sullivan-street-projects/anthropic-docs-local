---
title: "Project Vend: Phase Two"
source_url: "https://www.anthropic.com/research/project-vend-2"
source_type: "web-extracted"
fetched_at: "2026-03-15T00:00:00Z"
category: "research"
---

# Project Vend: Phase Two

## Overview

Anthropic's second phase of Project Vend demonstrates significant progress in AI agent capabilities for autonomous business operations, though substantial challenges remain.

## Key Findings

### Performance Improvements

In phase one, "Claudius" (a modified Claude model running a vending shop) struggled significantly, losing money and exhibiting poor judgment. Phase two showed dramatic improvement:

- **Model Upgrade**: Transitioned from Claude Sonnet 3.7 to Claude Sonnet 4.0 and later 4.5
- **Profitability**: "Weeks with negative profit margin were largely eliminated" as operations progressed
- **Expansion**: Successfully established shops in San Francisco, New York, and London

### Strategic Changes That Worked

**Tools and Infrastructure**
The most impactful enhancement was providing proper scaffolding: customer relationship management systems, improved inventory tracking, enhanced web search capabilities, and payment collection tools. These practical systems reduced reliance on the model's unsupported assumptions.

**Procedural Requirements**
Forcing Claudius to follow verification procedures proved crucial. Rather than making hasty offers, the agent now double-checked pricing and delivery estimates, resulting in more realistic commitments.

**Organizational Structure**
Introducing specialized agents improved results. "Clothius" (merchandise specialist) achieved strong profit margins, partly due to clear role separation.

## Persistent Vulnerabilities

Despite improvements, critical weaknesses emerged:

**Regulatory Ignorance**
Claudius nearly entered an illegal onion futures contract, stopped only by human intervention regarding the 1958 Onion Futures Act.

**Security Naivete**
When informed of shoplifting, Claudius proposed messaging unknown thieves and hiring untrained security at subminimum wages.

**Social Engineering**
Staff successfully impersonated decision-makers through unverified voting claims, nearly replacing legitimate leadership.

## Root Cause Analysis

The researchers identify a fundamental tension: "many of the problems that the models encountered stemmed from their training to be helpful." This helpfulness orientation prioritizes accommodation over business prudence, creating exploitable vulnerabilities in autonomous systems.

## Implications

The research reveals that "the gap between 'capable' and 'completely robust' remains wide." As AI systems handle increasingly important functions, developing general guardrails that permit economic efficiency while preventing abuse represents an urgent industry challenge.

The experiment demonstrates that capability improvements don't automatically translate to robustness—a critical consideration for real-world AI deployment.
