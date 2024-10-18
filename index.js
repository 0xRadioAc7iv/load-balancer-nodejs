import express from "express";
import { SERVERS } from "./config.js";

const app = express();
let currentServer = 0; // Server Index, ranges from 0 to 2

app.use(express.json());

app.use("*", async (request, response) => {
  // Build the Target URL
  const basePath = SERVERS[currentServer];
  const url = request.originalUrl;
  const finalUrl = basePath + url;

  // Sends the Request
  const serverResponse = await fetch(finalUrl, {
    method: request.method,
    body:
      request.method !== "GET" && request.method !== "HEAD"
        ? req.body
        : undefined,
    headers: request.headers,
  });

  // Extracts the Response Body as JSON
  const responseBody = await serverResponse.json();

  // Updates Current Server
  currentServer = (currentServer + 1) % SERVERS.length;

  // Sends Response back to the client
  return response.status(serverResponse.status).send(responseBody);
});

app.listen(3000, () => {
  console.log("Load Balancer started on PORT 3000");
});
