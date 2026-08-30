const store = require('../data/store');
const masteryLogic = require('../logic/mastery');
const { weakestTopic } = require('../logic/weakTopic');
const { buildRevisionPlan } = require('../logic/revision');
const gemini = require('../services/gemini.service');

exports.list = async (req, res, next) => {
  try {
    const list = await store.getPerformanceList(req.user.id);
    res.json(list.map(t => ({ ...t, mastery: Math.round(Number(t.mastery_score)) })));
  } catch (e) { next(e); }
};

exports.get = async (req, res, next) => {
  try {
    const t = await store.getTopic(req.user.id, req.params.id);
    if (!t) return res.status(404).json({ error: 'Topic not found' });
    res.json({ ...t, mastery: Math.round(Number(t.mastery_score)) });
  } catch (e) { next(e); }
};

// Dashboard aggregation (deterministic) lives under performance controller-style here for reuse.
exports.dashboard = async (req, res, next) => {
  try {
    const list = await store.getPerformanceList(req.user.id);
    const overall = masteryLogic.overall(list);
    const weakest = weakestTopic(list);
    const lastAnswers = await store.getLastAnswersByTopic(req.user.id);
    const plan = await buildRevisionPlan(list, lastAnswers, gemini);
    res.json({
      subject: store.demo.SUBJECT,
      overall,
      topicsCount: list.length,
      completed: list.filter(t => Number(t.mastery_score) >= 50).length,
      weakest: weakest ? { name: weakest.name, mastery: Math.round(Number(weakest.mastery_score)), topicId: weakest.topic_id } : null,
      recommended: plan[0] || null
    });
  } catch (e) { next(e); }
};
