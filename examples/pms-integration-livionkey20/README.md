# PMS Integration with LivionKey API - iLOQ S5 Keys

This example demonstrates how to integrate Property Management Systems (PMS) with iLOQ S5 keys using Livion Key Automats.

## Overview

LivionKey's iLOQ S5 key management system allows property managers to automate electronic key handovers for guests using secure Key Automats. This integration enables seamless booking-to-key management workflow with digital access rights.

## Integration Flow

### 1. Configuration Phase

#### Step 1: Service Account Setup

- Generate a LivionKey service account via the LivionKey User interface
- Store the private key securely in your PMS system
- Note down the Service Account ID for API authentication

#### Step 2: Access Rights & Automat Mapping

- Fetch available iLOQ access rights using the [Get Access Rights API](https://apidocsv2.livionkey.com/#tag/iLOQ/operation/IloqController_getAccessRights)
- Fetch available Key Automats using the [Get Automats API](https://apidocsv2.livionkey.com/#tag/Automats/operation/AutomatsController_getAutomats)
- Map your property listings/rooms to:
  - One or more iLOQ access rights (defines what doors/areas the key can access)
  - One Key Automat (defines where the key can be fetched and returned)
- Store these mappings in your PMS database

### 2. Operational Flow

#### New Booking Process

When a new booking arrives in your PMS:

1. **Create iLOQ Key Contract**: Use the [Create iLOQ Contract API](https://apidocsv2.livionkey.com/#tag/iLOQ/operation/IloqController_createContract) to generate an electronic key handover contract
2. **Get Pincode**: The API response includes the pincode for key retrieval from the Key Automat
3. **PMS Guest Notification**: Your PMS sends guest notification with pickup instructions and pincode using your own messaging system
4. **Key Retrieval**: Guest uses the provided pincode at the designated Key Automat to retrieve the electronic iLOQ key
5. **Key Return**: Guest returns the electronic key to the same or designated Key Automat at checkout

**Note**: You can choose to disable LivionKey's automatic notifications and handle all guest communication through your PMS by setting `sendSms: false` and `sendEmail: false` in the contract request.

## API Endpoints Used

### Primary Endpoints

- `GET /iloq/accessRights` - List and map access rights to your properties
- `GET /automats` - List Key Automats for key pickup/return locations
- `POST /iloq/keycontracts` - Create electronic key handover contracts for bookings
- `GET /iloq/keycontracts/{id}` - Monitor contract status
- `PATCH /iloq/keycontracts/{id}` - Update contract details if needed
- `DELETE /iloq/keycontracts/{id}` - Cancel contracts when bookings are cancelled

### Key Differences from Mechanical Keys

- **Access Rights**: iLOQ keys use access rights instead of physical key assignments
- **Multiple Access Rights**: One booking can have multiple access rights mapped to different areas
- **Electronic Keys**: Keys are programmed electronically with specific access permissions
- **Contract Type**: Supports different contract types for various use cases

### Advanced Features

#### Webhooks (Optional)

Webhook documentation and examples coming later.

## Authentication

All API calls require signature-based authentication using:

- Service Account ID
- Timestamp
- Request signature using your private key

See the [Authentication Documentation](https://apidocsv2.livionkey.com/#section/Authentication) for detailed implementation.

## Example Implementation

The `nodejs/` directory contains a example Node.js implementation demonstrating:

- Authentication setup
- Access rights and automats listing
- Property-to-access-rights mapping
- Contract creation for bookings
- Complete PMS integration flow example
- Contract management (status check, update, cancellation)

## Getting Started

1. Review the Node.js example in the `nodejs/` directory
2. Set up your service account credentials in the CONFIG object
3. Run `npm install` and `npm run generate-types` to set up dependencies
4. Test access rights and automats listing functions
5. Create your property-to-access-rights mappings
6. Implement contract creation for your booking workflow

## iLOQ S5 Specific Considerations

- **Access Rights Mapping**: Carefully map access rights to ensure guests have appropriate access to their assigned areas
- **Number of Keys**: Specify the number of electronic keys needed per booking (typically 1-2)
- **Contract Type**: Use appropriate contract type based on your use case (default: fetch & return)
- **Key Automat Selection**: Choose Key Automats strategically based on property location and guest convenience

## Support

For technical support and API questions, contact LivionKey support.
