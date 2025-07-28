import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create users
  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      id: 'user_1',
      email: 'john@example.com',
      name: 'John Doe',
      emailVerified: true,
      image: 'https://example.com/john.jpg',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      id: 'user_2',
      email: 'jane@example.com',
      name: 'Jane Smith',
      emailVerified: false,
      image: 'https://example.com/jane.jpg',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      id: 'user_3',
      email: 'admin@example.com',
      name: 'Admin User',
      emailVerified: true,
      image: 'https://example.com/admin.jpg',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('Users created:', { user1, user2, user3 });
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 