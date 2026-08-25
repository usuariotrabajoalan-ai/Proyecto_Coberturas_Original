const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN "phone" TEXT;');
    console.log("Columna 'phone' añadida con éxito.");
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log("La columna 'phone' ya existe.");
    } else {
      console.error("Error al añadir columna:", error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
