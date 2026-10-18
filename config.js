require('dotenv').config();
module.exports = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'aphix_rahasia_sekolah_2026',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'aphix123',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  SUPABASE_URL: 'https://nkrpibvmohqwgaiphiii.supabase.co',
  SUPABASE_SERVICE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rcnBpYnZtb2hxd2dhaXBoaWlpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTQ3OTU5NCwiZXhwIjoyMTA1MDU1NTk0fQ.IlQ3OSvEGyx3LPZuc0paocC0ZLb4mAhnFgNNsC2OmZI'
};
