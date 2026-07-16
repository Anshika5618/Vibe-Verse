import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { withAuth } from '@/lib/withAuth';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
  return getPost(req, res, id);
}

  
  if (req.method === 'PUT') {
    return withAuth((req, res) => updatePost(req, res, id))(req, res);
  }
  if (req.method === 'DELETE') {
    return withAuth((req, res) => deletePost(req, res, id))(req, res);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}

async function getPost(req, res, id) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
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
            where: { userId_postId: { userId: payload.userId, postId: id } },
          });
          liked = !!existing;
        }
      }
    }

    return res.status(200).json({ post: { ...post, liked } });
  } catch (err) {
    console.error('Get post error:', err);
    return res.status(500).json({ error: 'Failed to fetch post' });
  }
}

async function updatePost(req, res, id) {
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // role-based access: must be the author OR an admin
    if (post.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: not your post' });
    }

    const { title, content, published } = req.body;
    const data = {};
    if (title !== undefined) {
      if (title.length > 200) {
        return res.status(400).json({ error: 'Title must be under 200 characters' });
      }
      data.title = title;
    }
    if (content !== undefined) data.content = content;
    if (published !== undefined) data.published = Boolean(published);

    const updated = await prisma.post.update({ where: { id }, data });
    return res.status(200).json({ post: updated });
  } catch (err) {
    console.error('Update post error:', err);
    return res.status(500).json({ error: 'Failed to update post' });
  }
}

async function deletePost(req, res, id) {
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: not your post' });
    }

    await prisma.post.delete({ where: { id } });
    return res.status(200).json({ message: 'Post deleted' });
  } catch (err) {
    console.error('Delete post error:', err);
    return res.status(500).json({ error: 'Failed to delete post' });
  }
}