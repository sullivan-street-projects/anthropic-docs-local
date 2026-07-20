---
title: "CLI, SDKs, and Libraries"
source_url: "https://platform.claude.com/docs/en/api/client-sdks"
source_type: "web-extracted"
fetched_at: "2026-07-20T00:00:00Z"
category: "sdks"
---

# CLI, SDKs, and Libraries

Official tools for building with the Claude API: the ant CLI, client SDKs in seven languages, and framework-specific libraries.

Anthropic provides three kinds of official tooling for building with the Claude API:

- **CLI:** The `ant` command-line tool for shell scripting and interactive use.
- **Client SDKs:** General-purpose Messages API clients for Python, TypeScript, C#, Go, Java, PHP, and Ruby. Each SDK provides idiomatic interfaces, type safety, and built-in support for streaming, retries, and error handling.
- **Libraries and integrations:** Packages and compatibility layers that expose Claude inside another framework's API surface rather than the Messages API directly.

## CLI

| Tool                                                                             | Description                                       |
| :------------------------------------------------------------------------------- | :------------------------------------------------ |
| [ant CLI](https://platform.claude.com/docs/en/cli-sdks-libraries/cli/quickstart) | Shell scripting, typed flags, response transforms |

## Client SDKs

| SDK                                                                                  | Description                                    |
| :----------------------------------------------------------------------------------- | :--------------------------------------------- |
| [Python](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/python)         | Sync and async clients, Pydantic models        |
| [TypeScript](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/typescript) | Node.js, Deno, Bun, and browser support        |
| [C#](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/csharp)             | .NET Standard 2.0+, IChatClient integration    |
| [Go](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/go)                 | Context-based cancellation, functional options |
| [Java](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/java)             | Builder pattern, CompletableFuture async       |
| [PHP](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/php)               | Value objects, builder pattern                 |
| [Ruby](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/ruby)             | Sorbet types, streaming helpers                |

## Libraries and Integrations

Libraries and integrations expose Claude through another framework's API surface. They are not general-purpose Messages API clients.

| Library                                                                                                             | Description                                          |
| :------------------------------------------------------------------------------------------------------------------ | :--------------------------------------------------- |
| [Apple Foundation Models](https://platform.claude.com/docs/en/cli-sdks-libraries/libraries/apple-foundation-models) | Swift package for Apple's `LanguageModelSession` API |
| [OpenAI SDK compatibility](https://platform.claude.com/docs/en/cli-sdks-libraries/libraries/openai-sdk)             | Use Claude through the OpenAI SDK surface            |

## Building Agents or Using Claude Code?

The CLI, client SDKs, and libraries are for calling the Claude API yourself: you send each request and handle each response. Claude Code, the Claude Agent SDK, and Claude Managed Agents work at a higher level, providing the agent loop, tool execution, and runtime.

| Tool                                                                                 | Description                                               |
| :----------------------------------------------------------------------------------- | :-------------------------------------------------------- |
| [Claude Code](https://code.claude.com/docs/en/overview)                              | Agentic coding tool for delegating coding tasks to Claude |
| [Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview)               | Build agents that run in a process you operate            |
| [Claude Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview) | Run agents in Anthropic's managed infrastructure          |

## GitHub Repositories

- [anthropic-sdk-python](https://github.com/anthropics/anthropic-sdk-python)
- [anthropic-sdk-typescript](https://github.com/anthropics/anthropic-sdk-typescript)
- [anthropic-sdk-java](https://github.com/anthropics/anthropic-sdk-java)
- [anthropic-sdk-go](https://github.com/anthropics/anthropic-sdk-go)
- [anthropic-sdk-ruby](https://github.com/anthropics/anthropic-sdk-ruby)
- [anthropic-sdk-csharp](https://github.com/anthropics/anthropic-sdk-csharp)
- [anthropic-sdk-php](https://github.com/anthropics/anthropic-sdk-php)
