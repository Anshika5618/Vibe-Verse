import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRY = '7d';

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload) {
  // payload should be minimal: { userId, role }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

  export function buildCookie(name, value, options = {}) {
    const {
      httpOnly = true,
      secure = process.env.NODE_ENV === 'production',
      sameSite = 'Lax',
      path = '/',
      maxAge,
    } = options;
  
    let cookie = `${name}=${encodeURIComponent(value)}`;
    if (path) cookie += `; Path=${path}`;
    if (maxAge !== undefined) cookie += `; Max-Age=${maxAge}`;
    if (httpOnly) cookie += `; HttpOnly`;
    if (secure) cookie += `; Secure`;
    if (sameSite) cookie += `; SameSite=${sameSite}`;
    return cookie;
  }