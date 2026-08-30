/* global CONFIG, DEMO, Store, Mastery, UI */
/* ============================================================
   API abstraction. DEMO mode = client-side (Store/DEMO).
   When CONFIG.API_BASE_URL is set, calls the Node/Express backend.
   Every method returns a Promise and has a fallback so the demo
   NEVER breaks even if the network or Gemini is unavailable.
   ============================================================ */
window.API = {
  _token(){ return localStorage.getItem('synapse_token'); },
  async _req(path, opts={}) {
    const res = await fetch(CONFIG.API_BASE_URL + path, {
      ...opts,
      headers: { 'Content-Type':'application/json', ...(this._token()?{Authorization:'Bearer '+this._token()}:{}) , ...(opts.headers||{}) }
    });
    if (!res.ok) throw new Error('HTTP '+res.status);
    return res.json();
  },

  async login(email, password) {
    if (CONFIG.DEMO_MODE) {
      await Store.seedDemoUser();
      const user = await Store.verifyUser(email, password);
      if (!user) throw new Error('Invalid email or password');
      Store.setUser(user);
      return { user, token: 'demo' };
    }
    const r = await this._req('/api/auth/login', { method:'POST', body: JSON.stringify({ email, password }) });
    localStorage.setItem('synapse_token', r.token); Store.setUser(r.user); return r;
  },

  async register(name, email, password) {
    if (CONFIG.DEMO_MODE) {
      const user = await Store.registerUser({ name, email, password });
      Store.setUser(user);
      return { user, token: 'demo' };
    }
    const r = await this._req('/api/auth/register', { method:'POST', body: JSON.stringify({ name, email, password }) });
    localStorage.setItem('synapse_token', r.token); Store.setUser(r.user); return r;
  },

  async dashboard() {
    if (CONFIG.DEMO_MODE) {
      await wait(120);
      const topics = DEMO.topics.map(t=>({ ...t, mastery: Store.masteryOf(t.id) }));
      const overall = Mastery.overall(DEMO.topics, Store.get().mastery);
      const weakest = Mastery.weakest(DEMO.topics, Store.get().mastery);
      return {
        subject: DEMO.subject, overall, topicsCount: topics.length,
        completed: Store.completedCount(), weakest,
        recommended: Store.revisionPlan()[0] || null,
        activity: Store.get().activity.slice(0,5)
      };
    }
    try { return await this._req('/api/performance/dashboard'); }
    catch(e){ CONFIG.API_BASE_URL=''; return this.dashboard(); }
  },

  async topics() {
    if (CONFIG.DEMO_MODE) { await wait(100); return DEMO.topics.map(t=>({ ...t, mastery: Store.masteryOf(t.id) })); }
    try { return await this._req('/api/topics'); } catch(e){ CONFIG.API_BASE_URL=''; return this.topics(); }
  },
  async topic(id) {
    if (CONFIG.DEMO_MODE) { await wait(80); const t=DEMO.topics.find(x=>x.id===id); return { ...t, mastery: Store.masteryOf(id) }; }
    try { return await this._req('/api/topics/'+id); } catch(e){ CONFIG.API_BASE_URL=''; return this.topic(id); }
  },

  async askTutor(topicId, question) {
    if (CONFIG.DEMO_MODE) return demoTutor(topicId, question);
    try { return await this._req('/api/tutor/ask', { method:'POST', body: JSON.stringify({ topicId, question }) }); }
    catch(e){ return demoTutor(topicId, question); }
  },

  async quiz(topicId) {
    if (CONFIG.DEMO_MODE) {
      await wait(150);
      const qs = (DEMO.questions[topicId]||[]).slice(0,5);
      return { topicId, questions: qs };
    }
    try { return await this._req('/api/quizzes/generate', { method:'POST', body: JSON.stringify({ topicId }) }); }
    catch(e){ CONFIG.API_BASE_URL=''; return this.quiz(topicId); }
  },

  async submitQuiz(topicId, questions, selections) {
    // Deterministic scoring done here (mirrors backend deterministic logic)
    const answers = questions.map((q,i)=>({
      qid:q.id, d:q.d, st:q.st, selected: selections[i],
      correct: selections[i] === q.correct
    }));
    const correct = answers.filter(a=>a.correct).length;
    if (CONFIG.DEMO_MODE) {
      await wait(300);
      const rec = Store.recordQuiz(topicId, correct, questions.length, answers);
      return { ...rec, questions };
    }
    try {
      const r = await this._req('/api/quizzes/submit', { method:'POST', body: JSON.stringify({ topicId, answers }) });
      return { ...r, questions };
    } catch(e){
      const rec = Store.recordQuiz(topicId, correct, questions.length, answers);
      return { ...rec, questions };
    }
  },

  async revision() {
    if (CONFIG.DEMO_MODE) { await wait(120); return Store.revisionPlan(); }
    try { return await this._req('/api/revision'); } catch(e){ CONFIG.API_BASE_URL=''; return Store.revisionPlan(); }
  },

  async performance() {
    if (CONFIG.DEMO_MODE) {
      await wait(120);
      const s = Store.get();
      return {
        topics: DEMO.topics.map(t=>({ ...t, mastery: Store.masteryOf(t.id) })),
        overall: Mastery.overall(DEMO.topics, s.mastery),
        history: s.masteryHistory,
        quizzes: s.quizzes.slice(0,8),
        completed: Store.completedCount()
      };
    }
    try { return await this._req('/api/performance'); } catch(e){ CONFIG.API_BASE_URL=''; return this.performance(); }
  }
};

function wait(ms){ return new Promise(r=>setTimeout(r,ms)); }
function titleCase(s){ return (s||'').replace(/\w\S*/g, t=>t.charAt(0).toUpperCase()+t.slice(1)); }

async function demoTutor(topicId, question) {
  await wait(700 + Math.random()*500);
  const q = (question||'').toLowerCase();
  let best=null, bestScore=0;
  DEMO.tutorKB.forEach(entry => {
    const score = entry.keys.reduce((a,k)=> a + (q.includes(k)?1:0), 0) + (entry.topic===topicId?0.5:0);
    if (score > bestScore){ bestScore=score; best=entry; }
  });
  if (best && bestScore>0) return { answer: best.answer, sources: best.sources, grounded:true };
  // topic-scoped fallback still grounded in material
  const t = DEMO.topics.find(x=>x.id===topicId) || DEMO.topics[4];
  return {
    answer: `Based on your uploaded material on **${t.name}**: ${t.summary}\n\nKey points from your notes: ${t.keyConcepts.slice(0,3).join(', ')}. Ask me to compare concepts, or open the quiz to test this topic.`,
    sources: [`${t.name} — study material`],
    grounded: true
  };
}
