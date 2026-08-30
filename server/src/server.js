const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('@exortek/express-mongo-sanitize');
const connectDB = require('./config/db');
const { authLimiter, apiLimiter } = require('./middleware/rateLimiters');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const universityRoutes = require('./routes/universityRoutes');
const projectRoutes = require('./routes/projectRoutes');
const industryRoutes = require('./routes/industryRoutes');
const governmentRoutes = require('./routes/governmentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const adminRoutes = require('./routes/adminRoutes');

connectDB();

const app = express();

// Allowed origins: in dev this is just your Vite server; in production,
// set CLIENT_URL in .env to your deployed frontend's real URL. Requests
// with no origin (e.g. Postman, server-to-server) are allowed through,
// since origin-checking is a browser-enforced concept, not a real
// server-side security boundary on its own — this app already relies
// on JWTs for actual authorization.
const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

app.use(helmet({ crossOriginResourcePolicy: false })); // disabled so /uploads images still load cross-origin
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(mongoSanitize());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', apiLimiter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PS26043 server is running' });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/industry', industryRoutes);
app.use('/api/government', governmentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});