---
title: "Vision API"
source_url: "https://platform.claude.com/docs/en/build-with-claude/vision"
source_type: "web-extracted"
fetched_at: "2026-01-31T00:00:00Z"
category: "api"
---

# Vision

Claude's vision capabilities allow understanding and analyzing images for multimodal interaction.

## How to Use Vision

- **claude.ai**: Upload or drag-and-drop images
- **Console Workbench**: Add images button in User messages
- **API**: Include image content blocks

## Limits and Requirements

### Image Limits
- **API**: Up to 100 images per request
- **claude.ai**: Up to 20 images per turn
- **Max size**: 8000x8000 px (rejected if larger)
- **File size**: 5MB (API), 10MB (claude.ai)

### Supported Formats
- `image/jpeg`
- `image/png`
- `image/gif`
- `image/webp`

### Size Recommendations
For optimal performance, resize images:
- Long edge: max 1568 pixels
- Total: max ~1.15 megapixels
- Very small images (<200px) may degrade performance

### Optimal Sizes by Aspect Ratio

| Aspect Ratio | Size |
|--------------|------|
| 1:1 | 1092x1092 px |
| 3:4 | 951x1268 px |
| 2:3 | 896x1344 px |
| 9:16 | 819x1456 px |
| 1:2 | 784x1568 px |

## Token Calculation

```
tokens = (width * height) / 750
```

Cost examples (Claude Sonnet 4.5 at $3/M input tokens):

| Size | Tokens | Cost/image |
|------|--------|------------|
| 200x200 | ~54 | ~$0.00016 |
| 1000x1000 | ~1334 | ~$0.004 |
| 1092x1092 | ~1590 | ~$0.0048 |

## API Examples

### Base64-Encoded Image

```python
import anthropic
import base64
import httpx

# Encode image
image_data = base64.standard_b64encode(
    httpx.get("https://example.com/image.jpg").content
).decode("utf-8")

client = anthropic.Anthropic()
message = client.messages.create(
    model="claude-sonnet-4-5",
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
                        "data": image_data
                    }
                },
                {"type": "text", "text": "Describe this image."}
            ]
        }
    ]
)
```

### URL-Based Image

```python
message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "url",
                        "url": "https://example.com/image.jpg"
                    }
                },
                {"type": "text", "text": "Describe this image."}
            ]
        }
    ]
)
```

### Files API

```python
# Upload image
with open("image.jpg", "rb") as f:
    file = client.beta.files.upload(file=("image.jpg", f, "image/jpeg"))

# Use in message
message = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    betas=["files-api-2025-04-14"],
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {"type": "file", "file_id": file.id}
                },
                {"type": "text", "text": "Describe this image."}
            ]
        }
    ]
)
```

## Multiple Images

```python
messages=[
    {
        "role": "user",
        "content": [
            {"type": "text", "text": "Image 1:"},
            {"type": "image", "source": {"type": "url", "url": url1}},
            {"type": "text", "text": "Image 2:"},
            {"type": "image", "source": {"type": "url", "url": url2}},
            {"type": "text", "text": "How are these different?"}
        ]
    }
]
```

## Best Practices

1. Place images before text/questions
2. Use clear, high-quality images
3. Ensure text in images is legible
4. Pre-resize large images to reduce latency
5. Label multiple images ("Image 1:", "Image 2:")

## Limitations

- **People identification**: Cannot identify (name) people
- **Accuracy**: May struggle with low-quality, rotated, or tiny images
- **Spatial reasoning**: Limited precision for layouts
- **Counting**: Approximate counts, not always precise
- **AI detection**: Cannot reliably detect AI-generated images
- **Medical**: Not for diagnostic scans (CT, MRI)

## FAQ

**Can Claude read image URLs?**
Yes, use `"type": "url"` source blocks.

**Does Claude read image metadata?**
No, metadata is not parsed or received.

**Can Claude generate images?**
No, Claude is image understanding only - no generation or editing.

**Can I delete uploaded images?**
Uploads are ephemeral and automatically deleted after processing.
