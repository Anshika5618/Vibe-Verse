import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/withAuth';

async function toggleLike(req, res) {
  const { id: postId } = req.query;

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const existing = await prisma.like.findUnique({
      where: {
        userId_postId: { userId: req.user.id, postId }, // uses the @@unique([userId, postId]) index
      },
    });

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      const count = await prisma.like.count({ where: { postId } });
      return res.status(200).json({ liked: false, likeCount: count });
    } else {
      await prisma.like.create({ data: { userId: req.user.id, postId } });
      const count = await prisma.like.count({ where: { postId } });
      return res.status(201).json({ liked: true, likeCount: count });
    }
  } catch (err) {
    console.error('Toggle like error:', err);
    return res.status(500).json({ error: 'Failed to toggle like' });
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  return withAuth(toggleLike)(req, res);
}