import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import logger from './config/logger.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;


app.use(helmet());
app.use(cors());
app.use(compression());


const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, 
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});


app.use(process.env.API_PREFIX || '/api/v1', routes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Event Management API',
    version: '1.0.0',
    documentation: '/api/v1/health'
  });
});


app.use(notFoundHandler);
app.use(errorHandler);


app.listen(PORT, () => {
  logger.info(` Server is running on port ${PORT}`);
  logger.info(` API available at http://localhost:${PORT}${process.env.API_PREFIX || '/api/v1'}`);
});


process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;