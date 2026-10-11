---
title: "Launching an opt-in vulnerability-finding service for open-source software"
source_url: "https://www.anthropic.com/research/launching-opt-in-vuln-finding-service-for-open-source"
source_type: "web-extracted"
fetched_at: "2026-10-11T00:00:00Z"
category: "research"
---

# Launching an opt-in vulnerability-finding service for open-source software

Anthropic, **October 8, 2026**. **OSS Scanner** is a free, opt-in vulnerability scanner for open-source projects, built on Anthropic's strongest models and modeled on Google's OSS-Fuzz. It grew out of using Claude to find vulnerabilities during Project Glasswing.

- **How it works:** fully model-generated scans, no human review/triage before reports go out (faster, more frequent, but some reports may be invalid). Each report includes a self-contained reproducer, an explanation (with bisection where possible), and a candidate patch when available. Reports come from Claude Mythos and other strong models.
- **Enrollment:** only core maintainers of eligible projects can enroll via a pull request to Anthropic's GitHub repo; eligibility similar to OSS-Fuzz (critical impact on infrastructure/user security), case by case.
- **Results:** 29,000+ candidate vulnerabilities found in six months; ~6,000 manually triaged; ~5,000 unverified reports sent to maintainers who asked for everything. In validation, penetration testers checked 97 critical/high findings across 48 projects — 85 (88%) met the CVD bar; 11 real but duplicate; 1 false positive. wolfSSL: all but two of 74 reports valid, five became CVEs.
- **Related:** Cyber Verification Program (advanced capabilities + reduced blocking for qualifying pros); Claude for OSS (free Max 20x subscriptions for maintainers).
