/* global */
/* ============================================================
   Deterministic mastery & analytics logic (NO AI here).
   Mirrors backend src/logic/*.js
   ============================================================ */
window.Mastery = {
  band(score) {
    if (score >= 90) return { key:'strong', label:'Strong', cls:'high' };
    if (score >= 75) return { key:'good', label:'Good', cls:'high' };
    if (score >= 50) return { key:'developing', label:'Developing', cls:'med' };
    return { key:'review', label:'Needs Review', cls:'low' };
  },
  colorClass(score){ return score >= 75 ? 'm-high' : score >= 50 ? 'm-med' : 'm-low'; },
  textClass(score){ return score >= 75 ? 'm-high-t' : score >= 50 ? 'm-med-t' : 'm-low-t'; },
  tagClass(score){ return score >= 75 ? 'high' : score >= 50 ? 'med' : 'low'; },

  // Deterministic quiz accuracy -> percentage
  scorePercent(correct, total){ return total ? Math.round((correct/total)*100) : 0; },

  /* Enhanced mastery update.
     new = round( 0.7*accuracy + 0.2*prevMastery + 0.1*difficultyBonus ), then blended with attempts.
     Kept simple, explainable and deterministic. */
  updatedMastery(prev, accuracyPct, attempts, difficultyMix) {
    const diffBonus = difficultyMix ? Math.min(100, difficultyMix) : accuracyPct;
    let val = 0.65*accuracyPct + 0.20*prev + 0.15*diffBonus;
    // small reward for repeated practice, capped
    val = val + Math.min(attempts, 4) * 0.5;
    return Math.max(0, Math.min(100, Math.round(val)));
  },

  overall(topics, masteryMap) {
    if (!topics.length) return 0;
    const sum = topics.reduce((a,t)=> a + (masteryMap[t.id] ?? t.initialMastery), 0);
    return Math.round(sum / topics.length);
  },

  weakest(topics, masteryMap) {
    let w = null;
    topics.forEach(t => {
      const m = masteryMap[t.id] ?? t.initialMastery;
      if (!w || m < w.mastery) w = { ...t, mastery:m };
    });
    return w;
  },

  // difficulty performance breakdown from answered questions
  difficultyBreakdown(answers) {
    const out = { easy:{c:0,t:0}, medium:{c:0,t:0}, hard:{c:0,t:0} };
    answers.forEach(a => { const b=out[a.d]; if(b){ b.t++; if(a.correct) b.c++; } });
    return out;
  },

  // weakest subtopic within a set of answers
  weakestSubtopic(answers) {
    const map = {};
    answers.forEach(a => {
      map[a.st] = map[a.st] || { c:0, t:0 };
      map[a.st].t++; if (a.correct) map[a.st].c++;
    });
    let worst = null;
    Object.entries(map).forEach(([st, v]) => {
      const pct = this.scorePercent(v.c, v.t);
      if (!worst || pct < worst.pct) worst = { st, pct, ...v };
    });
    return worst;
  },

  // adaptive next difficulty
  nextDifficulty(current, accuracyPct) {
    if (accuracyPct >= 80) return current === 'easy' ? 'medium' : 'hard';
    if (accuracyPct < 50)  return 'easy';
    return current;
  }
};
