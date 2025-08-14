// API Express minimaliste pour comptes + progression
// Persistance en fichiers JSON via FileDB

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import crypto from 'node:crypto';
import { FileDB } from './lib/filedb.js';
import {
  hashPassword,
  comparePassword,
  issueToken,
  setTokenCookie,
  clearTokenCookie,
  authMiddleware,
  requireAuth,
} from './lib/auth.js';

dotenv.config();
const app = express();

const ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:3000'; // CRA par défaut
const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret';
const PORT = process.env.PORT ?? 4000;
const IS_PROD = process.env.NODE_ENV === 'production';

app.use(cors({ origin: ORIGIN, credentials: true })); // CORS + cookies cross-site
app.use(express.json()); // JSON body parser
app.use(cookieParser()); // cookie parser
app.use(authMiddleware(JWT_SECRET)); // attache req.user si cookie valide

// "Tables" fichiers
const usersDB = new FileDB('data/users.json', { users: [] });
const progressDB = new FileDB('data/progress.json', { progressByUserId: {} });

function findUserByEmail(users, email) {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

// ---------- Routes Auth ----------
app.post('/auth/register', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const { users } = await usersDB.read();
  if (findUserByEmail(users, email)) return res.status(409).json({ error: 'email already in use' });

  const passwordHash = await hashPassword(password);
  const newUser = { id: crypto.randomUUID(), email, passwordHash, createdAt: new Date().toISOString() };

  await usersDB.write((db) => (db.users.push(newUser), db));

  const token = issueToken({ sub: newUser.id, email: newUser.email }, JWT_SECRET);
  setTokenCookie(res, token, IS_PROD);
  res.status(201).json({ id: newUser.id, email: newUser.email });
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  const { users } = await usersDB.read();
  const user = findUserByEmail(users, email);
  if (!user) return res.status(401).json({ error: 'invalid credentials' });
  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });

  const token = issueToken({ sub: user.id, email: user.email }, JWT_SECRET);
  setTokenCookie(res, token, IS_PROD);
  res.json({ id: user.id, email: user.email });
});

app.post('/auth/logout', (req, res) => {
  clearTokenCookie(res);
  res.json({ ok: true });
});

app.get('/me', async (req, res) => {
  // Renvoie null si non connecté; sinon { id, email, progress }
  if (!req.user) return res.json(null);
  const userId = req.user.sub;
  const { users } = await usersDB.read();
  const user = users.find((u) => u.id === userId);
  if (!user) return res.json(null);

  const { progressByUserId } = await progressDB.read();
  res.json({ id: user.id, email: user.email, progress: progressByUserId[userId] ?? null });
});

// ---------- Routes Progression ----------
// Schéma conseillé :
// { capturedIds: number[], badgeCount: number, unlockedRules: string[], activeRules: string[], currentDeckIds: number[], lastSeenAt: string }

app.get('/progress', requireAuth, async (req, res) => {
  const { progressByUserId } = await progressDB.read();
  res.json(progressByUserId[req.user.sub] ?? null);
});

app.put('/progress', requireAuth, async (req, res) => {
  const payload = req.body ?? {};
  await progressDB.write((db) => {
    db.progressByUserId[req.user.sub] = {
      ...payload,
      lastSeenAt: new Date().toISOString(),
    };
    return db;
  });
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`API http://localhost:${PORT}`));