---
title: "Vision API"
source_url: "https://platform.claude.com/docs/en/build-with-claude/vision"
source_type: "web-extracted"
fetched_at: "2026-03-10T00:00:00Z"
category: "api"
---

# Vision

Claude's vision capabilities allow it to understand and analyze images, enabling multimodal interactions across a wide range of use cases including document analysis, chart interpretation, image description, and visual reasoning.

## How to Use Vision

- **claude.ai**: Upload or drag-and-drop images directly into the chat interface.
- **Console Workbench**: Use the image button at the top-right of User message blocks.
- **API**: Include image content blocks in the `messages` array.

## Supported Formats

| Format | MIME Type |
|:-------|:---------|
| JPEG | `image/jpeg` |
| PNG | `image/png` |
| GIF | `image/gif` |
| WebP | `image/webp` |

## Limits

| Constraint | API | claude.ai |
|:-----------|:----|:----------|
| Images per request/turn | Up to 100 | Up to 20 |
| Max file size per image | 5 MB | 10 MB |
| Max image dimensions (single) | 8000 x 8000 px | 8000 x 8000 px |
| Max image dimensions (>20 images) | 2000 x 2000 px | N/A |
| Request size limit | 32 MB | N/A |

## Image Sources

Claude supports three source types for images in the API.

### Base64 Encoded

Embed the image data directly in the request:

```python
import anthropic
import base64

client = anthropic.Anthropic()

with open("image.jpg", "rb") as f:
    image_data = base64.standard_b64encode(f.read()).decode("utf-8")

message = client.messages.create(
    model="claude-opus-4-6",
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

```typescript
import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";

const client = new Anthropic();

const imageData = fs.readFileSync("image.jpg").toString("base64");

const message = await client.messages.create({
  model: "claude-opus-4-6",
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

```json
{
  "type": "image",
  "source": {
    "type": "base64",
    "media_type": "image/jpeg",
    "data": "<base64-encoded-data>"
  }
}
```

### URL Reference

Provide a publicly accessible URL. Anthropic fetches the image server-side:

```json
{
  "type": "image",
  "source": {
    "type": "url",
    "url": "https://example.com/image.jpg"
  }
}
```

```python
message = client.messages.create(
    model="claude-opus-4-6",
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

### Files API

Reference an image previously uploaded via the Files API:

```json
{
  "type": "image",
  "source": {
    "type": "file",
    "file_id": "file_abc123"
  }
}
```

## Image Sizing and Resizing

For optimal performance, resize images before uploading. Claude applies automatic resizing using these rules:

1. If the long edge exceeds **1568 pixels**, the image is scaled down preserving aspect ratio so the long edge is 1568 px.
2. If the image exceeds approximately **1,600 tokens** (about 1.15 megapixels), it is further scaled down.
3. Very small images (under 200 px on any edge) may degrade performance.

### Maximum Sizes (no resize applied)

These are the largest dimensions at common aspect ratios that fit within the 1,600-token budget:

| Aspect Ratio | Max Image Size |
|:-------------|:---------------|
| 1:1 | 1092 x 1092 px |
| 3:4 | 951 x 1268 px |
| 2:3 | 896 x 1344 px |
| 9:16 | 819 x 1456 px |
| 1:2 | 784 x 1568 px |

To avoid unexpected resizing, pre-scale your images to fit within these bounds.

## Image Token Costs

Token calculation formula:

```
tokens = (width px * height px) / 750
```

| Image Size | Approximate Tokens | Cost/image (Opus 4.6) | Cost per 1K images |
|:-----------|:-------------------|:----------------------|:-------------------|
| 200 x 200 px | ~54 | ~$0.00016 | ~$0.16 |
| 1000 x 1000 px | ~1,334 | ~$0.004 | ~$4.00 |
| 1092 x 1092 px | ~1,590 | ~$0.0048 | ~$4.80 |

## Multiple Images

Send multiple images in a single request by including multiple image content blocks:

```python
message = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {"type": "base64", "media_type": "image/jpeg", "data": image1_data},
                },
                {
                    "type": "image",
                    "source": {"type": "base64", "media_type": "image/jpeg", "data": image2_data},
                },
                {
                    "type": "text",
                    "text": "Compare these two images. What are the key differences?"
                }
            ],
        }
    ],
)
```

When sending more than 20 images, the maximum dimension per image is reduced to 2000 x 2000 px.

## Best Practices

- **Place images before text** in the content array for best results.
- **Use clear, high-quality images** -- blurry, pixelated, or very low-resolution images degrade performance.
- **Ensure text in images is legible** at the resolution you provide.
- **Label multiple images** when sending several: "Image 1:", "Image 2:", etc., to help Claude reference them.
- **Pre-resize images** to the maximum sizes listed above to control token costs and avoid unexpected quality changes.
- **Use specific prompts** -- ask targeted questions about the image rather than open-ended "describe this image" when possible.

## Limitations

- **People identification**: Claude cannot identify (name) people in images. It can describe physical attributes but will not match faces to identities.
- **Spatial reasoning**: Limited precision for object localization, layouts, and spatial relationships. Approximate rather than exact.
- **Counting**: Provides approximate counts only, especially with many small or overlapping objects.
- **AI-generated images**: Cannot reliably detect whether an image is AI-generated or synthetic.
- **Rotation and orientation**: May struggle with heavily rotated, mirrored, or upside-down content.
- **Accuracy on low-quality images**: May hallucinate details on blurry, low-resolution, or heavily compressed images.
- **Inappropriate content**: Will not process images that violate the Acceptable Use Policy.
- **Healthcare**: Not a substitute for professional medical image interpretation or diagnosis.
- **Image generation**: Claude cannot generate, edit, create, or modify images. It is an image understanding model only.

## FAQ

| Question | Answer |
|:---------|:-------|
| What file types are supported? | JPEG, PNG, GIF, WebP |
| Can Claude read images from URLs? | Yes, via `"source": {"type": "url", "url": "..."}` |
| What are the size limits? | API: 5 MB per image. claude.ai: 10 MB per image |
| How many images can I send? | API: up to 100 per request. claude.ai: up to 20 per turn |
| Does Claude receive image metadata? | No. EXIF data and other metadata are stripped and not processed |
| Can Claude generate images? | No. Claude can only analyze and describe existing images |
| Can Claude read text in images (OCR)? | Yes. Claude can extract and interpret text from images, including handwritten text, though accuracy varies with image quality |
