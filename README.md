# Load Balancer (Node.js)

This project implements a load balancer using Node.js and Express, featuring rate limiting, response caching, GZIP compression, round-robin server selection, and server health monitoring with HTTPS support.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [TLS Certificate Setup](#tls-setup)
- [Project Structure](#project-structure)
- [License](#license)

## Features

- Load Balancing: Implements round-robin server selection for balancing requests across available servers.
- Rate Limiting: Limits client requests to 100 requests per 15-minute window using `express-rate-limit`.
- Caching: Caches responses for GET requests to improve efficiency.
- Compression: GZIP compression for all responses using `compression` middleware.
- Health Monitoring: Periodically pings backend servers to update the list of available servers.
- HTTPS Support: Configured to run on HTTPS with SSL certificate and key.

## Installation

```
git clone https://github.com/0xRadioAc7iv/load-balancer-nodejs.git
cd load-balancer-nodejs
npm install
```

## Usage

After setting up the required environment and configuration, you can start the server with the following command:

```
npm start
```

This will start an HTTPS server on `https://localhost:443`.

## Configuration

Edit the `config.js` file to specify the list of backend servers:

    export const SERVERS = [
      "http://server1:port",
      "http://server2:port",
      "http://server3:port"
    ];

Ensure that the server key and certificate files are stored in the root directory as `server.key` and `server.cert` respectively for HTTPS configuration.

## TLS Certificate Setup

To generate self-signed TLS certificates for local development:

1.  Open a terminal and run the following command to create a new private key and certificate:

```
openssl req -x509 -newkey rsa:4096 -keyout server.key -out server.cert -days 365 -nodes
```

2.  Follow the prompts to fill out certificate details. For local development, you can enter placeholder values.
3.  The above command will generate two files: `server.key` (private key) and `server.cert` (certificate) in the current directory.
4.  Move these files to the root of the project directory if not already there.

**Note:** For production environments, consider using a trusted certificate authority (CA) instead of a self-signed certificate.

## Project Structure

    .
    ├── config.js               # Configuration file for backend server URLs
    ├── server.key              # SSL key for HTTPS
    ├── server.cert             # SSL certificate for HTTPS
    ├── index.js                  # Main application file
    ├── middlewares/
    │   └── logger.js           # Custom logger middleware
    ├── utils/
    │   ├── cache.js            # Functions for caching responses
    │   └── requestHandler.js   # Utility to handle server requests
    └── README.md             # README file for project documentation

## License

This project is licensed under the MIT License.
