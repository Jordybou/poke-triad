// Utilitaires d'authentification : hash, compare, JWT, cookies httpOnly, middleware

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const TOKEN_COOKIE = 'session';
const TOKEN_TTL_SEC = 60 * 60 * 24 * 7; // 7 jours

export const hashPassword = (plain) => bcrypt.hash(plain, 10);
export const comparePassword = (plain, hash) => bcrypt.compare(plain, hash);
export const issueToken = (payload, secret) => jwt.sign(payload, secret, { expiresIn: TOKEN_TTL_SEC });

export function setTokenCookie(res, token, isProd) {
  // Cookie httpOnly : non lisible par JS côté client → plus sûr contre XSS
  res.cookie(TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,      // true en prod (HTTPS)
    path: '/',
    maxAge: TOKEN_TTL_SEC * 1000,
  });
}

export const clearTokenCookie = (res) => res.clearCookie(TOKEN_COOKIE, { path: '/' });

export const authMiddleware = (secret) => (req, _res, next) => {
  // Si un cookie JWT est présent et valide, on attache req.user
  const token = req.cookies?.[TOKEN_COOKIE];
  if (token) {
    try { req.user = jwt.verify(token, secret); } catch { /* token invalide/expiré → invité */ }
  }
  next();
};

export const requireAuth = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  next();
};