// Centralised environment config. Never hard-code secrets.
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  // 'demo' = no external calls (pre-seeded data). 'live' = use Gemini + MySQL.
  AI_MODE: process.env.AI_MODE || 'demo',
  JWT_SECRET: process.env.JWT_SECRET || 'change-me-in-production',
  JWT_EXPIRES: process.env.JWT_EXPIRES || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  DB: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'synapseedu'
  }
};
