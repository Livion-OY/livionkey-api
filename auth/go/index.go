package main

import (
	"bytes"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"crypto/x509"
	"encoding/base64"
	"encoding/pem"
	"fmt"
	"io"
	"io/ioutil"
	"math/big"
	"net/http"
	"time"
)

const SERVICE_ACCOUNT_ID = "yourServiceAccountId"
const PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
...your private key here...
-----END RSA PRIVATE KEY-----`
const MAX_RETRIES = 5 // Adjust as needed

func callAPI(method string, url string, body io.Reader, retries int) ([]byte, error) {
	timestamp := fmt.Sprintf("%d", time.Now().UnixNano()/int64(time.Millisecond))
	dataToHash := method + url
	if body != nil {
		bodyBytes, _ := ioutil.ReadAll(body)
		dataToHash += string(bodyBytes)
		// If body is read, it needs to be recreated for the HTTP request
		body = bytes.NewBuffer(bodyBytes)
	}

	hashed := sha256.Sum256([]byte(dataToHash))
	signature, err := signData(SERVICE_ACCOUNT_ID+timestamp+fmt.Sprintf("%x", hashed))
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest(method, url, body)
	if err != nil {
		return nil, err
	}

	req.Header.Add("x-service-account-id", SERVICE_ACCOUNT_ID)
	req.Header.Add("x-timestamp", timestamp)
	req.Header.Add("x-signature", signature)
	if method == "POST" {
		req.Header.Add("Content-Type", "application/json")
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusTooManyRequests && retries > 0 {
		delay := time.Duration((1 << (MAX_RETRIES - retries)) * 1000) * time.Millisecond
		time.Sleep(delay)
		return callAPI(method, url, body, retries-1)
	}

	return ioutil.ReadAll(resp.Body)
}

func signData(data string) (string, error) {
	block, _ := pem.Decode([]byte(PRIVATE_KEY))
	if block == nil {
		return "", fmt.Errorf("failed to decode PEM block containing the key")
	}

	privKey, err := x509.ParsePKCS1PrivateKey(block.Bytes)
	if err != nil {
		return "", err
	}

	rng := rand.Reader
	hashed := sha256.Sum256([]byte(data))
	signature, err := rsa.SignPKCS1v15(rng, privKey, crypto.SHA256, hashed[:])
	if err != nil {
		return "", err
	}

	return base64.StdEncoding.EncodeToString(signature), nil
}

func main() {
	url := "https://api.livionkey.com/v2/"
	response, err := callAPI("GET", url, nil, MAX_RETRIES)
	if err != nil {
		fmt.Println("Error calling API:", err)
		return
	}
	fmt.Println("Response:", string(response))
}