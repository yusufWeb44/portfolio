import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const faqs = await prisma.faqItem.findMany({
    orderBy: { order: 'asc' },
  });
  console.log(JSON.stringify(faqs, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

