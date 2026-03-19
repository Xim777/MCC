const express = require('express');
const cors = require('cors');

const { initError } = require('../backend/config/firebase');
const districtRoutes = require('../backend/routes/districts');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug endpoint - remove after fixing
app.get('/api/debug', (req, res) => {
  res.json({
    firebaseOk: !initError,
    firebaseError: initError || null,
    hasEnvVar: !!process.env.FIREBASE_SERVICE_ACCOUNT,
    envVarLength: process.env.FIREBASE_SERVICE_ACCOUNT ? process.env.FIREBASE_SERVICE_ACCOUNT.length : 0
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), firebaseOk: !initError });
});

// Only load routes that need Firebase if it initialized
if (!initError) {
  const authRoutes = require('../backend/routes/auth');
  const entryRoutes = require('../backend/routes/entries');
  const reportRoutes = require('../backend/routes/reports');
  app.use('/api/auth', authRoutes);
  app.use('/api/entries', entryRoutes);
  app.use('/api/reports', reportRoutes);
} else {
  app.all('/api/auth/*', (req, res) => res.status(500).json({ error: 'Firebase not initialized: ' + initError }));
  app.all('/api/entries/*', (req, res) => res.status(500).json({ error: 'Firebase not initialized: ' + initError }));
  app.all('/api/reports/*', (req, res) => res.status(500).json({ error: 'Firebase not initialized: ' + initError }));
}

app.use('/api/districts', districtRoutes);

module.exports = app;
