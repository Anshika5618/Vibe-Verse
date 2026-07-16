import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

function parseCookies(req) {
  const header = req.headers.cookie;
  if (!header) return {};
  return Object.fromEntries(
    header.split(';').map((c) => {
      const [key, ...v] = c.trim().split('=');
      return [key, decodeURIComponent(v.join('='))];
    })
  );
}

// Wrap an API handler to require a logged-in user.
// Usage: export default withAuth(handler)
export function withAuth(handler) {
  return async (req, res) => {
    const cookies = parseCookies(req);
    const token = cookies.token;

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, username: true, role: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'User no longer exists' });
    }

    req.user = user; // attach to request for the handler to use
    return handler(req, res);
  };
}

// Wrap an API handler to require a specific role (e.g. ADMIN).
// Usage: export default withAuth(withRole('ADMIN')(handler))
export function withRole(role) {
  return (handler) => async (req, res) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
    }
    return handler(req, res);
  };
}