# Python Webhook Receiver

Flask endpoint that verifies Livion webhook signatures with the official [`standardwebhooks`](https://pypi.org/project/standardwebhooks/) library. `index.py` also contains `verify_manually`, the same verification using only the Python standard library.

```bash
pip install -r requirements.txt
LIVION_WEBHOOK_SECRET=whsec_... python index.py
```

The receiver listens on `POST /livion-webhook` (port 3000 by default, override with `PORT`).
