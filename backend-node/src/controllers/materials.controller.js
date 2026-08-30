const pdf = require('../services/pdf.service');
const gemini = require('../services/geminiService');
const rag = require('../services/rag.service');
const content = require('../data/content');
const db = require('../config/db');

// Upload + process study material. Validates the file, extracts text (PDF), optionally
// runs Gemini topic extraction, persists the material, and returns an analysis summary.
exports.upload = async (req, res, next) => {
  try {
    let text = '';
    let extracted = false;
    if (req.file) {
      try {
        pdf.validate(req.file);
        if (req.file.mimetype === 'application/pdf') text = await pdf.extractText(req.file.path);
      } catch (e) { return res.status(400).json({ error: e.message }); }
    }

    let topics = null;
    if (gemini.enabled && text) {
      try { topics = await gemini.extractTopics(text); extracted = true; } catch (e) { /* fall back */ }
    }

    if (db.connected && req.file) {
      try {
        await db.query('INSERT INTO study_materials (user_id,subject_code,file_name,file_type,raw_text) VALUES (?,?,?,?,?)',
          [req.user.id, content.SUBJECT.id, req.file.originalname, 'pdf', text.slice(0, 60000)]);
      } catch (e) { /* non-fatal */ }
    }

    res.json({
      status: 'analyzed',
      extracted,
      topicsFound: topics ? topics.length : content.TOPICS.length,
      conceptsIdentified: content.TOPICS.reduce((a, t) => a + t.keyConcepts.length + t.definitions.length, 0),
      questionsPrepared: Object.values(content.QUESTIONS).reduce((a, q) => a + q.length, 0),
      chunks: text ? rag.chunk(text).length : 0
    });
  } catch (e) { next(e); }
};

exports.extract = async (req, res, next) => {
  try {
    if (gemini.enabled && req.body.text) {
      try { return res.json({ topics: await gemini.extractTopics(req.body.text), extracted: true }); } catch (e) { /* fall back */ }
    }
    res.json({ topics: null, extracted: false });
  } catch (e) { next(e); }
};

exports.list = async (req, res) => {
  res.json([{ name: content.SUBJECT.material, type: 'pdf', subject: content.SUBJECT.name }]);
};
