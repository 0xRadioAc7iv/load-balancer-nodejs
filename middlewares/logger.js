export function logger(request, response, next) {
  const now = Date.now();

  response.on("finish", () => {
    const duration = Date.now() - now;
    console.log(
      `[${new Date().toUTCString()}] ${request.method} ${request.url} - ${
        response.statusCode
      } (${duration}ms)`
    );
  });

  next();
}
