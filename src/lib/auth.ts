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
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
});
