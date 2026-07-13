---
title: "Vision API"
source_url: "https://platform.claude.com/docs/en/build-with-claude/vision"
source_type: "web-extracted"
fetched_at: "2026-07-13T00:00:00Z"
category: "api"
---

# Vision

Claude's vision capabilities allow it to understand and analyze images, enabling multimodal interactions across a wide range of use cases including document analysis, chart interpretation, image description, and visual reasoning.

This guide describes how to send images to Claude, the limits and costs that apply, and where to find guidance for [coordinate-based workflows](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates).

## How to Use Vision

- **claude.ai**: Upload or drag-and-drop images directly into the chat interface.
- **Console Workbench**: Use the image button at the top-right of User message blocks.
- **API**: Include image content blocks in the `messages` array.

On the API, provide images to Claude as `image` content blocks using one of three source types:

1. A base64-encoded image embedded in the request body
2. A URL reference to an image hosted online
3. A `file_id` returned by the Files API (upload once, reference many times)

> On Amazon Bedrock and Google Cloud, only base64-encoded sources are currently available.

> Just as placing long documents before your query improves results in text prompts, Claude works best when images come before text. Images placed after text or interpolated with text still perform well, but if your use case allows it, prefer an image-then-text structure.

## Supported Formats

| Format | MIME Type    |
| :----- | :----------- |
| JPEG   | `image/jpeg` |
| PNG    | `image/png`  |
| GIF    | `image/gif`  |
| WebP   | `image/webp` |

Animations are unsupported, and only the first frame is used.

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
    model="claude-opus-4-8",
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
  model: "claude-opus-4-8",
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
    model="claude-opus-4-8",
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

In multi-turn conversations and agentic workflows, each request resends the full conversation history. If images are base64-encoded, the full image bytes are included in the payload on every turn. Uploading images to the Files API and referencing them by `file_id` keeps request payloads small regardless of how many images accumulate in the conversation history.

## Image Limits

### Request Limits

The maximum number of images per message or request is:

- 20 per message on claude.ai.
- 100 per request on the API, for models with a 200k-token context window.
- 600 per request on the API, for all other models.

The maximum dimensions per image are 8000x8000 px.

If a single API request contains more than 20 images, a stricter per-image dimension limit applies. Images exceeding the stricter limit are rejected with an `invalid_request_error`. To stay under the limit on all platforms, either resize each image so that neither dimension exceeds 2000 px, or keep the request to 20 or fewer image and document blocks.

The maximum size per image is:

- 10 MB (base64-encoded) when using the Claude API directly.
- 5 MB (base64-encoded) on Amazon Bedrock and Google Cloud.
- 10 MB on claude.ai.

> Although the API supports up to 600 images per request, request size limits (32 MB for standard endpoints; lower on some partner-operated platforms) can be reached first. For many images, consider uploading with the Files API and referencing by `file_id` to keep request payloads small.

## Resolution and Token Cost

Claude views images in patches instead of pixels. Each patch is a 28x28-pixel block, referred to as a visual token. An image costs `ceil(width / 28) x ceil(height / 28)` visual tokens.

Each model has a maximum native image resolution, expressed as a long-edge limit and a visual-token limit. Images larger than either limit are downscaled before processing.

| Resolution Tier | Models                                                                             | Max Long Edge | Max Visual Tokens |
| :-------------- | :--------------------------------------------------------------------------------- | :------------ | :---------------- |
| High-resolution | Claude Fable 5, Claude Mythos 5, Claude Opus 4.8, Claude Opus 4.7, Claude Sonnet 5 | 2576 px       | 4784              |
| Standard        | All other models                                                                   | 1568 px       | 1568              |

High-resolution support is automatic on the listed models and requires no beta header or client-side opt-in.

The following table shows the visual-token cost for several image sizes on each tier:

| Image Size             | Standard-tier Tokens | High-resolution-tier Tokens |
| :--------------------- | :------------------- | :-------------------------- |
| 200x200 px (0.04 MP)   | 64                   | 64                          |
| 1000x1000 px (1 MP)    | 1296                 | 1296                        |
| 1092x1092 px (1.19 MP) | 1521                 | 1521                        |
| 1920x1080 px (2.07 MP) | 1560 (downscaled)    | 2691                        |
| 2000x1500 px (3 MP)    | 1564 (downscaled)    | 3888                        |
| 3840x2160 px (8.29 MP) | 1560 (downscaled)    | 4784 (downscaled)           |

High-resolution images can use up to roughly three times more visual tokens than the same image on a standard-tier model. If you don't need the additional fidelity, downsample images before sending to control token costs.

## Multiple Images

Send multiple images in a single request by including multiple image content blocks:

```python
message = client.messages.create(
    model="claude-opus-4-8",
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

In a multi-turn conversation, add new images in later `user` turns the same way. Claude has access to every image from earlier turns, so follow-up questions work without including the earlier images again.

## Coordinates and Bounding Boxes

For bounding boxes, points, and pixel coordinates, see [Coordinates and bounding boxes](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates). Claude returns absolute pixel coordinates relative to the image it sees after resizing; that guide covers how Claude resizes and pads images and how to pre-resize or rescale so coordinates line up with your original image.

## Best Practices

- **Place images before text** in the content array for best results.
- **Use clear, high-quality images** -- blurry, pixelated, or very low-resolution images degrade performance.
- **Ensure text in images is legible** at the resolution you provide.
- **Label multiple images** when sending several: "Image 1:", "Image 2:", etc., to help Claude reference them.
- **Pre-resize images** to control token costs and avoid unexpected quality changes.
- **Use specific prompts** -- ask targeted questions about the image rather than open-ended "describe this image" when possible.
- **Compress wisely** -- lossy formats like JPEG or WebP can reduce latency but heavy compression can make text difficult to read.

## Limitations

- **People identification**: Claude cannot identify (name) people in images. It can describe physical attributes but will not match faces to identities.
- **Spatial reasoning**: Claude's coordinate and localization outputs are approximate. Follow the guidance in [Coordinates and bounding boxes](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates) and verify outputs before relying on them.
- **Counting**: Provides approximate counts of objects in an image but might not always be precisely accurate, especially with large numbers of small objects.
- **AI-generated images**: Cannot reliably detect whether an image is AI-generated or synthetic. Do not rely on it to detect fake or synthetic images.
- **Accuracy on low-quality images**: May hallucinate details on blurry, low-resolution, or heavily compressed images.
- **Inappropriate content**: Will not process images that violate the Acceptable Use Policy.
- **Healthcare**: Not a substitute for professional medical image interpretation or diagnosis. Although Claude can analyze general medical images, it is not designed to interpret complex diagnostic scans such as CTs or MRIs.
- **Image generation**: Claude cannot generate, edit, create, or modify images. It is an image understanding model only.

## FAQ

| Question                              | Answer                                                                                                                        |
| :------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------- |
| What file types are supported?        | JPEG, PNG, GIF, WebP                                                                                                          |
| Can Claude read images from URLs?     | Yes, via `"source": {"type": "url", "url": "..."}`                                                                            |
| What are the size limits?             | API: 10 MB per image (5 MB on Bedrock/Google Cloud). claude.ai: 10 MB per image                                               |
| How many images can I send?           | API: up to 600 per request (100 for 200k-token context models). claude.ai: up to 20 per turn                                  |
| Does Claude receive image metadata?   | No. EXIF data and other metadata are stripped and not processed                                                               |
| Can Claude generate images?           | No. Claude can only analyze and describe existing images                                                                      |
| Can Claude read text in images (OCR)? | Yes. Claude can extract and interpret text from images, including handwritten text, though accuracy varies with image quality |
