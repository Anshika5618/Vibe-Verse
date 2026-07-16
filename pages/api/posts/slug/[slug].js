import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug } = req.query;

  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, username: true } },
        _count: { select: { likes: true } },
      },
    });

    if (!post || !post.published) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the requester (if logged in) has liked this post
    let liked = false;
    const cookies = req.headers.cookie;
    if (cookies) {
      const match = cookies.split(';').find((c) => c.trim().startsWith('token='));
      if (match) {
        const token = decodeURIComponent(match.split('=')[1]);
        const payload = verifyToken(token);
        if (payload) {
          const existing = await prisma.like.findUnique({
            where: { userId_postId: { userId: payload.userId, postId: post.id } },
          });
          liked = !!existing;
        }
      }
    }

    return res.status(200).json({ post: { ...post, liked } });
  } catch (err) {
    console.error('Get post by slug error:', err);
    return res.status(500).json({ error: 'Failed to fetch post' });
  }
}