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
    const { items } = await request.json(); // Array of { id: string, order: number }

    if (!Array.isArray(items)) {
      return new Response(JSON.stringify({ message: "items array required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Execute atomic update transaction
    await prisma.$transaction(
      items.map((item) =>
        prisma.project.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("[reorder-projects] Error:", err);
    return new Response(
      JSON.stringify({ message: err.message || "Failed to reorder projects" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
