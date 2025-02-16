import express from "express";
import { logger } from "./middlewares/logger.js";
import compression from "compression";
import { sendRequestToServer } from "./utils/requestHandler.js";
import { cacheServerResponse, isCached } from "./utils/cache.js";
import cron from "node-cron";
import { SERVERS } from "./config.js";
import { rateLimit } from "express-rate-limit";

// Initialize available servers array and current server index for round-robin load balancing
let availableServers = [];
let currentServer = 0; // Server Index, ranges from 0 to 2

const app = express();

// Set up rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  limit: 100, // Allow max 100 requests per 15 minutes
  message: "You have reached your rate limit! Please try again after some time",
  standardHeaders: "draft-6",
  skipFailedRequests: true,
});

app.use(limiter);
app.use(compression()); // Enable GZIP compression for responses
app.use(express.json()); // Parse incoming JSON requests
app.use(logger);

// Main route handler for all incoming requests
app.use("*", async (request, response) => {
  const url = request.originalUrl;
  const method = request.method;

  if (availableServers.length === 0) {
    response.status(503).send("No servers available");
    return;
  }

  // Select target server based on round-robin and update current server index
  const targetURL = SERVERS[currentServer] + url;
  currentServer = (currentServer + 1) % availableServers.length;

  const { isResponseCached, responseBody } = isCached(method, url);

  if (isResponseCached) {
    response.setHeader("X-Cache", "HIT");
    response.status(200).send(responseBody);
    return;
  }

  // Attempt to send the request to the selected server and handle response
  try {
    const serverResponse = await sendRequestToServer(
      targetURL,
      method,
      request.headers,
      request.body
    );

    if (serverResponse) {
      const responseBody = await serverResponse.json();

      if (serverResponse.ok && method === "GET") {
        cacheServerResponse(url, responseBody);
      }

      // Sends Response back to the client
      response.status(serverResponse.status).send(responseBody);
    }
  } catch (error) {
    console.log(error);
    response.sendStatus(500);
  }
});

// Function to ping servers and update the available servers list
async function pingServers() {
  const servers = [];

  for await (const server of SERVERS) {
    try {
      const response = await fetch(`${server}/health`);
      if (response.ok) {
        servers.push(server);
        console.log(`Yes: ${server}`);
      }
    } catch (error) {
      console.log(`No: ${server}`);
    }
  }

  availableServers = servers;
}

// Schedule server health checks every 30 seconds to update available servers list
cron.schedule("*/30 * * * * *", async () => {
  await pingServers();
});

app.listen(3000, async () => {
  await pingServers();
  console.log("Server is running on http://localhost:3000");
});
