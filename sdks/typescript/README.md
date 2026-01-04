---
title: "TypeScript SDK README"
source_url: "https://raw.githubusercontent.com/anthropics/anthropic-sdk-typescript/main/README.md"
source_type: "github-raw"
fetched_at: "2026-01-04T05:43:46Z"
category: "sdks"
---

# Anthropic TypeScript API Library

[![NPM version](https://img.shields.io/npm/v/@anthropic-ai/sdk.svg?label=npm%20(stable))](https://npmjs.org/package/@anthropic-ai/sdk)

This library provides convenient access to the Anthropic REST API from server-side TypeScript or JavaScript.

## Installation

```sh
npm install @anthropic-ai/sdk
```

## Usage

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

## Streaming responses

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

## Counting Tokens

```ts
const message = await client.messages.create(...)
console.log(message.usage)
// { input_tokens: 25, output_tokens: 13 }
```

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
```

## Error Handling

| Status Code | Error Type                 |
| ----------- | -------------------------- |
| 400         | `BadRequestError`          |
| 401         | `AuthenticationError`      |
| 403         | `PermissionDeniedError`    |
| 404         | `NotFoundError`            |
| 429         | `RateLimitError`           |
| >=500       | `InternalServerError`      |

## Requirements

- TypeScript >= 4.9
- Node.js 20 LTS or later
- Deno v1.28.0 or higher
- Bun 1.0 or later

For more information, see [docs.anthropic.com](https://docs.anthropic.com/).
