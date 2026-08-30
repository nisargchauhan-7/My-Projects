const store = require('../data/store');
const masteryLogic = require('../logic/mastery');
const { weakestTopic } = require('../logic/weakTopic');
const { buildRevisionPlan } = require('../logic/revision');
const gemini = require('../services/geminiService');

// Transform the deterministic revision plan into the shape the frontend renders
// (nested topic object with the stable code as id).
function shapePlan(item) {
  return { rank: item.rank, topic: { id: item.topicId, name: item.topic, mastery: item.mastery }, minutes: item.minutes, focus: item.focus, reason: item.reason };
}

exports.overview = async (req, res, next) => {
  try {
    const list = await store.getPerformanceList(req.user.id);
    const attempts = await store.getAttempts(req.user.id);
    const history = await store.getHistory(req.user.id);
    res.json({
      overall: masteryLogic.overall(list),
      topics: list.map(t => ({ id: t.id, idx: t.idx, name: t.name, mastery: t.mastery, subtopics: t.subtopics })),
      quizzes: attempts,
      history,
      completed: list.filter(t => Number(t.mastery_score) >= 50).length
    });
  } catch (e) { next(e); }
};

exports.dashboard = async (req, res, next) => {
  try {
    const list = await store.getPerformanceList(req.user.id);
    const overall = masteryLogic.overall(list);
    const weakest = weakestTopic(list);
    const lastAnswers = await store.getLastAnswersByTopic(req.user.id);
    const plan = await buildRevisionPlan(list, lastAnswers, gemini);
    const activity = await store.getActivity(req.user.id);
    res.json({
      subject: store.content.SUBJECT,
      overall,
      topicsCount: list.length,
      completed: list.filter(t => Number(t.mastery_score) >= 50).length,
      weakest: weakest ? { id: weakest.id, name: weakest.name, mastery: weakest.mastery } : null,
      recommended: plan[0] ? shapePlan(plan[0]) : null,
      activity
    });
  } catch (e) { next(e); }
};

exports.revision = async (req, res, next) => {
  try {
    const list = await store.getPerformanceList(req.user.id);
    const lastAnswers = await store.getLastAnswersByTopic(req.user.id);
    const plan = await buildRevisionPlan(list, lastAnswers, gemini);
    res.json(plan.map(shapePlan));
  } catch (e) { next(e); }
};

exports.attempts = async (req, res, next) => {
  try { res.json(await store.getAttempts(req.user.id)); } catch (e) { next(e); }
};
