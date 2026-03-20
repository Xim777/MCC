const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { requireAdmin } = require('../middleware/auth');

// GET /api/reports - get all closed entries for report (admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('entries')
      .where('status', '==', 'Closed')
      .get();

    const entries = [];
    snapshot.forEach(doc => {
      entries.push({ id: doc.id, ...doc.data() });
    });

    // Filter by mediaType if specified
    const mediaTypeFilter = req.query.mediaType;
    const filtered = mediaTypeFilter
      ? entries.filter(e => (e.mediaType || 'social_media') === mediaTypeFilter)
      : entries;

    // Sort by sno
    filtered.sort((a, b) => a.sno - b.sno);

    res.json({ entries: filtered });
  } catch (err) {
    console.error('Reports error:', err);
    res.status(500).json({ error: 'Failed to fetch report data.' });
  }
});

module.exports = router;
