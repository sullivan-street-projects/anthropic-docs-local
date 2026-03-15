---
title: "Code Execution with MCP: Building More Efficient Agents"
source_url: "https://www.anthropic.com/engineering/code-execution-with-mcp"
source_type: "web-extracted"
fetched_at: "2026-03-15T00:00:00Z"
category: "engineering"
---

# Code Execution with MCP: Building More Efficient Agents

**Published:** November 4, 2025

## Overview

The article explores how code execution environments can optimize AI agent interactions with the Model Context Protocol (MCP). Rather than loading all tool definitions upfront, agents can write code to call tools more efficiently.

## Key Problems Identified

### 1. Tool Definition Overload
When MCP clients expose all tool definitions directly to models via tool-calling syntax, extensive context is consumed. For agents with thousands of connected tools, "hundreds of thousands of tokens" may be processed before addressing user requests.

### 2. Intermediate Result Duplication
Tool results pass through the model multiple times. The example describes downloading a meeting transcript and attaching it to a Salesforce record—requiring the full transcript to flow through context twice, potentially consuming 50,000+ additional tokens for longer documents.

## Solution: Presenting MCP as Code APIs

Instead of direct tool calls, the approach generates a file structure representing tools as TypeScript functions. Agents discover tools by exploring a `./servers/` filesystem directory, loading only necessary definitions on-demand.

**Example structure:**
```
servers/
├── google-drive/
│   ├── getDocument.ts
│   └── index.ts
├── salesforce/
│   └── updateRecord.ts
```

This method reduces token usage "from 150,000 tokens to 2,000 tokens—a time and cost saving of 98.7%."

## Key Benefits

**Progressive Disclosure:** Models navigate filesystems efficiently, reading tool definitions only when needed rather than upfront.

**Data Filtering:** Large datasets can be processed in the execution environment. Fetching 10,000 spreadsheet rows allows filtering to return only relevant results to the model.

**Control Flow Efficiency:** Loops, conditionals, and error handling execute natively without alternating model calls.

**Privacy Protection:** Intermediate results remain in the execution environment by default. Sensitive data like PII can be tokenized automatically, preventing model exposure.

**State Persistence:** Agents maintain progress across operations via filesystem access, enabling resumption and skill development.

## Important Considerations

Code execution introduces operational complexity. Secure sandboxing, resource limits, and monitoring infrastructure are required—adding overhead that direct tool calls avoid. Organizations must weigh efficiency gains against implementation costs.

## Attribution

Written by Adam Jones and Conor Kelly, with feedback from Jeremy Fox, Jerome Swannack, Stuart Ritchie, Molly Vorwerck, Matt Samuels, and Maggie Vo.
