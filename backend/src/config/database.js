// Load environment variables
require('dotenv').config();

module.exports = {
  development: {
    // Use Supabase DIRECT connection string for migrations
    use_env_variable: 'SUPABASE_DIRECT_URL',
    dialect: 'postgres',
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
    // Use Supabase DIRECT connection string for testing
    use_env_variable: 'SUPABASE_DIRECT_URL',
    dialect: 'postgres',
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
    // Use Supabase DIRECT connection string for production
    use_env_variable: 'SUPABASE_DIRECT_URL',
    dialect: 'postgres',
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
