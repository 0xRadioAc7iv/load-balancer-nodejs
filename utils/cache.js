// Temporary Solution for Caching GET Requests

const cache = new Map();

export function isCached(method, url) {
  if (method !== "GET") return { isResponseCached: false, responseBody: null };

  if (cache.has(url)) {
    const { body, cachedTime } = cache.get(url);
    const isCacheOldEnough = (Date.now() - cachedTime) / 1000 > 10;

    if (isCacheOldEnough) {
      cache.delete(url);
      return { isResponseCached: false, responseBody: null };
    }

    return { isResponseCached: true, responseBody: body };
  }

  return { isResponseCached: false, responseBody: null };
}

export function cacheServerResponse(method, url, response) {
  if (method === "GET")
    cache.set(url, { body: response, cachedTime: Date.now() });
}
