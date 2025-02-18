const cache = new Map();

export function isCached(method: string, url: string) {
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

export function cacheServerResponse(url: string, response: string) {
  cache.set(url, { body: response, cachedTime: Date.now() });
}
