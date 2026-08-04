# Webhooks

Livion can push event data to your HTTPS endpoint whenever relevant data changes in Livion's system. Each delivery is an HTTP `POST` with a JSON body, signed according to the [Standard Webhooks](https://www.standardwebhooks.com/) specification so you can verify that every request genuinely comes from Livion and has not been tampered with.

Webhook subscriptions are managed self-service in the LivionKey WebApp.

> Using the legacy LivionKey REST API? Webhook delivery for legacy integrations is configured differently — see [legacy/push-notification-service-events.md](legacy/push-notification-service-events.md). The event payloads are identical in both setups and are documented [below](#event-payloads).

## Setting Up a Subscription

1. In the LivionKey WebApp, open the webhook settings and create a subscription with:
   - a **name** for your own reference,
   - your **endpoint URL** — must be `https://` and publicly reachable (private/internal addresses are rejected),
   - the **organization unit** whose events you want (events from descendant units are included),
   - **one event type** from the [catalog](#event-payloads). To receive several event types, create one subscription per event type.
2. On creation you are shown the **signing secret** (`whsec_...`) **exactly once**. Store it immediately in your secret storage — it cannot be retrieved later (only its last four characters remain visible). If you lose it, delete the subscription and create a new one.
3. Send a **test delivery** from the UI. Your endpoint receives a signed sample payload of the subscribed event type; the subscription becomes active once your endpoint responds with HTTP `2xx`.

Test deliveries carry the same shape as live events, with placeholder values (device ids `"000000"`, and never real `pincode`/`code` values).

## Verifying Signatures

Every delivery carries three headers per the Standard Webhooks specification:

| Header | Example | Meaning |
| --- | --- | --- |
| `webhook-id` | `64f8...` | Unique id of this delivery. Stays the same across retries of the same delivery. |
| `webhook-timestamp` | `1754200000` | Unix epoch **seconds** when this attempt was signed. |
| `webhook-signature` | `v1,K5oZfzN95Z9UVu1EsfQmfVNQhnkZ2pj9o9NDN/H/pI4=` | Base64 HMAC-SHA256 signature. |

The signed content is:

```
{webhook-id}.{webhook-timestamp}.{raw request body}
```

and the HMAC key is your secret with the `whsec_` prefix stripped and the remainder **base64-decoded**.

### Use a Standard Webhooks library (recommended)

Because Livion signs per the Standard Webhooks spec, the official receiver libraries verify deliveries out of the box:

- Node.js: [`standardwebhooks`](https://www.npmjs.com/package/standardwebhooks)
- Python: [`standardwebhooks`](https://pypi.org/project/standardwebhooks/)
- Go: [`github.com/standard-webhooks/standard-webhooks/libraries/go`](https://github.com/standard-webhooks/standard-webhooks/tree/main/libraries/go)
- PHP: [`standard-webhooks/standard-webhooks`](https://packagist.org/packages/standard-webhooks/standard-webhooks)
- More languages: https://github.com/standard-webhooks/standard-webhooks/tree/main/libraries

```js
import { Webhook } from "standardwebhooks";

const wh = new Webhook(process.env.LIVION_WEBHOOK_SECRET); // "whsec_..."
// throws if the signature is invalid or the timestamp is outside the tolerance window
const payload = wh.verify(rawBody, {
  "webhook-id": req.headers["webhook-id"],
  "webhook-timestamp": req.headers["webhook-timestamp"],
  "webhook-signature": req.headers["webhook-signature"],
});
```

Runnable receiver examples are in [`examples/webhooks/`](examples/webhooks/).

### Verifying manually

If you prefer not to add a dependency:

```js
const crypto = require("crypto");

function verify(secret, headers, rawBody) {
  const id = headers["webhook-id"];
  const timestamp = headers["webhook-timestamp"];

  // Reject stale timestamps (replay protection). 5 minutes is a sensible tolerance.
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;

  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const expected = crypto
    .createHmac("sha256", key)
    .update(`${id}.${timestamp}.`)
    .update(rawBody) // raw body BYTES, exactly as received
    .digest("base64");

  // The header may contain several space-separated signatures (e.g. during
  // secret rotation) — accept if any "v1,..." entry matches.
  return headers["webhook-signature"].split(" ").some((part) => {
    const [version, signature] = part.split(",");
    if (version !== "v1" || !signature) return false;
    try {
      return crypto.timingSafeEqual(Buffer.from(signature, "base64"), Buffer.from(expected, "base64"));
    } catch {
      return false;
    }
  });
}
```

Common pitfalls:

- **Verify the raw body bytes.** Don't parse the JSON and re-serialize it before verifying — key order or whitespace differences will change the signature. Configure your framework to give you the unparsed request body.
- **Use a constant-time comparison** (`crypto.timingSafeEqual` or your library's equivalent), not `===`.
- **Enforce a timestamp tolerance** to reject replayed deliveries.
- **Deduplicate by `webhook-id`** if your processing is not idempotent — retries reuse the same id.

## Delivery and Retries

- Deliveries are `POST` requests with `content-type: application/json`.
- Any `2xx` response marks the delivery successful. Respond quickly and process asynchronously — slow responses run into delivery timeouts.
- Failed deliveries (timeouts, connection errors, non-`2xx` responses) are retried with exponential backoff, up to 11 attempts in total.
- Every retry is **re-signed with a fresh `webhook-timestamp`** so timestamp validation keeps working; `webhook-id` stays the same across all retries of one delivery.
- Redirects are not followed — the endpoint URL must respond directly.
- The most recent delivery result (status code, attempts, errors) is visible on the subscription in the LivionKey WebApp.

## Event Payloads

The following event types are available. A subscription delivers exactly one of them.

### `key-status`

Used for key lifecycle updates.

Possible `state` values:

- `key-returned`
- `key-fetched`
- `key-not-returned`
- `key-not-fetched`

Example:

```json
{
  "type": "key-status",
  "deviceId": "000000",
  "lockerIndex": 1,
  "keyId": "key1",
  "contractId": "Contract1",
  "contractObjectId": "9783297772ddh2i29d89238d39820",
  "state": "key-fetched",
  "time": "2021-05-11T11:46:55.008Z",
  "tag": "livion/key/customer1"
}
```

Notes:

- `tag` is Livion-specific data.

### `contract-update`

Used when a locker contract is added or updated.

Example:

```json
{
  "type": "contract-update",
  "pincode": "124578",
  "contractId": "Contract1",
  "contractObjectId": "9783297772ddh2i29d89238d39820",
  "time": "2021-05-11T11:46:55.008Z",
  "start": "2021-06-01T09:00:00.008Z",
  "end": "2021-06-30T09:00:00.008Z",
  "deviceId": "234521",
  "keyId": "key1",
  "tag": "livion/key/customer1"
}
```

Notes:

- `contractObjectId` is Livion-specific data.
- `tag` is Livion-specific data.

### `code-entered`

Used when a correct code is entered on the device.

Possible `type` values inside the payload:

- `right-pincode`
- `right-return-code`
- `right-access-code`

Example:

```json
{
  "type": "code-entered",
  "code": "124578",
  "deviceId": "234521",
  "lockerIndex": 1,
  "keyId": "key1",
  "contractId": "Contract1",
  "contractObjectId": "9783297772ddh2i29d89238d39820",
  "time": "2021-05-11T11:46:55.008Z",
  "tag": "livion/key/customer1"
}
```

Notes:

- `contractId` may be missing for return code events.
- `keyId` and `lockerIndex` may be missing for access code events.
- `tag` is Livion-specific data.

### `device-alarm`

Used for supported public device alarms.

Possible `state` values:

- `activated`
- `deactivated`

Supported `alarmType` values:

- `DEVICE_ERROR`
- `DEVICE_POWER_DISCONNECTED`
- `DEVICE_LOW_POWER`
- `DEVICE_MOVED`
- `DEVICE_DISCONNECTED`
- `DEVICE_WIFI_OFFLINE`

`KEY_NOT_RETURNED` is not included in `device-alarm`, because that case is already delivered through `key-status` with `state = key-not-returned`.

Activation example:

```json
{
  "type": "device-alarm",
  "alarmType": "DEVICE_DISCONNECTED",
  "deviceId": "device123",
  "state": "activated",
  "start": "2026-04-02T09:30:00.000Z",
  "end": null,
  "acknowledged": false
}
```

Acknowledged alarm example:

```json
{
  "type": "device-alarm",
  "alarmType": "DEVICE_DISCONNECTED",
  "deviceId": "device123",
  "state": "activated",
  "start": "2026-04-02T09:30:00.000Z",
  "end": null,
  "acknowledged": true
}
```

Deactivation example:

```json
{
  "type": "device-alarm",
  "alarmType": "DEVICE_MOVED",
  "deviceId": "device123",
  "state": "deactivated",
  "start": "2026-04-02T09:00:00.000Z",
  "end": "2026-04-02T09:35:00.000Z",
  "acknowledged": true
}
```

## Summary

1. Create a subscription in the LivionKey WebApp (HTTPS endpoint, one event type).
2. Store the `whsec_...` secret when it is shown — it is shown only once.
3. Implement signature verification (use a Standard Webhooks library, or verify manually against the raw body).
4. Respond `2xx` quickly; process asynchronously.
5. Send a test delivery to activate the subscription.
