# Push Notification Webhooks

## Purpose

This document describes the LivionKey push notification service.

Livion can send event data to a customer-provided HTTP endpoint using webhooks. Each notification is sent as an HTTP `POST` request with a JSON body.

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

## Event Payloads

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
