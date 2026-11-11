import type { APIRoute } from "astro";
import { auth } from "@/lib/auth";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

// Change the signed-in admin's password. better-auth checks the current
// password and length rules; every other session is signed out and this
// one gets a fresh session cookie.
export const POST: APIRoute = async ({ request }) => {
  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }

  const { currentPassword, newPassword } = body;
  if (!currentPassword || !newPassword) {
    return json({ error: "Current and new password are required" }, 400);
  }
  if (currentPassword === newPassword) {
    return json(
      { error: "New password must differ from the current one" },
      400,
    );
  }

  const res = await auth.api.changePassword({
    headers: request.headers,
    body: { currentPassword, newPassword, revokeOtherSessions: true },
    asResponse: true,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return json(
      { error: err.message || "Could not change password" },
      res.status,
    );
  }

  // Pass the refreshed session cookie through to the browser
  const headers = new Headers({ "Content-Type": "application/json" });
  res.headers.forEach((v, k) => {
    if (k.toLowerCase() === "set-cookie") headers.append(k, v);
  });
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers,
  });
};
