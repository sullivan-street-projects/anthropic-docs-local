---
title: "API Errors"
source_url: "https://platform.claude.com/docs/en/api/errors"
source_type: "web-extracted"
fetched_at: "2026-03-10T00:00:00Z"
category: "api"
---

# API Errors

## HTTP Error Codes

| Code | Type | Description |
|:-----|:-----|:------------|
| 400 | `invalid_request_error` | Issue with request format or content |
| 401 | `authentication_error` | Issue with API key |
| 403 | `permission_error` | API key lacks permission for the resource |
| 404 | `not_found_error` | Requested resource not found |
| 413 | `request_too_large` | Request exceeds maximum allowed bytes (e.g., 32 MB for Messages API) |
| 429 | `rate_limit_error` | Account hit rate limit |
| 500 | `api_error` | Unexpected internal error |
| 529 | `overloaded_error` | API temporarily overloaded |

**Note:** 529 errors occur during high traffic across all users. In rare cases, sharp usage increases may trigger 429 errors due to acceleration limits. Ramp traffic gradually and maintain consistent patterns.

When streaming via SSE, errors can occur after a 200 response is returned.

## Request Size Limits

| Endpoint Type | Maximum Size |
|:---|:---|
| Messages API | 32 MB |
| Token Counting API | 32 MB |
| Batch API | 256 MB |
| Files API | 500 MB |

Exceeding limits returns a 413 `request_too_large` error from Cloudflare before reaching API servers.

## Error Response Format

```json
{
  "type": "error",
  "error": {
    "type": "not_found_error",
    "message": "The requested resource could not be found."
  },
  "request_id": "req_011CSHoEeqs5C35K2UUqR7Fy"
}
```

All error responses now include a `request_id` field in the response body (in addition to the `request-id` response header). Include this when contacting support.

## Request ID

Every API response includes a `request-id` header. Include this when contacting support.

```python
message = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello, Claude"}],
)
print(f"Request ID: {message._request_id}")
```

## Long Requests

Use streaming Messages API or Message Batches API for requests over 10 minutes. Networks may drop idle connections. Set TCP socket keep-alive to reduce timeout impact.

SDKs validate that non-streaming requests won't exceed 10-minute timeout and set TCP keep-alive.

For large `max_tokens`, use `.stream()` with `.get_final_message()` (Python) or `.finalMessage()` (TypeScript) to get the complete Message without event handling.

## Common Validation Errors

### Prefill Not Supported

Claude Opus 4.6 does not support prefilling assistant messages:

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "Prefilling assistant messages is not supported for this model."
  }
}
```

Use structured outputs, system prompt instructions, or `output_config.format` instead.

### Request Too Large

When a request exceeds the size limit for the endpoint (e.g., 32 MB for Messages API):

```json
{
  "type": "error",
  "error": {
    "type": "request_too_large",
    "message": "Request body exceeds maximum allowed size of 33554432 bytes."
  }
}
```

Reduce request size by using the Files API to upload large content separately, or use the Batch API (256 MB limit) for bulk processing.
