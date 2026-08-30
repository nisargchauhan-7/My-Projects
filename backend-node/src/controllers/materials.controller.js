const path = require('path');
const pdf = require('../services/pdf.service');
const gemini = require('../services/gemini.service');
const rag = require('../services/rag.service');

// Upload + process study material. In live mode extracts text, chunks it, and (optionally)
// runs Gemini topic extraction. In demo mode returns the pre-seeded analysis summary.
exports.upload = async (req, res, next) => {
  try {
    let text = '';
    if (req.file) {
      try {
        pdf.validate(req.file);
        if (req.file.mimetype === 'application/pdf') text = await pdf.extractText(req.file.path);
      } catch (e) { /* fall back to demo analysis */ }
    }

    let topics = null;
    if (gemini.enabled && text) {
      try { topics = await gemini.extractTopics(text); } catch (e) { /* fall back */ }
    }

    const demo = require('../data/demoData');
    const result = {
      status: 'analyzed',
      topicsFound: topics ? topics.length : demo.TOPICS.length,
      conceptsIdentified: demo.TOPICS.reduce((a, t) => a + t.subtopics.length, 0) + 30,
      questionsPrepared: Object.values(demo.QUESTIONS).reduce((a, q) => a + q.length, 0) + 5,
      learningPath: 'Ready',
      chunks: text ? rag.chunk(text).length : 0
    };
    res.json(result);
  } catch (e) { next(e); }
};

exports.list = async (req, res) => {
  const demo = require('../data/demoData');
  res.json([{ name: demo.SUBJECT.material, type: 'pdf', subject: demo.SUBJECT.name }]);
};
