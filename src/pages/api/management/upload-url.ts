import type { APIRoute } from "astro";
import { GetPresignedUploadUrl } from "@/lib/s3";
import crypto from "crypto";

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { filename, contentType } = await request.json();

    if (!filename) {
      return new Response(JSON.stringify({ message: "filename is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const uuid = crypto.randomUUID();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `media/${uuid}/${sanitizedFilename}`;

    const mimeType = contentType || "application/octet-stream";
    const url = await GetPresignedUploadUrl(key, mimeType, 3600);

    return new Response(JSON.stringify({ url, key }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("[upload-url] Error:", err);
    return new Response(
      JSON.stringify({
        message: "Failed to generate presigned upload URL",
        error: err.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
