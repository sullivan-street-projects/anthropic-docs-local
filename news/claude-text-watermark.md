---
title: "How Claude's Text Watermarking Works"
source_url: "https://www.anthropic.com/news/claude-text-watermark"
source_type: "web-extracted"
fetched_at: "2026-09-06T00:00:00Z"
category: "news"
published: "2026-08-14"
---

# How Claude's Text Watermarking Works

## Overview

Anthropic is implementing text watermarking in future Claude models to comply with the EU AI Act. The watermark enables detection of Claude's involvement in text generation while maintaining output quality and user privacy. (Published August 14, 2026; updated September 1, 2026.)

## What Is Watermarking?

Claude generates text sequentially, selecting among word candidates. Watermarking leverages low-stakes choices where multiple words work equally well—like choosing between "overcast" or "grey" after "The weather today was cold and…" Instead of random selection, the watermark uses a cryptographic key to influence word choices, creating a detectable pattern invisible to readers.

## Impact on Output Quality

The watermark produces no measurable impact on content quality, creativity, or readability. Testing by Google DeepMind (which developed the SynthID-Text method Anthropic adopted) found no statistically significant differences in user ratings between watermarked and unwatermarked outputs.

## Technical Specifics

Claude uses a version of Google DeepMind's SynthID-Text approach published in Nature (2024). The method belongs to a family descending from Scott Aaronson's 2022 proposal, maintaining the principle that watermarking only changes randomness sources, not word selection biases.

## Limitations

- Watermarking works only on passages with sufficient length and flexible word choices
- It cannot distinguish between "Claude wrote this" and "Claude edited this"
- Factual passages and code contain less watermarking due to stricter word requirements
- Light editing may preserve the watermark; complete rewrites remove it

## User Implications

- No performance slowdown or additional costs
- Watermarks contain no identifying information linking to users, organizations, or specific chats
- Detection API currently available to eligible organizations (regulators, researchers, fact-checkers, enterprises)
- Files receive C2PA content credentials noting Claude involvement

## Special Cases

- **Proofreading:** Limited watermarking since most words are unchanged
- **Code:** Minimal watermarking where exact outputs are required; some watermarking appears in comments
- **Translations:** Watermarked since Claude selects every word
- **Older models:** Being updated during the transition period

## Regulatory Context

Approximately 190 organizations signed the EU Code of Practice on Transparency of AI-Generated Content in July 2026, requiring AI providers to mark generated content.
