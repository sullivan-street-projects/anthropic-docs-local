---
title: "TypeScript SDK README"
source_url: "https://raw.githubusercontent.com/anthropics/anthropic-sdk-typescript/main/README.md"
source_type: "github-raw"
fetched_at: "2026-01-10T00:00:00Z"
category: "sdks"
---

# Anthropic TypeScript API Library

[![NPM version](https://img.shields.io/npm/v/@anthropic-ai/sdk.svg?label=npm%20(stable))](https://npmjs.org/package/@anthropic-ai/sdk)

Server-side TypeScript/JavaScript library for the Anthropic REST API.

## Installation

```sh
npm install @anthropic-ai/sdk
```

## Basic Usage

```js
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'],
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
for await (const event of stream) {
  console.log(event.type);
}
```

To cancel: `break` from the loop or call `stream.controller.abort()`.

## Tool Helpers

```ts
import { betaZodTool } from '@anthropic-ai/sdk/helpers/beta/zod';
import { z } from 'zod';

const weatherTool = betaZodTool({
  name: 'get_weather',
  inputSchema: z.object({ location: z.string() }),
  description: 'Get the current weather',
  run: (input) => `Weather in ${input.location}: 60F`,
});

const result = await client.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 1000,
  messages: [{ role: 'user', content: 'Weather in SF?' }],
  tools: [weatherTool],
});
```

## Message Batches

```ts
await client.messages.batches.create({
  requests: [
    {
      custom_id: 'my-request',
      params: {
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 1024,
        messages: [{ role: 'user', content: 'Hello' }],
      },
    },
  ],
});
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

| Status Code | Error Type              |
|-------------|-------------------------|
| 400         | `BadRequestError`       |
| 401         | `AuthenticationError`   |
| 403         | `PermissionDeniedError` |
| 404         | `NotFoundError`         |
| 429         | `RateLimitError`        |
| >=500       | `InternalServerError`   |

## Retries & Timeouts

- Default: 2 retries with exponential backoff
- Default timeout: 10 minutes (scales with `max_tokens` for non-streaming)

```ts
const client = new Anthropic({
  maxRetries: 0,  // Disable retries
  timeout: 20 * 1000,  // 20 seconds
});
```

## Logging

Set `ANTHROPIC_LOG=debug` or use the `logLevel` option:

```ts
const client = new Anthropic({ logLevel: 'debug' });
```

## Requirements

- TypeScript >= 4.9
- Node.js 20 LTS or later
- Deno v1.28.0+, Bun 1.0+
- Cloudflare Workers, Vercel Edge Runtime

For more information, see [docs.anthropic.com](https://docs.anthropic.com/).
