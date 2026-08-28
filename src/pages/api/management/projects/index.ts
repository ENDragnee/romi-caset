import type { APIRoute } from "astro";
import { prisma } from "@/lib/prisma";

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();

    // Map thumbnailKey or thumbnail
    const thumbnail = body.thumbnailKey || body.thumbnail || null;
    const gallery = Array.isArray(body.galleryKeys)
      ? body.galleryKeys
      : Array.isArray(body.gallery)
        ? body.gallery
        : [];

    const project = await prisma.project.create({
      data: {
        title: body.title,
        slug: body.slug,
        client: body.client || "",
        category: body.category,
        cardType: body.cardType || "WIDE",
        year: body.year ? parseInt(body.year) : null,
        youtubeUrl: body.youtubeUrl || null,
        description: body.description || null,
        featured: Boolean(body.featured),
        thumbnail,
        gallery,
      },
    });

    return new Response(JSON.stringify(project), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("[create-project] Error:", err);
    return new Response(
      JSON.stringify({ message: err.message || "Failed to create project" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
