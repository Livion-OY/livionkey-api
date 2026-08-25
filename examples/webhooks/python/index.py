"""
LivionKey webhook receiver example (Flask).

Verifies each delivery's Standard Webhooks signature before accepting it.
See ../../../webhooks.md for the full documentation.
"""
import base64
import hashlib
import hmac
import os
import time

from flask import Flask, request
from standardwebhooks import Webhook

SECRET = os.environ.get("LIVION_WEBHOOK_SECRET")  # "whsec_..."
if not SECRET:
    raise SystemExit("Set LIVION_WEBHOOK_SECRET to your subscription secret (whsec_...)")

webhook = Webhook(SECRET)

app = Flask(__name__)


@app.post("/livion-webhook")
def livion_webhook():
    # IMPORTANT: verify the RAW body bytes, not a parsed/re-serialized version.
    raw_body = request.get_data()
    try:
        # Verifies the HMAC signature and rejects timestamps outside the
        # replay-tolerance window. Raises on any failure.
        event = webhook.verify(raw_body, dict(request.headers))
    except Exception:
        return "invalid signature", 401

    # Retries of a failed delivery reuse the same webhook-id — deduplicate on it
    # if your processing is not idempotent.
    delivery_id = request.headers.get("webhook-id")
    print(f"Received {event.get('type')} (delivery {delivery_id}): {event}")

    # Acknowledge immediately; do real processing asynchronously.
    return "ok", 200


def verify_manually(secret: str, headers: dict, raw_body: bytes) -> bool:
    """The same verification without the standardwebhooks dependency."""
    # Header names may arrive in any casing (e.g. Flask title-cases them).
    headers = {k.lower(): v for k, v in headers.items()}
    delivery_id = headers.get("webhook-id")
    timestamp = headers.get("webhook-timestamp")
    signature_header = headers.get("webhook-signature")
    if not delivery_id or not timestamp or not signature_header:
        return False

    # Reject stale (or malformed) timestamps — replay protection.
    try:
        if abs(time.time() - int(timestamp)) > 300:
            return False
    except ValueError:
        return False

    key = base64.b64decode(secret.removeprefix("whsec_"))
    signed_content = f"{delivery_id}.{timestamp}.".encode() + raw_body
    expected = hmac.new(key, signed_content, hashlib.sha256).digest()

    # The header may carry several space-separated signatures (e.g. during secret
    # rotation) — accept if any "v1,..." entry matches.
    for part in signature_header.split(" "):
        version, _, signature = part.partition(",")
        if version != "v1" or not signature:
            continue
        if hmac.compare_digest(base64.b64decode(signature), expected):
            return True
    return False


if __name__ == "__main__":
    app.run(port=int(os.environ.get("PORT", 3000)))
