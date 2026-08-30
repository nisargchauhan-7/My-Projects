// Deterministic mastery logic — NO AI. Mirrors frontend js/mastery.js
function scorePercent(correct, total) { return total ? Math.round((correct / total) * 100) : 0; }

function band(score) {
  if (score >= 90) return 'Strong';
  if (score >= 75) return 'Good';
  if (score >= 50) return 'Developing';
  return 'Needs Review';
}

// Enhanced, explainable update blending accuracy, prior mastery, difficulty-weighted success and attempts.
function updatedMastery(prev, accuracyPct, attempts, difficultyMix) {
  const diffBonus = difficultyMix != null ? Math.min(100, difficultyMix) : accuracyPct;
  let val = 0.65 * accuracyPct + 0.20 * prev + 0.15 * diffBonus;
  val += Math.min(attempts, 4) * 0.5;
  return Math.max(0, Math.min(100, Math.round(val)));
}

function difficultyWeightedMix(answers) {
  const w = { easy: 1, medium: 1.5, hard: 2 };
  let num = 0, den = 0;
  const map = {};
  answers.forEach(a => { const d = a.difficulty || a.d; map[d] = map[d] || { c: 0, t: 0 }; map[d].t++; if (a.is_correct || a.correct) map[d].c++; });
  Object.entries(map).forEach(([k, v]) => { if (v.t) { num += (v.c / v.t) * 100 * w[k] * v.t; den += w[k] * v.t; } });
  return den ? num / den : null;
}

function overall(perfList) {
  if (!perfList.length) return 0;
  return Math.round(perfList.reduce((a, p) => a + Number(p.mastery_score), 0) / perfList.length);
}

module.exports = { scorePercent, band, updatedMastery, difficultyWeightedMix, overall };
