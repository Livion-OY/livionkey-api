import fetch from "node-fetch";
import { createHash, createSign } from "crypto";

// Configuration - Replace with your actual values
const CONFIG = {
  SERVICE_ACCOUNT_ID: "your-service-account-id",
  PRIVATE_KEY: `-----BEGIN RSA PRIVATE KEY-----
...your private key here...
-----END RSA PRIVATE KEY-----`,
  BASE_URL: "https://api.livionkey.com/v2",
};

// Generate these interfaces using: npm run generate-types
// Then import: import type { components } from "./types/api";
interface MechanicalKey {
  id: string;
  name?: string;
  status: { available: boolean };
  selectedStorage?: { automatId?: string };
}

interface KeyContract {
  id: string;
  start: string;
  end?: string;
  keys: Array<{
    id: string;
    status?: string;
    storageInfo?: { pincode?: string };
  }>;
}

/**
 * Creates authentication headers for LivionKey API
 */
function createAuthHeaders(
  method: string,
  url: string,
  body?: any
): Record<string, string> {
  const timestamp = Date.now().toString();
  const bodyString = body ? JSON.stringify(body) : "";

  // Create signature
  const dataToHash = `${method}${url}${bodyString}`;
  const hash = createHash("sha256").update(dataToHash).digest("hex");
  const dataToSign = `${CONFIG.SERVICE_ACCOUNT_ID}${timestamp}${hash}`;
  const signature = createSign("RSA-SHA256")
    .update(dataToSign)
    .sign(CONFIG.PRIVATE_KEY, "base64");

  return {
    "x-service-account-id": CONFIG.SERVICE_ACCOUNT_ID,
    "x-timestamp": timestamp,
    "x-signature": signature,
    "Content-Type": "application/json",
  };
}

/**
 * Makes authenticated API call to LivionKey
 */
async function makeAPICall<T>(
  method: string,
  endpoint: string,
  body?: any
): Promise<T> {
  const url = `${CONFIG.BASE_URL}${endpoint}`;
  const headers = createAuthHeaders(method, url, body);

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `API call failed: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  return (await response.json()) as T;
}

/**
 * Example 1: Fetch available mechanical keys
 */
async function fetchAvailableKeys(): Promise<MechanicalKey[]> {
  console.log("Fetching available keys...");

  const response = await makeAPICall<{ data: MechanicalKey[] }>(
    "GET",
    "/mechanical/keys?limit=100"
  );

  console.log(`Found ${response.data.length} keys`);
  return response.data;
}

/**
 * Example 2: Create a key contract for a booking
 */
async function createBookingContract(bookingData: {
  keyId: string;
  guestName: string;
  guestEmail: string;
  checkInDate: string;
  checkOutDate: string;
}): Promise<KeyContract> {
  console.log(`Creating contract for ${bookingData.guestName}...`);

  const contractRequest = {
    start: bookingData.checkInDate,
    end: bookingData.checkOutDate,
    contact: {
      name: bookingData.guestName,
      email: bookingData.guestEmail,
      // PMS handles notifications, so disable LivionKey notifications
      sendSms: false,
      sendEmail: false,
      language: "en",
    },
    keys: [{ id: bookingData.keyId }],
    freeLockerAfterFetch: false,
  };

  const contract = await makeAPICall<KeyContract>(
    "POST",
    "/mechanical/keycontracts",
    contractRequest
  );

  // Extract pincode for your PMS notification system
  const pincode = contract.keys[0]?.storageInfo?.pincode;
  if (pincode) {
    console.log(`Contract created! Pincode: ${pincode}`);
    console.log(`Send this pincode to guest via your PMS notification system`);
  }

  return contract;
}

/**
 * Example 3: Update a contract (extend checkout date)
 */
async function updateContractEndDate(
  contractId: string,
  newEndDate: string
): Promise<KeyContract> {
  console.log(`Updating contract ${contractId} end date...`);

  const updateRequest = {
    end: newEndDate,
  };

  const updatedContract = await makeAPICall<KeyContract>(
    "PATCH",
    `/mechanical/keycontracts/${contractId}`,
    updateRequest
  );

  console.log("Contract updated successfully");
  return updatedContract;
}

/**
 * Example 4: Get contract status
 */
async function getContractStatus(contractId: string): Promise<KeyContract> {
  console.log(`Checking status of contract ${contractId}...`);

  const contract = await makeAPICall<KeyContract>(
    "GET",
    `/mechanical/keycontracts/${contractId}`
  );

  console.log(`Contract Status:`);
  console.log(`- Start: ${contract.start}`);
  console.log(`- End: ${contract.end || "No end date"}`);
  contract.keys.forEach((key: any, index: number) => {
    console.log(
      `- Key ${index + 1}: ${key.id} - Status: ${key.status || "Unknown"}`
    );
  });

  return contract;
}

/**
 * Example 5: Cancel a contract
 */
async function cancelContract(contractId: string): Promise<void> {
  console.log(`Cancelling contract ${contractId}...`);

  await makeAPICall<void>("DELETE", `/mechanical/keycontracts/${contractId}`);

  console.log("Contract cancelled successfully");
}

/**
 * PMS Integration Flow Example
 */
async function demonstratePMSFlow(): Promise<void> {
  try {
    // Step 1: Fetch available keys (do this during setup)
    const keys = await fetchAvailableKeys();

    // Step 2: Map your properties to keys (store these mappings in your system)
    const propertyKeyMappings = new Map([
      ["room-101", keys[0]?.id], // Map room-101 to first available key
      ["room-102", keys[1]?.id], // Map room-102 to second available key
    ]);

    // Step 3: When a new booking comes in, create a contract
    const bookingData = {
      keyId: propertyKeyMappings.get("room-101")!,
      guestName: "John Doe",
      guestEmail: "john.doe@example.com",
      checkInDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      checkOutDate: new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000
      ).toISOString(), // In 3 days
    };

    const contract = await createBookingContract(bookingData);

    // Step 4: Send notification to guest via your PMS system
    const pincode = contract.keys[0]?.storageInfo?.pincode;
    if (pincode) {
      await sendGuestNotificationViaPMS(
        bookingData.guestEmail,
        bookingData.guestName,
        pincode
      );
    }

    // Step 5: Optional - Check contract status
    await getContractStatus(contract.id);

    // Step 6: Optional - Update contract if needed
    // await updateContractEndDate(contract.id, new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString());

    // Step 7: Optional - Cancel contract if booking is cancelled
    // await cancelContract(contract.id);
  } catch (error) {
    console.error("PMS Integration flow failed:", error);
  }
}

/**
 * Example of sending notification via your PMS system
 * Replace this with your actual notification service
 */
async function sendGuestNotificationViaPMS(
  guestEmail: string,
  guestName: string,
  pincode: string
): Promise<void> {
  console.log("--- Sending notification via PMS ---");
  console.log(`To: ${guestEmail}`);
  console.log(
    `Message: Hello ${guestName}, your keys are ready! Use pincode: ${pincode}`
  );

  // Replace with your actual PMS notification integration:
  // await yourPMSEmailService.send({
  //   to: guestEmail,
  //   subject: "Your keys are ready for pickup",
  //   template: "key-pickup",
  //   data: { guestName, pincode }
  // });
}

demonstratePMSFlow();

// Webhook documentation and implementation examples coming later
