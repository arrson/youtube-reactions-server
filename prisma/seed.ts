// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: 'arraworld@gmail.com' },
    update: {},
    create: {
      id: '00000000admin00000000',
      displayName: 'Stephen',
      email: 'arraworld@gmail.com',
      isAdmin: true,
    },
  });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
