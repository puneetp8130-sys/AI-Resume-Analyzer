const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok' }, message: 'Service is healthy' });
});

app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
