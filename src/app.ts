import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { db } from './config/database';
import { companies } from './schemas/company';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { getDashboard,generateApiKeyRoute,getCompanies,login,register, generateApiKey, toggleCompanyStatus, getApiKey } from './controllers/auth.controller';
import { authenticate } from './middleware/auth.middleware';
import { getDashboardStats, getSettings, updatePassword, updateProfile } from './controllers/dashboard.controller';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(passport.initialize());

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  callbackURL: `${process.env.CALLBACK_URL}/api/auth/github/callback`,
  scope: ['user:email']
}, async (profile:any, done:any) => {
  try {
    const email = profile.emails?.[0].value;
    if (!email) return done(new Error('No email found'), undefined);
    
    let [company] = await db.select().from(companies).where(eq(companies.email, email));
    
    if (!company) {
      const apiKey = generateApiKey();
      [company] = await db.insert(companies).values({
        email,
        name: profile.displayName || profile.username,
        githubId: profile.id,
        apiKey
      }).returning();
    };
    
    return done(null, company);
  } catch (error: any) {
    return done(error, undefined);
  }
}));


app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/api/register', register);
app.post('/api/login', login);


app.get('/api/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/api/auth/github/callback',
  passport.authenticate('github', { session: false }),
  (req: any, res) => {
    const token = jwt.sign(
      { companyId: req.user.id, email: req.user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    
    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/auth/github/callback?token=${token}&apiKey=${req.user.apiKey}`);
  }
);


app.get('/api/dashboard', authenticate, getDashboard);
app.get('/api/api-keys', authenticate, getApiKey);
app.post('/api/generate-api-key', authenticate,generateApiKeyRoute);
app.get('/api/companies', authenticate, getCompanies);
app.patch('/api/companies/:id/toggle-status', authenticate, toggleCompanyStatus);
app.get('/api/dashboard/stats', authenticate, getDashboardStats);
app.get('/api/settings', authenticate, getSettings);
app.put('/api/settings/profile', authenticate, updateProfile);
app.put('/api/settings/password', authenticate, updatePassword);


app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;