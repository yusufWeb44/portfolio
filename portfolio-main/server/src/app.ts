import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';

// We'll import routes later

const app = express();

// Security and utility middlewares
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:4173',
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl) or allowed origins or any localhost port
    if (!origin || allowedOrigins.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
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
