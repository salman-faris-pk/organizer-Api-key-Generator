import { db } from '../config/database.js';
import { companies } from '../schemas/company.js';
import { count, eq, sql } from 'drizzle-orm';
import bcrypt from "bcrypt";
export const getDashboardStats = async (req, res) => {
    try {
        const companyId = req.companyId;
        if (!companyId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const totalCompaniesResult = await db.select({ count: count() }).from(companies);
        const totalCompanies = totalCompaniesResult[0]?.count || 0;
        const activeCompaniesResult = await db.select({ count: count() })
            .from(companies)
            .where(sql `${companies.active} = true`);
        const activeCompanies = activeCompaniesResult[0]?.count || 0;
        // Get companies registered in last 7 days
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const newRegistrationsResult = await db.select({ count: count() })
            .from(companies)
            .where(sql `${companies.createdAt} > ${oneWeekAgo}`);
        const newRegistrations = newRegistrationsResult[0]?.count || 0;
        const apiKeysGenerated = totalCompanies;
        // Optional: Get weekly trend
        const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
        const lastWeekCompaniesResult = await db.select({ count: count() })
            .from(companies)
            .where(sql `${companies.createdAt} BETWEEN ${twoWeeksAgo} AND ${oneWeekAgo}`);
        const lastWeekCompanies = lastWeekCompaniesResult[0]?.count || 0;
        const calculateChange = (current, previous) => {
            if (previous === 0)
                return current > 0 ? '+100%' : '0%';
            const change = ((current - previous) / previous) * 100;
            return `${change >= 0 ? '+' : ''}${change.toFixed(0)}%`;
        };
        res.json({
            stats: {
                totalCompanies,
                activeCompanies,
                apiKeysGenerated,
                newRegistrations,
                // Optional trends
                totalCompaniesChange: calculateChange(totalCompanies, totalCompanies - newRegistrations),
                activeCompaniesChange: '0%',
                apiKeysChange: calculateChange(apiKeysGenerated, apiKeysGenerated - newRegistrations),
                newRegistrationsChange: calculateChange(newRegistrations, lastWeekCompanies),
            }
        });
    }
    catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export const updateProfile = async (req, res) => {
    try {
        const companyId = req.companyId;
        const { name } = req.body;
        if (!companyId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        if (!name || name.trim().length === 0) {
            return res.status(400).json({ error: 'Name is required' });
        }
        // Update company name only
        const [updatedCompany] = await db.update(companies)
            .set({ name: name.trim() })
            .where(eq(companies.id, companyId))
            .returning();
        res.json({
            message: 'Profile updated successfully',
            company: {
                id: updatedCompany.id,
                name: updatedCompany.name,
                email: updatedCompany.email,
                apiKey: updatedCompany.apiKey,
                active: updatedCompany.active,
                createdAt: updatedCompany.createdAt
            }
        });
    }
    catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Update password
export const updatePassword = async (req, res) => {
    try {
        const companyId = req.companyId;
        const { currentPassword, newPassword } = req.body;
        if (!companyId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new password are required' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }
        const [company] = await db.select()
            .from(companies)
            .where(eq(companies.id, companyId));
        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }
        // Check if company has password (GitHub users might not have one)
        if (!company.passwordHash) {
            return res.status(400).json({
                error: 'Password not set. Please use GitHub login or contact support.'
            });
        }
        const isValid = await bcrypt.compare(currentPassword, company.passwordHash);
        if (!isValid) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }
        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);
        await db.update(companies)
            .set({ passwordHash: newPasswordHash })
            .where(eq(companies.id, companyId));
        res.json({
            message: 'Password updated successfully'
        });
    }
    catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Get settings (just profile info)
export const getSettings = async (req, res) => {
    try {
        const companyId = req.companyId;
        if (!companyId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const [company] = await db.select({
            id: companies.id,
            name: companies.name,
            email: companies.email,
            createdAt: companies.createdAt,
        })
            .from(companies)
            .where(eq(companies.id, companyId));
        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }
        res.json({
            name: company.name,
            email: company.email,
            createdAt: company.createdAt,
        });
    }
    catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
