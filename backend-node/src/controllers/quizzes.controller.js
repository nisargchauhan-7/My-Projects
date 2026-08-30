const store = require('../data/store');
const { selectQuestions } = require('../logic/adaptiveQuiz');
const gemini = require('../services/geminiService');

// Generate a quiz for a topic. Tries Gemini in live mode, falls back to stored questions.
exports.generate = async (req, res, next) => {
  try {
    const code = req.body.topicId || req.body.code;
    const difficulty = req.body.difficulty;
    let questions = await store.getQuestions(code, 8);
    if (gemini.enabled && (!questions || questions.length < 5)) {
      try {
        const topic = await store.getTopic(req.user.id, code);
        const gen = await gemini.generateQuestions(topic.name, difficulty || 'medium', 5);
        questions = gen.map((q, i) => ({ id: 'g' + i, ...q }));
      } catch (e) { /* fall back to stored */ }
    }
    const selected = selectQuestions(questions, 5, difficulty || 'easy');
    res.json({
      topicId: code,
      questions: selected.map(q => ({
        id: q.id, d: q.difficulty, st: q.subtopic, text: q.question_text,
        options: q.options, correct: q.correct_answer, explain: q.explain
      }))
    });
  } catch (e) { next(e); }
};

// Deterministic scoring + mastery update (backend owns all math — never AI).
exports.submit = async (req, res, next) => {
  try {
    const code = req.body.topicId || req.body.code;
    const { answers } = req.body; // [{subtopic,difficulty,selected,correct}]
    if (!Array.isArray(answers) || !answers.length) return res.status(400).json({ error: 'No answers provided' });
    const result = await store.submitAttempt(req.user.id, code, answers);
    res.json(result);
  } catch (e) { next(e); }
};
