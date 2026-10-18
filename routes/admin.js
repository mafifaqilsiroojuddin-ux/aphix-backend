// =========================================================
// Route: Login admin (untuk KELOLA ARSIP di web ketiga)
// =========================================================
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../lib/db');
const config = require('../config');
const { adminAuth } = require('../middleware/auth');

router.post('/login', (req, res) => {
  const { password } = req.body || {};
  if (!password || !db.verifyAdminPassword(String(password))) {
    return res.status(401).json({ error: 'Sandi salah.' });
  }
  const token = jwt.sign({ role: 'admin' }, config.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

// Opsional: ganti sandi admin
router.put('/password', adminAuth, (req, res) => {
  const { newPassword } = req.body || {};
  if (!newPassword || String(newPassword).length < 6) {
    return res.status(400).json({ error: 'Sandi baru minimal 6 karakter.' });
  }
  db.changeAdminPassword(String(newPassword));
  res.json({ ok: true });
});

module.exports = router;
