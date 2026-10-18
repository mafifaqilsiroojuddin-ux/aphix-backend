const express = require('express');
const router = express.Router();
const db = require('../lib/db');

router.get('/:section', async (req, res) => {
  const d = await db.findOne('content', 'section', req.params.section);
  d ? res.json(d) : res.json({ section: req.params.section, data: {} });
});

router.post('/:section', async (req, res) => {
  let d = await db.findOne('content', 'section', req.params.section);
  d = d
    ? await db.update('content', d.id, { data: req.body })
    : await db.insert('content', { section: req.params.section, data: req.body });
  res.json(d);
});

module.exports = router;
