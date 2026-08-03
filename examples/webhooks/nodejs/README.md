# Node.js Webhook Receiver

Express endpoint that verifies Livion webhook signatures with the official [`standardwebhooks`](https://www.npmjs.com/package/standardwebhooks) library. `index.ts` also contains `verifyManually`, the same verification using only Node.js builtins.

```bash
npm install
LIVION_WEBHOOK_SECRET=whsec_... npm start
```

The receiver listens on `POST /livion-webhook` (port 3000 by default, override with `PORT`).
