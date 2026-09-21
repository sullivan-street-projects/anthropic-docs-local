---
title: "Project Glasswing: An initial update"
source_url: "https://www.anthropic.com/research/glasswing-initial-update"
source_type: "web-extracted"
fetched_at: "2026-09-21T00:00:00Z"
category: "research"
---

# Project Glasswing: An initial update

**Date:** May 22, 2026

---

## Overview

Anthropic's Project Glasswing represents a collaborative initiative involving approximately 50 partners working to identify and remediate vulnerabilities in critical software infrastructure before advanced AI models can be weaponized against them. The first month of operations has yielded significant findings across both proprietary and open-source codebases.

## Key Results

### Early Performance Data

Partners utilizing Claude Mythos Preview discovered over 10,000 high- or critical-severity vulnerabilities within one month. According to Anthropic's summary, "Progress on software security used to be limited by how quickly we could find new vulnerabilities."

Notable organizational findings include:

- **Cloudflare:** 2,000 total bugs identified (400 critical/high-severity) with false positive rates superior to human testers
- **Mozilla:** 271 Firefox vulnerabilities detected—a tenfold increase over previous testing cycles
- **UK AI Security Institute:** Mythos Preview became the first model solving their full cyber ranges end-to-end
- **Banking sector application:** Detection and prevention of a $1.5 million fraudulent wire transfer

### Open-Source Software Scanning

Anthropic's independent scanning of 1,000+ open-source projects revealed approximately 6,202 estimated high- or critical-severity vulnerabilities among 23,019 total findings.

Assessment results show credibility: "90.6% (1,587) have proved to be valid true positives, and 62.4% (1,094) were confirmed as either high- or critical-severity."

## Disclosure and Patching Challenges

The cybersecurity field faces a significant bottleneck. While vulnerability discovery has accelerated dramatically, the human capacity for verification, disclosure, and patch deployment remains constrained. Currently, high- or critical-severity bugs require approximately two weeks for patching after disclosure.

Of 530 reported high- or critical-severity bugs, only 75 have received patches with public advisories—reflecting genuine ecosystem capacity limitations rather than early-stage delays.

## Defensive Recommendations

Organizations should prioritize:

- Accelerating patch cycles and security fix deployment
- Simplifying software update installation for end users
- Shortening patch testing and deployment timelines
- Implementing fundamental security controls (network hardening, multi-factor authentication, comprehensive logging)

## Available Tools

Anthropic has released Claude Security in public beta, enabling enterprise vulnerability scanning and patch generation. Within three weeks, this tool facilitated patching of 2,100 vulnerabilities.

Additional resources include the Cyber Verification Program for legitimate security professionals and customizable scanning tools featuring integrated threat modeling capabilities.

## Future Directions

Mythos-class models remain unavailable to the general public pending development of stronger safeguards. Project Glasswing will expand partnerships with government and allied organizations while preparing eventual public release once security measures are sufficiently robust.
