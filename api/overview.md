---
title: "API Overview"
source_url: "https://docs.anthropic.com/"
source_type: "web-extracted"
fetched_at: "2026-01-04T05:55:00Z"
category: "api"
---

# Claude API Overview

Build with Claude using the Claude Developer Platform and Claude Code.

## Claude Developer Platform

### Getting Started
Make your first API call in minutes.

### Features
- **Messages API**: Core interface for interacting with Claude
- **Tool Use**: Extend Claude's capabilities with custom functions
- **Vision**: Analyze and understand images
- **Streaming**: Real-time response generation
- **Extended Thinking**: Enhanced reasoning with step-by-step thinking

### Key Capabilities
- **Structured Outputs**: Guaranteed schema conformance
- **Agent Skills**: Dynamic instruction loading
- **Files API**: Upload and reference files
- **Batch Processing**: Process multiple requests at 50% cost
- **Prompt Caching**: Reduce costs by up to 90%

## Claude Code
- Agentic coding tool for your terminal
- Understands your codebase
- Natural language commands
- Git workflow handling

## Resources

### Documentation
- [API Reference](https://platform.claude.com/docs/en/api/overview)
- [Release Notes](https://platform.claude.com/docs/en/release-notes/api)
- [Claude Console](https://platform.claude.com/)

### Learning
- [Anthropic Courses](https://anthropic.skilljar.com/)
- [Claude Cookbook](https://github.com/anthropics/anthropic-cookbook)
- [Claude Quickstarts](https://github.com/anthropics/anthropic-quickstarts)

## SDKs

| Language | Package |
|----------|---------|
| Python | `pip install anthropic` |
| TypeScript | `npm install @anthropic-ai/sdk` |
| Go | `github.com/anthropics/anthropic-sdk-go` |
| Java | Maven Central |
| Ruby | `gem install anthropic` |
| C# | NuGet |
| PHP | Composer |

## Authentication

All API requests require an API key:

```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json"
```

## Rate Limits

Rate limits vary by usage tier and model. Monitor your usage in the [Console](https://platform.claude.com/settings/usage).
