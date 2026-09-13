---
title: "Measuring AI Capabilities in Intelligence Targeting and Conventional Weapons"
source_url: "https://www.anthropic.com/research/intelligence-targeting-conventional-weapons-capabilities"
source_type: "web-extracted"
fetched_at: "2026-09-13T00:00:00Z"
category: "research"
published: "2026-09-10"
---

# Measuring AI Capabilities in Intelligence Targeting and Conventional Weapons

**Publication Date:** September 10, 2026

**Author/Organization:** Anthropic's Frontier Red Team

---

## Article Summary

Anthropic's Frontier Red Team has released comprehensive evaluations demonstrating that advanced AI models possess capabilities historically reserved for specialized human experts in intelligence targeting and weapons development. The research highlights both the technical capabilities of frontier models and concerning gaps in open-source alternatives.

### Key Findings on Intelligence Targeting

The evaluation suite assessed models across three intelligence domains:

**Account Correlation and Classification:** Models demonstrated the ability to link social media accounts across platforms and classify individuals by interest level. Mythos Preview achieved the strongest performance, analyzing median samples of 37,000 words in approximately 11 minutes—a task requiring roughly 2.5 hours of human analyst review time.

**Geolocation from Photographs:** Advanced models approached superhuman performance. Mythos Preview and Mythos 5 achieved median distance errors of 37-47 kilometers across 6,000 photographs, with roughly 23% of guesses landing within 1 kilometer—surpassing champion-level human GeoGuessr players who typically achieve 151-kilometer median errors.

**Geolocation from Text:** Using real Twitter data from 2010, frontier models located users' home locations with median errors under 21 kilometers. The research noted that 70% of successfully geolocated individuals revealed their locations through explicit references, while 13% were identified through dialect and cultural markers.

### Weapons Development Capabilities

Models were tested on three simulated drone engineering tasks:

**Terminal Guidance:** Models wrote flight control code to guide drones toward moving targets. Opus 5 achieved 80% strike rates against stationary, high-visibility vehicles, but performance collapsed against camouflaged or evasive targets. Even frontier models struggled with realistic scenarios.

**Payload Delivery:** Models designed code to release simulated ordnance. Against static targets, success rates exceeded 90% for frontier models. Performance degraded significantly with moving targets and environmental factors like wind.

**GPS-Denied Navigation:** Models attempted autonomous navigation using magnetometers and barometers when GPS signals were jammed or spoofed. Frontier models detected sensor disagreements and attempted dead-reckoning, typically ending 15-30 meters from destinations. Weaker models remained deceived by subtle spoofing.

### Open-Weights Model Performance

Chinese open-source models like Kimi K3 trailed frontier systems but still demonstrated concerning capabilities. On geolocation tasks, K3 performed comparably to Sonnet 5, while lagging significantly on drone guidance—achieving strike rates below 2% on moving targets compared to Opus 5's 20% average.

### Safety Implications

The researchers emphasize that evaluations represent "a floor rather than a ceiling" and note that actual threat actors would have advantages unavailable in sandboxed environments. The research documents real instances of AI misuse for surveillance and weapons development that informed the evaluation design.

### Recommended Responses

Anthropic proposes several mitigation strategies:

- **Classifier Development:** Implementation of detection systems to block weapons-development requests
- **Open-Weights Research:** Increased focus on safety measures for openly-available models
- **Policy Considerations:** Enhanced legal frameworks addressing mass surveillance and AI-enabled capabilities
- **Computational Restrictions:** Continued protection of advanced chipmaking as a constraint on adversarial AI development

The report concludes that these capabilities will likely expand as models improve, necessitating proactive security measures rather than reactive responses.
