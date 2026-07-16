import { withAuth } from '@/lib/withAuth';

async function handler(req, res) {
  return res.status(200).json({ user: req.user });
}

export default withAuth(handler);