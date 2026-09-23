import type { APIRoute } from "astro";
import { prisma } from "@/lib/prisma";

export const GET: APIRoute = async () => {
  try {
    const videos = await prisma.heroVideo.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return new Response(JSON.stringify(videos), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user)
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });

  try {
    const body = await request.json();
    const { key, title } = body;

    if (!key) {
      return new Response(JSON.stringify({ error: "Media key is required" }), {
        status: 400,
      });
    }

    const count = await prisma.heroVideo.count();

    const heroVideo = await prisma.heroVideo.create({
      data: {
        key,
        title: title || "Hero Clip",
        order: count + 1,
        active: true,
      },
    });

    return new Response(JSON.stringify(heroVideo), { status: 201 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
