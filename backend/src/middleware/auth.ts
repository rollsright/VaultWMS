import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { ApiResponse } from '../types';
import sequelize from '../config/sequelize';
import { QueryTypes } from 'sequelize';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Auth middleware: Request received', { 
      method: req.method, 
      url: req.url, 
      hasAuthHeader: !!req.headers.authorization,
      origin: req.headers.origin 
    });
    
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Auth middleware: No valid auth header');
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      } as ApiResponse);
    }

    // Extract the token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.log('Auth middleware: Invalid token or user not found', { error: error?.message, hasUser: !!user });
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      } as ApiResponse);
    }

    // Look up the user in our database to get tenant_id
    try {
      const dbUser = await sequelize.query(
        'SELECT id, tenant_id, email, first_name, last_name, role, is_active FROM users WHERE supabase_user_id = $1 AND is_active = true',
        {
          bind: [user.id],
          type: QueryTypes.SELECT
        }
      ) as any[];

      if (!dbUser || dbUser.length === 0) {
        console.log('Auth middleware: User not found in database or inactive', { supabaseUserId: user.id });
        return res.status(401).json({
          success: false,
          error: 'User not found or inactive'
        } as ApiResponse);
      }

      // Combine Supabase user with database user info
      req.user = {
        ...user,
        ...dbUser[0],
        supabase_user_id: user.id
      };
      
      console.log('Auth middleware: User authenticated successfully', { 
        userId: req.user.id, 
        tenantId: req.user.tenant_id,
        email: req.user.email 
      });
      
    } catch (dbError) {
      console.error('Auth middleware: Database lookup error:', dbError);
      return res.status(500).json({
        success: false,
        error: 'Authentication failed'
      } as ApiResponse);
    }

    next();
    return;

  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed'
    } as ApiResponse);
    return;
  }
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data: { user } } = await supabase.auth.getUser(token);
      req.user = user;
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};
