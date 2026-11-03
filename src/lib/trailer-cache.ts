const CACHE_NAME = "br-trailers-v1";
const MAX_ENTRY_BYTES = 25 * 1024 * 1024; // 25MB cap per clip
const MAX_ENTRIES = 12; // manual LRU cap — Cache Storage has no built-in eviction

async function openTrailerCache(): Promise<Cache | null> {
  try {
    return "caches" in window ? await caches.open(CACHE_NAME) : null;
  } catch {
    return null;
  }
}

/**
 * Resolves the URL a <video> should play. On a cache hit, converts the
 * cached Response to a blob: URL (a Response can't be assigned to
 * video.src directly). On a miss, returns the network URL immediately so
 * playback starts over HTTP via the Range-enabled media proxy, and warms
 * the cache in the background for next time.
 */
export async function getTrailerSrc(networkUrl: string): Promise<string> {
  const cache = await openTrailerCache();
  if (cache) {
    const hit = await cache.match(networkUrl);
    if (hit) {
      const blob = await hit.blob();
      return URL.createObjectURL(blob);
    }
  }
  warmTrailerCache(networkUrl);
  return networkUrl;
}

/**
 * Background-warms the cache for a trailer that hasn't been triggered yet
 * (no hover/visibility event involved). Skips URLs already cached so a
 * repeated prefetch pass never re-downloads a clip that's already there.
 */
export async function prefetchTrailer(networkUrl: string): Promise<void> {
  try {
    const cache = await openTrailerCache();
    if (cache) {
      const existing = await cache.match(networkUrl);
      if (existing) return;
    }
    await warmTrailerCache(networkUrl);
  } catch {
    // offline / quota / CORS: fine, it'll just stream on first hover instead
  }
}

async function warmTrailerCache(networkUrl: string): Promise<void> {
  try {
    const cache = await openTrailerCache();
    if (!cache) return;
    const res = await fetch(networkUrl);
    if (!res.ok) return;
    if (+(res.headers.get("content-length") || 0) > MAX_ENTRY_BYTES) return;
    const blob = await res.blob();
    if (blob.size > MAX_ENTRY_BYTES) return;
    await cache.put(
      networkUrl,
      new Response(blob, {
        headers: {
          "content-type": blob.type || "video/mp4",
          "x-br-cached-at": String(Date.now()),
        },
      }),
    );
    await evictOldestIfOverCap(cache);
  } catch {
    // offline / quota / CORS: fine, next trigger just streams again
  }
}

async function evictOldestIfOverCap(cache: Cache): Promise<void> {
  const keys = await cache.keys();
  if (keys.length <= MAX_ENTRIES) return;
  const withTimestamps = await Promise.all(
    keys.map(async (req) => {
      const res = await cache.match(req);
      const at = +(res?.headers.get("x-br-cached-at") || 0);
      return { req, at };
    }),
  );
  withTimestamps.sort((a, b) => a.at - b.at);
  const toDelete = withTimestamps.slice(0, withTimestamps.length - MAX_ENTRIES);
  await Promise.all(toDelete.map(({ req }) => cache.delete(req)));
}
