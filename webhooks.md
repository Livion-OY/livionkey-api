# Webhooks

Livion can push event data to your HTTPS endpoint whenever relevant data changes in Livion's system. Each delivery is an HTTP `POST` with a JSON body, signed according to the [Standard Webhooks](https://www.standardwebhooks.com/) specification so you can verify that every request genuinely comes from Livion and has not been tampered with.

Webhook subscriptions are managed self-service in the LivionKey WebApp.

> Using the legacy LivionKey REST API? Webhook delivery for legacy integrations is configured differently — see [legacy/push-notification-service-events.md](legacy/push-notification-service-events.md), which documents the **flat** payload shape legacy integrations receive. Self-service subscriptions (this page) receive events wrapped in an **envelope**, documented [below](#event-payloads). The two shapes are different — do not assume they match.

## Setting Up a Subscription

1. In the LivionKey WebApp, open the webhook settings and create a subscription with:
   - a **name** for your own reference,
   - your **endpoint URL** — must be `https://` and publicly reachable (private/internal addresses are rejected),
   - the **organization unit** whose events you want (events from descendant units are included),
   - **one or more event types** from the [catalog](#event-payloads).
2. On creation you are shown the **signing secret** (`whsec_...`) **exactly once**. Store it immediately in your secret storage — it cannot be retrieved later (only its last four characters remain visible). If you lose it, delete the subscription and create a new one.
3. Send a **test delivery** from the UI. Your endpoint receives a signed sample payload for each subscribed event type; the subscription becomes active once your endpoint responds with HTTP `2xx` to every test delivery.

Test deliveries use the same envelope shape as live events (see [Event Payloads](#event-payloads)), with placeholder values (device ids `"000000"`, and never real `pincode`/`code` values).

## Updating a Subscription

An existing subscription's **event types** and **endpoint URL** can be edited — the signing secret is never affected by an update.

- **Event types**: changes take effect immediately, no re-verification. Deliveries already queued for a removed event type are dropped.
- **Endpoint URL**: the new URL is verified before it takes effect — Livion sends a signed sample delivery for each subscribed event type to the *new* URL, and the change is committed only when every one gets a `2xx`. If verification fails, the update is rejected and the previous URL stays in effect. In-flight and queued deliveries switch to the new URL once it is committed.
- **Signing secret**: cannot be rotated in place — delete the subscription and create a new one (which issues a new secret).

## Verifying Signatures

Every delivery carries three headers per the Standard Webhooks specification:

| Header | Example | Meaning |
| --- | --- | --- |
| `webhook-id` | `64f8...` | Unique id of this delivery. Stays the same across retries of the same delivery. |
| `webhook-timestamp` | `1754200000` | Unix epoch **seconds** when this attempt was signed. |
| `webhook-signature` | `v1,K5oZfzN95Z9UVu1EsfQmfVNQhnkZ2pj9o9NDN/H/pI4=` | Base64 HMAC-SHA256 signature. |

Each delivery also carries a `webhook-event-type` header (e.g. `webhook-event-type: key-status`), set to the same value as the envelope's `type` field. It is not part of the signature — it lets you route a delivery at the proxy/queue layer before parsing or verifying the body.

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
  const signatureHeader = headers["webhook-signature"];
  if (!id || !timestamp || !signatureHeader) return false;

  // Reject stale or malformed timestamps (replay protection). 5 minutes is a sensible tolerance.
  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > 300) return false;

  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const expected = crypto
    .createHmac("sha256", key)
    .update(`${id}.${timestamp}.`)
    .update(rawBody) // raw body BYTES, exactly as received
    .digest("base64");

  // The header may contain several space-separated signatures (e.g. during
  // secret rotation) — accept if any "v1,..." entry matches.
  return signatureHeader.split(" ").some((part) => {
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
- Failed deliveries (timeouts, connection errors, non-`2xx` responses) are retried on a fixed schedule of up to **20 attempts spanning roughly 6 hours**: dense at first (5s, 15s, 30s, 1m, 2m, 5m, 10m, 15m, 20m), then every 30 minutes. The first successful attempt stops the schedule.
- Every retry is **re-signed with a fresh `webhook-timestamp`** so timestamp validation keeps working; `webhook-id` stays the same across all retries of one delivery.
- Deliveries to one subscription are **ordered per source and event type**: while a delivery is retrying, later events for the same device and event type wait behind it rather than arriving out of order.
- Redirects are not followed — the endpoint URL must respond directly.
- The most recent delivery result (status code, attempts, errors) is visible on the subscription in the LivionKey WebApp — including, while a delivery is still retrying, when the next attempt is scheduled.

## Event Payloads

**This section documents the self-service subscription shape.** Every delivery is a JSON **envelope**: metadata fields alongside a `data` object holding the event-specific payload. A subscription delivers the event types it subscribes to; each delivery carries a single event.

> Using the legacy LivionKey REST API? Legacy deliveries use a different, **flat** body with no envelope — see [legacy/push-notification-service-events.md](legacy/push-notification-service-events.md#event-payloads). Do not use the shapes on this page for a legacy integration.

### Envelope

```json
{
  "specVersion": "1",
  "type": "<catalog event type>",
  "occurredAt": "<ISO-8601>",
  "createdAt": "<ISO-8601>",
  "organizationUnitId": "<org unit id>",
  "data": { }
}
```

| Field | Meaning |
| --- | --- |
| `specVersion` | Envelope version. `"1"` for this shape. Bumped only on a breaking change to the envelope or to a `data` shape. |
| `type` | The subscribed catalog event type: `key-status`, `contract-update`, `code-entered`, `device-alarm`. Always equal to the `webhook-event-type` header. |
| `occurredAt` | When the event happened in the real world. |
| `createdAt` | When Livion recorded the event. May differ from `occurredAt` under delay or backfill. |
| `organizationUnitId` | Id of the organization unit the event is scoped to — the subscribed unit or one of its sub-units. The same unit id the LivionKey APIs use. |
| `data` | The event-specific payload — see below. Contains no metadata: no `type`, no `time`, no `tag`. |

Where `data.deviceId` is present, it identifies the device the event relates to: a key automat or a keypad, depending on the event source.

### `key-status`

Used for key lifecycle updates. `data.state` is one of `key-fetched`, `key-returned`, `key-not-fetched`, `key-not-returned`. `data.storageType` is `device` or `manualStorage`.

Device-storage key:

```json
{
  "specVersion": "1",
  "type": "key-status",
  "occurredAt": "2021-05-11T11:46:55.008Z",
  "createdAt": "2021-05-11T11:46:55.421Z",
  "organizationUnitId": "customer1",
  "data": {
    "state": "key-fetched",
    "storageType": "device",
    "deviceId": "234521",
    "lockerIndex": 1,
    "keyId": "key1",
    "contractId": "Contract1",
    "contractObjectId": "9783297772ddh2i29d89238d39820"
  }
}
```

Manual-storage / KeyRegister key — `deviceId` and `lockerIndex` are absent, since the key is not in a device:

```json
{
  "specVersion": "1",
  "type": "key-status",
  "occurredAt": "2021-05-11T11:46:55.008Z",
  "createdAt": "2021-05-11T11:46:55.402Z",
  "organizationUnitId": "customer1",
  "data": {
    "state": "key-fetched",
    "storageType": "manualStorage",
    "keyId": "key1",
    "contractId": "Contract1",
    "contractObjectId": "9783297772ddh2i29d89238d39820"
  }
}
```

### `contract-update`

Used when a locker contract is added or updated. The contract's type (`default`, `fetch`, or `return`) is `data.contractType`.

```json
{
  "specVersion": "1",
  "type": "contract-update",
  "occurredAt": "2021-05-11T11:46:55.008Z",
  "createdAt": "2021-05-11T11:46:55.377Z",
  "organizationUnitId": "customer1",
  "data": {
    "contractType": "default",
    "contractId": "Contract1",
    "contractObjectId": "9783297772ddh2i29d89238d39820",
    "pincode": "124578",
    "start": "2021-06-01T09:00:00.008Z",
    "end": "2021-06-30T09:00:00.008Z",
    "deviceId": "234521",
    "keyId": "key1"
  }
}
```

### `code-entered`

Used when a correct code is entered on the device. The kind of code is `data.codeType`: `right-pincode`, `right-return-code`, or `right-access-code`.

```json
{
  "specVersion": "1",
  "type": "code-entered",
  "occurredAt": "2021-05-11T11:46:55.008Z",
  "createdAt": "2021-05-11T11:46:55.298Z",
  "organizationUnitId": "customer1",
  "data": {
    "codeType": "right-pincode",
    "code": "124578",
    "deviceId": "234521",
    "lockerIndex": 1,
    "keyId": "key1",
    "contractId": "Contract1",
    "contractObjectId": "9783297772ddh2i29d89238d39820"
  }
}
```

Notes:

- `data.contractId` is absent for return codes.
- `data.keyId` and `data.lockerIndex` are absent for access codes.

### `device-alarm`

Used for supported public device alarms. `data.state` is `activated` or `deactivated`.

Supported `data.alarmType` values:

- `DEVICE_ERROR`
- `DEVICE_POWER_DISCONNECTED`
- `DEVICE_LOW_POWER`
- `DEVICE_MOVED`
- `DEVICE_DISCONNECTED`
- `DEVICE_WIFI_OFFLINE`

`KEY_NOT_RETURNED` is not included in `device-alarm`, because that case is already delivered through `key-status` with `state = key-not-returned`.

```json
{
  "specVersion": "1",
  "type": "device-alarm",
  "occurredAt": "2026-04-02T09:30:00.000Z",
  "createdAt": "2026-04-02T09:30:00.244Z",
  "organizationUnitId": "customer1",
  "data": {
    "alarmType": "DEVICE_DISCONNECTED",
    "state": "activated",
    "deviceId": "device123",
    "start": "2026-04-02T09:30:00.000Z",
    "end": null,
    "acknowledged": false
  }
}
```

An acknowledged alarm carries `"acknowledged": true`; a deactivation carries `"state": "deactivated"` and a populated `end`.

## Summary

1. Create a subscription in the LivionKey WebApp (HTTPS endpoint, one or more event types).
2. Store the `whsec_...` secret when it is shown — it is shown only once.
3. Implement signature verification (use a Standard Webhooks library, or verify manually against the raw body).
4. Respond `2xx` quickly; process asynchronously. Deliveries are the [envelope shape](#event-payloads); route by the `webhook-event-type` header if useful before parsing.
5. Send a test delivery to activate the subscription.
6. Event types and the endpoint URL can be [edited later](#updating-a-subscription); URL changes are verified before they take effect. The secret cannot be rotated — delete and recreate for a new one.
