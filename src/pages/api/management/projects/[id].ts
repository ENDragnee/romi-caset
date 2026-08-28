import type { APIRoute } from "astro";
import { prisma } from "@/lib/prisma";

export const PUT: APIRoute = async ({ params, request, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ message: "Project ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();

    const thumbnail =
      body.thumbnailKey !== undefined
        ? body.thumbnailKey
        : body.thumbnail !== undefined
          ? body.thumbnail
          : null;

    const gallery = Array.isArray(body.galleryKeys)
      ? body.galleryKeys
      : Array.isArray(body.gallery)
        ? body.gallery
        : undefined;

    const project = await prisma.project.update({
      where: { id },
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
        ...(gallery ? { gallery } : {}),
      },
    });

    return new Response(JSON.stringify(project), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("[update-project] Error:", err);
    return new Response(
      JSON.stringify({ message: err.message || "Failed to update project" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { id } = params;

  try {
    await prisma.project.delete({ where: { id } });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("[delete-project] Error:", err);
    return new Response(
      JSON.stringify({ message: err.message || "Failed to delete project" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
