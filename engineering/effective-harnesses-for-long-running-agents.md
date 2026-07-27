---
title: "Effective harnesses for long-running agents"
source_url: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents"
source_type: "web-extracted"
fetched_at: "2026-07-27T00:00:00Z"
category: "engineering"
published: "2025-11-26"
---

# Effective harnesses for long-running agents

**Publication Date:** November 26, 2025

"The core challenge of long-running agents is that they must work in discrete sessions, and each new session begins with no memory of what came before." This creates a situation where agents lose continuity, similar to software teams where each shift lacks knowledge of prior work.

## Two-Part Solution

The research proposes two specialized agent types:

1. **Initializer Agent**: Runs once to establish the foundational environment
2. **Coding Agent**: Handles all subsequent sessions with incremental progress

## Key Environmental Components

### Feature List

The initializer creates a comprehensive JSON file documenting over 200 individual features. Each feature includes descriptive steps and a `passes` boolean field. The guidance emphasizes: "It is unacceptable to remove or edit tests because this could lead to missing or buggy functionality."

**Example feature structure:**

```json
{
  "category": "functional",
  "description": "New chat button creates a fresh conversation",
  "steps": ["Navigate to main interface", "Click the 'New Chat' button"],
  "passes": false
}
```

### Supporting Artifacts

- `init.sh` script for launching development environments
- `claude-progress.txt` tracking session history
- Git commit history for state recovery

## Agent Failure Modes and Solutions

| Problem                      | Initializer Solution           | Coding Agent Solution                              |
| ---------------------------- | ------------------------------ | -------------------------------------------------- |
| Premature project completion | Create structured feature list | Work on single features sequentially               |
| Buggy/undocumented progress  | Initialize git repository      | Begin sessions with verification testing           |
| Incomplete feature marking   | Include feature checklist      | Require end-to-end testing before marking complete |
| Setup confusion              | Write `init.sh` script         | Read initialization script at session start        |

## Critical Practices

**Incremental Approach:** Working on one feature at a time proved essential, preventing the agent from attempting to "one-shot" entire applications.

**Testing Requirements:** "Claude's tendency to mark a feature as complete without proper testing" was addressed by requiring browser automation tools and end-to-end verification matching human user workflows.

**Session Startup Routine:** Each coding session follows this sequence:

1. Verify working directory location
2. Review git logs and progress files
3. Select highest-priority incomplete feature
4. Run basic end-to-end verification

## Results

The approach successfully enabled Claude Opus 4.5 to make sustained progress on complex projects like building a Claude.ai clone, with proper documentation and testable code states at each session boundary.

## Future Research Directions

Open questions remain regarding whether multi-agent architectures (specialized testing, QA, and cleanup agents) might outperform single general-purpose agents. The authors also suggest these principles may generalize beyond web development to scientific research and financial modeling.
