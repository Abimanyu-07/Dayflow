import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { ENV } from './config/env';
import apiRouter from './routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

const app: Express = express();

// Security Headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: '*', // For hackathon ease of integration with frontend localhost/vercel
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});
app.use('/api', limiter);

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads (profile pictures & documents)
app.use('/uploads', express.static(path.resolve(process.cwd(), ENV.UPLOAD_DIR)));

// Mount Main API Router
app.use('/api', apiRouter);

// 404 Catch-all
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

// Start server if not running in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(ENV.PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Dayflow HRMS Backend running on port ${ENV.PORT}`);
    console.log(`🌐 Health check: http://localhost:${ENV.PORT}/api/health`);
    console.log(`=========================================`);
  });
}

export default app;
