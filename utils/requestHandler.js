export async function sendRequestToServer(url, method, headers, body) {
  console.log(url);
  const response = await fetch(url, {
    method: method,
    headers: headers,
    body:
      method !== "GET" && method !== "HEAD" ? JSON.stringify(body) : undefined,
  });

  return response;
}
