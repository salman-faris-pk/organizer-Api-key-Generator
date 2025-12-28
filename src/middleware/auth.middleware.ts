import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  companyId?: string;
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    } 
  
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { companyId: string };
    
    (req as AuthRequest).companyId = decoded.companyId;
 
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};