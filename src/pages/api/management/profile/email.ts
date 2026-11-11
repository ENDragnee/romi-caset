import type { APIRoute } from "astro";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Change the signed-in admin's login email. Requires the current password,
// since whoever controls the email controls the account.
export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) return json({ error: "Unauthorized" }, 401);

  let body: { newEmail?: string; currentPassword?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }

  const newEmail = body.newEmail?.trim().toLowerCase() ?? "";
  const { currentPassword } = body;
  if (!EMAIL_RE.test(newEmail)) {
    return json({ error: "Enter a valid email address" }, 400);
  }
  if (!currentPassword) {
    return json({ error: "Current password is required" }, 400);
  }
  if (newEmail === user.email.toLowerCase()) {
    return json({ error: "That is already your email" }, 400);
  }

  try {
    await auth.api.verifyPassword({
      headers: request.headers,
      body: { password: currentPassword },
    });
  } catch {
    return json({ error: "Current password is incorrect" }, 400);
  }

  const taken = await prisma.user.findUnique({ where: { email: newEmail } });
  if (taken) return json({ error: "That email is already in use" }, 409);

  await prisma.user.update({
    where: { id: user.id },
    data: { email: newEmail },
  });

  return json({ success: true, email: newEmail });
};
