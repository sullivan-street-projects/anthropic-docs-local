---
title: "Developing Enterprise Frontier Safeguards with our customers"
source_url: "https://www.anthropic.com/news/enterprise-frontier-safeguards"
source_type: "web-extracted"
fetched_at: "2026-09-06T00:00:00Z"
category: "news"
published: "2026-09-01"
---

# Developing Enterprise Frontier Safeguards with our customers

## Overview

Anthropic introduced Enterprise Frontier Safeguards (EFS), a solution combining zero data retention privacy with sophisticated misuse detection capabilities. The system stores data in customer-controlled cloud infrastructure rather than Anthropic's systems. Rollout begins this fall, with eligible customers receiving zero data retention on Fable 5 and Fable 5.1 until EFS launches.

The development involved collaboration with over 100 customers across financial services, healthcare, manufacturing, telecom, law, retail, and public sector, plus partnerships with Amazon Web Services, Google Cloud, and Microsoft Azure.

## The Problem

Advanced models like Claude Fable 5.1 introduce increased risks alongside their capabilities. Anthropic documented attempted misuse including fraud and sophisticated cyberattacks involving autonomous agent misbehavior. Enterprise credential theft and multi-session attacks are particularly difficult to detect without sustained data monitoring and correlation across time and accounts.

While Anthropic introduced 30-day data retention with Fable 5 for safety reasons (never for model training), regulated-industry customers struggled with retention policies. EFS addresses this tension.

## Key Design Principles

**Monitoring control:** Customers review flagged patterns directly; Anthropic's automated systems don't conduct human review.

**Data storage:** Customers maintain data in their cloud accounts under their encryption keys, with complete audit logging and access control.

**Automated review only:** No Anthropic human review occurs; customers' own teams manage all response to detected signals, including suspicious activity patterns and credential misuse indicators.

## Supported Platforms

EFS works across Claude Code, Claude Enterprise, the Claude Platform, Amazon Bedrock, Claude Platform on AWS, Google Agent Platform, and Microsoft Foundry, providing consistent controls regardless of access method.

## Pricing and Access

Anthropic charges no fee for EFS. Cloud storage costs (data storage, reads, writes, egress) are billed by customers' cloud providers. The feature rolls out in phases with a form for requesting access.
