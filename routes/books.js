// =========================================================
// Route: Arsip Buku (Hologram Book / web ketiga)
// Public: GET daftar buku  |  Admin: tambah/ubah/hapus + upload PDF
// =========================================================
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../lib/db');
const config = require('../config');
const { adminAuth } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, config.UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safe = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, safe);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // max 25 MB per PDF
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || path.extname(file.originalname).toLowerCase() === '.pdf') {
      cb(null, true);
    } else {
      cb(new Error('Hanya file PDF yang boleh diunggah.'));
    }
  },
});

// Public — daftar semua buku (untuk ditampilkan di globe hologram)
router.get('/', (req, res) => {
  res.json(db.findAll('books'));
});

// Admin — tambah buku (beserta upload PDF opsional)
router.post('/', adminAuth, upload.single('pdf'), (req, res) => {
  const { judul, keterangan, lat, lon, warna } = req.body || {};
  if (!judul || !String(judul).trim()) return res.status(400).json({ error: 'Judul wajib diisi.' });
  const book = db.insert('books', {
    judul: String(judul).trim(),
    keterangan: keterangan || '',
    lat: Number(lat) || 0,
    lon: Number(lon) || 0,
    warna: warna || '#4dffe0',
    pdfUrl: req.file ? '/uploads/' + req.file.filename : '',
  });
  res.status(201).json(book);
});

// Admin — ubah buku
router.put('/:id', adminAuth, upload.single('pdf'), (req, res) => {
  const book = db.findOne('books', b => b.id === req.params.id);
  if (!book) return res.status(404).json({ error: 'Buku tidak ditemukan.' });
  const patch = {};
  ['judul', 'keterangan', 'warna'].forEach(k => { if (req.body[k] !== undefined) patch[k] = req.body[k]; });
  ['lat', 'lon'].forEach(k => { if (req.body[k] !== undefined) patch[k] = Number(req.body[k]) || 0; });
  if (req.file) {
    // hapus PDF lama jika ada
    if (book.pdfUrl) {
      const oldPath = path.join(config.UPLOAD_DIR, path.basename(book.pdfUrl));
      if (fs.existsSync(oldPath)) try { fs.unlinkSync(oldPath); } catch (e) {}
    }
    patch.pdfUrl = '/uploads/' + req.file.filename;
  }
  const updated = db.update('books', book.id, patch);
  res.json(updated);
});

// Admin — hapus buku (beserta file PDF-nya)
router.delete('/:id', adminAuth, (req, res) => {
  const book = db.findOne('books', b => b.id === req.params.id);
  if (!book) return res.status(404).json({ error: 'Buku tidak ditemukan.' });
  if (book.pdfUrl) {
    const p = path.join(config.UPLOAD_DIR, path.basename(book.pdfUrl));
    if (fs.existsSync(p)) try { fs.unlinkSync(p); } catch (e) {}
  }
  db.remove('books', book.id);
  res.json({ ok: true });
});

module.exports = router;
