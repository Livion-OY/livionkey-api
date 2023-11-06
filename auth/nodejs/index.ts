import fetch from 'universal-fetch';
import { createHash, createSign } from 'crypto';

const SERVICE_ACCOUNT_ID = 'yourServiceAccountId';
const PRIVATE_KEY = 'yourPrivateKey';
const MAX_RETRIES = 5; // Adjust as needed

async function callAPI(method: string, url: string, body: string | null = null, retries: number = MAX_RETRIES): Promise<any> {
    const timestamp = Date.now().toString();
    const dataToHash = `${method}${url}${body || ''}`;
    const hash = createHash('sha256').update(dataToHash).digest('hex');
    const signature = createSign('RSA-SHA256').update(`${SERVICE_ACCOUNT_ID}${timestamp}${hash}`).sign(PRIVATE_KEY, 'base64');

    const response = await fetch(url, {
        method: method,
        headers: {
            'x-service-account-id': SERVICE_ACCOUNT_ID,
            'x-timestamp': timestamp,
            'x-signature': signature,
            'Content-Type': 'application/json'
        },
        body: method === 'POST' ? body : undefined
    });

    if (response.status === 429 && retries > 0) { // 429 is the Too Many Requests status code
        const delay = (2 ** (MAX_RETRIES - retries)) * 1000; // Exponential backoff in milliseconds
        await new Promise(resolve => setTimeout(resolve, delay));
        return callAPI(method, url, body, retries - 1);
    }

    return await response.json();
}

(async () => {
    const url = 'https://api.livionkey.com/v2/';
    console.log(await callAPI('GET', url));
})();