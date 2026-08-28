import type { APIRoute } from "astro";
import { GetObject } from "@/lib/s3";

export const GET: APIRoute = async ({ params }) => {
  const key = params.key;
  if (!key) {
    return new Response("Media key is required", { status: 404 });
  }

  try {
    const response = await GetObject(key);

    if (!response.Body) {
      return new Response("Object body is empty", { status: 404 });
    }

    // Convert AWS SDK stream to Web ReadableStream
    const stream =
      typeof (response.Body as any).transformToWebStream === "function"
        ? (response.Body as any).transformToWebStream()
        : (response.Body as any);

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": response.ContentType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
        ...(response.ContentLength
          ? { "Content-Length": String(response.ContentLength) }
          : {}),
      },
    });
  } catch (err: any) {
    console.error(
      `[media-serve] Failed to fetch key "${key}":`,
      err.name || err.message || err,
    );
    return new Response("Media not found", { status: 404 });
  }
};
