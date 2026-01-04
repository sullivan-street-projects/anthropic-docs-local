---
title: "Other SDKs Overview"
source_url: "https://docs.anthropic.com/en/api/client-sdks"
source_type: "web-extracted"
fetched_at: "2026-01-04T06:25:00Z"
category: "sdks"
---

# Claude Client SDKs

Anthropic provides official client SDKs for multiple programming languages to access Claude APIs.

## Official SDKs

### Python SDK

The primary SDK with full feature support.

```bash
pip install anthropic
```

```python
from anthropic import Anthropic

client = Anthropic()
response = client.messages.create(
    model="claude-opus-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
)
```

- **GitHub**: https://github.com/anthropics/anthropic-sdk-python
- **PyPI**: https://pypi.org/project/anthropic/

### TypeScript/JavaScript SDK

Full-featured SDK for Node.js and browser environments.

```bash
npm install @anthropic-ai/sdk
```

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();
const response = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 1024,
    messages: [{ role: "user", content: "Hello!" }]
});
```

- **GitHub**: https://github.com/anthropics/anthropic-sdk-typescript
- **npm**: https://www.npmjs.com/package/@anthropic-ai/sdk

### Go SDK

Official Go library for server-side applications.

```bash
go get github.com/anthropics/anthropic-sdk-go
```

```go
package main

import (
    "context"
    "github.com/anthropics/anthropic-sdk-go"
    "github.com/anthropics/anthropic-sdk-go/option"
)

func main() {
    client := anthropic.NewClient(
        option.WithAPIKey("my-api-key"),
    )

    message, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
        Model:     anthropic.ModelClaudeOpus4_5,
        MaxTokens: 1024,
        Messages: []anthropic.MessageParam{
            anthropic.NewUserMessage(anthropic.NewTextBlock("Hello!")),
        },
    })
}
```

- **GitHub**: https://github.com/anthropics/anthropic-sdk-go
- **Go Package**: pkg.go.dev/github.com/anthropics/anthropic-sdk-go
- **Requires**: Go 1.22+

### Java SDK

Official Java library available on Maven Central.

**Maven**:
```xml
<dependency>
    <groupId>com.anthropic</groupId>
    <artifactId>anthropic-java</artifactId>
    <version>2.11.1</version>
</dependency>
```

**Gradle**:
```groovy
implementation 'com.anthropic:anthropic-java:2.11.1'
```

```java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.*;

AnthropicClient client = AnthropicOkHttpClient.builder()
    .apiKey("my-api-key")
    .build();

Message message = client.messages().create(MessageCreateParams.builder()
    .model("claude-opus-4-5")
    .maxTokens(1024)
    .addUserMessage("Hello!")
    .build());
```

- **GitHub**: https://github.com/anthropics/anthropic-sdk-java
- **Maven Central**: https://central.sonatype.com/artifact/com.anthropic/anthropic-java
- **License**: MIT

### C# SDK (Beta)

.NET SDK currently in beta.

```bash
dotnet add package Anthropic
```

- **GitHub**: https://github.com/anthropics/anthropic-sdk-dotnet
- **NuGet**: https://www.nuget.org/packages/Anthropic

### PHP SDK (Beta)

PHP SDK currently in beta.

```bash
composer require anthropic/sdk
```

- **GitHub**: https://github.com/anthropics/anthropic-sdk-php
- **Packagist**: https://packagist.org/packages/anthropic/sdk

## Partner Platform Support

Claude is available through partner platforms with SDK support:

### Amazon Bedrock

```python
from anthropic import AnthropicBedrock

client = AnthropicBedrock()
response = client.messages.create(
    model="anthropic.claude-opus-4-5-20251101-v1:0",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
)
```

### Google Cloud Vertex AI

```python
from anthropic import AnthropicVertex

client = AnthropicVertex(region="us-central1", project_id="my-project")
response = client.messages.create(
    model="claude-opus-4-5@20251101",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
)
```

## Community Libraries

### Kotlin (Klaude)

Unofficial community-maintained Kotlin/Java library.

```kotlin
// Maven
implementation("com.klaude:klaude:0.0.1")
```

- **GitHub**: https://github.com/paulotaylor/klaude
- **Note**: Not officially affiliated with Anthropic

## SDK Features Comparison

| Feature | Python | TypeScript | Go | Java | C# | PHP |
|---------|--------|------------|-----|------|-----|-----|
| Messages API | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Streaming | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tool Use | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Vision | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Bedrock | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Vertex AI | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Extended Thinking | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Prompt Caching | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Beta Status | Stable | Stable | Stable | Stable | Beta | Beta |

## Authentication

All SDKs support API key authentication:

```bash
export ANTHROPIC_API_KEY="your-api-key"
```

Or pass directly to client constructor.

## Resources

- **API Reference**: https://docs.anthropic.com/en/api
- **Python SDK Docs**: See sdks/python/README.md
- **TypeScript SDK Docs**: See sdks/typescript/README.md
