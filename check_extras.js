const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const adminUsers = await prisma.$queryRaw`SELECT * FROM admin_users`;
  console.log("Admins:", adminUsers);
  
  const staff = await prisma.$queryRaw`SELECT * FROM staff LIMIT 3`;
  console.log("Staff:", staff);
}
main().finally(() => prisma.$disconnect());
