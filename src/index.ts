import express, { urlencoded } from "express";
import { loggingMiddleware } from "./middlewares/logger.js";
import compression from "compression";
import { sendRequestToServer } from "./utils/requestHandler.js";
import { cacheServerResponse, isCached } from "./utils/cache.js";
import cron from "node-cron";
import { ALLOWED_ORIGINS, SERVERS } from "./config.js";
import { handleErrors } from "./middlewares/errorHandler.js";
import cors from "cors";
import helmet from "helmet";
import { limiter } from "./utils/limiter.js";
import { AVAILABLE_SERVERS, generateTargetURL } from "./utils/balancing.js";

const app = express();

app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? ALLOWED_ORIGINS : "*",
  })
);
app.use(helmet());
app.use(limiter);
app.use(compression()); // Enable GZIP compression for responses
app.use(express.json()); // Parse incoming JSON requests
app.use(urlencoded({ extended: false }));
app.use(loggingMiddleware);

// Main route handler for all incoming requests
app.use("*", async (request, response) => {
  const url = request.originalUrl;
  const method = request.method;

  if (AVAILABLE_SERVERS.size === 0) {
    response.status(503).send("No servers available");
    return;
  }

  const targetURL = generateTargetURL(url);

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

app.use(handleErrors);

// Function to ping servers and update the available servers list
async function pingServers() {
  for await (const server of SERVERS) {
    try {
      const response = await fetch(`${server}/health`);
      if (response.ok) {
        AVAILABLE_SERVERS.set(server, true);
        console.log(`Yes: ${server}`);
      }
    } catch (error) {
      AVAILABLE_SERVERS.set(server, false);
      console.log(`No: ${server}`);
    }
  }
}

// Schedule server health checks every 30 seconds to update available servers list
cron.schedule("*/30 * * * * *", async () => {
  await pingServers();
});

app.listen(3000, async () => {
  await pingServers();
  console.log("Server is running on http://localhost:3000");
});
