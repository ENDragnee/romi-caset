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

    return new Response(stream, { status: 200, headers });
  } catch (err: any) {
    if (err.name === "NoSuchKey" || err.$metadata?.httpStatusCode === 404) {
      return new Response("Media not found", { status: 404 });
    }
    console.error(
      `[media-serve] Failed to fetch key "${key}":`,
      err.name || err.message || err,
    );
    return new Response("Media not found", { status: 404 });
  }
};
