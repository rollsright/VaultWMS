// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth';
import itemsRoutes from './routes/items';
import usersRoutes from './routes/users';
import warehousesRoutes from './routes/warehouses';
import zonesRoutes from './routes/zones';
import locationsRoutes from './routes/locations';
import customersRoutes from './routes/customers';
import suppliersRoutes from './routes/suppliers';
import './config/sequelize'; // Initialize database connection

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS properly for authenticated requests
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'https://vault-wms-frontend.vercel.app',
  'https://vaultwms.vercel.app',
  'https://rolls-right.vercel.app',
  // Add more specific Vercel domains as needed
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    const isAllowed = allowedOrigins.includes(origin);
    
    // Also allow any Vercel app domain (pattern matching)
    const isVercelApp = origin && origin.endsWith('.vercel.app');
    
    if (isAllowed || isVercelApp) {
      console.log('✅ CORS allowed origin:', origin);
      callback(null, true);
    } else {
      console.log('🚫 CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
})); // Security headers (with CORS-friendly settings)

// Log CORS configuration for debugging
console.log('🔒 CORS configured for origins:', allowedOrigins);
console.log('🔒 FRONTEND_URL env var:', process.env.FRONTEND_URL);

app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'WMS Backend API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// CORS test endpoint
app.post('/test-cors', (req, res) => {
  console.log('🧪 CORS test endpoint hit');
  console.log('🧪 Origin:', req.headers.origin);
  console.log('🧪 Headers:', req.headers);
  
  res.json({
    success: true,
    message: 'CORS test successful',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/warehouses', warehousesRoutes);
app.use('/api/zones', zonesRoutes);
app.use('/api/locations', locationsRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/suppliers', suppliersRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

export default app;
