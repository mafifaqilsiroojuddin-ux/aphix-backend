require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_jwt_aphix_ganti_nanti',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'aphix123',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
 const isProd = process.env.NODE_ENV === 'production';

const DATA_DIR = isProd
  ? '/tmp/data'
  : path.join(__dirname, 'data');

const UPLOAD_DIR = isProd
  ? '/tmp/uploads'
  : path.join(__dirname, 'uploads');
};
