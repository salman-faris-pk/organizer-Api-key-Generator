import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from '../config/database';
import { companies } from '../schemas/company';
import { eq } from 'drizzle-orm';

interface AuthRequest extends Request {
  companyId?: string;
}

export const generateApiKey = (): string => crypto.randomUUID();

export const generateToken = (payload: { companyId: string; email: string | null }): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
};


export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name)
      return res.status(400).json({ error: 'All fields are required' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
    }

    const existing = await db.select().from(companies).where(eq(companies.email, email));
    if (existing.length > 0)
      return res.status(400).json({ error: 'Company already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const apiKey = generateApiKey();

    const [newCompany] = await db.insert(companies)
      .values({ email, name, passwordHash, apiKey })
      .returning();


    const token = generateToken({ companyId: newCompany.id, email: newCompany.email });

    res.status(201).json({
      message: 'Registration successful',
      company: {
        id: newCompany.id,
        name: newCompany.name,
        email: newCompany.email,
        apiKey: newCompany.apiKey
      },
      token
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });

    const [company] = await db.select().from(companies).where(eq(companies.email, email));
    if (!company || !company.passwordHash)
      return res.status(401).json({ error: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, company.passwordHash);
    if (!isValid)
      return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken({ companyId: company.id, email: company.email });

    res.json({
      message: 'Login successful',
      company: {
        id: company.id,
        name: company.name,
        email: company.email,
        apiKey: company.apiKey
      },
      token
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Generate API Key
export const generateApiKeyRoute = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.companyId;
    if (!companyId) return res.status(401).json({ error: 'Not authenticated' });

    const newApiKey = generateApiKey();

    const [updatedCompany] = await db.update(companies)
      .set({ apiKey: newApiKey })
      .where(eq(companies.id, companyId))
      .returning();

    res.json({
      message: 'API key generated successfully',
      apiKey: updatedCompany.apiKey
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getApiKey = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.companyId;
    if (!companyId) return res.status(401).json({ error: 'Not authenticated' });

    const [company] = await db.select({ apiKey: companies.apiKey })
      .from(companies)
      .where(eq(companies.id, companyId));

    if (!company) return res.status(404).json({ error: 'Company not found' });

    res.json({ apiKey: company.apiKey });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


export const getCompanies = async (req: AuthRequest, res: Response) => {
  try {
    const companyList = await db.select({
      id: companies.id,
      name: companies.name,
      email: companies.email,
      active: companies.active,
      createdAt: companies.createdAt
    })
    .from(companies)
    .orderBy(companies.createdAt);

    res.json({ companies: companyList });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get dashboard info
export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.companyId;
    if (!companyId) return res.status(401).json({ error: 'Not authenticated' });

    const [company] = await db.select().from(companies).where(eq(companies.id, companyId));
    if (!company) return res.status(404).json({ error: 'Company not found' });

    res.json({
      company: {
        id: company.id,
        name: company.name,
        email: company.email,
        apiKey: company.apiKey,
        active: company.active,
        createdAt: company.createdAt
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};



export const toggleCompanyStatus = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.companyId;
    const { id: targetCompanyId } = req.params;

    if (!companyId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const [company] = await db.select({ active: companies.active })
      .from(companies)
      .where(eq(companies.id, targetCompanyId));

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const newStatus = !company.active;
    
    const [updatedCompany] = await db.update(companies)
      .set({ active: newStatus })
      .where(eq(companies.id, targetCompanyId))
      .returning();

    res.json({
      message: `Company ${newStatus ? 'activated' : 'deactivated'} successfully`,
      company: {
        id: updatedCompany.id,
        name: updatedCompany.name,
        email: updatedCompany.email,
        active: updatedCompany.active
      }
    });

  } catch (error: any) {
    console.error('Error toggling company status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};