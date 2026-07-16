//For load-testing only, not real seeding


import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'seeduser@test.com' },
    update: {},
    create: { email: 'seeduser@test.com', username: 'seeduser', password: hashed },
  });

  console.log('Seeding 2000 posts...');
  for (let i = 0; i < 2000; i++) {
    await prisma.post.create({
      data: {
        title: `Seeded Post ${i}`,
        slug: `seeded-post-${i}-${Date.now()}`,
        content: 'Lorem ipsum '.repeat(50),
        published: i % 3 !== 0, // mix of published/unpublished
        authorId: user.id,
        createdAt: new Date(Date.now() - i * 1000 * 60),
      },
    });
    if (i % 200 === 0) console.log(`  ${i}/2000`);
  }
  console.log('Done seeding.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());