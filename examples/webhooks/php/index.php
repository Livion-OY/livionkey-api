<?php
/**
 * LivionKey webhook receiver example (plain PHP, runnable with `php -S`).
 *
 * Verifies each delivery's Standard Webhooks signature before accepting it.
 * See ../../../webhooks.md for the full documentation.
 */

require __DIR__ . '/vendor/autoload.php';

use StandardWebhooks\Webhook;

$secret = getenv('LIVION_WEBHOOK_SECRET'); // "whsec_..."
if ($secret === false || $secret === '') {
    fwrite(STDERR, "Set LIVION_WEBHOOK_SECRET to your subscription secret (whsec_...)\n");
    exit(1);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) !== '/livion-webhook') {
    http_response_code(404);
    exit;
}

// IMPORTANT: verify the RAW body bytes, not a parsed/re-serialized version.
$rawBody = file_get_contents('php://input');

// The library expects lowercase header names.
$headers = array_change_key_case(getallheaders(), CASE_LOWER);

try {
    // Verifies the HMAC signature and rejects timestamps outside the
    // replay-tolerance window. Throws on any failure.
    $event = (new Webhook($secret))->verify($rawBody, $headers);
} catch (\Exception $e) {
    http_response_code(401);
    echo 'invalid signature';
    exit;
}

// Acknowledge immediately; do real processing asynchronously.
http_response_code(200);
echo 'ok';

// Retries of a failed delivery reuse the same webhook-id — deduplicate on it
// if your processing is not idempotent.
error_log(sprintf('Received %s (delivery %s)', $event['type'] ?? '?', $headers['webhook-id'] ?? '?'));

/**
 * The same verification without the standard-webhooks dependency,
 * using only the PHP standard library.
 *
 * @param array<string,string> $headers lowercase header names
 */
function verifyManually(string $secret, array $headers, string $rawBody): bool
{
    $id = $headers['webhook-id'] ?? '';
    $timestamp = $headers['webhook-timestamp'] ?? '';
    $signatureHeader = $headers['webhook-signature'] ?? '';
    if ($id === '' || $timestamp === '' || $signatureHeader === '') {
        return false;
    }

    // Reject stale timestamps (replay protection).
    if (abs(time() - (int) $timestamp) > 300) {
        return false;
    }

    $key = base64_decode(preg_replace('/^whsec_/', '', $secret));
    $expected = base64_encode(hash_hmac('sha256', "{$id}.{$timestamp}.{$rawBody}", $key, true));

    // The header may carry several space-separated signatures (e.g. during secret
    // rotation) — accept if any "v1,..." entry matches.
    foreach (explode(' ', $signatureHeader) as $part) {
        $pieces = explode(',', $part, 2);
        if (count($pieces) === 2 && $pieces[0] === 'v1' && hash_equals($expected, $pieces[1])) {
            return true;
        }
    }
    return false;
}
