const store = require('../data/store');

exports.list = async (req, res, next) => {
  try {
    const list = await store.getPerformanceList(req.user.id);
    res.json(list.map(t => ({
      id: t.id, idx: t.idx, name: t.name, mastery: t.mastery,
      subtopics: t.subtopics, estMin: t.estimated_study_time
    })));
  } catch (e) { next(e); }
};

exports.get = async (req, res, next) => {
  try {
    const t = await store.getTopic(req.user.id, req.params.id);
    if (!t) return res.status(404).json({ error: 'Topic not found' });
    res.json({
      id: t.id, idx: t.idx, name: t.name, mastery: t.mastery, estMin: t.estimated_study_time,
      subtopics: t.subtopics, summary: t.summary, keyConcepts: t.keyConcepts,
      definitions: t.definitions, examples: t.examples, related: t.related
    });
  } catch (e) { next(e); }
};
