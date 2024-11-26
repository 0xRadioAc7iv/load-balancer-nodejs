# Load Balancer (Node.js)

This project implements a load balancer using Node.js and Express, featuring rate limiting, response caching, GZIP compression, round-robin server selection, and server health monitoring.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [License](#license)

## Features

- Load Balancing: Implements round-robin server selection for balancing requests across available servers.
- Rate Limiting: Limits client requests to 100 requests per 15-minute window using `express-rate-limit`.
- Caching: Caches responses for GET requests to improve efficiency.
- Compression: GZIP compression for all responses using `compression` middleware.
- Health Monitoring: Periodically pings backend servers to update the list of available servers.

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

This will start an HTTPS server on `http://localhost:3000`.

## Configuration

Edit the `config.js` file to specify the list of backend servers:

    export const SERVERS = [
      "http://server1:port",
      "http://server2:port",
      "http://server3:port"
    ];

## Project Structure

    .
    ├── config.js               # Configuration file for backend server URLs
    ├── index.js                  # Main application file
    ├── middlewares/
    │   └── logger.js           # Custom logger middleware
    ├── utils/
    │   ├── cache.js            # Functions for caching responses
    │   └── requestHandler.js   # Utility to handle server requests
    └── README.md             # README file for project documentation

## Testing

To test the project, run the following command:

```
npm test
```

## License

This project is licensed under the MIT License.
