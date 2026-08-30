// Adaptive quiz difficulty — deterministic rule engine.
function nextDifficulty(current, accuracyPct) {
  if (accuracyPct >= 80) return current === 'easy' ? 'medium' : 'hard';
  if (accuracyPct < 50) return 'easy';
  return current;
}

// Choose an ordered set of questions for a topic given a target difficulty distribution.
function selectQuestions(questions, count = 5, startDifficulty = 'easy') {
  const byDiff = { easy: [], medium: [], hard: [] };
  questions.forEach(q => (byDiff[q.difficulty] || byDiff.easy).push(q));
  const order = startDifficulty === 'hard' ? ['hard', 'medium', 'easy']
    : startDifficulty === 'medium' ? ['medium', 'hard', 'easy']
    : ['easy', 'medium', 'hard'];
  const out = [];
  let i = 0;
  while (out.length < count && i < 50) {
    const bucket = order[i % order.length];
    if (byDiff[bucket] && byDiff[bucket].length) out.push(byDiff[bucket].shift());
    i++;
  }
  return out.slice(0, count);
}

module.exports = { nextDifficulty, selectQuestions };
