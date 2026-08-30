const store = require('../data/store');
const masteryLogic = require('../logic/mastery');
const { buildRevisionPlan } = require('../logic/revision');
const gemini = require('../services/gemini.service');

exports.overview = async (req, res, next) => {
  try {
    const list = await store.getPerformanceList(req.user.id);
    const attempts = await store.getAttempts(req.user.id);
    res.json({
      overall: masteryLogic.overall(list),
      topics: list.map(t => ({ ...t, mastery: Math.round(Number(t.mastery_score)) })),
      quizzes: attempts.map(a => ({ topicId: a.topic_id, score: a.score, total: a.total })),
      completed: list.filter(t => Number(t.mastery_score) >= 50).length
    });
  } catch (e) { next(e); }
};

exports.topics = async (req, res, next) => {
  try {
    const list = await store.getPerformanceList(req.user.id);
    res.json(list.map(t => ({ topicId: t.topic_id, name: t.name, mastery: Math.round(Number(t.mastery_score)) })));
  } catch (e) { next(e); }
};

exports.revision = async (req, res, next) => {
  try {
    const list = await store.getPerformanceList(req.user.id);
    const lastAnswers = await store.getLastAnswersByTopic(req.user.id);
    const plan = await buildRevisionPlan(list, lastAnswers, gemini);
    res.json(plan);
  } catch (e) { next(e); }
};
