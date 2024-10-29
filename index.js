import express from "express";
import { logger } from "./middlewares/logger.js";
import compression from "compression";
import { sendRequestToServer } from "./utils/requestHandler.js";
import { cacheServerResponse, isCached } from "./utils/cache.js";
import cron from "node-cron";
import { SERVERS } from "./config.js";

let availableServers = [];
let currentServer = 0; // Server Index, ranges from 0 to 2

const app = express();

app.use(compression());
app.use(express.json());
app.use(logger);

app.use("*", async (request, response) => {
  const url = request.originalUrl;
  const method = request.method;

  if (availableServers.length === 0) {
    return response.status(503).send("No servers available");
  }

  const targetURL = SERVERS[currentServer] + url;
  currentServer = (currentServer + 1) % availableServers.length;

  const { isResponseCached, responseBody } = isCached(method, url);

  if (isResponseCached) {
    response.setHeader("X-Cache", "HIT");
    return response.status(200).send(responseBody);
  }

  try {
    // Sends the Request
    const serverResponse = await sendRequestToServer(
      targetURL,
      method,
      request.headers,
      request.body
    );

    // Extracts the Response Body as JSON
    const responseBody = await serverResponse.json();

    if (serverResponse.ok && method === "GET") {
      console.log(url, responseBody);
      cacheServerResponse(url, responseBody);
    }

    // Sends Response back to the client
    return response.status(serverResponse.status).send(responseBody);
  } catch (error) {
    console.log(error);
    return response.sendStatus(500);
  }
});

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

cron.schedule("*/5 * * * * *", async () => {
  await pingServers();
});

app.listen(3000, () => {
  console.log("Load Balancer started on PORT 3000");
});
