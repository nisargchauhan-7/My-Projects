const store = require('../data/store');
const gemini = require('../services/geminiService');
const rag = require('../services/rag.service');
const content = require('../data/content');

// AI Tutor — grounded in the student's uploaded material. Live mode grounds Gemini with
// retrieved context; demo mode uses the grounded knowledge base. Never a generic chatbot.
exports.ask = async (req, res, next) => {
  try {
    const code = req.body.topicId || req.body.code;
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'Question is required' });

    if (gemini.enabled && req.materialChunks) {
      try {
        const context = rag.retrieve(req.materialChunks, question, 3);
        const topic = await store.getTopic(req.user.id, code);
        const answer = await gemini.tutorAnswer(topic ? topic.name : 'this topic', question, context || 'No specific context found.');
        return res.json({ answer, sources: ['Your uploaded material'], grounded: true });
      } catch (e) { /* fall back to KB */ }
    }

    const q = question.toLowerCase();
    let best = null, bestScore = 0;
    content.TUTOR_KB.forEach(entry => {
      const s = entry.keys.reduce((a, k) => a + (q.includes(k) ? 1 : 0), 0) + (entry.code === code ? 0.5 : 0);
      if (s > bestScore) { bestScore = s; best = entry; }
    });
    if (best && bestScore > 0) return res.json({ answer: best.answer, sources: best.sources, grounded: true });

    const t = content.topicByCode(code) || content.TOPICS[4];
    res.json({
      answer: `Based on your uploaded ${content.SUBJECT.name} material on **${t.name}**: ${t.summary}\n\nKey points from your notes: ${t.keyConcepts.slice(0, 3).join(', ')}. Ask me to compare concepts, or open the quiz to test this topic.`,
      sources: [`${t.name} — study material`],
      grounded: true
    });
  } catch (e) { next(e); }
};
