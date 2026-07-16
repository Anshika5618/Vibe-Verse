import { buildCookie } from '@/lib/auth';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Overwrite the cookie with an empty value and Max-Age=0 to delete it
  res.setHeader('Set-Cookie', buildCookie('token', '', { maxAge: 0 }));
  return res.status(200).json({ message: 'Logged out' });
}