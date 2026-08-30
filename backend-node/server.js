// SynapseEDU Learning Hub — Node.js + Express API server
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const env = require('./src/config/env');
const db = require('./src/config/db');
const routes = require('./src/routes');
const { notFound, errorHandler } = require('./src/middleware/error');

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(','), credentials: true }));
app.use(express.json({ limit: '2mb' }));

// Basic rate limiting on the API surface
app.use('/api', rateLimit({ windowMs: 60 * 1000, max: 120, standardHeaders: true, legacyHeaders: false }));

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

(async () => {
  await db.init();
  app.listen(env.PORT, () => {
    console.log(`SynapseEDU API listening on :${env.PORT}  [AI_MODE=${env.AI_MODE}, DB=${db.connected ? 'mysql' : 'in-memory demo'}]`);
  });
})();

module.exports = app;
