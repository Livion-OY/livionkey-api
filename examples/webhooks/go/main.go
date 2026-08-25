// LivionKey webhook receiver example (net/http).
//
// Verifies each delivery's Standard Webhooks signature before accepting it.
// See ../../../webhooks.md for the full documentation.
package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"io"
	"log"
	"math"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	standardwebhooks "github.com/standard-webhooks/standard-webhooks/libraries/go"
)

func main() {
	secret := os.Getenv("LIVION_WEBHOOK_SECRET") // "whsec_..."
	if secret == "" {
		log.Fatal("Set LIVION_WEBHOOK_SECRET to your subscription secret (whsec_...)")
	}

	webhook, err := standardwebhooks.NewWebhook(secret)
	if err != nil {
		log.Fatalf("invalid secret: %v", err)
	}

	http.HandleFunc("/livion-webhook", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		// IMPORTANT: verify the RAW body bytes, not a parsed/re-serialized version.
		rawBody, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "read error", http.StatusBadRequest)
			return
		}

		// Verifies the HMAC signature and rejects timestamps outside the
		// replay-tolerance window.
		if err := webhook.Verify(rawBody, r.Header); err != nil {
			http.Error(w, "invalid signature", http.StatusUnauthorized)
			return
		}

		// Acknowledge immediately; do real processing asynchronously.
		w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, "ok")

		// Retries of a failed delivery reuse the same webhook-id — deduplicate on it
		// if your processing is not idempotent.
		log.Printf("Received delivery %s: %s", r.Header.Get("webhook-id"), rawBody)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	log.Printf("Listening for Livion webhooks on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

// verifyManually is the same verification without the standard-webhooks
// dependency, using only the Go standard library.
func verifyManually(secret string, headers http.Header, rawBody []byte) bool {
	id := headers.Get("webhook-id")
	timestamp := headers.Get("webhook-timestamp")
	signatureHeader := headers.Get("webhook-signature")
	if id == "" || timestamp == "" || signatureHeader == "" {
		return false
	}

	// Reject stale timestamps (replay protection).
	ts, err := strconv.ParseInt(timestamp, 10, 64)
	if err != nil || math.Abs(float64(time.Now().Unix()-ts)) > 300 {
		return false
	}

	key, err := base64.StdEncoding.DecodeString(strings.TrimPrefix(secret, "whsec_"))
	if err != nil {
		return false
	}
	mac := hmac.New(sha256.New, key)
	fmt.Fprintf(mac, "%s.%s.", id, timestamp)
	mac.Write(rawBody)
	expected := mac.Sum(nil)

	// The header may carry several space-separated signatures (e.g. during secret
	// rotation) — accept if any "v1,..." entry matches.
	for _, part := range strings.Split(signatureHeader, " ") {
		version, signature, found := strings.Cut(part, ",")
		if !found || version != "v1" {
			continue
		}
		candidate, err := base64.StdEncoding.DecodeString(signature)
		if err == nil && hmac.Equal(candidate, expected) {
			return true
		}
	}
	return false
}
