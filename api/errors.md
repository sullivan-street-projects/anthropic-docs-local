---
title: "API Errors"
source_url: "https://docs.anthropic.com/en/api/errors"
source_type: "web-extracted"
fetched_at: "2026-01-04T05:55:00Z"
category: "api"
---

# API Errors

## HTTP Error Codes

| Code | Type | Description |
|------|------|-------------|
| 400 | `invalid_request_error` | Issue with request format or content |
| 401 | `authentication_error` | Issue with API key |
| 403 | `permission_error` | API key lacks permission |
| 404 | `not_found_error` | Resource not found |
| 413 | `request_too_large` | Exceeds max request size |
| 429 | `rate_limit_error` | Rate limit hit |
| 500 | `api_error` | Internal server error |
| 529 | `overloaded_error` | API temporarily overloaded |

## Request Size Limits

| Endpoint | Max Size |
|----------|----------|
| Messages API | 32 MB |
| Token Counting API | 32 MB |
| Batch API | 256 MB |
| Files API | 500 MB |

Exceeding limits returns 413 `request_too_large` from Cloudflare.

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

## Request ID

Every response includes a `request-id` header. Include this when contacting support.

### Accessing Request ID

**Python:**
```python
message = client.messages.create(...)
print(f"Request ID: {message._request_id}")
```

**TypeScript:**
```typescript
const message = await client.messages.create({...});
console.log('Request ID:', message._request_id);
```

## Rate Limiting

429 errors occur when hitting rate limits. 529 errors occur during high API traffic.

In rare cases, sharp usage increases can trigger acceleration limits (429 errors). To avoid:
- Ramp up traffic gradually
- Maintain consistent usage patterns

## Streaming Errors

Errors can occur after a 200 response during streaming:

```json
event: error
data: {"type": "error", "error": {"type": "overloaded_error", "message": "Overloaded"}}
```

## Long Requests

**Recommendations:**
- Use streaming for long-running requests
- Use Message Batches API for bulk processing
- Avoid large `max_tokens` without streaming

**Issues with long requests:**
- Networks may drop idle connections
- Variable network reliability
- SDKs validate 10-minute timeout for non-streaming

**Mitigations:**
- Set TCP socket keep-alive
- Use SDKs (they set appropriate options)
- Prefer streaming or batch APIs

## Error Handling Best Practices

1. **Retry logic**: Implement exponential backoff for 429 and 529 errors
2. **Request IDs**: Log request IDs for debugging
3. **Graceful degradation**: Handle errors without crashing
4. **Monitor limits**: Check rate limit headers
5. **Validate input**: Catch 400 errors early

## SDK Error Handling

**Python:**
```python
import anthropic

try:
    message = client.messages.create(...)
except anthropic.APIConnectionError as e:
    print("Connection failed:", e)
except anthropic.RateLimitError as e:
    print("Rate limited:", e)
except anthropic.APIStatusError as e:
    print(f"API error {e.status_code}:", e.message)
```

**TypeScript:**
```typescript
import Anthropic from '@anthropic-ai/sdk';

try {
  const message = await client.messages.create({...});
} catch (error) {
  if (error instanceof Anthropic.APIError) {
    console.log(error.status, error.message);
  }
}
```

## Error Type Reference

| Error Class | Description |
|-------------|-------------|
| `BadRequestError` | 400 - Invalid request |
| `AuthenticationError` | 401 - Auth failed |
| `PermissionDeniedError` | 403 - Not permitted |
| `NotFoundError` | 404 - Not found |
| `UnprocessableEntityError` | 422 - Can't process |
| `RateLimitError` | 429 - Too many requests |
| `InternalServerError` | 500+ - Server error |
| `APIConnectionError` | Connection failed |
