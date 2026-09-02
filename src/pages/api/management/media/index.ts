import type { APIRoute } from "astro";
import { prisma } from "@/lib/prisma";

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const pageParam = url.searchParams.get("page");
    const limitParam = url.searchParams.get("limit");

    // If pagination params are provided, return paginated results
    if (pageParam || limitParam) {
      const page = Math.max(1, parseInt(pageParam || "1", 10) || 1);
      const limit = Math.max(
        1,
        Math.min(100, parseInt(limitParam || "18", 10) || 18),
      );

      const [total, items] = await Promise.all([
        prisma.media.count(),
        prisma.media.findMany({
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);

      const totalPages = Math.ceil(total / limit) || 1;

      return new Response(
        JSON.stringify({
          items,
          total,
          totalPages,
          page,
          limit,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Default: return all items (backward compatibility)
    const media = await prisma.media.findMany({
      orderBy: { createdAt: "desc" },
    });
    return new Response(JSON.stringify(media), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Fetch media error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();
    const { key, filename, mimeType, size, width, height } = body;

    if (!key || !filename || !mimeType || size === undefined) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const media = await prisma.media.create({
      data: {
        key,
        filename,
        mimeType,
        size,
        width: width || null,
        height: height || null,
      },
    });

    return new Response(JSON.stringify(media), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
