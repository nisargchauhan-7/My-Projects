// Data-access layer. Uses MySQL when connected, otherwise an in-memory demo store.
// Everything is keyed by the stable topic `code` (t1..t8). Rich topic content comes
// from content.js; MySQL persists user *state* (mastery, attempts, quiz history).
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const content = require('./content');
const mastery = require('../logic/mastery');

const byCode = code => content.topicByCode(code);

function enrich(code, mastery_score, attempts) {
  const t = byCode(code);
  if (!t) return null;
  return {
    id: t.code, code: t.code, topic_id: t.code, idx: t.idx, name: t.name,
    mastery_score: Number(mastery_score), mastery: Math.round(Number(mastery_score)),
    attempts: attempts || 0, estimated_study_time: t.estMin,
    subtopics: t.subtopics, summary: t.summary, keyConcepts: t.keyConcepts,
    definitions: t.definitions, examples: t.examples, related: t.related
  };
}

// ---------- In-memory fallback ----------
const mem = {
  users: [{ id: 1, name: 'Demo Student', email: 'demo@synapse.edu', password_hash: bcrypt.hashSync('demo1234', 10) }],
  nextUserId: 2,
  perf: {}, attempts: {}, history: {}, lastAnswers: {}
};
function memBaseline(userId) {
  if (!mem.perf[userId]) {
    mem.perf[userId] = {};
    content.TOPICS.forEach(t => { mem.perf[userId][t.code] = { mastery: t.initialMastery, attempts: 0 }; });
    mem.attempts[userId] = []; mem.history[userId] = []; mem.lastAnswers[userId] = {};
  }
}

// ---------- Users ----------
async function findUserByEmail(email) {
  if (db.connected) { const [r] = await db.query('SELECT * FROM users WHERE email=?', [email]); return r[0] || null; }
  return mem.users.find(u => u.email === email) || null;
}
async function createUser({ name, email, password }) {
  const hash = bcrypt.hashSync(password, 10);
  if (db.connected) {
    const [r] = await db.query('INSERT INTO users (name,email,password_hash) VALUES (?,?,?)', [name, email, hash]);
    await ensureBaseline(r.insertId);
    return { id: r.insertId, name, email };
  }
  const u = { id: mem.nextUserId++, name, email, password_hash: hash };
  mem.users.push(u); memBaseline(u.id);
  return { id: u.id, name, email };
}

// Give a user their baseline mastery per topic (idempotent).
async function ensureBaseline(userId) {
  if (db.connected) {
    for (const t of content.TOPICS) {
      await db.query('INSERT IGNORE INTO topic_performance (user_id,topic_code,mastery_score,attempts) VALUES (?,?,?,0)',
        [userId, t.code, t.initialMastery]);
    }
    return;
  }
  memBaseline(userId);
}

// ---------- Performance / topics ----------
async function getPerformanceList(userId) {
  await ensureBaseline(userId);
  if (db.connected) {
    const [rows] = await db.query('SELECT topic_code, mastery_score, attempts FROM topic_performance WHERE user_id=?', [userId]);
    const map = {}; rows.forEach(r => { map[r.topic_code] = r; });
    return content.TOPICS.map(t => {
      const r = map[t.code] || { mastery_score: t.initialMastery, attempts: 0 };
      return enrich(t.code, r.mastery_score, r.attempts);
    });
  }
  return content.TOPICS.map(t => enrich(t.code, mem.perf[userId][t.code].mastery, mem.perf[userId][t.code].attempts));
}

async function getTopic(userId, code) {
  const list = await getPerformanceList(userId);
  return list.find(t => t.code === code) || null;
}

// ---------- Quiz ----------
async function getQuestions(code, count = 5) {
  if (db.connected) {
    const [rows] = await db.query('SELECT id, subtopic, question_text, options, correct_answer, difficulty FROM questions WHERE topic_code=? ORDER BY id', [code]);
    if (rows.length) return rows.map(r => ({ ...r, options: typeof r.options === 'string' ? JSON.parse(r.options) : r.options }));
  }
  return (content.QUESTIONS[code] || []).map(q => ({ id: q.id, subtopic: q.subtopic, question_text: q.question_text, options: q.options, correct_answer: q.correct_answer, difficulty: q.difficulty }));
}

// Deterministic scoring + mastery update. answers: [{subtopic,difficulty,selected,correct}]
async function submitAttempt(userId, code, answers) {
  const correct = answers.filter(a => a.correct).length;
  const total = answers.length;
  const score = mastery.scorePercent(correct, total);
  const dmix = mastery.difficultyWeightedMix(answers);

  if (db.connected) {
    await ensureBaseline(userId);
    const [prev] = await db.query('SELECT mastery_score, attempts FROM topic_performance WHERE user_id=? AND topic_code=?', [userId, code]);
    const t = byCode(code);
    const prevM = prev.length ? Number(prev[0].mastery_score) : (t ? t.initialMastery : 50);
    const attempts = (prev.length ? prev[0].attempts : 0) + 1;
    const newM = mastery.updatedMastery(prevM, score, attempts, dmix);
    const [att] = await db.query('INSERT INTO quiz_attempts (user_id,topic_code,score,correct,total_questions,attempt_number) VALUES (?,?,?,?,?,?)',
      [userId, code, score, correct, total, attempts]);
    for (const a of answers) await db.query('INSERT INTO answers (quiz_attempt_id,subtopic,difficulty,selected_option,is_correct) VALUES (?,?,?,?,?)',
      [att.insertId, a.subtopic, a.difficulty, a.selected, a.correct ? 1 : 0]);
    await db.query('INSERT INTO topic_performance (user_id,topic_code,mastery_score,attempts,last_review_date) VALUES (?,?,?,?,CURDATE()) ' +
      'ON DUPLICATE KEY UPDATE mastery_score=VALUES(mastery_score), attempts=VALUES(attempts), last_review_date=CURDATE()',
      [userId, code, newM, attempts]);
    // snapshot overall for the history chart
    const list = await getPerformanceList(userId);
    await db.query('INSERT INTO mastery_history (user_id,overall) VALUES (?,?)', [userId, mastery.overall(list)]);
    return { topicId: code, score, correct, total, prevMastery: prevM, mastery: newM, answers };
  }

  memBaseline(userId);
  const cur = mem.perf[userId][code] || { mastery: 50, attempts: 0 };
  const prevM = cur.mastery;
  const attempts = cur.attempts + 1;
  const newM = mastery.updatedMastery(prevM, score, attempts, dmix);
  mem.perf[userId][code] = { mastery: newM, attempts };
  mem.lastAnswers[userId][code] = answers;
  mem.attempts[userId].unshift({ topicId: code, score, correct, total, at: Date.now() });
  const list = content.TOPICS.map(t => enrich(t.code, mem.perf[userId][t.code].mastery, mem.perf[userId][t.code].attempts));
  mem.history[userId].push({ date: Date.now(), overall: mastery.overall(list) });
  return { topicId: code, score, correct, total, prevMastery: prevM, mastery: newM, answers };
}

async function getLastAnswersByTopic(userId) {
  if (db.connected) {
    const [rows] = await db.query(
      `SELECT a.subtopic, a.difficulty, a.is_correct AS correct, qa.topic_code
         FROM answers a JOIN quiz_attempts qa ON a.quiz_attempt_id=qa.id
        WHERE qa.user_id=? ORDER BY qa.id DESC LIMIT 200`, [userId]);
    const map = {}; rows.forEach(r => { if (!map[r.topic_code]) map[r.topic_code] = []; map[r.topic_code].push({ subtopic: r.subtopic, difficulty: r.difficulty, correct: !!r.correct }); });
    return map;
  }
  memBaseline(userId);
  return { ...mem.lastAnswers[userId] };
}

async function getAttempts(userId) {
  if (db.connected) {
    const [rows] = await db.query('SELECT topic_code, score, correct, total_questions AS total FROM quiz_attempts WHERE user_id=? ORDER BY id DESC LIMIT 8', [userId]);
    return rows.map(r => ({ topicId: r.topic_code, score: r.score, correct: r.correct, total: r.total }));
  }
  memBaseline(userId);
  return (mem.attempts[userId] || []).slice(0, 8);
}

async function getHistory(userId) {
  if (db.connected) {
    const [rows] = await db.query('SELECT overall, UNIX_TIMESTAMP(created_at)*1000 AS date FROM mastery_history WHERE user_id=? ORDER BY id LIMIT 50', [userId]);
    return rows.map(r => ({ date: Number(r.date), overall: r.overall }));
  }
  memBaseline(userId);
  return mem.history[userId];
}

// Recent activity feed (derived from attempts + a baseline).
async function getActivity(userId) {
  const attempts = await getAttempts(userId);
  const acts = attempts.slice(0, 4).map(a => {
    const t = byCode(a.topicId) || { name: 'Topic' };
    return {
      icon: a.score >= 75 ? 'check' : 'alert',
      color: a.score >= 75 ? 'green' : (a.score >= 50 ? 'amber' : 'red'),
      text: `Quiz on ${t.name}`, meta: `Scored ${a.score}% · recent`
    };
  });
  acts.push(
    { icon: 'book', color: 'blue', text: 'Studied TCP/IP fundamentals', meta: 'earlier' },
    { icon: 'alert', color: 'red', text: 'Weak area detected: AIMD Algorithm', meta: '36% mastery' }
  );
  return acts.slice(0, 5);
}

module.exports = {
  content, findUserByEmail, createUser, ensureBaseline,
  getPerformanceList, getTopic, getQuestions, submitAttempt,
  getLastAnswersByTopic, getAttempts, getHistory, getActivity
};
