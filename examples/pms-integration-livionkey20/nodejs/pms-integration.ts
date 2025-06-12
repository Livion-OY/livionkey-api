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

// Interfaces (or import types generated with openapi-typescript)
interface AccessRight {
  id: string;
  name: string;
}

interface Automat {
  id: string;
  name: string;
}

interface IloqKeyContract {
  id: string;
  start: string;
  end?: string;
  accessRightIds?: string[];
  keys?: Array<{
    id: string;
    status?: string;
    storageInfo?: { pincode?: string };
  }>;
}

/**
 * Creates authentication headers for LivionKey API (same logic as mechanical example)
 */
function createAuthHeaders(
  method: string,
  url: string,
  body?: any
): Record<string, string> {
  const timestamp = Date.now().toString();
  const bodyString = body ? JSON.stringify(body) : "";

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
 * Generic helper for authenticated API calls
 */
async function makeAPICall<T>(
  method: string,
  endpoint: string,
  body?: any
): Promise<T> {
  const url = `${CONFIG.BASE_URL}${endpoint}`;
  const headers = createAuthHeaders(method, url, body);

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `API call failed: ${res.status} ${res.statusText} - ${errorText}`
    );
  }

  return (await res.json()) as T;
}

// ---------------------------------------------------------------------------
// 1. Fetch data required for mapping
// ---------------------------------------------------------------------------

async function fetchAccessRights(): Promise<AccessRight[]> {
  console.log("Fetching iLOQ access rights...");
  const response = await makeAPICall<{ data: AccessRight[] }>(
    "GET",
    "/iloq/accessRights?limit=100"
  );
  console.log(`Found ${response.data.length} access rights`);
  return response.data;
}

async function fetchAutomats(): Promise<Automat[]> {
  console.log("Fetching Key Automats...");
  const response = await makeAPICall<{ data: Automat[] }>(
    "GET",
    "/automats?limit=100"
  );
  console.log(`Found ${response.data.length} automats`);
  return response.data;
}

// ---------------------------------------------------------------------------
// 2. Booking → Key handover flow for iLOQ S5 keys
// ---------------------------------------------------------------------------

async function createIloqBookingContract(booking: {
  accessRightIds: string[]; // mapped access rights for the listing
  automatId: string; // automat associated with the listing
  guestName: string;
  guestEmail: string;
  checkInDate: string;
  checkOutDate: string;
}): Promise<IloqKeyContract> {
  console.log(`Creating iLOQ S5 key contract for ${booking.guestName}...`);

  const contractRequest = {
    input: {
      contractType: 1, // default contract (fetch & return)
      numberOfKeys: 1,
      accessRightIds: booking.accessRightIds,
      keyAutomatId: booking.automatId,
      start: booking.checkInDate,
      end: booking.checkOutDate,
      contact: {
        name: booking.guestName,
        email: booking.guestEmail,
        sendSms: false,
        sendEmail: false,
        language: "en",
      },
    },
  };

  const contract = await makeAPICall<IloqKeyContract>(
    "POST",
    "/iloq/keycontracts",
    contractRequest
  );

  const pincode = contract.keys?.[0]?.storageInfo?.pincode;
  if (pincode) {
    console.log(`Contract created! Pincode: ${pincode}`);
    console.log(`Send this pincode to the guest via PMS notification system.`);
  }

  return contract;
}

/**
 * Example 3: Get iLOQ contract status
 */
async function getIloqContractStatus(
  contractId: string
): Promise<IloqKeyContract> {
  console.log(`Checking status of iLOQ contract ${contractId}...`);

  const contract = await makeAPICall<IloqKeyContract>(
    "GET",
    `/iloq/keycontracts/${contractId}`
  );

  console.log(`iLOQ Contract Status:`);
  console.log(`- Start: ${contract.start}`);
  console.log(`- End: ${contract.end || "No end date"}`);
  contract.keys?.forEach((key: any, index: number) => {
    console.log(
      `- Key ${index + 1}: ${key.id} - Status: ${key.status || "Unknown"}`
    );
  });

  return contract;
}

/**
 * Example 4: Update iLOQ contract (extend checkout date)
 */
async function updateIloqContractEndDate(
  contractId: string,
  newEndDate: string
): Promise<IloqKeyContract> {
  console.log(`Updating iLOQ contract ${contractId} end date...`);

  const updateRequest = {
    end: newEndDate,
  };

  const updatedContract = await makeAPICall<IloqKeyContract>(
    "PATCH",
    `/iloq/keycontracts/${contractId}`,
    updateRequest
  );

  console.log("iLOQ Contract updated successfully");
  return updatedContract;
}

/**
 * Example 5: Cancel iLOQ contract
 */
async function cancelIloqContract(contractId: string): Promise<void> {
  console.log(`Cancelling iLOQ contract ${contractId}...`);

  await makeAPICall<void>("DELETE", `/iloq/keycontracts/${contractId}`);

  console.log("iLOQ Contract cancelled successfully");
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
    `Message: Hello ${guestName}, your iLOQ keys are ready! Use pincode: ${pincode}`
  );

  // Replace with your actual PMS notification integration:
  // await yourPMSEmailService.send({
  //   to: guestEmail,
  //   subject: "Your keys are ready for pickup",
  //   template: "key-pickup",
  //   data: { guestName, pincode }
  // });
}

// ---------------------------------------------------------------------------
// 3. Example PMS flow for iLOQ keys
// ---------------------------------------------------------------------------

async function demonstrateIloqPMSFlow(): Promise<void> {
  try {
    // Step 1: Fetch available access rights and automats (do this during setup)
    const [accessRights, automats] = await Promise.all([
      fetchAccessRights(),
      fetchAutomats(),
    ]);

    // Step 2: Map your properties to access rights and automats (store these mappings in your system)
    const listingMappings = new Map<
      string,
      { accessRightIds: string[]; automatId: string }
    >();

    // For demo we map first access right & first automat to listing-101
    if (accessRights.length === 0 || automats.length === 0) {
      throw new Error(
        "No access rights or automats found – cannot create mapping!"
      );
    }

    listingMappings.set("listing-101", {
      accessRightIds: [accessRights[0].id],
      automatId: automats[0].id,
    });

    // Step 3: When a new booking comes in, create a contract
    const bookingData = {
      ...listingMappings.get("listing-101")!,
      guestName: "Alice Example",
      guestEmail: "alice@example.com",
      checkInDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
      checkOutDate: new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000
      ).toISOString(), // +3 days
    };

    const contract = await createIloqBookingContract(bookingData);

    // Step 4: Send notification to guest via your PMS system
    const pincode = contract.keys?.[0]?.storageInfo?.pincode;
    if (pincode) {
      await sendGuestNotificationViaPMS(
        bookingData.guestEmail,
        bookingData.guestName,
        pincode
      );
    }

    // Step 5: Optional - Check contract status
    await getIloqContractStatus(contract.id);

    // Step 6: Optional - Update contract if needed
    // await updateIloqContractEndDate(contract.id, new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString());

    // Step 7: Optional - Cancel contract if booking is cancelled
    // await cancelIloqContract(contract.id);

    console.log(`iLOQ contract ${contract.id} created successfully.`);
  } catch (err) {
    console.error("iLOQ PMS integration flow failed:", err);
  }
}

demonstrateIloqPMSFlow();
