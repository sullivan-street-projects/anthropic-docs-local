---
title: "TypeScript SDK README"
source_url: "https://raw.githubusercontent.com/anthropics/anthropic-sdk-typescript/main/README.md"
source_type: "github-raw"
fetched_at: "2026-02-14T00:00:00Z"
category: "sdks"
---

# Claude SDK for TypeScript

[![NPM version](https://img.shields.io/npm/v/@anthropic-ai/sdk.svg?label=npm%20(stable))](https://npmjs.org/package/@anthropic-ai/sdk) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@anthropic-ai/sdk)

This library provides convenient access to the Claude API from TypeScript or JavaScript.

The full API documentation can be found at [platform.claude.com/docs](https://platform.claude.com/docs/en/api/typescript/messages/create) or in [api.md](api.md).

## Installation

```sh
npm install @anthropic-ai/sdk
```

## Basic Usage

```js
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const message = await client.messages.create({
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Hello, Claude' }],
  model: 'claude-sonnet-4-5-20250929',
});

console.log(message.content);
```

## Streaming

```ts
const stream = await client.messages.create({
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Hello, Claude' }],
  model: 'claude-sonnet-4-5-20250929',
  stream: true,
});
for await (const messageStreamEvent of stream) {
  console.log(messageStreamEvent.type);
}
```

To cancel a stream: `break` from the loop or call `stream.controller.abort()`.

### Streaming Helpers

```ts
const stream = client.messages
  .stream({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1024,
    messages: [{ role: 'user', content: 'Say hello there!' }],
  })
  .on('text', (text) => {
    console.log(text);
  });

const message = await stream.finalMessage();
```

## Tool Helpers

```ts
import { betaZodTool } from '@anthropic-ai/sdk/helpers/beta/zod';
import { z } from 'zod';

const weatherTool = betaZodTool({
  name: 'get_weather',
  inputSchema: z.object({ location: z.string() }),
  description: 'Get the current weather in a given location',
  run: (input) => `The weather in ${input.location} is foggy and 60°F`,
});

const finalMessage = await client.beta.messages.toolRunner({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1000,
  messages: [{ role: 'user', content: 'What is the weather in San Francisco?' }],
  tools: [weatherTool],
});
```

## Message Batches

```ts
await client.messages.batches.create({
  requests: [
    {
      custom_id: 'my-first-request',
      params: {
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 1024,
        messages: [{ role: 'user', content: 'Hello, world' }],
      },
    },
  ],
});

// Get results
const results = await client.messages.batches.results(batch_id);
for await (const entry of results) {
  if (entry.result.type === 'succeeded') {
    console.log(entry.result.message.content);
  }
}
```

## File Uploads

```ts
import fs from 'fs';
import Anthropic, { toFile } from '@anthropic-ai/sdk';

await client.beta.files.upload({
  file: await toFile(fs.createReadStream('/path/to/file'), undefined, { type: 'application/json' }),
  betas: ['files-api-2025-04-14'],
});
```

## Error Handling

```ts
const message = await client.messages
  .create({
    max_tokens: 1024,
    messages: [{ role: 'user', content: 'Hello, Claude' }],
    model: 'claude-sonnet-4-5-20250929',
  })
  .catch(async (err) => {
    if (err instanceof Anthropic.APIError) {
      console.log(err.status); // 400
      console.log(err.name); // BadRequestError
      console.log(err.headers); // {server: 'nginx', ...}
    } else {
      throw err;
    }
  });
```

| Status Code | Error Type                 |
| ----------- | -------------------------- |
| 400         | `BadRequestError`          |
| 401         | `AuthenticationError`      |
| 403         | `PermissionDeniedError`    |
| 404         | `NotFoundError`            |
| 422         | `UnprocessableEntityError` |
| 429         | `RateLimitError`           |
| >=500       | `InternalServerError`      |

## Retries & Timeouts

Default: 2 retries with exponential backoff. Default timeout: 10 minutes (scales with `max_tokens` for non-streaming).

```ts
const client = new Anthropic({
  maxRetries: 0, // Disable retries
  timeout: 20 * 1000, // 20 seconds
});
```

## Logging

Set `ANTHROPIC_LOG=debug` or use the `logLevel` option:

```ts
const client = new Anthropic({ logLevel: 'debug' });
```

Available levels: `'debug'`, `'info'`, `'warn'`, `'error'`, `'off'`

## Platform Support

- **AWS Bedrock**: Available through [separate package](https://github.com/anthropics/anthropic-sdk-typescript/tree/main/packages/bedrock-sdk)
- **Google Vertex AI**: Supported
- **Proxies**: Configurable via `fetchOptions` with runtime-specific options

## Beta Features

Access beta features through the `beta` property with appropriate beta headers:

```ts
const response = await client.beta.messages.create({
  max_tokens: 1024,
  model: 'claude-sonnet-4-5-20250929',
  messages: [{ role: 'user', content: "What's 4242424242 * 4242424242?" }],
  tools: [{ name: 'code_execution', type: 'code_execution_20250522' }],
  betas: ['code-execution-2025-05-22'],
});
```

## Requirements

- TypeScript >= 4.9
- Node.js 20 LTS or later (non-EOL versions)
- Deno v1.28.0+, Bun 1.0+
- Cloudflare Workers, Vercel Edge Runtime
- Jest 28+ with "node" environment

For more information, see [docs.anthropic.com](https://docs.anthropic.com/).
