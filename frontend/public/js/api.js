var { CONFIG, DEMO, Store, Mastery } = window;
/* ============================================================
   API abstraction.
   BACKEND mode  -> calls the real Node/Express/MySQL API (via same-origin /api/*).
   DEMO fallback -> client-side (Store/DEMO) so the demo NEVER breaks if the
                    network/DB/Gemini is unavailable.
   ============================================================ */
window.API = {
  _token(){ return localStorage.getItem('synapse_token'); },
  async _req(path, opts={}) {
    const res = await fetch(CONFIG.API_BASE_URL + path, {
      ...opts,
      headers: { 'Content-Type':'application/json', ...(this._token()?{Authorization:'Bearer '+this._token()}:{}) , ...(opts.headers||{}) }
    });
    if (!res.ok) { let msg='HTTP '+res.status; try{ const j=await res.json(); if(j&&j.error) msg=j.error; }catch(e){} throw new Error(msg); }
    return res.json();
  },

  // Mirror backend per-topic mastery into the client Store so Store-based helpers stay in sync.
  async _syncStore() {
    try {
      const p = await this._req('/api/performance');
      const s = Store.get();
      (p.topics||[]).forEach(t => { s.mastery[t.id] = t.mastery; });
      Store.save();
    } catch(e) { /* non-fatal */ }
  },

  async login(email, password) {
    if (CONFIG.DEMO_MODE) {
      await Store.seedDemoUser();
      const user = await Store.verifyUser(email, password);
      if (!user) throw new Error('Invalid email or password');
      Store.setUser(user); return { user, token: 'demo' };
    }
    const r = await this._req('/api/auth/login', { method:'POST', body: JSON.stringify({ email, password }) });
    localStorage.setItem('synapse_token', r.token); Store.setUser(r.user);
    await this._syncStore(); return r;
  },

  async register(name, email, password) {
    if (CONFIG.DEMO_MODE) {
      const user = await Store.registerUser({ name, email, password });
      Store.setUser(user); return { user, token: 'demo' };
    }
    const r = await this._req('/api/auth/register', { method:'POST', body: JSON.stringify({ name, email, password }) });
    localStorage.setItem('synapse_token', r.token); Store.setUser(r.user);
    await this._syncStore(); return r;
  },

  async dashboard() {
    if (!CONFIG.DEMO_MODE) {
      try { return await this._req('/api/performance/dashboard'); }
      catch(e){ CONFIG.BACKEND = false; }
    }
    await wait(120);
    const topics = DEMO.topics.map(t=>({ ...t, mastery: Store.masteryOf(t.id) }));
    return {
      subject: DEMO.subject, overall: Mastery.overall(DEMO.topics, Store.get().mastery),
      topicsCount: topics.length, completed: Store.completedCount(),
      weakest: Mastery.weakest(DEMO.topics, Store.get().mastery),
      recommended: Store.revisionPlan()[0] || null, activity: Store.get().activity.slice(0,5)
    };
  },

  async topics() {
    if (!CONFIG.DEMO_MODE) {
      try { const t = await this._req('/api/topics'); const s=Store.get(); t.forEach(x=>{ s.mastery[x.id]=x.mastery; }); Store.save(); return t; }
      catch(e){ CONFIG.BACKEND = false; }
    }
    await wait(100); return DEMO.topics.map(t=>({ ...t, mastery: Store.masteryOf(t.id) }));
  },

  async topic(id) {
    if (!CONFIG.DEMO_MODE) {
      try { return await this._req('/api/topics/'+id); } catch(e){ CONFIG.BACKEND = false; }
    }
    await wait(80); const t=DEMO.topics.find(x=>x.id===id); return { ...t, mastery: Store.masteryOf(id) };
  },

  async askTutor(topicId, question) {
    if (!CONFIG.DEMO_MODE) {
      try {
        const r = await this._req('/api/tutor/ask', { method:'POST', body: JSON.stringify({ topicId, question }) });
        if (r && r.answer) return r;
      } catch(e){ /* fall back to demo tutor */ }
    }
    return demoTutor(topicId, question);
  },

  async quiz(topicId) {
    if (!CONFIG.DEMO_MODE) {
      try {
        const r = await this._req('/api/quizzes/generate', { method:'POST', body: JSON.stringify({ topicId }) });
        if (r.questions && r.questions.length) return r;
      } catch(e){ /* fall back to seeded questions */ }
    }
    await wait(150);
    return { topicId, questions: (DEMO.questions[topicId] || []).slice(0, 5) };
  },

  async uploadMaterial(file) {
    // Real PDF upload to the Node backend (multipart). Returns the analysis summary.
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch(CONFIG.API_BASE_URL + '/api/materials/upload', {
      method:'POST', headers: this._token()?{Authorization:'Bearer '+this._token()}:{}, body: fd
    });
    if (!res.ok) throw new Error('Upload failed'); return res.json();
  },

  async aiExtract(text) {
    if (CONFIG.DEMO_MODE) return null;
    try {
      const r = await this._req('/api/materials/extract', { method:'POST', body: JSON.stringify({ text: text || '' }) });
      return (r && r.topics && r.topics.length) ? r.topics : null;
    } catch(e){ return null; }
  },

  async submitQuiz(topicId, questions, selections) {
    const answers = questions.map((q,i)=>({
      subtopic:q.st, difficulty:q.d, st:q.st, d:q.d,
      selected: selections[i], correct: selections[i] === q.correct
    }));
    if (!CONFIG.DEMO_MODE) {
      try {
        const r = await this._req('/api/quizzes/submit', { method:'POST', body: JSON.stringify({ topicId, answers }) });
        const s=Store.get(); s.mastery[topicId]=r.mastery; Store.save();
        return { ...r, answers, questions };
      } catch(e){ /* fall back to client scoring */ }
    }
    await wait(300);
    const correct = answers.filter(a=>a.correct).length;
    const rec = Store.recordQuiz(topicId, correct, questions.length, answers);
    return { ...rec, questions };
  },

  async revision() {
    if (!CONFIG.DEMO_MODE) {
      try { return await this._req('/api/revision'); } catch(e){ CONFIG.BACKEND = false; }
    }
    await wait(120); return Store.revisionPlan();
  },

  async performance() {
    if (!CONFIG.DEMO_MODE) {
      try { const p = await this._req('/api/performance'); const s=Store.get(); (p.topics||[]).forEach(t=>{ s.mastery[t.id]=t.mastery; }); Store.save(); return p; }
      catch(e){ CONFIG.BACKEND = false; }
    }
    await wait(120);
    const s = Store.get();
    return {
      topics: DEMO.topics.map(t=>({ ...t, mastery: Store.masteryOf(t.id) })),
      overall: Mastery.overall(DEMO.topics, s.mastery),
      history: s.masteryHistory, quizzes: s.quizzes.slice(0,8), completed: Store.completedCount()
    };
  }
};

function wait(ms){ return new Promise(r=>setTimeout(r,ms)); }

async function demoTutor(topicId, question) {
  await wait(600 + Math.random()*400);
  const q = (question||'').toLowerCase();
  let best=null, bestScore=0;
  DEMO.tutorKB.forEach(entry => {
    const score = entry.keys.reduce((a,k)=> a + (q.includes(k)?1:0), 0) + (entry.topic===topicId?0.5:0);
    if (score > bestScore){ bestScore=score; best=entry; }
  });
  if (best && bestScore>0) return { answer: best.answer, sources: best.sources, grounded:true };
  const t = DEMO.topics.find(x=>x.id===topicId) || DEMO.topics[4];
  return {
    answer: `Based on your uploaded material on **${t.name}**: ${t.summary}\n\nKey points from your notes: ${t.keyConcepts.slice(0,3).join(', ')}. Ask me to compare concepts, or open the quiz to test this topic.`,
    sources: [`${t.name} — study material`], grounded: true
  };
}
