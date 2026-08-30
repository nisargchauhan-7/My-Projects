// Deterministic weak-topic + weak-subtopic detection — NO AI.
function weakestTopic(perfList) {
  let w = null;
  perfList.forEach(p => { if (!w || Number(p.mastery_score) < Number(w.mastery_score)) w = p; });
  return w;
}

// Given per-answer records tagged with a subtopic, find the weakest subtopic.
function weakestSubtopic(answers) {
  const map = {};
  answers.forEach(a => {
    const st = a.subtopic || a.st;
    map[st] = map[st] || { c: 0, t: 0 };
    map[st].t++;
    if (a.is_correct || a.correct) map[st].c++;
  });
  let worst = null;
  Object.entries(map).forEach(([st, v]) => {
    const pct = v.t ? Math.round((v.c / v.t) * 100) : 0;
    if (!worst || pct < worst.pct) worst = { subtopic: st, pct, correct: v.c, total: v.t };
  });
  return worst;
}

// Prerequisite-aware weak list: if a topic is weak and its prerequisite is also weak, prioritise the prerequisite.
function weakTopics(perfList, threshold = 60) {
  return perfList
    .filter(p => Number(p.mastery_score) < threshold)
    .sort((a, b) => Number(a.mastery_score) - Number(b.mastery_score));
}

module.exports = { weakestTopic, weakestSubtopic, weakTopics };
