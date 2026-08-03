# Webhook Receiver Examples

Minimal HTTP endpoints that receive Livion webhook deliveries and verify their signatures, as described in [webhooks.md](../../webhooks.md).

Livion signs deliveries per the [Standard Webhooks](https://www.standardwebhooks.com/) specification, so each example uses the official receiver library for its language, and also shows how to verify manually with the standard library only.

- [`nodejs/`](nodejs/) — Express receiver (TypeScript).
- [`python/`](python/) — Flask receiver.

Both examples follow the same flow:

1. Read the **raw request body** (before any JSON parsing).
2. Verify `webhook-id` / `webhook-timestamp` / `webhook-signature` against your `whsec_...` secret.
3. Respond `2xx` immediately; do real processing asynchronously.

Set your subscription secret in the `LIVION_WEBHOOK_SECRET` environment variable before running either example.
