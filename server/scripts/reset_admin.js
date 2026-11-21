const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@example.com';
  const newPassword = 'admin123';
  const passwordHash = await bcrypt.hash(newPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  console.log(`\n✅ Admin user updated/created:`);
  console.log(`   Email:    ${admin.email}`);
  console.log(`   Password: ${newPassword}\n`);
}

main()
  .catch((e) => {
    console.error('Error resetting admin:', e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
