<?php
define('SERVICE_ACCOUNT_ID', 'yourServiceAccountId');
define('PRIVATE_KEY', '-----BEGIN RSA PRIVATE KEY-----
...your private key here...
-----END RSA PRIVATE KEY-----');
define('MAX_RETRIES', 5); // Adjust as needed

function callAPI($method, $url, $body = null, $retries = MAX_RETRIES) {
    $timestamp = (string) round(microtime(true) * 1000);
    $dataToHash = $method . $url . ($body ?: '');
    $hash = hash('sha256', $dataToHash);

    openssl_sign(SERVICE_ACCOUNT_ID . $timestamp . $hash, $signature, PRIVATE_KEY, OPENSSL_ALGO_SHA256);
    $signatureBase64 = base64_encode($signature);

    $headers = [
        'x-service-account-id: ' . SERVICE_ACCOUNT_ID,
        'x-timestamp: ' . $timestamp,
        'x-signature: ' . $signatureBase64,
        'Content-Type: application/json',
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    if ($body) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
    }

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if ($httpCode == 429 && $retries > 0) { // 429 is the Too Many Requests status code
        $delay = pow(2, MAX_RETRIES - $retries);
        sleep($delay);
        return callAPI($method, $url, $body, $retries - 1);
    }

    if ($response === false) {
        return curl_error($ch);
    }

    curl_close($ch);
    return json_decode($response, true);
}

// Usage
$url = 'https://api.livionkey.com/v2/';
$response = callAPI('GET', $url);
echo print_r($response, true);
?>
