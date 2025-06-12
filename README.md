# Livion API Examples

This repository contains various examples that demonstrate how to interact with the Livion API. The examples cover authentication methods, generating authorization headers, and making API requests using different programming languages.

## API Documentation

https://apidocsv2.livionkey.com/

## Authentication

https://apidocsv2.livionkey.com/#section/Authentication

The `examples/auth` directory includes language-specific implementations for creating authentication headers and sending requests to the Livion API. Each subfolder contains a complete example suited for the respective programming environment.

### Structure

The repository is structured as follows:

#### Authentication Examples (`auth/`)

The repository is structured as follows:

#### Authentication Examples (`auth/`)

- `go/`: Contains a Go example for generating authentication headers and making requests.
- `nodejs/`: Contains a Node.js example for generating authentication headers and making requests.
- `python/`: Contains a Python script showcasing how to generate headers and use the `requests` library for API communication.
- `php/`: Contains a PHP script showcasing how to generate headers and use cURL for API communication.

#### PMS Integration Examples

- `pms-integration-livionkey30/`: Mechanical key workflow with key automat

  - Key automat integration
  - Booking-to-key contract creation
  - Guest notification handling

- `pms-integration-livionkey20/`: iLOQ S5 key workflow with key automat
  - Mapping iLOQ access rights & automats to your listings
  - Creating iLOQ key contracts for bookings
  - Guest notification handling
