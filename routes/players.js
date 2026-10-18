// =========================================================
// Route: Pemain (siswa) + progress + leaderboard
// Dipakai oleh: web kedua (Game Deduksi Sejarah) & web utama (hub)
// =========================================================
const express = require('express');
const router = express.Router();
const db = require('../lib/db');

// Daftar / ambil profil pemain berdasarkan nama
router.post('/', (req, res) => {
  const { nama, hewan } = req.body || {};
  if (!nama || !String(nama).trim()) return res.status(400).json({ error: 'Nama wajib diisi.' });
  const name = String(nama).trim().slice(0, 50);
  let player = db.findOne('players', p => p.nama.toLowerCase() === name.toLowerCase());
  if (!player) {
    player = db.insert('players', {
      nama: name,
      hewan: hewan || '🐱',
      poinTotal: 0,
      levelTerbuka: [1],
      levelSelesai: [],
      gelarTerakhir: '',
      hasilEvaluasi: {},
    });
  } else if (hewan && player.hewan !== hewan) {
    player = db.update('players', player.id, { hewan });
  }
  res.json(player);
});

// Ambil 1 pemain
router.get('/:nama', (req, res) => {
  const player = db.findOne('players', p => p.nama.toLowerCase() === String(req.params.nama).toLowerCase());
  if (!player) return res.status(404).json({ error: 'Pemain tidak ditemukan.' });
  res.json(player);
});

// Simpan progress pemain
router.put('/:nama/progress', (req, res) => {
  const player = db.findOne('players', p => p.nama.toLowerCase() === String(req.params.nama).toLowerCase());
  if (!player) return res.status(404).json({ error: 'Pemain tidak ditemukan.' });
  const allowed = ['poinTotal', 'levelTerbuka', 'levelSelesai', 'gelarTerakhir', 'hasilEvaluasi', 'hewan'];
  const patch = {};
  for (const k of allowed) if (req.body && req.body[k] !== undefined) patch[k] = req.body[k];
  const updated = db.update('players', player.id, patch);
  res.json(updated);
});

// Leaderboard (peringkat poin) — bisa ditampilkan di web utama
router.get('/leaderboard/top', (req, res) => {
  const list = db.findAll('players')
    .slice()
    .sort((a, b) => (b.poinTotal || 0) - (a.poinTotal || 0))
    .slice(0, Number(req.query.limit) || 10)
    .map((p, i) => ({ rank: i + 1, nama: p.nama, hewan: p.hewan, poinTotal: p.poinTotal || 0 }));
  res.json(list);
});

module.exports = router;
