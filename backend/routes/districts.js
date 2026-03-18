const express = require('express');
const router = express.Router();
const { districts, constituencies } = require('../data/districts');

// GET /api/districts - list all districts
router.get('/', (req, res) => {
  res.json({ districts });
});

// GET /api/districts/:id/constituencies - get constituencies for a district
router.get('/:id/constituencies', (req, res) => {
  const { id } = req.params;
  const list = constituencies[id];
  if (!list) {
    return res.status(404).json({ error: 'District not found.' });
  }
  res.json({ constituencies: list });
});

module.exports = router;
