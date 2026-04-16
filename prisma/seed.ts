// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create organization
  const org = await prisma.organisation.create({
    data: {
      name: "Fortis Invicta",
      sector: "Energy",
      size: "Large",
      region: "West Africa",
      digitalMaturity: 75,
      score: 8.5,
    },
  });

  console.log("Created organization:", org.id);

  // Hash password
  const hashedPassword = await bcrypt.hash("ChangeMeNow123!", 10);

  // Create CEO user
  const ceoUser = await prisma.user.create({
    data: {
      email: "ceo@fortisinvicta.com",
      name: "Cadjatu Djalo",
      password: hashedPassword,
      role: "CEO",
      orgId: org.id,
    },
  });

  console.log("Created CEO user:", ceoUser.email);

  // Create Board user
  const boardUser = await prisma.user.create({
    data: {
      email: "board@fortisinvicta.com",
      name: "Samba Bajie",
      password: hashedPassword,
      role: "BOARD",
      orgId: org.id,
    },
  });

  console.log("Created Board user:", boardUser.email);

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
