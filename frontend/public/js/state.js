/* global CONFIG, DEMO, Mastery */
/* ============================================================
   Client-side state (localStorage) — the "student's learning history"
   In demo mode this stands in for the MySQL-backed backend.
   ============================================================ */
window.Store = {
  _s: null,
  _load() {
    if (this._s) return this._s;
    try { this._s = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || null; }
    catch(e){ this._s = null; }
    if (!this._s) this._s = this._fresh();
    return this._s;
  },
  _fresh() {
    const mastery = {};
    DEMO.topics.forEach(t => mastery[t.id] = t.initialMastery);
    return {
      user: null,
      subject: DEMO.subject,
      masteryHistory: [],           // [{date, overall}]
      mastery,                      // { topicId: score }
      attempts: {},                 // { topicId: count }
      studied: { t1:true, t2:true, t3:true, t7:false, t4:true, t5:true, t6:false, t8:false },
      quizzes: [],                  // [{topicId, score, correct, total, answers, at}]
      lastAnswers: {},              // { topicId: [answers] }
      activity: [
        { icon:'check', color:'green', text:'Completed quiz on OSI Model', meta:'Scored 91% · 2 days ago' },
        { icon:'book', color:'blue', text:'Studied TCP/IP fundamentals', meta:'3 days ago' },
        { icon:'alert', color:'red', text:'Weak area detected: AIMD Algorithm', meta:'36% mastery · 3 days ago' }
      ]
    };
  },
  save() { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(this._s)); },
  reset() { localStorage.removeItem(CONFIG.STORAGE_KEY); this._s = null; },

  get() { return this._load(); },
  get user(){ return this._load().user; },
  setUser(u){ this._load().user = u; this.save(); },
  logout(){ this._load().user = null; this.save(); },

  masteryOf(id){ const s=this._load(); return s.mastery[id] ?? (DEMO.topics.find(t=>t.id===id)||{}).initialMastery ?? 0; },

  recordQuiz(topicId, correct, total, answers) {
    const s = this._load();
    const pct = Mastery.scorePercent(correct, total);
    s.attempts[topicId] = (s.attempts[topicId]||0) + 1;
    const prev = this.masteryOf(topicId);
    const diff = Mastery.difficultyBreakdown(answers);
    const dmix = (() => {
      // weight harder-question success higher
      let num=0, den=0;
      const w={easy:1,medium:1.5,hard:2};
      Object.entries(diff).forEach(([k,v])=>{ if(v.t){ num += (v.c/v.t)*100*w[k]*v.t; den += w[k]*v.t; } });
      return den? num/den : pct;
    })();
    const updated = Mastery.updatedMastery(prev, pct, s.attempts[topicId], dmix);
    s.mastery[topicId] = updated;
    s.studied[topicId] = true;
    const rec = { topicId, score: pct, correct, total, answers, mastery: updated, prevMastery: prev, at: Date.now() };
    s.quizzes.unshift(rec);
    s.lastAnswers[topicId] = answers;
    // history snapshot
    s.masteryHistory.push({ date: Date.now(), overall: Mastery.overall(DEMO.topics, s.mastery) });
    const tName = (DEMO.topics.find(t=>t.id===topicId)||{}).name || 'Topic';
    s.activity.unshift({ icon: pct>=75?'check':'alert', color: pct>=75?'green':(pct>=50?'amber':'red'),
      text:`Quiz on ${tName}`, meta:`Scored ${pct}% · just now` });
    this.save();
    return rec;
  },

  completedCount(){ const s=this._load(); return Object.values(s.studied).filter(Boolean).length; },

  revisionPlan() {
    const s = this._load();
    // weak topics: mastery < 60, sorted ascending
    const weak = DEMO.topics
      .map(t => ({ ...t, mastery: this.masteryOf(t.id) }))
      .filter(t => t.mastery < 60)
      .sort((a,b)=> a.mastery - b.mastery)
      .slice(0, 3);
    return weak.map((t,i) => {
      const la = s.lastAnswers[t.id];
      let reason = `Recommended because your mastery in ${t.name} is ${t.mastery}%.`;
      let focus = t.subtopics.slice(0,3);
      if (la) {
        const ws = Mastery.weakestSubtopic(la);
        if (ws) reason = `Recommended because you scored ${ws.pct}% on questions related to ${ws.st} in ${t.name}.`;
      }
      return { rank:i+1, topic:t, minutes: t.estMin, focus, reason };
    });
  }
};
