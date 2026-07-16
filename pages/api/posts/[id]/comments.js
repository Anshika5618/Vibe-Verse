import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    // Fetch ALL comments for the post flat, then build the tree in JS.
    // (Fetching flat + building in-memory is far cheaper than N recursive queries.)
    const flatComments = await prisma.comment.findMany({
      where: { postId: id },
      orderBy: { createdAt: 'asc' },
      include: {
        author: { select: { id: true, username: true } },
      },
    });

    const byId = {};
    flatComments.forEach((c) => {
      byId[c.id] = { ...c, replies: [] };
    });

    const tree = [];
    flatComments.forEach((c) => {
      if (c.parentId) {
        byId[c.parentId]?.replies.push(byId[c.id]);
      } else {
        tree.push(byId[c.id]);
      }
    });

    return res.status(200).json({ comments: tree });
  } catch (err) {
    console.error('Get comments error:', err);
    return res.status(500).json({ error: 'Failed to fetch comments' });
  }
}