---
title: "Vision API"
source_url: "https://platform.claude.com/docs/en/build-with-claude/vision"
source_type: "web-extracted"
fetched_at: "2026-02-16T00:00:00Z"
category: "api"
---

# Vision

Claude's vision capabilities allow it to understand and analyze images, opening up multimodal interaction possibilities.

## How to Use Vision

- **claude.ai**: Upload or drag-and-drop images into chat
- **Console Workbench**: Image button at top-right of User message blocks
- **API**: Include image content blocks in messages

## Limits

- Up to 20 images per turn on claude.ai, 100 per API request
- Maximum image size: 8000x8000 px (2000x2000 if >20 images)
- 32 MB request size limit for standard endpoints
- API: Max 5 MB per image; claude.ai: Max 10 MB per image

## Image Sizing

For optimal performance, resize images before uploading. If the long edge exceeds 1568 pixels or the image exceeds ~1,600 tokens, it will be scaled down preserving aspect ratio. Very small images under 200 pixels may degrade performance.

### Maximum Sizes (no resize needed)

| Aspect Ratio | Image Size |
|:-------------|:-----------|
| 1:1 | 1092x1092 px |
| 3:4 | 951x1268 px |
| 2:3 | 896x1344 px |
| 9:16 | 819x1456 px |
| 1:2 | 784x1568 px |

## Image Costs

Token calculation: `tokens = (width px * height px) / 750`

| Image Size | Tokens | Cost/image (Opus 4.6) | Cost/1K images |
|:-----------|:-------|:----------------------|:---------------|
| 200x200 px | ~54 | ~$0.00016 | ~$0.16 |
| 1000x1000 px | ~1334 | ~$0.004 | ~$4.00 |
| 1092x1092 px | ~1590 | ~$0.0048 | ~$4.80 |

## Supported Formats

- JPEG (`image/jpeg`)
- PNG (`image/png`)
- GIF (`image/gif`)
- WebP (`image/webp`)

## Image Sources

### Base64 Encoded
```json
{"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": "<base64>"}}
```

### URL Reference
```json
{"type": "image", "source": {"type": "url", "url": "https://example.com/image.jpg"}}
```

### Files API
```json
{"type": "image", "source": {"type": "file", "file_id": "file_abc123"}}
```

## Best Practices

- Place images before text in prompts for best results
- Use clear, high-quality images (not blurry or pixelated)
- Ensure text in images is legible
- Label multiple images: "Image 1:", "Image 2:", etc.

## Limitations

- **People identification**: Cannot identify (name) people in images
- **Accuracy**: May hallucinate on low-quality, rotated, or very small images
- **Spatial reasoning**: Limited precision for localization and layouts
- **Counting**: Approximate counts only, especially with many small objects
- **AI-generated images**: Cannot reliably detect synthetic images
- **Inappropriate content**: Will not process content violating Acceptable Use Policy
- **Healthcare**: Not a substitute for professional medical diagnosis

## FAQ

- **File types**: JPEG, PNG, GIF, WebP
- **URL images**: Yes, via `"source": {"type": "url", "url": "..."}`
- **Size limits**: API 5 MB, claude.ai 10 MB per image
- **Image count**: API up to 100, claude.ai up to 20 per turn
- **Metadata**: Claude does not parse or receive image metadata
- **Image generation**: Claude cannot generate, edit, or create images
