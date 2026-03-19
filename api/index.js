const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug - test basic function first
app.get('/api/debug', (req, res) => {
  let firebaseStatus = 'not tested';
  let firebaseError = null;

  try {
    const hasEnv = !!process.env.FIREBASE_SERVICE_ACCOUNT;
    const envLen = process.env.FIREBASE_SERVICE_ACCOUNT ? process.env.FIREBASE_SERVICE_ACCOUNT.length : 0;

    let parsed = null;
    if (hasEnv) {
      parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      firebaseStatus = 'parsed ok, project: ' + parsed.project_id;
    } else {
      firebaseStatus = 'no env var';
    }

    res.json({ firebaseStatus, hasEnv, envLen, projectId: parsed?.project_id });
  } catch (err) {
    res.json({ firebaseStatus: 'error', error: err.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Load Firebase and routes only for non-debug paths
let routesLoaded = false;
let loadError = null;

function loadRoutes() {
  if (routesLoaded) return;
  try {
    const { initError } = require('../backend/config/firebase');
    if (initError) {
      loadError = initError;
      return;
    }
    const authRoutes = require('../backend/routes/auth');
    const entryRoutes = require('../backend/routes/entries');
    const reportRoutes = require('../backend/routes/reports');
    const districtRoutes = require('../backend/routes/districts');
    app.use('/api/auth', authRoutes);
    app.use('/api/entries', entryRoutes);
    app.use('/api/reports', reportRoutes);
    app.use('/api/districts', districtRoutes);
    routesLoaded = true;
  } catch (err) {
    loadError = err.message;
  }
}

// Lazy load routes on first API request
app.use('/api', (req, res, next) => {
  if (req.path === '/debug' || req.path === '/health') return next();
  loadRoutes();
  if (loadError) {
    return res.status(500).json({ error: 'Server init failed: ' + loadError });
  }
  next();
});

module.exports = app;
