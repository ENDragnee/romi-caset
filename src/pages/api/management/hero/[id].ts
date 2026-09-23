import type { APIRoute } from "astro";
import { prisma } from "@/lib/prisma";

export const PUT: APIRoute = async ({ params, request, locals }) => {
  if (!locals.user)
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  const { id } = params;

  try {
    const body = await request.json();
    const updated = await prisma.heroVideo.update({
      where: { id },
      data: {
        title: body.title !== undefined ? body.title : undefined,
        active: body.active !== undefined ? Boolean(body.active) : undefined,
        order: body.order !== undefined ? Number(body.order) : undefined,
      },
    });
    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  if (!locals.user)
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  const { id } = params;

  try {
    await prisma.heroVideo.delete({ where: { id } });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
