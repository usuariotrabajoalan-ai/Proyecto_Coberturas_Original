import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  
  // 1. Crear Administrador
  await prisma.user.upsert({
    where: { document: "admin" },
    update: {},
    create: {
      name: "Administrador",
      document: "admin",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created/verified.");

  // 2. Crear Empleadas (Limpiadoras)
  const empleadas = [
    { name: "Teresa Rolón", doc: "1111111" },
    { name: "Carmen Gómez", doc: "2222222" },
    { name: "María Florentín", doc: "3333333" },
  ];

  for (const emp of empleadas) {
    const psw = await bcrypt.hash(emp.doc, 10);
    await prisma.user.upsert({
      where: { document: emp.doc },
      update: {},
      create: {
        name: emp.name,
        document: emp.doc,
        password: psw,
        role: "CLEANER"
      }
    });
  }
  console.log("✅ Empleadas creadas.");

  // 3. Crear Lugares (Quinchos/Salones)
  const lugares = ["Quincho 1", "Quincho 2", "Quincho 3", "Salón Galas", "Salón de Eventos", "Quincho 10"];
  for (const l of lugares) {
    const exists = await prisma.location.findFirst({ where: { name: l } });
    if (!exists) {
      await prisma.location.create({
        data: { name: l, campus: "Sede Social" }
      });
    }
  }
  console.log("✅ Lugares (Quinchos/Salones) creados.");

  // 4. Crear Trabajos Pendientes y Completados
  const dbUsers = await prisma.user.findMany({ where: { role: "CLEANER" } });
  const dbLocations = await prisma.location.findMany();

  if (dbUsers.length > 0 && dbLocations.length > 0) {
    // Check if jobs exist so we don't duplicate on multiple seed runs
    const existingJobs = await prisma.job.count();
    if (existingJobs === 0) {
      const today = new Date();
      // Trabajo Pendiente
      await prisma.job.create({
        data: {
          userId: dbUsers[0].id,
          locationId: dbLocations[0].id,
          date: today,
          startTime: "14:00",
          status: "PENDING",
        }
      });
      // Trabajo Completado
      const pastDate = new Date();
      pastDate.setDate(today.getDate() - 2);
      await prisma.job.create({
        data: {
          userId: dbUsers[0].id,
          locationId: dbLocations[3].id, // Salón Galas
          date: pastDate,
          startTime: "09:00",
          endTime: new Date(pastDate.setHours(13, 0, 0)),
          status: "COMPLETED",
          notes: "Todo quedó impecable, se limpiaron las ventanas también.",
        }
      });
      console.log("✅ Trabajos de prueba asignados.");
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
