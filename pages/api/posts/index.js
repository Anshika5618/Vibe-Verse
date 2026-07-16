import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/withAuth';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return getPosts(req, res);
  }
  if (req.method === 'POST') {
    return withAuth(createPost)(req, res);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}

async function getPosts(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          createdAt: true,
          author: { select: { id: true, username: true } },
          _count: { select: { comments: true, likes: true } },
        },
      }),
      prisma.post.count({ where: { published: true } }),
    ]);

    return res.status(200).json({
      posts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Get posts error:', err);
    return res.status(500).json({ error: 'Failed to fetch posts' });
  }
}

async function createPost(req, res) {
  const { title, content, slug, published } = req.body;

  if (!title || !content || !slug) {
    return res.status(400).json({ error: 'Title, content, and slug are required' });
  }
  if (title.length > 200) {
    return res.status(400).json({ error: 'Title must be under 200 characters' });
  }

  try {
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) {
      return res.status(409).json({ error: 'A post with this slug already exists' });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        slug,
        published: Boolean(published),
        authorId: req.user.id,
      },
    });

    return res.status(201).json({ post });
  } catch (err) {
    console.error('Create post error:', err);
    return res.status(500).json({ error: 'Failed to create post' });
  }
}