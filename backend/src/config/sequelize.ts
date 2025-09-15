import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get DATABASE_URL from environment
function getDatabaseUrl(): string {
  // Use SUPABASE_DB_URL directly from environment
  const databaseUrl = process.env.SUPABASE_DB_URL;
  
  if (!databaseUrl) {
    throw new Error('SUPABASE_DB_URL environment variable is required');
  }
  
  console.log('🔍 Debug Info:');
  console.log('  Using SUPABASE_DB_URL from environment');
  console.log('  DATABASE_URL:', databaseUrl.replace(/:[^:@]+@/, ':***@')); // Hide password in logs
  
  return databaseUrl;
}

// Supabase database configuration
const config = {
  development: {
    dialect: 'postgres' as const,
    logging: console.log, // Enable SQL logging in development
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  },
  test: {
    dialect: 'postgres' as const,
    logging: false, // Disable logging in test
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  },
  production: {
    dialect: 'postgres' as const,
    logging: false, // Disable logging in production
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env as keyof typeof config];

// Create Sequelize instance
let sequelize: Sequelize;

try {
  // Generate DATABASE_URL from Supabase variables
  const databaseUrl = getDatabaseUrl();
  
  // Use Supabase connection string
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    dialectOptions: dbConfig.dialectOptions
  });
} catch (error) {
  console.error('❌ Failed to create database connection:', error);
  throw error;
}

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connection established successfully.');
  })
  .catch((err) => {
    console.error('❌ Unable to connect to the database:', err);
    console.log('💡 Tip: Make sure you\'re using the Supabase CONNECTION POOLER URL, not the direct database URL');
  });

export default sequelize;
