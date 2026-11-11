import type { APIRoute } from "astro";
import { GetObject } from "@/lib/s3";

export const GET: APIRoute = async ({ params, request }) => {
  const key = params.key;
  if (!key) {
    return new Response("Media key is required", { status: 404 });
  }

  try {
    const rangeHeader = request.headers.get("range") || undefined;
    const response = await GetObject(key, rangeHeader);

    if (!response.Body) {
      return new Response("Object body is empty", { status: 404 });
    }

    const stream =
      typeof (response.Body as any).transformToWebStream === "function"
        ? (response.Body as any).transformToWebStream()
        : (response.Body as any);

    const headers = new Headers();
    headers.set(
      "Content-Type",
      response.ContentType || "application/octet-stream",
    );
    headers.set("Accept-Ranges", "bytes");
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    if (response.ContentLength !== undefined) {
      headers.set("Content-Length", String(response.ContentLength));
    }

    // 206 Partial Content for video chunk streaming / seeking
    if (response.ContentRange) {
      headers.set("Content-Range", response.ContentRange);
      return new Response(stream, { status: 206, headers });
    }

    // Keys are unique (uuid/filename), so the content never changes. Let
    // Vercel's CDN keep full responses (it only stores 200s up to 10MB:
    // images, trailers, the preloader showreel) so repeat views don't each
    // cost a Backblaze download. stale-if-error keeps serving the edge copy
    // if Backblaze refuses (e.g. daily cap hit).
    headers.set(
      "Vercel-CDN-Cache-Control",
      "max-age=31536000, stale-if-error=604800",
    );

    return new Response(stream, { status: 200, headers });
  } catch (err: any) {
    const status = err.$metadata?.httpStatusCode;
    if (err.name === "NoSuchKey" || status === 404) {
      return new Response("Media not found", { status: 404 });
    }
    // Anything else is a storage-side failure (e.g. B2 403 when the daily
    // download cap is hit), not a missing file: say so, and don't let it be cached.
    console.error(
      `[media-serve] Failed to fetch key "${key}":`,
      err.name,
      status,
      err.message,
    );
    return new Response("Media temporarily unavailable", {
      status: status === 416 ? 416 : 503,
      headers: { "Cache-Control": "no-store", "Retry-After": "300" },
    });
  }
};
