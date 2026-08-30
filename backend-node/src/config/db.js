// MySQL pool + initialisation. If the DB is unavailable, `connected` stays false and the
// app runs in in-memory demo mode (see store.js) so the demo never breaks.
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const env = require('./env');
const demo = require('../data/demoData');

let pool = null;
let connected = false;

async function init() {
  if (env.AI_MODE === 'demo' && !process.env.FORCE_DB) {
    console.log('[db] AI_MODE=demo — using in-memory store (set AI_MODE=live + DB creds for MySQL).');
    return { pool: null, connected: false };
  }
  try {
    // Connect without database to create it if needed
    const boot = await mysql.createConnection({ host: env.DB.host, port: env.DB.port, user: env.DB.user, password: env.DB.password, multipleStatements: true });
    const schema = fs.readFileSync(path.join(__dirname, '../db/schema.sql'), 'utf8');
    await boot.query(schema);
    await boot.end();

    pool = mysql.createPool({ ...env.DB, waitForConnections: true, connectionLimit: 10, multipleStatements: true });
    connected = true;
    await seedTemplate();
    console.log('[db] MySQL connected & seeded.');
  } catch (e) {
    console.warn('[db] MySQL unavailable, falling back to in-memory demo store:', e.message);
    pool = null; connected = false;
  }
  return { pool, connected };
}

// Seed the shared Computer Networks template (subject/topics/questions) once.
async function seedTemplate() {
  const [subjRows] = await pool.query('SELECT id FROM subjects WHERE name = ? LIMIT 1', [demo.SUBJECT.name]);
  if (subjRows.length) return;
  // template owner user (id used only as template owner)
  const hash = require('bcryptjs').hashSync('demo1234', 10);
  const [u] = await pool.query('INSERT INTO users (name,email,password_hash) VALUES (?,?,?)', ['Demo Student', 'demo@synapse.edu', hash]);
  const [s] = await pool.query('INSERT INTO subjects (user_id,name) VALUES (?,?)', [u.insertId, demo.SUBJECT.name]);
  for (const t of demo.TOPICS) {
    const [tr] = await pool.query('INSERT INTO topics (subject_id,name,estimated_study_time) VALUES (?,?,?)', [s.insertId, t.name, t.est]);
    for (const st of t.subtopics) await pool.query('INSERT INTO subtopics (topic_id,name) VALUES (?,?)', [tr.insertId, st]);
    await pool.query('INSERT INTO topic_performance (user_id,topic_id,mastery_score,attempts) VALUES (?,?,?,0)', [u.insertId, tr.insertId, t.mastery]);
    const qs = demo.QUESTIONS[t.topic_id] || [];
    for (const q of qs) await pool.query('INSERT INTO questions (topic_id,subtopic,question_text,options,correct_answer,difficulty) VALUES (?,?,?,?,?,?)', [tr.insertId, q.subtopic, q.question_text, JSON.stringify(q.options), q.correct_answer, q.difficulty]);
  }
}

module.exports = { init, get pool() { return pool; }, get connected() { return connected; } };
