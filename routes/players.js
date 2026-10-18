const express = require('express');
const router = express.Router();
const db = require('../lib/db');

router.get('/', async (req, res) => {
  res.json(await db.findAll('players'));
});

router.get('/:name', async (req, res) => {
  const p = await db.findOne('players', 'name', req.params.name);
  p ? res.json(p) : res.status(404).json({ error: 'Tidak ada' });
});

router.post('/', async (req, res) => {
  res.status(201).json(await db.insert('players', req.body));
});

router.patch('/:id', async (req, res) => {
  const u = await db.update('players', req.params.id, req.body);
  u ? res.json(u) : res.status(404).json({ error: 'Tidak ada' });
});

router.delete('/:id', async (req, res) => {
  const ok = await db.remove('players', req.params.id);
  ok ? res.json({ ok: true }) : res.status(404).json({ error: 'Tidak ada' });
});

module.exports = router;
