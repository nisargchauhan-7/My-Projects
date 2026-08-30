const store = require('../data/store');
const gemini = require('../services/gemini.service');
const rag = require('../services/rag.service');
const demo = require('../data/demoData');

// In-memory material chunks per subject would live here in production (or a vector DB).
// For the demo/fallback we ground answers in the pre-defined tutor knowledge base.
exports.ask = async (req, res, next) => {
  try {
    const { topicId, question } = req.body;
    if (!question) return res.status(400).json({ error: 'Question is required' });

    // Live mode: retrieve context from stored material text and ground Gemini.
    if (gemini.enabled && req.materialChunks) {
      try {
        const context = rag.retrieve(req.materialChunks, question, 3);
        const topic = await store.getTopic(req.user.id, topicId);
        const answer = await gemini.tutorAnswer(topic ? topic.name : 'this topic', question, context || 'No specific context found.');
        return res.json({ answer, sources: ['Your uploaded material'], grounded: true });
      } catch (e) { /* fall back to KB */ }
    }

    // Demo/fallback: keyword-match the grounded knowledge base.
    const q = question.toLowerCase();
    let best = null, bestScore = 0;
    demo.TUTOR_KB.forEach(entry => {
      const score = entry.keys.reduce((a, k) => a + (q.includes(k) ? 1 : 0), 0) + (entry.topicId === Number(topicId) ? 0.5 : 0);
      if (score > bestScore) { bestScore = score; best = entry; }
    });
    if (best && bestScore > 0) return res.json({ answer: best.answer, sources: best.sources, grounded: true });

    const t = demo.TOPICS.find(x => x.topic_id === Number(topicId)) || demo.TOPICS[4];
    res.json({
      answer: `Based on your uploaded ${demo.SUBJECT.name} material on ${t.name}: this topic covers ${t.subtopics.join(', ')}. Ask me to compare concepts or open the quiz to test yourself.`,
      sources: [`${t.name} — study material`],
      grounded: true
    });
  } catch (e) { next(e); }
};
