---
title: "Other SDKs Overview"
source_url: "https://platform.claude.com/docs/en/api/client-sdks"
source_type: "web-extracted"
fetched_at: "2026-03-22T00:00:00Z"
category: "sdks"
---

# Client SDKs

Official SDKs for building with the Claude API in Python, TypeScript, Java, Go, Ruby, C#, and PHP.

## SDK Overview

| SDK | Status | Install | Min Version |
|:----|:-------|:--------|:------------|
| Python | GA | `pip install anthropic` | Python 3.9+ |
| TypeScript | GA | `npm install @anthropic-ai/sdk` | TypeScript 4.9+, Node.js 20+ |
| Java | GA | `com.anthropic:anthropic-java:2.15.0` | Java 8+ |
| Go | GA | `go get github.com/anthropics/anthropic-sdk-go` | Go 1.22+ |
| Ruby | GA | `bundler add anthropic` | Ruby 3.2.0+ |
| C# | Beta | `dotnet add package Anthropic` | .NET Standard 2.0 |
| PHP | Beta | `composer require anthropic-ai/sdk` | PHP 8.1.0+ |

## Quick Start

### Python
```python
import anthropic

client = anthropic.Anthropic()
message = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello, Claude"}],
)
print(message.content)
```

### TypeScript
```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();
const message = await client.messages.create({
  model: "claude-opus-4-6",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello, Claude" }]
});
console.log(message.content);
```

### Java
```java
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCreateParams params = MessageCreateParams.builder()
    .model(Model.CLAUDE_OPUS_4_6)
    .maxTokens(1024L)
    .addUserMessage("Hello, Claude")
    .build();
Message message = client.messages().create(params);
```

### Go
```go
client := anthropic.NewClient()
message, _ := client.Messages.New(context.Background(), anthropic.MessageNewParams{
    Model:     anthropic.ModelClaudeOpus4_6,
    MaxTokens: 1024,
    Messages: []anthropic.MessageParam{
        anthropic.NewUserMessage(anthropic.NewTextBlock("Hello, Claude")),
    },
})
```

### Ruby
```ruby
client = Anthropic::Client.new
message = client.messages.create(
  model: "claude-opus-4-6",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello, Claude" }]
)
```

### C#
```csharp
var client = new AnthropicClient();
var message = await client.Messages.Create(new MessageCreateParams {
    Model = "claude-opus-4-6",
    MaxTokens = 1024,
    Messages = [new() { Role = Role.User, Content = "Hello, Claude" }]
});
```

### PHP
```php
$client = new Client(apiKey: getenv('ANTHROPIC_API_KEY'));
$message = $client->messages->create(
    model: 'claude-opus-4-6',
    maxTokens: 1024,
    messages: [['role' => 'user', 'content' => 'Hello, Claude']],
);
echo $message->content[0]->text;
```

## Platform Support

All SDKs support multiple deployment options:
- **Claude API** -- Direct access to Claude API endpoints
- **Amazon Bedrock** -- Use Claude through AWS
- **Google Vertex AI** -- Use Claude through Google Cloud
- **Microsoft Foundry** -- Use Claude through Microsoft Azure

## Beta Features

Access beta features using the `beta` namespace in any SDK. See [Beta headers](https://platform.claude.com/docs/en/api/beta-headers) for available beta features.

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
