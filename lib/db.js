// =========================================================
// Lapisan Database — penyimpanan file JSON (tanpa server DB)
// Cocok untuk belajar & jalan lokal di VS Code.
// Saat online/deploy, pindah ke PostgreSQL/Supabase (lihat schema.sql)
// =========================================================
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const config = require('../config');

const COLLECTIONS = ['players', 'books', 'content', 'admin'];
const db = {};

function fileOf(name) {
  return path.join(config.DATA_DIR, name + '.json');
}

function load(name) {
  const f = fileOf(name);
  if (!fs.existsSync(f)) {
    db[name] = name === 'players' || name === 'books' ? [] : {};
    save(name);
    return;
  }
  try {
    db[name] = JSON.parse(fs.readFileSync(f, 'utf8'));
  } catch (e) {
    db[name] = name === 'players' || name === 'books' ? [] : {};
  }
}

function save(name) {
  fs.writeFileSync(fileOf(name), JSON.stringify(db[name], null, 2));
}

function init() {
  if (!fs.existsSync(config.DATA_DIR)) fs.mkdirSync(config.DATA_DIR, { recursive: true });
  if (!fs.existsSync(config.UPLOAD_DIR)) fs.mkdirSync(config.UPLOAD_DIR, { recursive: true });
  COLLECTIONS.forEach(load);

  // Seed admin (password dari .env, disimpan dalam bentuk hash)
  if (!db.admin || !db.admin.passwordHash) {
    db.admin = { passwordHash: bcrypt.hashSync(config.ADMIN_PASSWORD, 10) };
    save('admin');
  }
}

function getAll(name) { return db[name]; }
function setAll(name, val) { db[name] = val; save(name); }

// ---- helper untuk array collection (players, books) ----
function findAll(name) { return db[name]; }
function findOne(name, predicate) { return db[name].find(predicate); }
function insert(name, item) {
  item.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  item.createdAt = new Date().toISOString();
  item.updatedAt = item.createdAt;
  db[name].push(item);
  save(name);
  return item;
}
function update(name, id, patch) {
  const idx = db[name].findIndex(x => x.id === id);
  if (idx === -1) return null;
  db[name][idx] = { ...db[name][idx], ...patch, updatedAt: new Date().toISOString() };
  save(name);
  return db[name][idx];
}
function remove(name, id) {
  const before = db[name].length;
  db[name] = db[name].filter(x => x.id !== id);
  save(name);
  return db[name].length < before;
}

// ---- admin ----
function verifyAdminPassword(pw) {
  return bcrypt.compareSync(pw, db.admin.passwordHash);
}
function changeAdminPassword(newPw) {
  db.admin.passwordHash = bcrypt.hashSync(newPw, 10);
  save('admin');
}

init();

module.exports = { getAll, setAll, findAll, findOne, insert, update, remove, verifyAdminPassword, changeAdminPassword };
