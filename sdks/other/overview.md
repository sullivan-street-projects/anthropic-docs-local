---
title: "CLI, SDKs, and Libraries"
source_url: "https://platform.claude.com/docs/en/api/client-sdks"
source_type: "web-extracted"
fetched_at: "2026-07-06T00:00:00Z"
category: "sdks"
---

# CLI, SDKs, and Libraries

Official tools for building with the Claude API: the ant CLI, client SDKs in seven languages, and framework-specific libraries.

Anthropic provides three kinds of official tooling for building with the Claude API:

- **CLI:** The `ant` command-line tool for shell scripting and interactive use.
- **Client SDKs:** General-purpose Messages API clients for Python, TypeScript, C#, Go, Java, PHP, and Ruby. Each SDK provides idiomatic interfaces, type safety, and built-in support for streaming, retries, and error handling.
- **Libraries and integrations:** Packages and compatibility layers that expose Claude inside another framework's API surface rather than the Messages API directly.

## CLI

- **ant CLI** -- Shell scripting, typed flags, response transforms ([Quickstart](https://platform.claude.com/docs/en/cli-sdks-libraries/cli/quickstart))

## Client SDKs

| SDK | Description | Documentation |
|:----|:-----------|:--------------|
| Python | Sync and async clients, Pydantic models | [Python SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/python) |
| TypeScript | Node.js, Deno, Bun, and browser support | [TypeScript SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/typescript) |
| C# | .NET Standard 2.0+, IChatClient integration | [C# SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/csharp) |
| Go | Context-based cancellation, functional options | [Go SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/go) |
| Java | Builder pattern, CompletableFuture async | [Java SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/java) |
| PHP | Value objects, builder pattern | [PHP SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/php) |
| Ruby | Sorbet types, streaming helpers | [Ruby SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/ruby) |

## Libraries and Integrations

Libraries and integrations expose Claude through another framework's API surface. They are not general-purpose Messages API clients.

| Library | Description | Documentation |
|:--------|:-----------|:--------------|
| Apple Foundation Models | Swift package for Apple's LanguageModelSession API (beta) | [Apple Foundation Models](https://platform.claude.com/docs/en/cli-sdks-libraries/libraries/apple-foundation-models) |
| OpenAI SDK compatibility | Use Claude through the OpenAI SDK surface | [OpenAI SDK compatibility](https://platform.claude.com/docs/en/cli-sdks-libraries/libraries/openai-sdk) |

## Platform Support

All SDKs support multiple deployment options:
- **Claude API** -- Direct access to Claude API endpoints
- **Claude Platform on AWS** -- Uses Claude API model IDs with AWS billing and IAM authentication
- **Amazon Bedrock** -- Use Claude through AWS
- **Google Cloud** -- Use Claude through Google Cloud
- **Microsoft Foundry** -- Use Claude through Microsoft Azure

## SDK Features

All SDKs provide:
- Automatic header management (x-api-key, anthropic-version, content-type)
- Type-safe request and response handling
- Built-in retry logic and error handling
- Streaming support
- Request timeouts and connection management

## GitHub Repositories

- [anthropic-sdk-python](https://github.com/anthropics/anthropic-sdk-python)
- [anthropic-sdk-typescript](https://github.com/anthropics/anthropic-sdk-typescript)
- [anthropic-sdk-java](https://github.com/anthropics/anthropic-sdk-java)
- [anthropic-sdk-go](https://github.com/anthropics/anthropic-sdk-go)
- [anthropic-sdk-ruby](https://github.com/anthropics/anthropic-sdk-ruby)
- [anthropic-sdk-csharp](https://github.com/anthropics/anthropic-sdk-csharp)
- [anthropic-sdk-php](https://github.com/anthropics/anthropic-sdk-php)
