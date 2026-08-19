/**
 * News Aggregator Backend Server (Zero-Dependency Standalone Mode)
 * 
 * High-performance, secure Express API with 24-hour inactivity session management,
 * multi-source RSS ingestion, story clustering, and personalized ranking.
 * No external MongoDB cluster required.
 */

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const preferenceRoutes = require('./routes/preferenceRoutes');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { generalLimiter } = require('./middleware/rateLimiter');
const { runIngestion } = require('./services/newsIngestionService');

const app = express();

// Security & Parsing Middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Dynamic CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },
    credentials: true
  })
);

// General Rate Limiting
app.use('/api', generalLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    mode: 'standalone_store'
  });
});

// Primary API Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/preferences', preferenceRoutes);
app.use('/api/users', userRoutes);

// Centralized Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

function startBackgroundScheduler() {
  // Trigger initial live news ingestion immediately
  runIngestion().catch(err => {
    console.warn('[NewsIngestion] Ingestion cycle notice:', err.message);
  });

  // Recurring live refresh every 10 minutes
  const INGESTION_INTERVAL_MS = 10 * 60 * 1000;
  setInterval(() => {
    runIngestion().catch(err => {
      console.warn('[NewsIngestion] Periodic refresh warning:', err.message);
    });
  }, INGESTION_INTERVAL_MS);
}

// Start Server immediately without MongoDB connection requirement
app.listen(PORT, () => {
  console.log(`[Server] AuraNews API running on port ${PORT} (Zero-Dependency Standalone Mode)`);
  startBackgroundScheduler();
});

module.exports = app;
