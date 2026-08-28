import { defineMiddleware } from "astro:middleware";
import { auth } from "@/lib/auth";

export const onRequest = defineMiddleware(async (context, next) => {
  /* ── Populate session on every request ── */
  const session = await auth.api.getSession({
    headers: context.request.headers,
  });

  context.locals.user = session?.user ?? null;
  context.locals.session = session?.session ?? null;

  const path = context.url.pathname;

  /* ── Protect /management/* sub-pages (login page at /management is public) ── */
  if (path.startsWith("/management/") && !context.locals.user) {
    return context.redirect("/management");
  }

  /* ── Protect /api/management/* endpoints ── */
  if (path.startsWith("/api/management/") && !context.locals.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return next();
});
