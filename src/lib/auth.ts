import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  baseURL:
    process.env.BETTER_AUTH_URL ||
    (typeof import.meta !== "undefined" &&
      (import.meta as any).env?.BETTER_AUTH_URL) ||
    "http://localhost:4321",
  secret:
    process.env.BETTER_AUTH_SECRET ||
    (typeof import.meta !== "undefined" &&
      (import.meta as any).env?.BETTER_AUTH_SECRET),
  // Sign-in requests are rejected ("Invalid origin") unless the browser's
  // origin is the baseURL or listed here.
  trustedOrigins: [
    "https://biniromi.com",
    "https://www.biniromi.com",
    "http://localhost:4321",
    // Vercel preview/deployment URLs
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
    process.env.VERCEL_BRANCH_URL && `https://${process.env.VERCEL_BRANCH_URL}`,
  ].filter((o): o is string => Boolean(o)),
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
});
