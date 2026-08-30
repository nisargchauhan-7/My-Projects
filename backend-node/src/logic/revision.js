// Revision plan generation — rule-based ranking + optional LLM explanation.
const { weakTopics } = require('./weakTopic');

async function buildRevisionPlan(perfList, lastAnswersByTopic, gemini) {
  const weak = weakTopics(perfList, 60).slice(0, 3);
  const plan = [];
  for (let i = 0; i < weak.length; i++) {
    const p = weak[i];
    const focus = (p.subtopics || []).slice(0, 3);
    let reason = `Recommended because your mastery in ${p.name} is ${Math.round(p.mastery_score)}%.`;
    const answers = lastAnswersByTopic && lastAnswersByTopic[p.topic_id];
    if (answers) {
      const { weakestSubtopic } = require('./weakTopic');
      const ws = weakestSubtopic(answers);
      if (ws) reason = `Recommended because you scored ${ws.pct}% on questions related to ${ws.subtopic} in ${p.name}.`;
    }
    // Optional LLM-generated explanation (falls back to rule-based text on failure)
    if (gemini && gemini.enabled) {
      try {
        const text = await gemini.explainRevision(p.name, Math.round(p.mastery_score), focus);
        if (text) reason = text;
      } catch (e) { /* keep rule-based reason */ }
    }
    plan.push({ rank: i + 1, topicId: p.topic_id, topic: p.name, mastery: Math.round(p.mastery_score), minutes: p.estimated_study_time || 10, focus, reason });
  }
  return plan;
}

module.exports = { buildRevisionPlan };
