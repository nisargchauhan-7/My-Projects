// MySQL pool + initialisation. Attempts to connect using DB_* env vars.
// If the DB is unavailable, `connected` stays false and the app runs on an in-memory
// store (see store.js) so the Learning Hub is always demonstrable.
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const env = require('./env');
const content = require('../data/content');

let pool = null;
let connected = false;

async function init() {
  try {
    const boot = await mysql.createConnection({
      host: env.DB.host, port: env.DB.port, user: env.DB.user,
      password: env.DB.password, multipleStatements: true
    });
    const schema = fs.readFileSync(path.join(__dirname, '../db/schema.sql'), 'utf8');
    await boot.query(schema);
    await boot.end();

    pool = mysql.createPool({ ...env.DB, waitForConnections: true, connectionLimit: 10, multipleStatements: true });
    connected = true;
    await seedContent();
    await seedDemoUser();
    console.log('[db] MySQL connected & seeded.');
  } catch (e) {
    console.warn('[db] MySQL unavailable, falling back to in-memory store:', e.message);
    pool = null; connected = false;
  }
  return { pool, connected };
}

// Seed the shared Computer Networks content (subject/topics/subtopics/questions). Idempotent.
async function seedContent() {
  await pool.query('INSERT IGNORE INTO subjects (code,name,material) VALUES (?,?,?)',
    [content.SUBJECT.id, content.SUBJECT.name, content.SUBJECT.material]);
  for (const t of content.TOPICS) {
    await pool.query(
      'INSERT INTO topics (code,subject_code,name,idx,estimated_study_time,initial_mastery) VALUES (?,?,?,?,?,?) ' +
      'ON DUPLICATE KEY UPDATE name=VALUES(name), idx=VALUES(idx), estimated_study_time=VALUES(estimated_study_time)',
      [t.code, content.SUBJECT.id, t.name, t.idx, t.estMin, t.initialMastery]);
    const [subs] = await pool.query('SELECT COUNT(*) AS n FROM subtopics WHERE topic_code=?', [t.code]);
    if (!subs[0].n) for (const st of t.subtopics) await pool.query('INSERT INTO subtopics (topic_code,name) VALUES (?,?)', [t.code, st]);
    const [qn] = await pool.query('SELECT COUNT(*) AS n FROM questions WHERE topic_code=?', [t.code]);
    if (!qn[0].n) for (const q of (content.QUESTIONS[t.code] || [])) {
      await pool.query('INSERT INTO questions (topic_code,subtopic,question_text,options,correct_answer,difficulty) VALUES (?,?,?,?,?,?)',
        [t.code, q.subtopic, q.question_text, JSON.stringify(q.options), q.correct_answer, q.difficulty]);
    }
  }
}

async function seedDemoUser() {
  const [rows] = await pool.query('SELECT id FROM users WHERE email=?', ['demo@synapse.edu']);
  if (!rows.length) {
    const hash = bcrypt.hashSync('demo1234', 10);
    await pool.query('INSERT INTO users (name,email,password_hash) VALUES (?,?,?)', ['Demo Student', 'demo@synapse.edu', hash]);
  }
}

module.exports = {
  init,
  get pool() { return pool; },
  get connected() { return connected; },
  query: async (...a) => pool.query(...a)
};
