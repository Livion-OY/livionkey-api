import requests
from hashlib import sha256
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import padding
import time

SERVICE_ACCOUNT_ID = 'yourServiceAccountId'
PRIVATE_KEY = '''-----BEGIN RSA PRIVATE KEY-----
...your private key here...
-----END RSA PRIVATE KEY-----'''
MAX_RETRIES = 5  # Adjust as needed

def sign_data(private_key, data):
    private_key_obj = serialization.load_pem_private_key(
        private_key.encode(),
        password=None,
        backend=default_backend()
    )
    signature = private_key_obj.sign(
        data,
        padding.PKCS1v15(),
        hashes.SHA256()
    )
    return signature

def call_api(method, url, body=None, retries=MAX_RETRIES):
    timestamp = str(int(time.time() * 1000))
    body_content = body if body else ''
    data_to_hash = f"{method}{url}{body_content}"
    hash_obj = sha256(data_to_hash.encode())
    data_to_sign = f"{SERVICE_ACCOUNT_ID}{timestamp}{hash_obj.hexdigest()}".encode()
    signature = sign_data(PRIVATE_KEY, data_to_sign)
    signature_b64 = base64.b64encode(signature).decode()

    headers = {
        'x-service-account-id': SERVICE_ACCOUNT_ID,
        'x-timestamp': timestamp,
        'x-signature': signature_b64,
        'Content-Type': 'application/json'
    }

    response = requests.request(method, url, headers=headers, data=body)

    if response.status_code == 429 and retries > 0:  # 429 is the Too Many Requests status code
        delay = (2 ** (MAX_RETRIES - retries)) * 1  # Exponential backoff in seconds
        time.sleep(delay)
        return call_api(method, url, body, retries - 1)

    return response.json()

if __name__ == "__main__":
    url = 'https://api.livionkey.com/v2/'
    response = call_api('GET', url)
    print(response)
