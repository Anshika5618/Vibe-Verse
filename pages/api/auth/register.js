import { prisma } from '@/lib/prisma';
import { hashPassword, signToken, buildCookie } from '@/lib/auth';
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, username, password } = req.body;

  // --- server-side validation ---
  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Email, username, and password are required' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existing) {
      return res.status(409).json({ error: 'Email or username already in use' });
    }

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: { email, username, password: hashed },
      select: { id: true, email: true, username: true, role: true, createdAt: true },
      // ^ select (not the full row) so the hash never leaves the DB layer
    });

    const token = signToken({ userId: user.id, role: user.role });

   res.setHeader('Set-Cookie', buildCookie('token', token, { maxAge: 60 * 60 * 24 * 7 }));

    return res.status(201).json({ user });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}