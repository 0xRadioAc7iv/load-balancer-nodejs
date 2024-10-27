import express from "express";
import { logger } from "./middlewares/logger.js";
import compression from "compression";
import { generateNextServerURL } from "./utils/serverSelection.js";
import { sendRequestToServer } from "./utils/requestHandler.js";
import { cacheServerResponse, isCached } from "./utils/cache.js";

const app = express();

app.use(compression());
app.use(express.json());
app.use(logger);

app.use("*", async (request, response) => {
  const url = request.originalUrl;
  const method = request.method;

  const targetURL = generateNextServerURL(url);
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
    cacheServerResponse(method, url, responseBody);
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
