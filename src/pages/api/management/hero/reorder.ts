import type { APIRoute } from "astro";
import { prisma } from "@/lib/prisma";

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user)
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });

  try {
    const { items } = await request.json(); // [{ id: string, order: number }]

    if (!Array.isArray(items)) {
      return new Response(JSON.stringify({ error: "items array required" }), {
        status: 400,
      });
    }

    await prisma.$transaction(
      items.map((item) =>
        prisma.heroVideo.update({
          where: { id: item.id },
          data: { order: Number(item.order) },
        }),
      ),
      { timeout: 10000 },
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
