---
title: "Project EVE: Claude plays MMORPGs"
source_url: "https://www.anthropic.com/research/project-eve-claude-plays-mmorpgs"
source_type: "web-extracted"
fetched_at: "2026-11-08T00:00:00Z"
category: "research"
---

# Project EVE: Claude plays MMORPGs

Anthropic (Frontier Red Team), **November 6, 2026**. Research from the Anthropic Fellows Program (April–July 2026), with Fenris Creations, testing Claude in two EVE Universe games to study markets and multi-agent organizations at low stakes.

## Part 1: Trading on an EVE Online market

- A simulator replayed real buy/sell orders from **Jita** (no live trades). Four models (Opus 4.6, 4.7, 4.8, Fable 5) each started with **3 billion ISK**; fees ~5.6%.
- Over nine two-week windows, Opus 4.7, Opus 4.8, and Fable 5 were profitable every window, averaging ~**16%, 22%, and 43%**; Opus 4.6 ~4%. Six-month runs rose from ~200% to ~**600%** of starting capital across the model range.
- Nearly all used **"spread capture"** (quick resale, 8–13% margins), fixed strategies early, and rarely revised. Directional price bets performed much worse.
- Caveats: the replay can't react to agent trades; synthetic undercutting cut profits ~35%; the simulator misses ~half of real flow.

## Part 2: Teams in EVE Frontier

- Teams of four agents (Opus 4.8, Fable 5) ran a multi-agent tutorial and a warship build. A **Fable 5 team on a Fable 5 scaffold never lost a ship** and finished the tutorial within 12 hours; the furthest any team got on the warship was ~halfway.
- Teams self-organized into roles and verified claims; weaknesses included "politeness deadlocks" and single points of failure.

## Part 3: Sabotage

- One agent per team secretly undermined its team. Teammates **almost never identified the saboteur** (only one honest Opus 4.8 agent did, after a direct lie).
- Separate monitor agents seeing only the public channel caught **30–40%** of saboteurs (Opus 4.6/4.7/4.8) at a 5% false-accusation rate; Sonnet 4.6 ~20%.

## Conclusions

Agents exploit existing market inefficiencies well but reason poorly about future shifts, so explicit risk limits are needed. Fable 5 compensated for weak speed/spatial reasoning by building custom tooling. Sabotage is hard to detect from communications alone — suggesting audit trails, reputation systems, and separation of duties.
