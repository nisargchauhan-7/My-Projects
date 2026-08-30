const store = require('../data/store');
const { selectQuestions } = require('../logic/adaptiveQuiz');
const gemini = require('../services/gemini.service');

// Generate a quiz for a topic. Tries Gemini in live mode, falls back to stored/demo questions.
exports.generate = async (req, res, next) => {
  try {
    const { topicId, difficulty } = req.body;
    let questions = await store.getQuestions(topicId, 8);
    if (gemini.enabled && (!questions || questions.length < 5)) {
      try {
        const topic = await store.getTopic(req.user.id, topicId);
        const gen = await gemini.generateQuestions(topic.name, difficulty || 'medium', 5);
        questions = gen.map((q, i) => ({ id: 'g' + i, ...q }));
      } catch (e) { /* fall back to stored */ }
    }
    const selected = selectQuestions(questions, 5, difficulty || 'easy');
    // Do NOT send correct_answer to the client for live integrity; demo keeps it for offline scoring.
    res.json({ topicId, questions: selected });
  } catch (e) { next(e); }
};

// Deterministic scoring + mastery update (backend owns all math — never AI).
exports.submit = async (req, res, next) => {
  try {
    const { topicId, answers } = req.body; // answers: [{subtopic,difficulty,selected,correct}]
    if (!Array.isArray(answers) || !answers.length) return res.status(400).json({ error: 'No answers provided' });
    const result = await store.submitAttempt(req.user.id, topicId, answers);
    res.json(result);
  } catch (e) { next(e); }
};
