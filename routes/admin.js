const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../lib/db');
const config = require('../config');

router.post('/login', async (req, res) => {
  const ok = await db.verifyAdminPassword(req.body.password);
  if (!ok) return res.status(401).json({ error: 'Sandi salah' });
  res.json({ token: jwt.sign({ role: 'admin' }, config.JWT_SECRET, { expiresIn: '7d' }) });
});

module.exports = router;
