# Livion API Resources

Official LivionKey API resources: documentation and examples for integrating with the Livion API.

## API Documentation

- **API v2 reference**: https://apidocsv2.livionkey.com/
- **Authentication**: https://apidocsv2.livionkey.com/#section/Authentication
- **Webhooks**: [webhooks.md](webhooks.md) — self-service webhook subscriptions, signature verification and event payloads.
- **Legacy REST APIs**: [legacy/](legacy/) — API reference and webhook documentation for integrations built on the legacy LivionKey and LivionKeyPad REST APIs.

## Examples

### Authentication (`examples/auth/`)

Language-specific implementations for creating authentication headers and sending requests to the Livion API:

- `go/`: Go example for generating authentication headers and making requests.
- `nodejs/`: Node.js example for generating authentication headers and making requests.
- `python/`: Python script showcasing how to generate headers and use the `requests` library for API communication.
- `php/`: PHP script showcasing how to generate headers and use cURL for API communication.

### Webhook Receivers (`examples/webhooks/`)

Endpoints that receive Livion webhook deliveries and verify their signatures:

- `nodejs/`: Express receiver using the Standard Webhooks library, plus manual verification with Node builtins.
- `python/`: Flask receiver using the Standard Webhooks library, plus manual verification with the standard library.

### PMS Integration Examples

- `pms-integration-livionkey30/`: Mechanical key workflow with key automat

  - Key automat integration
  - Booking-to-key contract creation
  - Guest notification handling

- `pms-integration-livionkey20/`: iLOQ S5 key workflow with key automat
  - Mapping iLOQ access rights & automats to your listings
  - Creating iLOQ key contracts for bookings
  - Guest notification handling
