define({ "api": [
  {
    "type": "get",
    "url": "/contracts/public/:id/:hash/key/:keyId/opendoor-cancel",
    "title": "GET /contracts/public/:id/:hash/key/:keyId/opendoor-cancel",
    "version": "3.5.0",
    "name": "ContractCancelDeviceDoorOpenOperationGet",
    "group": "Contracts",
    "permission": [
      {
        "name": "non-authenticated"
      }
    ],
    "description": "<p>Fetch specific contract by hash</p>",
    "parameter": {
      "fields": {
        "Path": [
          {
            "group": "Path",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>contract id</p>"
          },
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "hash",
            "description": "<p>contract hash</p>"
          },
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "keyId",
            "description": "<p>key id</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\nok",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "400",
            "description": "<p>Contract not found</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          }
        ]
      }
    },
    "filename": "./routers/contracts.js",
    "groupTitle": "Contracts"
  },
  {
    "type": "delete",
    "url": "/contracts/:id",
    "title": "DELETE /contracts/:id",
    "version": "3.5.0",
    "name": "ContractDelete",
    "group": "Contracts",
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "description": "<p>Remove contract</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>authorization JWT token <code>Bearer {token}</code></p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Path": [
          {
            "group": "Path",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>contract Object ID</p>"
          }
        ],
        "Query": [
          {
            "group": "Query",
            "type": "Boolean",
            "optional": true,
            "field": "cancellation",
            "description": "<p>if true LivionKey System will send cancellation notification</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Contract",
            "description": "<p>deleted successfully</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "400",
            "description": "<p>Missing query parameters / Delete contract failed</p>"
          }
        ]
      }
    },
    "filename": "./routers/contracts.js",
    "groupTitle": "Contracts"
  },
  {
    "type": "get",
    "url": "/contracts/:id",
    "title": "GET /contracts/:id",
    "version": "3.5.0",
    "name": "ContractGet",
    "group": "Contracts",
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "description": "<p>Fetch specific contract</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>authorization JWT token <code>Bearer {token}</code></p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Path": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>contract Object id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "contract",
            "description": "<p>Desired contract</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"keyId\": \"A4324\",\n  \"devices\": [{\"id\": \"123456\", \"keyId\": \"A4324\"}],\n  \"contractId\": \"543553\",\n  \"pincode\": \"594395\",\n  \"start\": \"2018-02-14T08:06:30.000Z\",\n  \"end\": \"2018-02-17T08:06:30.000Z\",\n  \"person\": \"John Doe\",\n  \"contacts\": [{\"name\": \"John Doe\", \"email\": \"john.doe@livion.fi\", \"phoneNumber\": \"+358123456789\", \"sendEmail\": true, \"sendSms\": false, \"language\": \"fi-fi\"}]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "400",
            "description": "<p>Contract not found</p>"
          }
        ]
      }
    },
    "filename": "./routers/contracts.js",
    "groupTitle": "Contracts"
  },
  {
    "type": "post",
    "url": "/contracts/:id/pincode",
    "title": "POST /contracts/:id/pincode",
    "version": "3.5.0",
    "name": "ContractPincodePost",
    "group": "Contracts",
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "description": "<p>Regenerate pincode for contract</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>authorization JWT token <code>Bearer {token}</code></p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Path": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>contract Object ID</p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "Object[]",
            "optional": false,
            "field": "devices",
            "description": "<p>Mandatory devices. Array of id: device ID, keyId: key ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "pincode",
            "description": "<p>Generated pincode</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"pincode\": \"594395\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "400",
            "description": "<p>No devices</p>"
          }
        ]
      }
    },
    "filename": "./routers/contracts.js",
    "groupTitle": "Contracts"
  },
  {
    "type": "post",
    "url": "/contracts/:id",
    "title": "POST /contracts/:id",
    "version": "3.5.0",
    "name": "ContractPost",
    "group": "Contracts",
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "description": "<p>Contract update. Can be used for validity change or pincode change</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>authorization JWT token <code>Bearer {token}</code></p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Path": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>contract Object ID</p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "Object[]",
            "optional": false,
            "field": "devices",
            "description": "<p>Mandatory devices. Array of id: device ID, keyId: key ID</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "start",
            "description": "<p>Optional start time of contract.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "end",
            "description": "<p>Optional end time of contract, if not null perm should false/null.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "person",
            "description": "<p>Optional contract owner (person name).</p>"
          },
          {
            "group": "body",
            "type": "Object[]",
            "optional": true,
            "field": "contacts",
            "description": "<p>Optional list of contacts witl fields: name: String, email: String, phoneNumber: String, sendSms: Boolean, sendEmail: Boolean, language: String.</p>"
          },
          {
            "group": "body",
            "type": "Boolean",
            "optional": true,
            "field": "perm",
            "description": "<p>Optional permanent contract, if true end should be null.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "freeText",
            "description": "<p>Optional free Tezt to be added as a complement to email templates</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "pincode",
            "description": "<p>Optional pincode</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"devices\": [{\"id\": \"123456\", \"keyId\": \"A4324\"}],\n  \"start\": \"2018-02-14T08:06:30.000Z\",\n  \"end\": \"2018-02-17T08:06:30.000Z\",\n  \"pincode\": \"594395\",\n  \"person\": \"John Doe 2\",\n  \"contacts\": [{\"name\": \"John Doe 2\", \"email\": \"john.doe2@livion.fi\", \"phoneNumber\": \"+358123456789\", \"sendEmail\": true, \"sendSms\": false, \"language\": \"fi-fi\"}]\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "Contract",
            "description": "<p>updated</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "400",
            "description": "<p>Missing contract parameters <br />Missing deviceId from parameters <br />No devices <br />Contract not found <br />Start time should be before End time <br />Start time should be in the future <br />Overlapping contract existing <br />Pincode already used in existing contracts</p>"
          }
        ]
      }
    },
    "filename": "./routers/contracts.js",
    "groupTitle": "Contracts"
  },
  {
    "type": "get",
    "url": "/contracts/public/:id/:hash",
    "title": "GET /contracts/public/:id/:hash",
    "version": "3.5.0",
    "name": "ContractPublicGet",
    "group": "Contracts",
    "permission": [
      {
        "name": "non-authenticated"
      }
    ],
    "description": "<p>Fetch specific contract by hash</p>",
    "parameter": {
      "fields": {
        "Path": [
          {
            "group": "Path",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>contract id</p>"
          },
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "hash",
            "description": "<p>contract hash</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "contract",
            "description": "<p>Desired contract</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"devices\": [{\"id\": \"123456\", \"keyId\": \"A4324\"}],\n  \"contractId\": \"543553\",\n  \"pincode\": \"594395\",\n  \"start\": \"2018-02-14T08:06:30.000Z\",\n  \"end\": \"2018-02-17T08:06:30.000Z\",\n  \"person\": \"John Doe\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "400",
            "description": "<p>Contract not found</p>"
          }
        ]
      }
    },
    "filename": "./routers/contracts.js",
    "groupTitle": "Contracts"
  },
  {
    "type": "post",
    "url": "/contracts",
    "title": "POST /contracts",
    "version": "3.5.0",
    "name": "ContractsPost",
    "group": "Contracts",
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "description": "<p>Contract create</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>authorization JWT token <code>Bearer {token}</code></p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "contractId",
            "description": "<p>Mandatory contractId.</p>"
          },
          {
            "group": "body",
            "type": "Object[]",
            "optional": false,
            "field": "devices",
            "description": "<p>Mandatory devices. Array of id: device ID, keyId: key ID</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "start",
            "description": "<p>Mandatory start time of contract.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "person",
            "description": "<p>Mandatory contract owner (person name).</p>"
          },
          {
            "group": "body",
            "type": "Object[]",
            "optional": false,
            "field": "contacts",
            "description": "<p>Mandatory list of contacts with fields: email: String, phoneNumber: String, sendSms: Boolean, sendEmail: Boolean, language: String ('fi-fi', 'en-gb', 'swe-swe', 'no-no', 'da-da').</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "end",
            "description": "<p>Optional end time of contract, if not null perm should false/null.</p>"
          },
          {
            "group": "body",
            "type": "Boolean",
            "optional": true,
            "field": "perm",
            "description": "<p>Optional permanent contract, if true end should be null.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "freeText",
            "description": "<p>Optional free Tezt to be added as a complement to email templates</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "pincode",
            "description": "<p>Optional pincode. If pincode is not provided api will generate it.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "type",
            "description": "<p>Optional contract type. Type can be 'fetch', 'return', 'default' or undefined. Fetch type requires start time, Return type requires end time, default or undefined are the default usage.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"contractId\": \"543553\"\n  \"devices\": [{\"id\": \"123456\", \"keyId\": \"A4324\"}]\n  \"start\": \"2018-02-14T08:06:30.000Z\"\n  \"end\": \"2018-02-17T08:06:30.000Z\"\n  \"person\": \"John Doe\",\n  \"contacts\": [{\"email\": \"john.doe@livion.fi\", \"phoneNumber\": \"+358123456789\", \"sendEmail\": true, \"sendSms\": false, \"language\": \"fi-fi\"}]\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Contract id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "pincode",
            "description": "<p>Generated pincode</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"id\": \"a668e8f7f686a79879b976c65\"\n  \"pincode\": \"594395\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "400",
            "description": "<p>Missing contract parameters <br />Missing deviceId from parameters <br />Missing keyId from parameters <br />Missing contractId from parameters <br />Missing start from parameters <br />Missing person from parameters <br />Missing contacts from parameters <br />Missing end from parameters <br />No devices <br />ContractId already in use <br />KeyId not found <br />Start time should be before End time <br />Start time should be in the future <br />Overlapping contract existing <br />Pincode already used in existing contracts</p>"
          }
        ]
      }
    },
    "filename": "./routers/contracts.js",
    "groupTitle": "Contracts"
  },
  {
    "type": "get",
    "url": "/contracts/public/:id/:hash/key/:keyId/opendoor",
    "title": "GET /contracts/public/:id/:hash/key/:keyId/opendoor",
    "version": "3.5.0",
    "name": "ContratOpenDeviceDoorGet",
    "group": "Contracts",
    "permission": [
      {
        "name": "non-authenticated"
      }
    ],
    "description": "<p>Fetch specific contract by hash</p>",
    "parameter": {
      "fields": {
        "Path": [
          {
            "group": "Path",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>contract id</p>"
          },
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "hash",
            "description": "<p>contract hash</p>"
          },
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "keyId",
            "description": "<p>key id</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\nok",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "400",
            "description": "<p>Contract not found</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          }
        ]
      }
    },
    "filename": "./routers/contracts.js",
    "groupTitle": "Contracts"
  },
  {
    "type": "get",
    "url": "/devices/:id/accessrights",
    "title": "GET /devices/:id/accessrights",
    "version": "3.5.0",
    "name": "AccessRightsGet",
    "group": "Devices",
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "description": "<p>(ONLY FOR KEYPADS) Fetch all LivionKey device AccessRights</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>authorization JWT token <code>Bearer {token}</code></p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Path": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>device id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "AccessRights",
            "description": "<p>List of accessRights</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[{\n  \"id\": \"60531613299ae000094cd278\",\n  \"accessRightId\": \"543553\",\n  \"devices\": [{\"id\": \"123456\"],\n  \"pincode\": \"594395\",\n  \"start\": \"2018-02-14T08:06:30.000Z\",\n  \"end\": \"2018-02-17T08:06:30.000Z\",\n  \"perm\": null,\n  \"person\": \"John Doe\",\n  \"contacts\": [{\"email\": \"john.doe@livion.fi\", \"phoneNumber\": \"+358123456789\", \"sendEmail\": true, \"sendSms\": false, \"language\": \"fi-fi\"}],\n  \"freeText\": null,\n  \"tag\": [\"livion/key/customer\"],\n  \"pincode\": \"123564\"\n}]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "400",
            "description": "<p>Accesrights not found <br /> No devices</p>"
          }
        ]
      }
    },
    "filename": "./routers/devices.js",
    "groupTitle": "Devices"
  },
  {
    "type": "get",
    "url": "/devices/:id/contracts",
    "title": "GET /devices/:id/contracts",
    "version": "3.5.0",
    "name": "ContractsGet",
    "group": "Devices",
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "description": "<p>(ONLY FOR KEY30,KEY1) Fetch all LivionKey device contracts</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>authorization JWT token <code>Bearer {token}</code></p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Path": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>device id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "contracts",
            "description": "<p>List of contracts</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[{\n  \"id\": \"60531613299ae000094cd278\",\n  \"contractId\": \"543553\",\n  \"devices\": [{\"id\": \"123456\", \"keyId\": \"A4324\"}],\n  \"pincode\": \"594395\",\n  \"start\": \"2018-02-14T08:06:30.000Z\",\n  \"end\": \"2018-02-17T08:06:30.000Z\",\n  \"perm\": null,\n  \"person\": \"John Doe\",\n  \"contacts\": [{\"email\": \"john.doe@livion.fi\", \"phoneNumber\": \"+358123456789\", \"sendEmail\": true, \"sendSms\": false, \"language\": \"fi-fi\"}],\n  \"freeText\": null,\n  \"tag\": [\"livion/key/customer\"],\n  \"pincode\": \"123564\"\n}]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "400",
            "description": "<p>Contract not found <br /> No devices</p>"
          }
        ]
      }
    },
    "filename": "./routers/devices.js",
    "groupTitle": "Devices"
  },
  {
    "type": "get",
    "url": "/devices/:id",
    "title": "GET /devices/:id",
    "version": "3.5.0",
    "name": "DeviceGet",
    "group": "Devices",
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "description": "<p>Fetch specific LivionKey device</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>authorization JWT token <code>Bearer {token}</code></p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Path": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>Device id in URL path (<code>/devices/:id</code>).</p>"
          }
        ],
        "Query": [
          {
            "group": "Query",
            "type": "String",
            "optional": true,
            "field": "extend",
            "description": "<p>Optional query string extensions. Use <code>lockers</code> to include locker data.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example (without extend):",
          "content": "/devices/000001",
          "type": "url"
        },
        {
          "title": "Request-Example (with extend query string):",
          "content": "/devices/000001?extend=lockers",
          "type": "url"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "device",
            "description": "<p>Device data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response (without extend):",
          "content": "HTTP/1.1 200 OK\n{\n  \"id\": \"00054\",\n  \"name\": \"Gustavsberginkatu 13 Aula\",\n  \"tag\": \"livion/internal/oulu\",\n  \"connectionState\": \"connected\",\n  \"synced\": {\n       \"timestamp\": \"2020-12-03T13:21:30.574Z\",\n       \"isSynced\": true\n  }\n}",
          "type": "json"
        },
        {
          "title": "Success-Response (with extend=lockers):",
          "content": "HTTP/1.1 200 OK\n{\n  \"id\": \"00054\",\n  \"name\": \"Gustavsberginkatu 13 Aula\",\n  \"tag\": \"livion/internal/oulu\",\n  \"connectionState\": \"connected\",\n  \"synced\": {\n       \"timestamp\": \"2020-12-03T13:21:30.574Z\",\n       \"isSynced\": true\n  },\n  \"lockers\": [{\n    \"lockerIndex\": \"0\",\n    \"state\": \"lockerWithKey\",\n    \"isKeyInside\": true,\n    \"key\": { \"id\": \"key1\", \"name\": \"Main Door\" }\n  }]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "400",
            "description": "<p>Device not found</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Error</p>"
          }
        ]
      }
    },
    "filename": "./routers/devices.js",
    "groupTitle": "Devices"
  },
  {
    "type": "get",
    "url": "/devices/:id/keys",
    "title": "GET /devices/:id/keys",
    "version": "3.5.0",
    "name": "DeviceKeysGet",
    "group": "Devices",
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "description": "<p>(ONLY FOR KEY30,KEY1) Fetch all LivionKey device keys</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>authorization JWT token <code>Bearer {token}</code></p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Path": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>device id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "keys",
            "description": "<p>List of keys</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[{\n  \"keyId\": \"A1234\",\n  \"keyName\": \"Main Door\",\n  \"shared\": false,\n  \"contracts\": [{\n       \"id\": \"60531613299ae000094cd787\",\n       \"contractId\": \"Contract1\",\n       \"start\": \"2018-02-14T08:06:30.000Z\",\n       \"end\": \"2018-02-17T08:06:30.000Z\",\n       \"perm\": false,\n       \"pincode\": \"594395\",\n       \"devices\": [{\"id\": \"123456\", \"keyId\": \"A1234\", \"product\": \"key30\"}],\n       \"recurrent\": [],\n       \"person\": \"John Doe\",\n       \"contacts\": [{\"name\": \"John Doe\", \"email\": \"john.doe@livion.fi\", \"phoneNumber\": \"+358123456789\", \"sendEmail\": true, \"sendSms\": false, \"language\": \"fi-fi\"}]\n   }],\n   \"backupCodes\": [\"8438268923\", \"4055912581\"],\n   \"lockerIndex\": 0\n}]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "400",
            "description": "<p>Device keys not found</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Error</p>"
          }
        ]
      }
    },
    "filename": "./routers/devices.js",
    "groupTitle": "Devices"
  },
  {
    "type": "get",
    "url": "/devices/:id/lockers/:lockerIndex",
    "title": "GET /devices/:id/lockers/:lockerIndex",
    "version": "3.5.0",
    "name": "DeviceLockerGet",
    "group": "Devices",
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "description": "<p>(ONLY FOR KEY30,KEY1) Fetch one LivionKey device locker with live status. Locker data is resolved via device locker state from core API.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>authorization JWT token <code>Bearer {token}</code></p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Path": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>device id</p>"
          },
          {
            "group": "Path",
            "type": "number",
            "optional": false,
            "field": "lockerIndex",
            "description": "<p>locker index</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "deviceId",
            "description": "<p>Device id</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "locker",
            "description": "<p>Locker data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"deviceId\": \"000001\",\n  \"locker\": {\n    \"lockerIndex\": \"0\",\n    \"state\": \"lockerWithKey\",\n    \"isKeyInside\": true,\n    \"key\": { \"id\": \"key1\", \"name\": \"Main Door\" }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "400",
            "description": "<p>Device not found <br /> not supported <br /> malformed locker index</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "404",
            "description": "<p>locker not found</p>"
          }
        ]
      }
    },
    "filename": "./routers/devices.js",
    "groupTitle": "Devices"
  },
  {
    "type": "get",
    "url": "/devices/:id/lockers",
    "title": "GET /devices/:id/lockers",
    "version": "3.5.0",
    "name": "DeviceLockersGet",
    "group": "Devices",
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "description": "<p>(ONLY FOR KEY30,KEY1) Fetch all LivionKey device lockers with live status. Locker data is resolved via device locker state from core API.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>authorization JWT token <code>Bearer {token}</code></p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Path": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>device id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "deviceId",
            "description": "<p>Device id</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "lockers",
            "description": "<p>List of lockers</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"deviceId\": \"000001\",\n  \"lockers\": [{\n    \"lockerIndex\": \"0\",\n    \"state\": \"lockerWithKey\",\n    \"isKeyInside\": true,\n    \"key\": { \"id\": \"key1\", \"name\": \"Main Door\" }\n  }]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "400",
            "description": "<p>Device not found <br /> not supported</p>"
          }
        ]
      }
    },
    "filename": "./routers/devices.js",
    "groupTitle": "Devices"
  },
  {
    "type": "get",
    "url": "/devices",
    "title": "GET /devices",
    "version": "3.5.0",
    "name": "DevicesGet",
    "group": "Devices",
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "description": "<p>Fetch all accessible LivionKey devices</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>authorization JWT token <code>Bearer {token}</code></p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Query": [
          {
            "group": "Query",
            "type": "String[]",
            "optional": true,
            "field": "products",
            "description": "<p>Optional list of product type needed, key30 for LivionKey30, keyX for LivionKey1, keypad for LivionKeyPad. default value is ['key30', 'keyX']</p>"
          },
          {
            "group": "Query",
            "type": "String",
            "optional": true,
            "field": "extend",
            "description": "<p>Optional comma-separated extensions. Use <code>lockers</code> to include locker data.</p>"
          },
          {
            "group": "Query",
            "type": "number",
            "optional": true,
            "field": "limit",
            "description": "<p>Optional pagination limit. Required when <code>extend=lockers</code>, max value is 50.</p>"
          },
          {
            "group": "Query",
            "type": "number",
            "optional": true,
            "field": "after",
            "description": "<p>Optional pagination offset. Requires <code>limit</code>.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example (with pagination):",
          "content": "/devices?limit=10&after=0",
          "type": "url"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "devices",
            "description": "<p>Devices basic data (non-paginated response shape)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response (without pagination):",
          "content": "HTTP/1.1 200 OK\n[{\n  \"deviceId\": \"00053\",\n  \"name\": \"Gustavsberginkatu 12 Aula\",\n  \"tag\": \"livion/internal/oulu\",\n  \"connectionState\": \"connected\",\n  \"synced\": {\n       \"timestamp\": \"2020-12-03T13:21:30.574Z\",\n       \"isSynced\": true\n  }\n}]",
          "type": "json"
        },
        {
          "title": "Success-Response (with pagination):",
          "content": "HTTP/1.1 200 OK\n{\n  \"devices\": [{\n    \"id\": \"00053\",\n    \"product\": \"key30\",\n    \"name\": \"Gustavsberginkatu 12 Aula\",\n    \"tag\": \"livion/internal/oulu\",\n    \"connectionState\": \"connected\",\n    \"synced\": {\n      \"timestamp\": \"2020-12-03T13:21:30.574Z\",\n      \"isSynced\": true\n    }\n  }],\n  \"pageInfo\": {\n    \"start\": 0,\n    \"end\": 1,\n    \"hasNext\": false\n  }\n}",
          "type": "json"
        },
        {
          "title": "Success-Response (with pagination and extend=lockers):",
          "content": "HTTP/1.1 200 OK\n{\n  \"devices\": [{\n    \"id\": \"00053\",\n    \"product\": \"key30\",\n    \"name\": \"Gustavsberginkatu 12 Aula\",\n    \"tag\": \"livion/internal/oulu\",\n    \"connectionState\": \"connected\",\n    \"lockers\": [{\n      \"lockerIndex\": \"0\",\n      \"state\": \"lockerWithKey\",\n      \"isKeyInside\": true,\n      \"key\": { \"id\": \"key1\", \"name\": \"Main Door\" }\n    }]\n  }],\n  \"pageInfo\": {\n    \"start\": 0,\n    \"end\": 1,\n    \"hasNext\": false\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Error</p>"
          }
        ]
      }
    },
    "filename": "./routers/devices.js",
    "groupTitle": "Devices"
  },
  {
    "type": "post",
    "url": "/devices/:id/opendoor",
    "title": "POST /devices/:id/opendoor",
    "version": "3.5.0",
    "name": "OpenDoor",
    "group": "Devices",
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "description": "<p>(ONLY FOR Key30, KeyX) Open specific locker in device</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>authorization JWT token <code>Bearer {token}</code></p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Path": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>device id</p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "lockerIndex",
            "description": "<p>LockerIndex to be opened</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "200",
            "description": "<p>Command sent successfuly</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "400",
            "description": "<p>body is required <br /> lockerIndex is required <br /> Locker index is too big <br /> Device not found <br /> Device error <br /> Device busy <br /> Command not found</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "409",
            "description": "<p>Device is reserved</p>"
          }
        ]
      }
    },
    "filename": "./routers/devices.js",
    "groupTitle": "Devices"
  },
  {
    "type": "post",
    "url": "/devices/:id/unlock",
    "title": "POST /devices/:id/unlock",
    "version": "3.5.0",
    "name": "Unlock",
    "group": "Devices",
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "description": "<p>(ONLY FOR KEYPADS) Unlock the lock associated to the keypad</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>authorization JWT token <code>Bearer {token}</code></p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Path": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>device id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "200",
            "description": "<p>Command sent successfuly</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "400",
            "description": "<p>Device not found <br /> Device error <br /> Device busy <br /> Command not found</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "409",
            "description": "<p>Device is reserved</p>"
          }
        ]
      }
    },
    "filename": "./routers/devices.js",
    "groupTitle": "Devices"
  },
  {
    "type": "post",
    "url": "/keys",
    "title": "POST /keys",
    "version": "3.5.0",
    "name": "KeyCreate",
    "group": "Keys",
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "description": "<p>Create key to device</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>authorization JWT token <code>Bearer {token}</code></p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "keyId",
            "description": "<p>Mandatory unique keyId.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "keyName",
            "description": "<p>Mandatory keyName.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "deviceId",
            "description": "<p>Mandatory deviceId.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "keyCode",
            "description": "<p>Optional keyCode.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "lockerIndex",
            "description": "<p>Optional lockerIndex.</p>"
          },
          {
            "group": "body",
            "type": "Boolean",
            "optional": true,
            "field": "checkLockerStatus",
            "description": "<p>Optional. Default <code>false</code>. When <code>true</code>, locker assignment checks locker state and assignment.</p>"
          },
          {
            "group": "body",
            "type": "Boolean",
            "optional": true,
            "field": "shared",
            "description": "<p>Default to false, meaning key is private no overlapping contract allowed, if true key is Shared then overlapping contract are allowed.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"keyId\": 'A53',\n  \"deviceId\": '00053',\n  \"keyName\": 'Gustavsberginkatu 12c A 13',\n  \"keyCode\": '1234',\n  \"lockerIndex\": '3',\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"lockerIndex\": 3\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "400",
            "description": "<p>body is required <br /> deviceId is required <br />keyId is required <br />no such device <br/>key already exists with that keyId</p>"
          }
        ]
      }
    },
    "filename": "./routers/keys.js",
    "groupTitle": "Keys"
  },
  {
    "type": "delete",
    "url": "/keys/:id",
    "title": "",
    "version": "3.5.0",
    "name": "KeyDelete",
    "group": "Keys",
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "description": "<p>Remove key from device</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>authorization JWT token <code>Bearer {token}</code></p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Path": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>unique keyId</p>"
          }
        ],
        "Query": [
          {
            "group": "Query",
            "type": "string",
            "optional": false,
            "field": "deviceId",
            "description": "<p>Mandatory deviceId.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Key",
            "description": "<p>deleted</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "400",
            "description": "<p>Missing query parameters <br /> Missing deviceId from query parameters <br />no such key</p>"
          }
        ]
      }
    },
    "filename": "./routers/keys.js",
    "groupTitle": "Keys"
  },
  {
    "type": "get",
    "url": "/keys/:id",
    "title": "GET /keys/:id",
    "version": "3.5.0",
    "name": "KeyGet",
    "group": "Keys",
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "description": "<p>Get key</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>authorization JWT token <code>Bearer {token}</code></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "key",
            "description": "<p>Key data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[{\n  \"keyId\": \"A53\",\n  \"deviceId\": \"00053\",\n  \"keyName\": \"Gustavsberginkatu 12c A 13\",\n  \"keyCode\": \"1234\",\n  \"lockerIndex\": 3,\n  \"shared\": false,\n  \"backupCodes\": [\"1234567890\", \"0987654321\"],\n  \"contracts\": [\n     {\n       \"keyId\": \"A4324\",\n       \"devices\": [{\"id\": \"00053\", \"keyId\": \"A53\"}],\n       \"contractId\": \"543553\",\n       \"pincode\": \"594395\",\n       \"start\": \"2018-02-14T08:06:30.000Z\",\n       \"end\": \"2018-02-17T08:06:30.000Z\",\n       \"person\": \"John Doe\",\n       \"contacts\": [{\"email\": \"john.doe@livion.fi\", \"phoneNumber\": \"+358123456789\", \"sendEmail\": true, \"sendSms\": false, \"language\": \"fi-fi\"}],\n       \"keyStatus\": {\n           \"action\": \"key-added\",\n           \"timestamp\": \"2021-05-06T08:00:38.480Z\"\n       }\n     }\n ]\n}]",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Path": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>unique keyId</p>"
          }
        ],
        "Query": [
          {
            "group": "Query",
            "type": "string",
            "optional": true,
            "field": "deviceId",
            "description": "<p>Optional deviceId.</p>"
          },
          {
            "group": "Query",
            "type": "string",
            "optional": true,
            "field": "keyStatus",
            "description": "<p>Optional ketStatus. Must be equal to 'true'. it allows to get keyStatus at the same time.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "400",
            "description": "<p>no such key</p>"
          }
        ]
      }
    },
    "filename": "./routers/keys.js",
    "groupTitle": "Keys"
  },
  {
    "type": "get",
    "url": "/keys/:id/status",
    "title": "GET /keys/:id/status",
    "version": "3.5.0",
    "name": "KeyGetStatus",
    "group": "Keys",
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "description": "<p>Get key</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>authorization JWT token <code>Bearer {token}</code></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "key",
            "description": "<p>Key data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTP/1.1 200 OK\n   {\n      \"id\": \"5dd7af0a2aaec40007b91c8b\",\n      \"timestamp\": \"2019-11-22T09:48:58.433Z\",\n      \"tag\": [\"livion/key/customer\"],\n      \"source\": \"device\",\n      \"sourceId\": \"123456\",\n      \"action\": \"key-fetched\",\n      \"data\": {\n                \"before\": null,\n                \"after\": {\n                        \"lockerIndex\": 0,\n                         \"keyId\": \"id123\"\n                },\n              \"text\": \"key status: \\\"emptyLocker\\\" => event: \\\"key-fetched\\\"\",\n              \"value\": \"key-fetched\",\n              \"sourceTime\": \"2019-11-22T09:48:57.374Z\",\n              \"attachment\": [\n                  null\n              ]\n      }\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Path": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>unique keyId</p>"
          }
        ],
        "Query": [
          {
            "group": "Query",
            "type": "string",
            "optional": false,
            "field": "deviceId",
            "description": "<p>Mandatory deviceId.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "400",
            "description": "<p>Missing query parameters <br />Missing deviceId from query parameters</p>"
          }
        ]
      }
    },
    "filename": "./routers/keys.js",
    "groupTitle": "Keys"
  },
  {
    "type": "post",
    "url": "/keys/:id",
    "title": "POST /keys/:id",
    "version": "3.5.0",
    "name": "KeyUpdate",
    "group": "Keys",
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "description": "<p>Update key to device</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>authorization JWT token <code>Bearer {token}</code></p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Path": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>unique keyId</p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "deviceId",
            "description": "<p>Mandatory deviceId.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "keyName",
            "description": "<p>Optional keyName.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "keyCode",
            "description": "<p>Optional keyCode.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "lockerIndex",
            "description": "<p>Optional lockerIndex.</p>"
          },
          {
            "group": "body",
            "type": "Boolean",
            "optional": true,
            "field": "checkLockerStatus",
            "description": "<p>Optional. Default <code>false</code>. When <code>true</code>, locker update checks locker state and assignment.</p>"
          },
          {
            "group": "body",
            "type": "Boolean",
            "optional": true,
            "field": "shared",
            "description": "<p>Optional shared (Key sharing policy).</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"keyId\": 'A53',\n  \"deviceId\": '00053',\n  \"keyName\": 'Gustavsberginkatu 12c A 13',\n  \"keyCode\": '1234'\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Key",
            "description": "<p>updated</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "400",
            "description": "<p>body is required <br /> deviceId is required <br />lockerIndex is too big <br />no such device <br/>no such key <br/>no free lockers</p>"
          }
        ]
      }
    },
    "filename": "./routers/keys.js",
    "groupTitle": "Keys"
  },
  {
    "type": "post",
    "url": "/keys/:id/backupcodes",
    "title": "POST /keys/:id/backupcodes",
    "version": "3.5.0",
    "name": "KeyUpdateBackupCodes",
    "group": "Keys",
    "permission": [
      {
        "name": "authenticated"
      }
    ],
    "description": "<p>Update backupcodes to key in device</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>authorization JWT token <code>Bearer {token}</code></p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Path": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>unique keyId</p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "deviceId",
            "description": "<p>Mandatory deviceId.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"deviceId\": '00053',\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Key",
            "description": "<p>backup codes updated</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "400",
            "description": "<p>body is required <br /> deviceId is required <br />no such device <br/>no such key</p>"
          }
        ]
      }
    },
    "filename": "./routers/keys.js",
    "groupTitle": "Keys"
  }
] });
