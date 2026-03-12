---
title: "Detecting and Preventing Distillation Attacks"
source_url: "https://www.anthropic.com/news/detecting-and-preventing-distillation-attacks"
source_type: "web-extracted"
fetched_at: "2026-03-11T00:00:00Z"
category: "news"
published: "2026-02-23"
---

# Detecting and Preventing Distillation Attacks

**Published:** February 23, 2026

## Overview

Anthropic has identified large-scale campaigns by three AI laboratories—DeepSeek, Moonshot, and MiniMax—conducting unauthorized extraction of Claude's capabilities. The operations generated over 16 million interactions through approximately 24,000 fraudulent accounts, violating terms of service and regional access restrictions.

## What Is Distillation?

Model distillation involves training a smaller model using outputs from a more capable one. While this represents a legitimate training methodology used throughout the industry, it becomes problematic when competitors employ it to acquire advanced capabilities much faster and cheaper than independent development would require.

## Security Implications

Illicitly distilled models lack the safety mechanisms that frontier AI developers implement. These protections prevent deployment for harmful purposes like bioweapon development or cyber attacks. When foreign laboratories strip these safeguards before integrating distilled capabilities into military or surveillance infrastructure, significant national security risks emerge.

## The Three Campaigns

**DeepSeek** (150,000+ exchanges): Targeted reasoning abilities and created "censorship-safe alternatives" to politically sensitive queries.

**Moonshot** (3.4+ million exchanges): Focused on agentic reasoning, tool use, coding, and computer vision capabilities.

**MiniMax** (13+ million exchanges): Concentrated on agentic coding and tool orchestration, pivoting within 24 hours when new models released.

## Access Methods

These labs circumvent geographic restrictions using commercial proxy services operating "hydra cluster" architectures—sprawling fraudulent account networks distributing requests across multiple platforms without single points of failure.

## Anthropic's Response

Defensive measures include detection classifiers for identifying attack patterns, intelligence sharing with industry partners, strengthened account verification, and product-level safeguards designed to reduce output utility for illicit distillation without affecting legitimate users.
