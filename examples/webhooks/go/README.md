# Go Webhook Receiver

`net/http` endpoint that verifies Livion webhook signatures with the official [standard-webhooks Go library](https://github.com/standard-webhooks/standard-webhooks/tree/main/libraries/go). `main.go` also contains `verifyManually`, the same verification using only the Go standard library.

```bash
go mod tidy
LIVION_WEBHOOK_SECRET=whsec_... go run .
```

The receiver listens on `POST /livion-webhook` (port 3000 by default, override with `PORT`).
