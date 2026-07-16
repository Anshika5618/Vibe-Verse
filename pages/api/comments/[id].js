import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/withAuth';

async function deleteComment(req, res) {
  const { id } = req.query;

  try {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: not your comment' });
    }

    // Cascade delete handles replies automatically (see schema: onDelete: Cascade)
    await prisma.comment.delete({ where: { id } });
    return res.status(200).json({ message: 'Comment deleted' });
  } catch (err) {
    console.error('Delete comment error:', err);
    return res.status(500).json({ error: 'Failed to delete comment' });
  }
}

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    return withAuth(deleteComment)(req, res);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}