---
title: "Vision API"
source_url: "https://platform.claude.com/docs/en/build-with-claude/vision"
source_type: "web-extracted"
fetched_at: "2026-09-07T00:00:00Z"
category: "api"
---

# Vision

Claude's vision capabilities allow it to understand and analyze images, enabling multimodal interactions across a wide range of use cases including document analysis, chart interpretation, image description, and visual reasoning.

This guide describes how to send images to Claude, the limits and costs that apply, and where to find guidance for [coordinate-based workflows](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates).

## Send Images to Claude

Use Claude's vision capabilities through:

- **[claude.ai](https://claude.ai/)**: Upload an image like you would a file, or drag and drop an image directly into the chat window.
- **[Playground](https://platform.claude.com/playground)** in the Claude Console: Add images directly to any User message block.
- **API request**: See the following examples.

On the API, provide images to Claude as `image` content blocks using one of three source types:

1. A base64-encoded image embedded in the request body
2. A URL reference to an image hosted online
3. A `file_id` returned by the [Files API](https://platform.claude.com/docs/en/build-with-claude/files) (upload once, reference many times)

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
image1_data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP4z8AAAAMBAQDJ/pLvAAAAAElFTkSuQmCC"
image1_media_type = "image/png"

client = anthropic.Anthropic()
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
                        "media_type": image1_media_type,
                        "data": image1_data,
                    },
                },
                {"type": "text", "text": "Describe this image."},
            ],
        }
    ],
)
print(message)
```

```typescript
const anthropic = new Anthropic();

const message = await anthropic.messages.create({
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
            data: imageData // Base64-encoded image data as string
          }
        },
        {
          type: "text",
          text: "Describe this image."
        }
      ]
    }
  ]
});

console.log(message);
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

```python
client = anthropic.Anthropic()
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
                        "url": "https://platform.claude.com/docs/images/vision-example.jpg",
                    },
                },
                {"type": "text", "text": "Describe this image."},
            ],
        }
    ],
)
print(message)
```

```typescript
const anthropic = new Anthropic();

const message = await anthropic.messages.create({
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
            url: "https://platform.claude.com/docs/images/vision-example.jpg"
          }
        },
        {
          type: "text",
          text: "Describe this image."
        }
      ]
    }
  ]
});

console.log(message);
```

### Files API

For images you'll use repeatedly or when you want to avoid encoding overhead, use the [Files API](https://platform.claude.com/docs/en/build-with-claude/files). Upload the image once, then reference the returned `file_id` in subsequent messages instead of resending base64 data.

> In multi-turn conversations and agentic workflows, each request resends the full conversation history. If images are base64-encoded, the full image bytes are included in the payload on every turn, which can significantly increase request size and latency as the conversation grows. Uploading images to the Files API and referencing them by `file_id` keeps request payloads small regardless of how many images accumulate in the conversation history.

```python
client = anthropic.Anthropic()

# Upload the image file
with open("vision-example.jpg", "rb") as f:
    file_upload = client.files.upload(file=("vision-example.jpg", f, "image/jpeg"))

# Use the uploaded file in a message
message = client.messages.create(
    model="claude-opus-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {"type": "file", "file_id": file_upload.id},
                },
                {"type": "text", "text": "Describe this image."},
            ],
        }
    ],
)

print(message.content)
```

```typescript
import Anthropic, { toFile } from "@anthropic-ai/sdk";
import fs from "node:fs";

const anthropic = new Anthropic();

// Upload the image file
const fileUpload = await anthropic.files.upload({
  file: await toFile(fs.createReadStream("vision-example.jpg"), undefined, {
    type: "image/jpeg"
  })
});

// Use the uploaded file in a message
const response = await anthropic.messages.create({
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
            file_id: fileUpload.id
          }
        },
        {
          type: "text",
          text: "Describe this image."
        }
      ]
    }
  ]
});

console.log(response);
```

## Image Limits

### Request Limits

The maximum number of images per message or request is:

- 20 per message on [claude.ai](https://claude.ai/).
- 100 per request on the API, for models with a 200k-token context window.
- 600 per request on the API, for all other models.

The maximum dimensions per image are 8000x8000 px.

If a single API request contains more than 20 images, a stricter per-image dimension limit applies to every image in that request. All `image` blocks in the request count toward this threshold, including images from earlier conversation turns that you resend and images nested inside `tool_result` content (for example, screenshots returned to the computer use tool). On Amazon Bedrock and Google Cloud, document blocks such as PDFs also count toward this threshold. Images exceeding the stricter limit are rejected with an `invalid_request_error` whose message references "many-image requests" and states the current limit in pixels. To stay under the limit on all platforms, either resize each image so that neither dimension exceeds 2000 px, or keep the request to 20 or fewer image and document blocks.

The maximum size per image is:

- 10 MB (base64-encoded) when using the Claude API directly.
- 5 MB (base64-encoded) on Amazon Bedrock and Google Cloud.
- 10 MB on [claude.ai](https://claude.ai/).

> Although the API supports up to 600 images per request, [request size limits](https://platform.claude.com/docs/en/api/overview#request-size-limits) (32 MB for standard endpoints; lower on some partner-operated platforms, for example, Amazon Bedrock and Google Cloud) can be reached first. For many images, consider uploading with the [Files API](https://platform.claude.com/docs/en/build-with-claude/vision#files-api-image-example) and referencing by `file_id` to keep request payloads small.
>
> Even when using the Files API, requests with many large images can fail before reaching the 600-image count. Reduce image dimensions or file sizes (for example, by downsampling) before uploading.

## Resolution and Token Cost

Claude views images in patches instead of pixels. Each patch is a 28x28-pixel block, referred to as a visual token. An image costs `ceil(width / 28) x ceil(height / 28)` visual tokens.

Each model has a maximum native image resolution, expressed as a long-edge limit and a visual-token limit. Images larger than either limit are downscaled before processing; see [How Claude resizes and pads images](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates#how-claude-resizes-and-pads-images) for the exact rule. The exception is screenshots and zoom images that you return to the computer use and browser use toolsets: the API rejects a `tool_result` image that exceeds the model's limits with a validation error instead of downscaling it, so resize those images in your application before returning them. To have any other oversized image rejected with an error instead of downscaled, set the image block's [`transformations` field](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates#oversized-image-error).

| Resolution Tier | Models                      | Max Long Edge | Max Visual Tokens |
| :-------------- | :-------------------------- | :------------ | :---------------- |
| High-resolution | Claude 4.7 and later models | 2576 px       | 4784              |
| Standard        | All other models            | 1568 px       | 1568              |

High-resolution support is automatic on the listed models and requires no beta header or client-side opt-in.

The following table shows the downsized resolution and visual-token cost for several image sizes on each tier:

| Image Size                     | Standard tier: downsized to | Standard tier: tokens | High-resolution tier: downsized to | High-resolution tier: tokens |
| :----------------------------- | :-------------------------- | :-------------------- | :--------------------------------- | :--------------------------- |
| 200x200 px (0.04 megapixels)   | Not resized                 | 64                    | Not resized                        | 64                           |
| 1000x1000 px (1 megapixel)     | Not resized                 | 1296                  | Not resized                        | 1296                         |
| 1092x1092 px (1.19 megapixels) | Not resized                 | 1521                  | Not resized                        | 1521                         |
| 1920x1080 px (2.07 megapixels) | 1456x819 px                 | 1560                  | Not resized                        | 2691                         |
| 2000x1500 px (3 megapixels)    | 1269x952 px                 | 1564                  | Not resized                        | 3888                         |
| 3840x2160 px (8.29 megapixels) | 1456x819 px                 | 1560                  | 2576x1449 px                       | 4784                         |

When an image is downsized, Claude scales it to the largest size that fits the tier's limits while preserving its aspect ratio. This caps the token cost. For the precise rule and a reference implementation, see [How Claude resizes and pads images](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates#how-claude-resizes-and-pads-images).

To estimate cost, multiply the token count by the [per-token price of the model](https://claude.com/pricing) you're using. For example, at Claude Haiku 4.5's $1 USD per million input tokens (standard tier), the 1000x1000 image costs about $1.30 USD per thousand images. At Claude Opus 5's $5 USD per million (high-resolution tier), the same image costs about $6.48 USD per thousand and the 4K image about $23.92 USD per thousand.

High-resolution images can use up to roughly three times more visual tokens than the same image on a standard-tier model. If you don't need the additional fidelity that high resolution provides for computer use, screenshot understanding, and dense documents, downsample images before sending to control token costs. To minimize latency and to simplify [coordinate-based workflows](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates), prefer resizing images before uploading them.

## Multiple Images

Send multiple images in a single request by including multiple image content blocks. When sending several images, introduce each one with a short text label (`Image 1:`, `Image 2:`, and so on) so you can refer to them by name in your prompt and in follow-up turns.

```python
image1_data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP4z8AAAAMBAQDJ/pLvAAAAAElFTkSuQmCC"
image2_data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGNgYPgPAAEDAQAIicLsAAAAAElFTkSuQmCC"

client = anthropic.Anthropic()
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
                    "source": {
                        "type": "base64",
                        "media_type": "image/png",
                        "data": image1_data,
                    },
                },
                {"type": "text", "text": "Image 2:"},
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/png",
                        "data": image2_data,
                    },
                },
                {"type": "text", "text": "How are these images different?"},
            ],
        }
    ],
)
print(message)
```

In a multi-turn conversation, add new images in later `user` turns the same way. Claude has access to every image from earlier turns, so follow-up questions such as "Are these similar to the first two?" work without including the earlier images again in the new turn's content.

## Coordinates and Bounding Boxes

For bounding boxes, points, and pixel coordinates, see [Coordinates and bounding boxes](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates). Claude returns absolute pixel coordinates relative to the image it sees after resizing; that guide covers how Claude resizes and pads images and how to pre-resize or rescale so coordinates line up with your original image.

## Image Quality Guidance

When providing images to Claude, keep the following in mind for best results:

- **Image clarity**: Ensure images are clear and not too blurry or pixelated.
- **Text**: If the image contains important text, make sure it's legible and not too small. Avoid cropping out key visual context solely to enlarge the text.
- **Resizing**: Take into account that your image might be resized if it is too large (see [Resolution and token cost](#resolution-and-token-cost)); this might, for example, make text less legible. Consider pre-resizing your images, cropping them, or both. To have an oversized image rejected with an error instead of resized (important for [coordinate workflows](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates)), mark the image block with [`"oversized_image": "error"`](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates#oversized-image-error).
- **Image compression**: Compressing images before sending them, using a lossy format such as JPEG or WebP (lossy mode), can reduce latency by reducing the size of requests. However, this can introduce artifacts that are detrimental to model performance, especially when multiple compression passes are applied. Confirm your compression settings are appropriate for the task by inspecting the actual images sent to the API.

## Limitations

- **People identification**: Claude [cannot be used](https://www.anthropic.com/legal/aup) to name people in images and refuses to do so.
- **Accuracy**: Claude might hallucinate or make mistakes when interpreting low-quality, rotated, or very small images under 200 pixels.
- **Spatial reasoning**: Claude's coordinate and localization outputs are approximate. Follow the guidance in [Coordinates and bounding boxes](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates) and verify outputs before relying on them.
- **Counting**: Claude can give approximate counts of objects in an image but might not always be precisely accurate, especially with large numbers of small objects.
- **AI-generated images**: Claude cannot determine whether an image is AI-generated and might be incorrect if asked. Do not rely on it to detect fake or synthetic images.
- **Inappropriate content**: Claude does not process inappropriate or explicit images that violate the [Acceptable Use Policy](https://www.anthropic.com/legal/aup).
- **Healthcare applications**: Although Claude can analyze general medical images, it is not designed to interpret complex diagnostic scans such as CTs or MRIs. Claude's outputs should not be considered a substitute for professional medical advice or diagnosis.
- **Image generation**: Claude cannot generate, edit, create, or modify images. It is an image understanding model only.

Always carefully review and verify Claude's image interpretations, especially for high-stakes use cases. Do not use Claude for tasks requiring perfect precision or sensitive image analysis without human oversight.

## FAQ

| Question                              | Answer                                                                                                                        |
| :------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------- |
| What file types are supported?        | JPEG, PNG, GIF, WebP                                                                                                          |
| Can Claude read images from URLs?     | Yes, via `"source": {"type": "url", "url": "..."}`                                                                            |
| What are the size limits?             | API: 10 MB per image (5 MB on Bedrock/Google Cloud). claude.ai: 10 MB per image                                               |
| How many images can I send?           | API: up to 600 per request (100 for 200k-token context models). claude.ai: up to 20 per turn                                  |
| Does Claude receive image metadata?   | No. Claude does not parse or receive any metadata from images passed to it                                                    |
| Can Claude generate images?           | No. Claude can only analyze and describe existing images                                                                      |
| Can Claude read text in images (OCR)? | Yes. Claude can extract and interpret text from images, including handwritten text, though accuracy varies with image quality |
