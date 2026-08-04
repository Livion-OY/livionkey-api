/**
 * LivionKey webhook receiver example (Express).
 *
 * Verifies each delivery's Standard Webhooks signature before accepting it.
 * See ../../../webhooks.md for the full documentation.
 */
import express from 'express';
import { createHmac, timingSafeEqual } from 'crypto';
import { Webhook } from 'standardwebhooks';

const SECRET = process.env.LIVION_WEBHOOK_SECRET; // "whsec_..."
if (!SECRET) {
    console.error('Set LIVION_WEBHOOK_SECRET to your subscription secret (whsec_...)');
    process.exit(1);
}

const webhook = new Webhook(SECRET);

const app = express();

// IMPORTANT: capture the RAW body. Parsing and re-serializing JSON changes the
// bytes and breaks signature verification.
app.post('/livion-webhook', express.raw({ type: 'application/json' }), (req, res) => {
    let event: any;
    try {
        // Verifies the HMAC signature and rejects timestamps outside the
        // replay-tolerance window. Throws on any failure.
        event = webhook.verify(req.body, {
            'webhook-id': req.header('webhook-id') ?? '',
            'webhook-timestamp': req.header('webhook-timestamp') ?? '',
            'webhook-signature': req.header('webhook-signature') ?? '',
        });
    } catch (e) {
        return res.status(401).send('invalid signature');
    }

    // Acknowledge immediately; do real processing asynchronously.
    res.status(200).send('ok');

    // Retries of a failed delivery reuse the same webhook-id — deduplicate on it
    // if your processing is not idempotent.
    const deliveryId = req.header('webhook-id');
    console.log(`Received ${event.type} (delivery ${deliveryId}):`, event);
});

/**
 * The same verification without the standard-webhooks dependency,
 * using only Node.js builtins.
 */
export function verifyManually(secret: string, headers: Record<string, string | undefined>, rawBody: Buffer): boolean {
    const id = headers['webhook-id'];
    const timestamp = headers['webhook-timestamp'];
    const signatureHeader = headers['webhook-signature'];
    if (!id || !timestamp || !signatureHeader) return false;

    // Reject stale (or malformed) timestamps — replay protection.
    const ts = Number(timestamp);
    if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > 300) return false;

    const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
    const expected = createHmac('sha256', key)
        .update(`${id}.${timestamp}.`)
        .update(rawBody)
        .digest();

    // The header may carry several space-separated signatures (e.g. during secret
    // rotation) — accept if any "v1,..." entry matches.
    return signatureHeader.split(' ').some((part) => {
        const [version, signature] = part.split(',');
        if (version !== 'v1' || !signature) return false;
        const candidate = Buffer.from(signature, 'base64');
        return candidate.length === expected.length && timingSafeEqual(candidate, expected);
    });
}

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`Listening for Livion webhooks on port ${port}`));
