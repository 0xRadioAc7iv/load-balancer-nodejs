/**
 * Middleware function that logs details of each request and response.
 * Logs the HTTP method, request URL, status code, and the duration it took to complete the request.
 *
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 * @param {Function} next - Callback function to pass control to the next middleware.
 */
export function logger(request, response, next) {
  const now = Date.now();

  // Event listener for when the response finishes
  response.on("finish", () => {
    const duration = Date.now() - now;

    console.log(
      `[${new Date().toUTCString()}] ${request.method} ${
        request.originalUrl
      } - ${response.statusCode} (${duration}ms)`
    );
  });

  next();
}
