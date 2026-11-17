import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';

// We'll import routes later

const app = express();

// 1. HTTP Security Headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'blob:', 'http:', 'https:'],
        connectSrc: ["'self'", 'http:', 'https:'],
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allows uploaded images to be safely consumed
    xFrameOptions: { action: 'deny' }, // Anti-Clickjacking
    xContentTypeOptions: true, // Anti-MIME sniffing
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hidePoweredBy: true, // Prevents framework fingerprinting
  })
);

// 2. Cross-Origin Resource Sharing (CORS) Hardening
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:4173',
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // In production, enforce strictly against configured client URL
      if (process.env.NODE_ENV === 'production') {
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error('Blocked by CORS policy'));
      }
      // In development, permit localhost testing
      if (!origin || allowedOrigins.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// 3. Payload size limiting against Denial-of-Service (DoS)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

import fs from 'fs';

// Static file serving for uploads with caching and automatic WebP negotiation
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');

  // If client requests png but webp exists, seamlessly serve the lightweight webp
  if (req.path.endsWith('.png')) {
    const webpPath = path.join(__dirname, '../uploads', req.path.replace(/\.png$/, '.webp'));
    if (fs.existsSync(webpPath)) {
      res.setHeader('Content-Type', 'image/webp');
      return res.sendFile(webpPath);
    }
  }
  next();
});
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  maxAge: '7d',
  immutable: true,
}));

import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import apiRoutes from './routes/apiRoutes';
import uploadRoutes from './routes/uploadRoutes';

// Routes will go here
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api', apiRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || []
  });
});

export default app;
