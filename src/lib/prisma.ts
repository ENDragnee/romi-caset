import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const prismaClientSingleton = () => {
  const connectionString =
    process.env.DATABASE_URL ||
    (typeof import.meta !== "undefined" &&
      (import.meta as any).env?.DATABASE_URL);

  if (!connectionString) {
    throw new Error("DATABASE_URL is missing from environment variables");
  }

  if (connectionString.startsWith("prisma://")) {
    throw new Error(
      "You are using a 'prisma://' URL with the 'pg' adapter. Please use the Direct Connection URL (starts with 'postgres://') or remove the adapter.",
    );
  }

  const isLocal =
    connectionString.includes("localhost") ||
    connectionString.includes("127.0.0.1");

  const pool = new Pool({
    connectionString,
    ssl: isLocal ? false : { rejectUnauthorized: false },
    max: 10, // Limit pool size per serverless container
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  // Prevent idle connection drops from crashing the serverless container
  pool.on("error", (err) => {
    console.error("Unexpected error on idle PostgreSQL client", err);
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Preserve connection across warm serverless invocations on Vercel
export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

globalThis.prismaGlobal = prisma;
