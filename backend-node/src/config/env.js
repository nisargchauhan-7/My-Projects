// Centralised environment config. Never hard-code secrets.
require('dotenv').config();

const bool = (v, d) => (v === undefined ? d : String(v).toLowerCase() === 'true');

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  // DEMO_MODE=true => AI (Gemini) uses deterministic canned responses. The app also
  // falls back to demo automatically whenever Gemini/DB are unavailable.
  DEMO_MODE: bool(process.env.DEMO_MODE, true),
  JWT_SECRET: process.env.JWT_SECRET || 'change-me-in-production',
  JWT_EXPIRES: process.env.JWT_EXPIRES || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '*',
  FRONTEND_URL: process.env.FRONTEND_URL || '*',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
  DB: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'synapseedu'
  }
};
