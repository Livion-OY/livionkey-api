# PHP Webhook Receiver

Plain PHP endpoint that verifies Livion webhook signatures with the official [`standard-webhooks/standard-webhooks`](https://packagist.org/packages/standard-webhooks/standard-webhooks) Composer package. `index.php` also contains `verifyManually`, the same verification using only the PHP standard library (no Composer needed).

```bash
composer install
LIVION_WEBHOOK_SECRET=whsec_... php -S 0.0.0.0:3000 index.php
```

The receiver listens on `POST /livion-webhook`.
