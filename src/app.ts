import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import {
  getDashboard,
  getCompanies,
  login,
  register,
  toggleCompanyStatus,
  getApiKey,
  updateApiKeyRoute
} from './controllers/auth.controller.js';
import { authenticate } from './middleware/auth.middleware.js';
import {
  getDashboardStats,
  getSettings,
  updatePassword,
  updateProfile
} from './controllers/dashboard.controller.js';
import path from 'path';
import { getRedis } from './config/redis.js';
import { initializeGitHubStrategy } from './strategies/github.js';

dotenv.config();

const app = express();

getRedis();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

initializeGitHubStrategy();

app.get('/health', (_: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/api/register', register);
app.post('/api/login', login);

app.get('/api/auth/github', passport.authenticate('github'));

app.get(
  '/api/auth/github/callback',
  passport.authenticate('github', { session: false ,failureRedirect: '/login?error=github_auth_failed'}),
  (req: Request, res: Response) => {
    const user = req.user as any;

    const token = jwt.sign(
      { companyId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.redirect(`${process.env.CLIENT_URL}/auth/github/callback?token=${token}`);
  }
);

app.get('/api/dashboard', authenticate, getDashboard);
app.get('/api/api-keys', authenticate, getApiKey);
app.post('/api/generate-api-key', authenticate, updateApiKeyRoute);
app.get('/api/companies', authenticate, getCompanies);
app.patch('/api/companies/:id/toggle-status', authenticate, toggleCompanyStatus);
app.get('/api/dashboard/stats', authenticate, getDashboardStats);
app.get('/api/settings', authenticate, getSettings);
app.put('/api/settings/profile', authenticate, updateProfile);
app.put('/api/settings/password', authenticate, updatePassword);



const frontendPath = path.join(process.cwd(), 'ui', 'dist');

app.use(express.static(frontendPath));

app.get(/.*/, (_req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});


app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});


app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
);

export default app;
