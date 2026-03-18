const express = require('express');
const cors = require('cors');

const authRoutes = require('../backend/routes/auth');
const entryRoutes = require('../backend/routes/entries');
const reportRoutes = require('../backend/routes/reports');
const districtRoutes = require('../backend/routes/districts');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/entries', entryRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/districts', districtRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = app;
