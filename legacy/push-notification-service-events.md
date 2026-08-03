# Push Notification Webhooks (Legacy REST API)

## Purpose

This document describes webhook delivery for integrations built on the legacy LivionKey REST APIs ([LivionKey API](apidoc-livionkey30/), [LivionKeyPad API](apidoc-livionkeypad/)).

Livion can send event data to a customer-provided HTTP endpoint using webhooks. Each notification is sent as an HTTP `POST` request with a JSON body.

> Integrations on **API v2** use self-service webhook subscriptions with signed deliveries instead — see [webhooks.md](../webhooks.md) at the repository root. The event payloads are identical in both setups.

## How It Works

- You provide Livion with an HTTP endpoint URL.
- Livion sends webhook events to that endpoint as JSON.
- Events are pushed whenever relevant data is updated in Livion's system.
- Your service should process the payload and return HTTP `200` when the request has been handled successfully.
- If delivery fails, Livion retries the request with exponential backoff.

## Securing the Webhook

We recommend using a secure endpoint.

One simple way to secure the webhook is to use a custom secret header. For example:

```json
{
  "x-api-key": "your-shared-secret"
}
```

The endpoint URL and any required custom headers should be shared with Livion before the webhook is enabled.

## Available Events

The push notification service currently supports these webhook event types:

- `key-status`
- `contract-update`
- `code-entered`
- `device-alarm`

The payload of each event type is documented in [webhooks.md — Event Payloads](../webhooks.md#event-payloads). The payloads are the same regardless of how webhook delivery is configured.

## Delivery Notes

- Webhooks are sent as HTTP `POST` requests.
- The request body is JSON.
- Events are sent whenever relevant data is updated in Livion's system.
- A successful response should return HTTP `200`.
- Failed deliveries are retried with exponential backoff.
- Retries are automatically attempted when the request fails with `ECONNRESET`, `ENOTFOUND`, `ESOCKETTIMEDOUT`, `ETIMEDOUT`, `ECONNREFUSED`, `EHOSTUNREACH`, `EPIPE`, or `EAI_AGAIN`.
- Retries are also automatically attempted for HTTP `5xx` responses and HTTP `429`.

## Summary

To enable webhook delivery:

1. Create an HTTP `POST` endpoint.
2. Decide whether you want to protect it with a custom header such as `x-api-key`.
3. Share the endpoint URL and any required headers with Livion.
4. Return HTTP `200` after successful processing.
