# PMS Integration with LivionKey API

This example demonstrates how to integrate Property Management Systems (PMS) with LivionKey's mechanical key management system using Key Automats.

## Overview

LivionKey's mechanical key management system allows property managers to automate key handovers for guests using secure Key Automats. This integration enables seamless booking-to-key management workflow.

## Integration Flow

### 1. Configuration Phase

#### Step 1: Service Account Setup

- Generate a LivionKey service account via the LivionKey User interface
- Store the private key securely in your PMS system
- Note down the Service Account ID for API authentication

#### Step 2: Key Mapping

- Fetch available keys from LivionKey using the [List Mechanical Keys API](https://apidocsv2.livionkey.com/#tag/Mechanical-Keys/operation/list)
- Map your property listings/rooms to the corresponding keys stored in LivionKey Automats
- Store these mappings in your PMS database

### 2. Operational Flow

#### New Booking Process

When a new booking arrives in your PMS:

1. **Create Key Contract**: Use the [Create Mechanical Key Contract API](https://apidocsv2.livionkey.com/#tag/Mechanical-Key-Contracts/operation/create) to generate a key handover contract
2. **Get Pincode**: The API response includes the pincode for key retrieval
3. **PMS Guest Notification**: Your PMS sends guest notification with pickup instructions and pincode using your own messaging system
4. **Key Retrieval**: Guest uses the provided pincode at the Key Automat to retrieve keys
5. **Key Return**: Guest returns keys to the same or designated Key Automat at checkout

**Note**: You can choose to disable LivionKey's automatic notifications and handle all guest communication through your PMS by setting `sendSms: false` and `sendEmail: false` in the contract request.

## API Endpoints Used

### Primary Endpoints

- `GET /mechanical/keys` - List and map keys to your properties
- `POST /mechanical/keycontracts` - Create key handover contracts for bookings
- `GET /mechanical/keycontracts` - Monitor contract status
- `PATCH /mechanical/keycontracts/{id}` - Update contract details if needed

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
- Key listing and mapping
- Contract creation for bookings
- Complete PMS integration flow example

## Getting Started

1. Review the Node.js example in the `nodejs/` directory
2. Set up your service account credentials in the CONFIG object
3. Run `npm install` and `npm run generate-types` to set up dependencies
4. Test key listing and mapping functions
5. Implement contract creation for your booking workflow

## Support

For technical support and API questions, contact LivionKey support.
