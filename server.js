// =========================================================
// APHIX Backend — server utama
// Jalankan:  npm install  lalu  npm start
// Buka di browser: http://localhost:3000/api/health
// =========================================================
const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');

const app = express();

// Izinkan frontend Netlify mengakses API ini
const origins = config.CORS_ORIGIN === '*' ? true : config.CORS_ORIGIN.split(',').map(s => s.trim());
app.use(cors({ origin: origins }));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// File PDF yang diunggah bisa diakses publik
app.use('/uploads', express.static(config.UPLOAD_DIR));

// ---- Daftar endpoint ----
app.get('/api/health', (req, res) => res.json({ ok: true, service: 'APHIX Backend', time: new Date().toISOString() }));
app.use('/api/players', require('./routes/players'));
app.use('/api/content', require('./routes/content'));
app.use('/api/books', require('./routes/books'));
app.use('/api/admin', require('./routes/admin'));

// 404
app.use((req, res) => res.status(404).json({ error: 'Endpoint tidak ditemukan.' }));

// Error handler (termasuk error dari multer)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Terjadi kesalahan server.' });
});

app.listen(config.PORT, () => {
  console.log('=============================================');
  console.log('  APHIX Backend berjalan di port ' + config.PORT);
  console.log('  Cek: http://localhost:' + config.PORT + '/api/health');
  console.log('=============================================');
});
module.exports = app;
