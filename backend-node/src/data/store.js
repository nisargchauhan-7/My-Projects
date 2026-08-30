// Data-access layer. Uses MySQL when connected, otherwise an in-memory demo store.
// Keeps controllers clean and guarantees the Learning Hub works even without a database.
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const demo = require('../data/demoData');
const mastery = require('../logic/mastery');

// ---------- In-memory fallback ----------
const mem = {
  users: [{ id: 1, name: 'Demo Student', email: 'demo@synapse.edu', password_hash: bcrypt.hashSync('demo1234', 10) }],
  nextUserId: 2,
  // per-user performance: { userId: { topicId: {mastery, attempts, lastAnswers} } }
  perf: {},
  attempts: {} // { userId: [ {topicId, score, correct, total, at} ] }
};
function memBaseline(userId) {
  if (!mem.perf[userId]) {
    mem.perf[userId] = {};
    demo.TOPICS.forEach(t => { mem.perf[userId][t.topic_id] = { mastery: t.mastery, attempts: 0, lastAnswers: null }; });
    mem.attempts[userId] = [];
  }
}
function topicMeta(topicId) { return demo.TOPICS.find(t => t.topic_id === Number(topicId)); }

// ---------- Public API ----------
async function findUserByEmail(email) {
  if (db.connected) { const [r] = await db.pool.query('SELECT * FROM users WHERE email=?', [email]); return r[0] || null; }
  return mem.users.find(u => u.email === email) || null;
}
async function createUser({ name, email, password }) {
  const hash = bcrypt.hashSync(password, 10);
  if (db.connected) {
    const [r] = await db.pool.query('INSERT INTO users (name,email,password_hash) VALUES (?,?,?)', [name, email, hash]);
    await cloneTemplatePerformance(r.insertId);
    return { id: r.insertId, name, email };
  }
  const u = { id: mem.nextUserId++, name, email, password_hash: hash };
  mem.users.push(u); memBaseline(u.id);
  return { id: u.id, name, email };
}
async function cloneTemplatePerformance(userId) {
  // give the new user their own baseline mastery per topic (shared template topics)
  const [topics] = await db.pool.query('SELECT t.id, t.name FROM topics t JOIN subjects s ON t.subject_id=s.id');
  for (const t of topics) {
    const base = demo.TOPICS.find(d => d.name === t.name);
    await db.pool.query('INSERT IGNORE INTO topic_performance (user_id,topic_id,mastery_score,attempts) VALUES (?,?,?,0)', [userId, t.id, base ? base.mastery : 50]);
  }
}

async function getPerformanceList(userId) {
  if (db.connected) {
    const [rows] = await db.pool.query(
      `SELECT tp.topic_id, t.name, tp.mastery_score, tp.attempts, t.estimated_study_time,
              (SELECT GROUP_CONCAT(name) FROM subtopics WHERE topic_id=t.id) AS subs
         FROM topic_performance tp JOIN topics t ON t.id=tp.topic_id
        WHERE tp.user_id=? ORDER BY t.id`, [userId]);
    return rows.map(r => ({ ...r, subtopics: r.subs ? r.subs.split(',') : [] }));
  }
  memBaseline(userId);
  return demo.TOPICS.map(t => ({ topic_id: t.topic_id, name: t.name, mastery_score: mem.perf[userId][t.topic_id].mastery, attempts: mem.perf[userId][t.topic_id].attempts, estimated_study_time: t.est, subtopics: t.subtopics }));
}

async function getTopic(userId, topicId) {
  const list = await getPerformanceList(userId);
  return list.find(t => Number(t.topic_id) === Number(topicId)) || null;
}

async function getQuestions(topicId, count = 5) {
  if (db.connected) {
    const [rows] = await db.pool.query('SELECT id, subtopic, question_text, options, correct_answer, difficulty FROM questions WHERE topic_id=? LIMIT ?', [topicId, count]);
    return rows.map(r => ({ ...r, options: typeof r.options === 'string' ? JSON.parse(r.options) : r.options }));
  }
  return (demo.QUESTIONS[topicId] || []).slice(0, count).map((q, i) => ({ id: i + 1, ...q }));
}

// Deterministic scoring + performance update. answers: [{subtopic,difficulty,selected,correct}]
async function submitAttempt(userId, topicId, answers) {
  const correct = answers.filter(a => a.correct).length;
  const total = answers.length;
  const score = mastery.scorePercent(correct, total);
  const dmix = mastery.difficultyWeightedMix(answers);
  const meta = topicMeta(topicId);

  if (db.connected) {
    const [prev] = await db.pool.query('SELECT mastery_score, attempts FROM topic_performance WHERE user_id=? AND topic_id=?', [userId, topicId]);
    const prevM = prev.length ? Number(prev[0].mastery_score) : 50;
    const attempts = (prev.length ? prev[0].attempts : 0) + 1;
    const newM = mastery.updatedMastery(prevM, score, attempts, dmix);
    const [att] = await db.pool.query('INSERT INTO quiz_attempts (user_id,topic_id,score,total_questions,completed_at) VALUES (?,?,?,?,NOW())', [userId, topicId, score, total]);
    for (const a of answers) await db.pool.query('INSERT INTO answers (quiz_attempt_id,subtopic,difficulty,selected_option,is_correct) VALUES (?,?,?,?,?)', [att.insertId, a.subtopic, a.difficulty, a.selected, a.correct ? 1 : 0]);
    await db.pool.query('INSERT INTO topic_performance (user_id,topic_id,mastery_score,attempts,last_review_date) VALUES (?,?,?,?,CURDATE()) ON DUPLICATE KEY UPDATE mastery_score=VALUES(mastery_score), attempts=VALUES(attempts), last_review_date=CURDATE()', [userId, topicId, newM, attempts]);
    return { topicId, score, correct, total, prevMastery: prevM, mastery: newM, answers };
  }

  memBaseline(userId);
  const cur = mem.perf[userId][topicId] || { mastery: 50, attempts: 0 };
  const prevM = cur.mastery;
  const attempts = cur.attempts + 1;
  const newM = mastery.updatedMastery(prevM, score, attempts, dmix);
  mem.perf[userId][topicId] = { mastery: newM, attempts, lastAnswers: answers };
  mem.attempts[userId].unshift({ topicId, score, correct, total, at: Date.now() });
  return { topicId, score, correct, total, prevMastery: prevM, mastery: newM, answers };
}

async function getLastAnswersByTopic(userId) {
  if (db.connected) {
    const [rows] = await db.pool.query(
      `SELECT a.subtopic, a.difficulty, a.is_correct AS correct, qa.topic_id
         FROM answers a JOIN quiz_attempts qa ON a.quiz_attempt_id=qa.id
        WHERE qa.user_id=? ORDER BY qa.id DESC LIMIT 200`, [userId]);
    const map = {};
    rows.forEach(r => { if (!map[r.topic_id]) map[r.topic_id] = []; map[r.topic_id].push(r); });
    return map;
  }
  memBaseline(userId);
  const map = {};
  Object.entries(mem.perf[userId]).forEach(([tid, p]) => { if (p.lastAnswers) map[tid] = p.lastAnswers; });
  return map;
}

async function getAttempts(userId) {
  if (db.connected) {
    const [rows] = await db.pool.query('SELECT topic_id, score, total_questions AS total, completed_at FROM quiz_attempts WHERE user_id=? ORDER BY id DESC LIMIT 8', [userId]);
    return rows;
  }
  memBaseline(userId);
  return (mem.attempts[userId] || []).slice(0, 8);
}

module.exports = { findUserByEmail, createUser, getPerformanceList, getTopic, getQuestions, submitAttempt, getLastAnswersByTopic, getAttempts, demo };
