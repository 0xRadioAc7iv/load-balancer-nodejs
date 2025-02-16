export async function sendRequestToServer(
  url: string,
  method: string,
  headers: any,
  body: BodyInit
) {
  try {
    const response = await fetch(url, {
      method: method,
      headers: headers,
      body:
        method !== "GET" && method !== "HEAD"
          ? JSON.stringify(body)
          : undefined,
    });

    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
}
