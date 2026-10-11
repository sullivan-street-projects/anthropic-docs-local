---
title: "GLM-5.3 and the spread of advanced cyber capabilities"
source_url: "https://www.anthropic.com/research/glm-5-3-and-the-spread-of-advanced-cyber-capabilities"
source_type: "web-extracted"
fetched_at: "2026-10-11T00:00:00Z"
category: "research"
---

# GLM-5.3 and the spread of advanced cyber capabilities

Anthropic (Frontier Red Team), **September 29, 2026**.

- **Capability:** GLM-5.3 (Zhipu AI / Z.ai) can autonomously build end-to-end cyber exploits — a capability Anthropic first reported with Claude Mythos Preview five months earlier. NIST's CAISI called it "the most cyber-capable open-weight model released to date," trailing the US frontier by ~4 months.
- **Benchmarks:** On ExploitBench, 50/410 end-to-end exploits (vs Mythos Preview 56/410). On internal Binary Exploitation (100 tasks), 4% full control-flow hijacks vs 6% for Mythos Preview; Opus 4.6 and GLM-5.2 scored 0.
- **Real-world-style testing:** A researcher found several unknown vulnerabilities in a browser JS engine and chained them into a file-reading exploit (disclosed to maintainer). GLM-5.3-Flash built a working exploit chain for Chrome CVE-2026-11645 in ~8 hours of model work (~20 min human attention, ~$20.40 API cost).
- **Weak safeguards:** Refusals bypassed at high rates — red-team cover story 64%, prefilled reasoning 92%, abliteration 100%. Claude models stayed at 0% under API safeguards.
- **Abliteration:** ~2,200 GPU hours (~$4,400) to abliterate; refusal rates fell from >90% to ~2–12% while general capability held.

**Takeaways:** A step change in attacker access; defenders need frontier-capable tools (Project Glasswing, expanded trusted access); governments should independently safety-test capable models; open-weight developers should build in meaningful safeguards.
