---
title: "Vision API"
source_url: "https://platform.claude.com/docs/en/build-with-claude/vision"
source_type: "web-extracted"
fetched_at: "2026-07-27T00:00:00Z"
category: "api"
---

# Vision

Claude's vision capabilities allow it to understand and analyze images, enabling multimodal interactions across a wide range of use cases including document analysis, chart interpretation, image description, and visual reasoning.

This guide describes how to send images to Claude, the limits and costs that apply, and where to find guidance for [coordinate-based workflows](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates).

## Send images to Claude

- **claude.ai**: Upload or drag-and-drop images directly into the chat interface.
- **Console Workbench**: Use the image button at the top-right of User message blocks.
- **API**: Include image content blocks in the `messages` array.

On the API, provide images to Claude as `image` content blocks using one of three source types:

1. A base64-encoded image embedded in the request body
2. A URL reference to an image hosted online
3. A `file_id` returned by the Files API (upload once, reference many times)

> On Amazon Bedrock and Google Cloud, only base64-encoded sources are currently available.

> Just as placing long documents before your query improves results in text prompts, Claude works best when images come before text. Images placed after text or interpolated with text still perform well, but if your use case allows it, prefer an image-then-text structure.

### Base64 Encoded Image

Embed the image data directly in the request:

**cURL**

```bash
#!/bin/bash
IMAGE_BASE64=$(base64 -i image.jpg)

curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-opus-5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "image",
            "source": {
              "type": "base64",
              "media_type": "image/jpeg",
              "data": "'$IMAGE_BASE64'"
            }
          },
          {
            "type": "text",
            "text": "Describe this image in detail."
          }
        ]
      }
    ]
  }'
```

**CLI (ant)**

```bash
cat image.jpg | ant messages create \
  --model claude-opus-5 \
  --max-tokens 1024 \
  --image - \
  --text "Describe this image in detail."
```

**Python**

```python
import anthropic
import base64

client = anthropic.Anthropic()

with open("image.jpg", "rb") as f:
    image_data = base64.standard_b64encode(f.read()).decode("utf-8")

message = client.messages.create(
    model="claude-opus-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/jpeg",
                        "data": image_data,
                    },
                },
                {
                    "type": "text",
                    "text": "Describe this image in detail."
                }
            ],
        }
    ],
)
print(message.content[0].text)
```

**TypeScript**

```typescript
import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";

const client = new Anthropic();

const imageData = fs.readFileSync("image.jpg").toString("base64");

const message = await client.messages.create({
  model: "claude-opus-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "image",
          source: {
            type: "base64",
            media_type: "image/jpeg",
            data: imageData,
          },
        },
        {
          type: "text",
          text: "Describe this image in detail.",
        },
      ],
    },
  ],
});
console.log(message.content[0].text);
```

**C#**

```csharp
using Anthropic;

var client = new AnthropicClient();

var imageBytes = File.ReadAllBytes("image.jpg");
var imageData = Convert.ToBase64String(imageBytes);

var message = await client.Messages.CreateAsync(new()
{
    Model = "claude-opus-5",
    MaxTokens = 1024,
    Messages = [
        new()
        {
            Role = "user",
            Content = [
                new ImageContent
                {
                    Source = new Base64ImageSource
                    {
                        MediaType = "image/jpeg",
                        Data = imageData,
                    },
                },
                new TextContent { Text = "Describe this image in detail." },
            ],
        },
    ],
});
Console.WriteLine(message.Content[0].Text);
```

**Go**

```go
package main

import (
	"encoding/base64"
	"fmt"
	"os"

	"github.com/anthropics/anthropic-sdk-go"
)

func main() {
	client := anthropic.NewClient()

	imageBytes, _ := os.ReadFile("image.jpg")
	imageData := base64.StdEncoding.EncodeToString(imageBytes)

	message, _ := client.Messages.New(ctx, anthropic.MessageNewParams{
		Model:     "claude-opus-5",
		MaxTokens: 1024,
		Messages: []anthropic.MessageParam{
			anthropic.NewUserMessage(
				anthropic.NewBase64ImageBlockParam(imageData, "image/jpeg"),
				anthropic.NewTextBlock("Describe this image in detail."),
			),
		},
	})
	fmt.Println(message.Content[0].Text)
}
```

**Java**

```java
import com.anthropic.client.AnthropicClient;
import com.anthropic.models.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.List;

AnthropicClient client = AnthropicClient.builder().build();

byte[] imageBytes = Files.readAllBytes(Path.of("image.jpg"));
String imageData = Base64.getEncoder().encodeToString(imageBytes);

MessageCreateParams params = MessageCreateParams.builder()
    .model("claude-opus-5")
    .maxTokens(1024)
    .messages(List.of(
        MessageCreateParams.Message.builder()
            .role("user")
            .content(List.of(
                ImageBlockParam.builder()
                    .source(Base64ImageSource.builder()
                        .mediaType("image/jpeg")
                        .data(imageData)
                        .build())
                    .build(),
                TextBlockParam.builder()
                    .text("Describe this image in detail.")
                    .build()
            ))
            .build()
    ))
    .build();

Message message = client.messages().create(params);
System.out.println(message.getContent().get(0).getText());
```

**PHP**

```php
$client = Anthropic::client();

$imageData = base64_encode(file_get_contents('image.jpg'));

$message = $client->messages()->create([
    'model' => 'claude-opus-5',
    'max_tokens' => 1024,
    'messages' => [
        [
            'role' => 'user',
            'content' => [
                [
                    'type' => 'image',
                    'source' => [
                        'type' => 'base64',
                        'media_type' => 'image/jpeg',
                        'data' => $imageData,
                    ],
                ],
                [
                    'type' => 'text',
                    'text' => 'Describe this image in detail.',
                ],
            ],
        ],
    ],
]);
echo $message->content[0]->text;
```

**Ruby**

```ruby
require "anthropic"

client = Anthropic::Client.new

image_data = Base64.strict_encode64(File.read("image.jpg"))

message = client.messages.create(
  model: "claude-opus-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "image",
          source: {
            type: "base64",
            media_type: "image/jpeg",
            data: image_data,
          },
        },
        {
          type: "text",
          text: "Describe this image in detail.",
        },
      ],
    },
  ],
)
puts message.content[0].text
```

### URL Reference

Provide a publicly accessible URL. Anthropic fetches the image server-side:

**cURL**

```bash
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-opus-5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "image",
            "source": {
              "type": "url",
              "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
            }
          },
          {
            "type": "text",
            "text": "What type of insect is this?"
          }
        ]
      }
    ]
  }'
```

**CLI (ant)**

```bash
ant messages create \
  --model claude-opus-5 \
  --max-tokens 1024 \
  --image-url "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg" \
  --text "What type of insect is this?"
```

**Python**

```python
message = client.messages.create(
    model="claude-opus-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "url",
                        "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg",
                    },
                },
                {
                    "type": "text",
                    "text": "What type of insect is this?"
                }
            ],
        }
    ],
)
```

**TypeScript**

```typescript
const message = await client.messages.create({
  model: "claude-opus-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "image",
          source: {
            type: "url",
            url: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg",
          },
        },
        {
          type: "text",
          text: "What type of insect is this?",
        },
      ],
    },
  ],
});
```

**C#**

```csharp
var message = await client.Messages.CreateAsync(new()
{
    Model = "claude-opus-5",
    MaxTokens = 1024,
    Messages = [
        new()
        {
            Role = "user",
            Content = [
                new ImageContent
                {
                    Source = new UrlImageSource
                    {
                        Url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg",
                    },
                },
                new TextContent { Text = "What type of insect is this?" },
            ],
        },
    ],
});
```

**Go**

```go
message, _ := client.Messages.New(ctx, anthropic.MessageNewParams{
    Model:     "claude-opus-5",
    MaxTokens: 1024,
    Messages: []anthropic.MessageParam{
        anthropic.NewUserMessage(
            anthropic.NewURLImageBlockParam("https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"),
            anthropic.NewTextBlock("What type of insect is this?"),
        ),
    },
})
```

**Java**

```java
MessageCreateParams params = MessageCreateParams.builder()
    .model("claude-opus-5")
    .maxTokens(1024)
    .messages(List.of(
        MessageCreateParams.Message.builder()
            .role("user")
            .content(List.of(
                ImageBlockParam.builder()
                    .source(UrlImageSource.builder()
                        .url("https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg")
                        .build())
                    .build(),
                TextBlockParam.builder()
                    .text("What type of insect is this?")
                    .build()
            ))
            .build()
    ))
    .build();

Message message = client.messages().create(params);
```

**PHP**

```php
$message = $client->messages()->create([
    'model' => 'claude-opus-5',
    'max_tokens' => 1024,
    'messages' => [
        [
            'role' => 'user',
            'content' => [
                [
                    'type' => 'image',
                    'source' => [
                        'type' => 'url',
                        'url' => 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg',
                    ],
                ],
                [
                    'type' => 'text',
                    'text' => 'What type of insect is this?',
                ],
            ],
        ],
    ],
]);
```

**Ruby**

```ruby
message = client.messages.create(
  model: "claude-opus-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "image",
          source: {
            type: "url",
            url: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg",
          },
        },
        {
          type: "text",
          text: "What type of insect is this?",
        },
      ],
    },
  ],
)
```

### Files API

Reference an image previously uploaded via the Files API. In multi-turn conversations and agentic workflows, each request resends the full conversation history. If images are base64-encoded, the full image bytes are included in the payload on every turn. Uploading images to the Files API and referencing them by `file_id` keeps request payloads small regardless of how many images accumulate in the conversation history.

**cURL**

```bash
# Step 1: Upload the file
FILE_RESPONSE=$(curl -s https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -F "file=@image.jpg" \
  -F 'purpose=vision')

FILE_ID=$(echo "$FILE_RESPONSE" | jq -r '.id')

# Step 2: Use the file in a message
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-opus-5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "image",
            "source": {
              "type": "file",
              "file_id": "'$FILE_ID'"
            }
          },
          {
            "type": "text",
            "text": "Describe this image in detail."
          }
        ]
      }
    ]
  }'
```

**CLI (ant)**

```bash
# Upload and use in one command
ant files upload image.jpg --purpose vision | \
  ant messages create \
    --model claude-opus-5 \
    --max-tokens 1024 \
    --file-image - \
    --text "Describe this image in detail."
```

**Python**

```python
import anthropic

client = anthropic.Anthropic()

# Step 1: Upload the file
uploaded_file = client.files.create(
    file=open("image.jpg", "rb"),
    purpose="vision",
)

# Step 2: Use the file in a message
message = client.messages.create(
    model="claude-opus-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "file",
                        "file_id": uploaded_file.id,
                    },
                },
                {
                    "type": "text",
                    "text": "Describe this image in detail."
                }
            ],
        }
    ],
)
print(message.content[0].text)
```

**TypeScript**

```typescript
import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";

const client = new Anthropic();

// Step 1: Upload the file
const uploadedFile = await client.files.create({
  file: fs.createReadStream("image.jpg"),
  purpose: "vision",
});

// Step 2: Use the file in a message
const message = await client.messages.create({
  model: "claude-opus-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "image",
          source: {
            type: "file",
            file_id: uploadedFile.id,
          },
        },
        {
          type: "text",
          text: "Describe this image in detail.",
        },
      ],
    },
  ],
});
console.log(message.content[0].text);
```

**C#**

```csharp
var client = new AnthropicClient();

// Step 1: Upload the file
var uploadedFile = await client.Files.CreateAsync(new()
{
    File = File.OpenRead("image.jpg"),
    Purpose = "vision",
});

// Step 2: Use the file in a message
var message = await client.Messages.CreateAsync(new()
{
    Model = "claude-opus-5",
    MaxTokens = 1024,
    Messages = [
        new()
        {
            Role = "user",
            Content = [
                new ImageContent
                {
                    Source = new FileImageSource
                    {
                        FileId = uploadedFile.Id,
                    },
                },
                new TextContent { Text = "Describe this image in detail." },
            ],
        },
    ],
});
Console.WriteLine(message.Content[0].Text);
```

**Go**

```go
client := anthropic.NewClient()

// Step 1: Upload the file
file, _ := os.Open("image.jpg")
uploadedFile, _ := client.Files.New(ctx, anthropic.FileNewParams{
    File:    file,
    Purpose: "vision",
})

// Step 2: Use the file in a message
message, _ := client.Messages.New(ctx, anthropic.MessageNewParams{
    Model:     "claude-opus-5",
    MaxTokens: 1024,
    Messages: []anthropic.MessageParam{
        anthropic.NewUserMessage(
            anthropic.NewFileImageBlockParam(uploadedFile.ID),
            anthropic.NewTextBlock("Describe this image in detail."),
        ),
    },
})
fmt.Println(message.Content[0].Text)
```

**Java**

```java
AnthropicClient client = AnthropicClient.builder().build();

// Step 1: Upload the file
FileCreateParams fileParams = FileCreateParams.builder()
    .file(Path.of("image.jpg"))
    .purpose("vision")
    .build();

FileObject uploadedFile = client.files().create(fileParams);

// Step 2: Use the file in a message
MessageCreateParams params = MessageCreateParams.builder()
    .model("claude-opus-5")
    .maxTokens(1024)
    .messages(List.of(
        MessageCreateParams.Message.builder()
            .role("user")
            .content(List.of(
                ImageBlockParam.builder()
                    .source(FileImageSource.builder()
                        .fileId(uploadedFile.getId())
                        .build())
                    .build(),
                TextBlockParam.builder()
                    .text("Describe this image in detail.")
                    .build()
            ))
            .build()
    ))
    .build();

Message message = client.messages().create(params);
System.out.println(message.getContent().get(0).getText());
```

**PHP**

```php
$client = Anthropic::client();

// Step 1: Upload the file
$uploadedFile = $client->files()->create([
    'file' => fopen('image.jpg', 'r'),
    'purpose' => 'vision',
]);

// Step 2: Use the file in a message
$message = $client->messages()->create([
    'model' => 'claude-opus-5',
    'max_tokens' => 1024,
    'messages' => [
        [
            'role' => 'user',
            'content' => [
                [
                    'type' => 'image',
                    'source' => [
                        'type' => 'file',
                        'file_id' => $uploadedFile->id,
                    ],
                ],
                [
                    'type' => 'text',
                    'text' => 'Describe this image in detail.',
                ],
            ],
        ],
    ],
]);
echo $message->content[0]->text;
```

**Ruby**

```ruby
client = Anthropic::Client.new

# Step 1: Upload the file
uploaded_file = client.files.create(
  file: File.open("image.jpg"),
  purpose: "vision",
)

# Step 2: Use the file in a message
message = client.messages.create(
  model: "claude-opus-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "image",
          source: {
            type: "file",
            file_id: uploaded_file.id,
          },
        },
        {
          type: "text",
          text: "Describe this image in detail.",
        },
      ],
    },
  ],
)
puts message.content[0].text
```

## Multiple Images

Send multiple images in a single request by including multiple image content blocks:

**cURL**

```bash
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-opus-5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": [
          {"type": "text", "text": "Image 1:"},
          {
            "type": "image",
            "source": {"type": "base64", "media_type": "image/png", "data": "'$IMAGE1_BASE64'"}
          },
          {"type": "text", "text": "Image 2:"},
          {
            "type": "image",
            "source": {"type": "base64", "media_type": "image/png", "data": "'$IMAGE2_BASE64'"}
          },
          {"type": "text", "text": "How are these images different?"}
        ]
      }
    ]
  }'
```

**CLI (ant)**

```bash
ant messages create \
  --model claude-opus-5 \
  --max-tokens 1024 \
  --text "Image 1:" --image image1.png \
  --text "Image 2:" --image image2.png \
  --text "How are these images different?"
```

**Python**

```python
message = client.messages.create(
    model="claude-opus-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Image 1:"},
                {
                    "type": "image",
                    "source": {"type": "base64", "media_type": "image/png", "data": image1_data},
                },
                {"type": "text", "text": "Image 2:"},
                {
                    "type": "image",
                    "source": {"type": "base64", "media_type": "image/png", "data": image2_data},
                },
                {
                    "type": "text",
                    "text": "How are these images different?"
                }
            ],
        }
    ],
)
```

**TypeScript**

```typescript
const message = await client.messages.create({
  model: "claude-opus-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "Image 1:" },
        {
          type: "image",
          source: { type: "base64", media_type: "image/png", data: image1Data },
        },
        { type: "text", text: "Image 2:" },
        {
          type: "image",
          source: { type: "base64", media_type: "image/png", data: image2Data },
        },
        { type: "text", text: "How are these images different?" },
      ],
    },
  ],
});
```

**C#**

```csharp
var message = await client.Messages.CreateAsync(new()
{
    Model = "claude-opus-5",
    MaxTokens = 1024,
    Messages = [
        new()
        {
            Role = "user",
            Content = [
                new TextContent { Text = "Image 1:" },
                new ImageContent
                {
                    Source = new Base64ImageSource { MediaType = "image/png", Data = image1Data },
                },
                new TextContent { Text = "Image 2:" },
                new ImageContent
                {
                    Source = new Base64ImageSource { MediaType = "image/png", Data = image2Data },
                },
                new TextContent { Text = "How are these images different?" },
            ],
        },
    ],
});
```

**Go**

```go
message, _ := client.Messages.New(ctx, anthropic.MessageNewParams{
    Model:     "claude-opus-5",
    MaxTokens: 1024,
    Messages: []anthropic.MessageParam{
        anthropic.NewUserMessage(
            anthropic.NewTextBlock("Image 1:"),
            anthropic.NewBase64ImageBlockParam(image1Data, "image/png"),
            anthropic.NewTextBlock("Image 2:"),
            anthropic.NewBase64ImageBlockParam(image2Data, "image/png"),
            anthropic.NewTextBlock("How are these images different?"),
        ),
    },
})
```

**Java**

```java
MessageCreateParams params = MessageCreateParams.builder()
    .model("claude-opus-5")
    .maxTokens(1024)
    .messages(List.of(
        MessageCreateParams.Message.builder()
            .role("user")
            .content(List.of(
                TextBlockParam.builder().text("Image 1:").build(),
                ImageBlockParam.builder()
                    .source(Base64ImageSource.builder()
                        .mediaType("image/png").data(image1Data).build())
                    .build(),
                TextBlockParam.builder().text("Image 2:").build(),
                ImageBlockParam.builder()
                    .source(Base64ImageSource.builder()
                        .mediaType("image/png").data(image2Data).build())
                    .build(),
                TextBlockParam.builder().text("How are these images different?").build()
            ))
            .build()
    ))
    .build();

Message message = client.messages().create(params);
```

**PHP**

```php
$message = $client->messages()->create([
    'model' => 'claude-opus-5',
    'max_tokens' => 1024,
    'messages' => [
        [
            'role' => 'user',
            'content' => [
                ['type' => 'text', 'text' => 'Image 1:'],
                [
                    'type' => 'image',
                    'source' => ['type' => 'base64', 'media_type' => 'image/png', 'data' => $image1Data],
                ],
                ['type' => 'text', 'text' => 'Image 2:'],
                [
                    'type' => 'image',
                    'source' => ['type' => 'base64', 'media_type' => 'image/png', 'data' => $image2Data],
                ],
                ['type' => 'text', 'text' => 'How are these images different?'],
            ],
        ],
    ],
]);
```

**Ruby**

```ruby
message = client.messages.create(
  model: "claude-opus-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "Image 1:" },
        {
          type: "image",
          source: { type: "base64", media_type: "image/png", data: image1_data },
        },
        { type: "text", text: "Image 2:" },
        {
          type: "image",
          source: { type: "base64", media_type: "image/png", data: image2_data },
        },
        { type: "text", text: "How are these images different?" },
      ],
    },
  ],
)
```

In a multi-turn conversation, add new images in later `user` turns the same way. Claude has access to every image from earlier turns, so follow-up questions work without including the earlier images again.

## Image Limits

### Request Limits

The maximum number of images per message or request is:

- 20 per message on claude.ai.
- 100 per request on the API, for models with a 200k-token context window.
- 600 per request on the API, for all other models.

The maximum dimensions per image are 8000x8000 px.

### Many-image dimension limit

If a single API request contains more than 20 images, a stricter per-image dimension limit applies. Images exceeding the stricter limit are rejected with an `invalid_request_error`. To stay under the limit on all platforms, either resize each image so that neither dimension exceeds 2000 px, or keep the request to 20 or fewer image and document blocks. On Amazon Bedrock and Google Cloud Vertex AI, document blocks also count toward this threshold.

### Max size per image

The maximum size per image is:

- 10 MB (base64-encoded) when using the Claude API directly.
- 5 MB (base64-encoded) on Amazon Bedrock and Google Cloud.
- 10 MB on claude.ai.

> Although the API supports up to 600 images per request, request size limits (32 MB for standard endpoints; lower on some partner-operated platforms) can be reached first. For many images, consider uploading with the Files API and referencing by `file_id` to keep request payloads small.

### Image quality guidance

- **Image clarity**: Use clear, high-quality images. Blurry, pixelated, or very low-resolution images degrade performance.
- **Text legibility**: Ensure text in images is legible at the resolution you provide. If text is too small to read at the native resolution, Claude may struggle to extract it accurately.
- **Resizing considerations**: Pre-resize images to control token costs and avoid unexpected quality changes. If you do not need high-resolution fidelity, downsample images before sending.
- **Compression trade-offs**: Lossy formats like JPEG or WebP can reduce latency and payload size, but heavy compression can make text difficult to read and fine details harder to distinguish.

## Supported Formats

| Format | MIME Type    |
| :----- | :----------- |
| JPEG   | `image/jpeg` |
| PNG    | `image/png`  |
| GIF    | `image/gif`  |
| WebP   | `image/webp` |

Animations are unsupported, and only the first frame is used.

## Resolution and Token Cost

Claude views images in patches instead of pixels. Each patch is a 28x28-pixel block, referred to as a visual token. An image costs `ceil(width / 28) x ceil(height / 28)` visual tokens.

Each model has a maximum native image resolution, expressed as a long-edge limit and a visual-token limit. Images larger than either limit are downscaled before processing.

| Resolution Tier | Models                   | Max Long Edge | Max Visual Tokens |
| :-------------- | :----------------------- | :------------ | :---------------- |
| High-resolution | Claude 4.7 and later models | 2576 px       | 4784              |
| Standard        | All other models         | 1568 px       | 1568              |

High-resolution support is automatic on the listed models and requires no beta header or client-side opt-in.

The following table shows the visual-token cost for several image sizes on each tier:

| Image Size             | Standard tier: downsized to | Standard tier: tokens | High-res tier: downsized to | High-res tier: tokens |
| :--------------------- | :-------------------------- | :-------------------- | :-------------------------- | :-------------------- |
| 200x200 (0.04 MP)     | Not resized                 | 64                    | Not resized                 | 64                    |
| 1000x1000 (1 MP)      | Not resized                 | 1296                  | Not resized                 | 1296                  |
| 1092x1092 (1.19 MP)   | Not resized                 | 1521                  | Not resized                 | 1521                  |
| 1920x1080 (2.07 MP)   | 1456x819 px                 | 1560                  | Not resized                 | 2691                  |
| 2000x1500 (3 MP)      | 1269x952 px                 | 1564                  | Not resized                 | 3888                  |
| 3840x2160 (8.29 MP)   | 1456x819 px                 | 1560                  | 2576x1449 px                | 4784                  |

To estimate cost, multiply the visual-token count by the model's per-token input price. For example, a 1000x1000 image (1,296 visual tokens) costs approximately $0.0003 on Haiku 4.5 and $0.02 on Opus 5.

High-resolution images can use up to roughly three times more visual tokens than the same image on a standard-tier model. If you don't need the additional fidelity, downsample images before sending to control token costs.

## Coordinates and Bounding Boxes

For bounding boxes, points, and pixel coordinates, see [Coordinates and bounding boxes](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates). Claude returns absolute pixel coordinates relative to the image it sees after resizing; that guide covers how Claude resizes and pads images and how to pre-resize or rescale so coordinates line up with your original image.

## Limitations

- **People identification**: Claude cannot identify (name) people in images. It can describe physical attributes but will not match faces to identities.
- **Accuracy**: May hallucinate or misinterpret details, especially on blurry, low-resolution, or heavily compressed images.
- **Spatial reasoning**: Claude's coordinate and localization outputs are approximate. Follow the guidance in [Coordinates and bounding boxes](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates) and verify outputs before relying on them.
- **Counting**: Provides approximate counts of objects in an image but may not always be precisely accurate, especially with large numbers of small objects.
- **AI-generated images**: Cannot reliably detect whether an image is AI-generated or synthetic. Do not rely on it to detect fake or synthetic images.
- **Inappropriate content**: Will not process images that violate the Acceptable Use Policy.
- **Healthcare**: Not a substitute for professional medical image interpretation or diagnosis. Although Claude can analyze general medical images, it is not designed to interpret complex diagnostic scans such as CTs or MRIs.
- **Image generation**: Claude cannot generate, edit, create, or modify images. It is an image understanding model only.

## FAQ

| Question | Answer |
| :--- | :--- |
| What file types are supported? | JPEG, PNG, GIF, and WebP. |
| Can Claude read images from URLs? | Yes, via `"source": {"type": "url", "url": "..."}`. URL sources are not available on Amazon Bedrock or Google Cloud. |
| What are the size limits? | API: 10 MB per image (5 MB on Bedrock/Google Cloud). claude.ai: 10 MB per image. |
| How many images can I send? | API: up to 600 per request (100 for 200k-token context models). claude.ai: up to 20 per turn. |
| Does Claude receive image metadata? | No. EXIF data and other metadata are stripped before processing. |
| Can I delete uploaded images? | Images sent via base64 or URL are ephemeral and not stored after the request completes. Files uploaded via the Files API can be deleted with the delete endpoint. |
| How is my data handled? | See the [Privacy Policy](https://www.anthropic.com/privacy) for details on data handling. Images are processed in accordance with Anthropic's data policies. |
| What if Claude gives the wrong interpretation? | Try providing a higher-quality image, adding context in the text prompt, or breaking complex queries into simpler questions. |
| Can Claude generate images? | No. Claude can only analyze and describe existing images. It cannot generate, edit, or create images. |
