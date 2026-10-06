# Legacy LivionKey REST APIs

Documentation for integrations built on the legacy LivionKey REST APIs. These APIs remain in use and supported for existing integrations; new integrations should be built on [API v2](https://apidocsv2.livionkey.com/).

Base URL: `https://api.livionkey.com`

## API Reference

Generated API documentation (open `index.html` in a browser):

- [`apidoc-livionkey30/`](apidoc-livionkey30/) — **LivionKey API**: endpoints for contracts, keys and devices.
- [`apidoc-livionkeypad/`](apidoc-livionkeypad/) — **LivionKeyPad API**: endpoints for access rights and devices.

Both APIs share the same base URL and the same authentication, described below.

## Authentication

Every endpoint except `POST /auth/login` requires a JSON Web Token (JWT) in the `Authorization` header:

```
Authorization: Bearer <token>
```

The token is obtained by logging in with the email and password of a LivionKey user account. It is valid for **one hour** and must be cached and reused across requests, not fetched per request. The four steps below cover the whole flow.

### Step 1 — Get API credentials

API access is enabled per account by Livion. Contact Livion to get a user account opened for API usage, and use a dedicated integration account rather than a person's own login. Keep the email and password in your server-side secret storage; never ship them in a browser or mobile client.

### Step 2 — Log in to get a token

```bash
curl -X POST https://api.livionkey.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "integration@example.com", "password": "your-password"}'
```

Response:

```json
{
  "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6...",
  "expirationTime": "Tue, 06 Aug 2019 11:31:29 GMT"
}
```

| Field | Description |
| --- | --- |
| `token` | The JWT to send as `Authorization: Bearer <token>` on every subsequent call. |
| `expirationTime` | UTC timestamp when the token stops working, one hour after login. Store it next to the token. |

The body also accepts an optional `forceRefresh` boolean. It is not needed in normal use; every login already returns a fresh token.

### Step 3 — Call the API with the token

```bash
curl https://api.livionkey.com/devices \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6..."
```

Note the `Bearer ` prefix: a bare token in the header is rejected with `403 No token provided.`

### Step 4 — Cache the token and refresh before it expires

The token is valid for one hour from login. Requirements for a well-behaved integration:

- **Log in once, reuse the token.** Keep the token and its `expirationTime` in memory (or in a shared cache if you run several workers). Do not call `/auth/login` before every request: it is a full sign-in on every call, it slows every request down, and repeated logins are throttled: once the limit is hit, `/auth/login` answers `429` with a `Retry-After` header (seconds) until the throttle clears.
- **Refresh proactively.** Log in again a few minutes before `expirationTime` (for example when less than five minutes remain), so in-flight requests never race the expiry.
- **Handle a rejected token by refreshing and retrying once.** An expired or otherwise invalid token is rejected with HTTP `401` (see the error table below). Treat that response as "token no longer valid": discard the cached token, log in again, and retry the request one time.
- **There is no server-side logout.** To end a session simply discard the token; it stops working at `expirationTime`.

Minimal example of a cached token getter (Node.js 18+, no dependencies):

```js
const BASE_URL = 'https://api.livionkey.com';
const REFRESH_MARGIN_MS = 5 * 60 * 1000; // re-login when < 5 min remain

let cached = null; // { token, expiresAt }

async function getToken() {
  if (cached && cached.expiresAt - Date.now() > REFRESH_MARGIN_MS) {
    return cached.token;
  }
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.LIVIONKEY_EMAIL,
      password: process.env.LIVIONKEY_PASSWORD,
    }),
  });
  if (!res.ok) throw new Error(`Login failed: ${res.status} ${await res.text()}`);
  const { token, expirationTime } = await res.json();
  cached = { token, expiresAt: new Date(expirationTime).getTime() };
  return token;
}

async function api(method, path, body, retry = true) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${await getToken()}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401 && retry) {
    cached = null; // token rejected: log in again and retry once
    return api(method, path, body, false);
  }
  if (!res.ok) throw new Error(`${method} ${path} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

// usage
const devices = await api('GET', '/devices');
```

### Authentication errors

| Status | Body | Cause |
| --- | --- | --- |
| `400` | `Missing email from parameters` / `Missing password from parameters` | Login body is missing a field. Send JSON with `Content-Type: application/json`. |
| `400` | `Firebase: Error (auth/invalid-login-credentials).` | Wrong email or password. |
| `401` | `GraphQL - <timestamp> - <id> - not authorized` | Token expired or malformed, or the account has no access to the requested resource. Refresh the token and retry once; if it still fails, check the account's access with Livion. |
| `403` | `{"success":false,"message":"No token provided."}` | `Authorization` header is missing or is not in the form `Bearer <token>`. |
| `429` | `Too many login attempts, try again later` | Login is throttled. Wait the number of seconds in the `Retry-After` header before logging in again, and cache the token instead of logging in per request. |

## Quick start: create a key contract

A typical LivionKey API integration authenticates once, looks up a device and a key, then creates a contract that lets a person pick up that key with a pincode. All requests below use the `Authorization: Bearer <token>` header from Step 3.

1. **List the devices your account can see.** The `deviceId` values are needed in the next steps.

   ```bash
   curl https://api.livionkey.com/devices -H "Authorization: Bearer $TOKEN"
   ```

2. **List the keys on a device.** Each key has a `keyId` and its current `contracts`.

   ```bash
   curl https://api.livionkey.com/devices/00053/keys -H "Authorization: Bearer $TOKEN"
   ```

3. **Create a contract for a key.** `contractId` is your own reference (for example a booking number) and must be unique. Contracts on the same private key cannot overlap in time. If you omit `pincode`, the API generates one and returns it.

   ```bash
   curl -X POST https://api.livionkey.com/contracts \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "contractId": "booking-543553",
       "devices": [{ "id": "00053", "keyId": "A4324" }],
       "start": "2026-10-01T12:00:00.000Z",
       "end": "2026-10-04T10:00:00.000Z",
       "person": "John Doe",
       "contacts": [{ "email": "john.doe@example.com", "phoneNumber": "+358123456789", "sendEmail": true, "sendSms": false, "language": "fi-fi" }]
     }'
   ```

   Response: `{ "id": "a668e8f7f686a79879b976c65", "pincode": "594395" }`. The `id` is the contract's object id used in `/contracts/:id` calls; the `pincode` opens the locker.

4. **Read, update or delete the contract** with its `id`: `GET /contracts/:id`, `POST /contracts/:id`, `POST /contracts/:id/pincode`, `DELETE /contracts/:id`.

Field-level details for every endpoint are in the [API reference](#api-reference).

## Webhooks

Webhook delivery for legacy REST API integrations is described in [push-notification-service-events.md](push-notification-service-events.md).

The webhook event payloads are shared with API v2 and documented in [webhooks.md — Event Payloads](../webhooks.md#event-payloads) at the repository root.
