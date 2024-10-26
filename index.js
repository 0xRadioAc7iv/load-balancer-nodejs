import express from "express";
import { SERVERS } from "./config.js";
import { logger } from "./middlewares/logger.js";

const app = express();
let currentServer = 0; // Server Index, ranges from 0 to 2

const cacheArray = new Map(); // Temporary Solution for Caching GET Requests

app.use(express.json());
app.use(logger);

app.use("*", async (request, response) => {
  // Build the Target URL
  const basePath = SERVERS[currentServer];
  const url = request.originalUrl;
  const finalUrl = basePath + url;

  if (request.method === "GET" && cacheArray.has(url)) {
    const requestTime = Date.now();
    const { body, cachedTime } = cacheArray.get(url);

    if (parseInt((requestTime - cachedTime) / 1000) < 10) {
      response.setHeader("X-Cache", "HIT");
      return response.status(200).send(body);
    }
  }

  try {
    // Sends the Request
    const serverResponse = await fetch(finalUrl, {
      method: request.method,
      body:
        request.method !== "GET" && request.method !== "HEAD"
          ? JSON.stringify(req.body)
          : undefined,
      headers: request.headers,
    });

    // Extracts the Response Body as JSON
    const responseBody = await serverResponse.json();

    // Cache the Response
    if (request.method === "GET") {
      cacheArray.set(url, {
        body: responseBody,
        cachedTime: Date.now(),
      });
    }

    // Updates Current Server
    currentServer = (currentServer + 1) % SERVERS.length;

    // Sends Response back to the client
    return response.status(serverResponse.status).send(responseBody);
  } catch (error) {
    console.log(error);
    return response.sendStatus(500);
  }
});

app.listen(3000, () => {
  console.log("Load Balancer started on PORT 3000");
});
