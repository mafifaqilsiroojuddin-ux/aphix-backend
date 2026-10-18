const express = require('express');
const router = express.Router();
const db = require('../lib/db');

router.get('/', async (req, res) => {
  res.json(await db.findAll('books'));
});

router.post('/', async (req, res) => {
  res.status(201).json(await db.insert('books', req.body));
});

router.patch('/:id', async (req, res) => {
  const u = await db.update('books', req.params.id, req.body);
  u ? res.json(u) : res.status(404).json({ error: 'Tidak ada' });
});

router.delete('/:id', async (req, res) => {
  const ok = await db.remove('books', req.params.id);
  ok ? res.json({ ok: true }) : res.status(404).json({ error: 'Tidak ada' });
});

module.exports = router;
