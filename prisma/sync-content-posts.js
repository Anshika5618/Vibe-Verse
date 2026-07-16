import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash('adminPassword123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vibeverse.com' },
    update: {},
    create: {
      email: 'admin@vibeverse.com',
      username: 'vibeverse-admin',
      password: hashed,
      role: 'ADMIN',
    },
  });

  const contentDir = path.join(process.cwd(), 'content');
  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith('.mdx'));

  for (const file of files) {
    const slug = file.replace('.mdx', '');
    const raw = fs.readFileSync(path.join(contentDir, file), 'utf8');
    const { data, content } = matter(raw);

    const fields = {
      title: data.title,
      content,
      description: data.description || null,
      image: data.image || null,
      tags: data.tags || [],
      readTime: data.readTime || null,
      published: true,
    };

    const post = await prisma.post.upsert({
      where: { slug },
      update: fields,
      create: { slug, authorId: admin.id, ...fields },
    });

    console.log(`Synced: ${post.slug} (${post.id})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());