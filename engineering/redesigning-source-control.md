---
title: "Redesigning source control at Anthropic"
source_url: "https://www.anthropic.com/engineering/redesigning-source-control"
source_type: "web-extracted"
fetched_at: "2026-10-18T00:00:00Z"
category: "engineering"
---

# Redesigning source control at Anthropic

Anthropic Engineering, **October 2026**. Anthropic's merge volume grew >10× in a few months — from ~2,500 code changes merged/day (May 2026) to >30,000/day (September). Source control became the main bottleneck: Claude could write code faster than human-scale infrastructure could handle it.

## The problem: scaling the monorepo

The main branch history is nearly 100 GB; a compressed working copy exceeds 25 GB. ~25 million checkouts run daily for CI alone — naively ~600 PB of git traffic/day. Git partial-clone tools (shallow clones, sparse checkouts, promisor remotes), internal mirrors, and blob-stored snapshots helped; at peak several hundred git mirrors ran. But as the merge rate rose, snapshots drifted from the branch tip and history-dependent operations (diff, blame) grew harder on partial clones. The team noted git was used as a centralized system, yet nearly all clients were always-online agents — git's offline-first design worked against them.

## Principles for agent-scale source control (Scion)

Anthropic built **Scion**, drawing on Google's Piper and Meta's Sapling (crediting Sapling's server Mononoke and its Bonsai data model):

- **Clients are always online** — fetch data on demand rather than holding a complete copy.
- **Client-server asymmetry** — the server handles history, blame, commits, merges, rebases; the client keeps a bounded object cache and materializes files.
- **A comprehensive service enables new tools** — every query exposed via API, so jobs like bisect/revert need no local repo.
- **Everything scales horizontally** — no fully materialized copy anywhere, even on the server; no packfiles, no repo maintenance.
- **Commits are cheap, incremental, lock-free** — commits happen on the server (nothing to push); cost tracks change size, not repo size; refs kept minimal (mostly main and release branches).
- **The working copy is optional and sparse** — many CI/write workloads skip checkouts; the client materializes only what it reads.

## How Scion works

- **Changeset:** the basic unit, an entry in a write-ahead log, listing files changed relative to its first parent plus content-addressed pointers to compressed blobs. Created on the server, immediately available everywhere.
- **Derived data:** blame, path history, commit-graph skip lists computed through one generic recursive mechanism (each type defined from its parents' values), computed eagerly or lazily.
- **Scaling:** all stored data is content-addressed and immutable, so any server can cache without coordination; servers act as large caches computing derived data on demand, writing results to Spanner. The `scn` client fetches by requesting missing trees recursively then blobs (each request targets an immutable object; transfers resumable, no single packfile). Sparse/virtualized checkouts need no special support.
- **Three tiers** sharing the same RPCs: `scion-daemon` (per node), `scion-cache` (per region), `scion-server` (authoritative, reads Spanner/cloud storage on miss). Tiers strictly enforced to isolate failures.

### Results

Each tier keeps a >99% cache hit rate and no long-lived state. Scion's CPU/memory footprint is ~200× smaller than the previous git-mirror infrastructure; CI and research checkouts take seconds instead of minutes; CI gained a 25% CPU capacity win.

## What the team learned

- **Small teams move fast:** seven engineers built Scion, the Antique code-review tool, and related systems, migrating in five months while merge volume grew 10×.
- **Engineering work is shifting:** engineers judged Claude better at writing code, but system design and tradeoffs stayed essential — often the job was to say "no" when agents violated core constraints (e.g. scanning the commit log instead of querying the review tool). Reviewers now focus on intent over every line.
- **Quality/optimization improved:** heavy testing (hermetic simulations, fuzzing, rate limiting); Claude rewrote an ingestion pipeline to use 20× less memory and run 4× faster while keeping ordering invariants.
- **Security built in:** repo-level access control, directory-level permissions, semantic approval rules.
- **Operations watched by "superfans":** Claude instances assigned to watch individual components, using telemetry/logs to catch subtle issues.
- **Human-scale workflows rethought:** a global-lock merge queue makes little sense when hundreds of changes merge during a test run; Anthropic invested in post-merge and pre-deploy testing instead.

## Contributing to the ecosystem

Scion is not a git replacement — it fits only very large monorepos and its tooling is bespoke. Anthropic hopes to share ideas git platforms can adopt: server-side RPCs exposing source-control queries, server architectures that scale independently of the client, and sparse/shallow features that compose better. It hopes to partner with GitHub, GitLab, and open-source contributors.
