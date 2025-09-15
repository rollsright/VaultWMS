// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth';
import itemsRoutes from './routes/items';

const app = express();
const PORT = process.env.PORT || 3002;

// Configure CORS properly for authenticated requests
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'https://*.vercel.app', // Allow all Vercel deployments
  'https://vaultwms.vercel.app', // Common Vercel pattern
  'https://rolls-right.vercel.app', // Another common pattern
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or matches Vercel pattern
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.includes('*')) {
        return origin.includes(allowedOrigin.replace('*', ''));
      }
      return origin === allowedOrigin;
    });
    
    if (isAllowed) {
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
