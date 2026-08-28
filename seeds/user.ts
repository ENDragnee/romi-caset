import "dotenv/config";
import { auth } from "../src/lib/auth";
import { prisma } from "../src/lib/prisma";

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || "admin@kasetproduction.com";
  const password = process.env.SEED_ADMIN_PASSWORD || "Admin@123456";
  const name = process.env.SEED_ADMIN_NAME || "Admin User";

  console.log(`Seeding admin user: ${email}...`);

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log(`User ${email} already exists. Skipping.`);
    return;
  }

  // Create user using Better Auth API so password hashing & account linking are handled properly
  const user = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
  });

  console.log("✅ Admin user seeded successfully:", {
    id: user.user.id,
    email: user.user.email,
    name: user.user.name,
  });
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
