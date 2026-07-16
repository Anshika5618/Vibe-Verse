import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/withAuth';

async function createComment(req, res) {
  const { content, postId, parentId } = req.body;

  if (!content || !postId) {
    return res.status(400).json({ error: 'Content and postId are required' });
  }
  if (content.length > 2000) {
    return res.status(400).json({ error: 'Comment must be under 2000 characters' });
  }

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (parentId) {
      const parent = await prisma.comment.findUnique({ where: { id: parentId } });
      if (!parent || parent.postId !== postId) {
        return res.status(400).json({ error: 'Invalid parent comment' });
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        parentId: parentId || null,
        authorId: req.user.id,
      },
      include: {
        author: { select: { id: true, username: true } },
      },
    });

    return res.status(201).json({ comment });
  } catch (err) {
    console.error('Create comment error:', err);
    return res.status(500).json({ error: 'Failed to create comment' });
  }
}

export default withAuth(createComment);