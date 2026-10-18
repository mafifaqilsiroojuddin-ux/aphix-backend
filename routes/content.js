// =========================================================
// Route: Konten game (pertemuan & level / bank soal)
// Public: GET  |  Admin: PUT (edit soal dari jarak jauh)
// =========================================================
const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const { adminAuth } = require('../middleware/auth');

router.get('/', (req, res) => {
  const c = db.getAll('content');
  res.json(c && Object.keys(c).length ? c : { pertemuan: [] });
});

router.put('/', adminAuth, (req, res) => {
  db.setAll('content', req.body || { pertemuan: [] });
  res.json({ ok: true, content: db.getAll('content') });
});

module.exports = router;
