/* global Layout, UI, API, Store, DEMO, Mastery, gsap */
/* Quiz Results — score + analysis + what to do next */
(function(){
  Layout.mount('quiz', { title:'Quiz Results', crumb:'Score → analysis → next action' });
  const el = document.getElementById('page-content');

  let res=null;
  try { res = JSON.parse(sessionStorage.getItem('synapse_last_result')); } catch(e){}
  if (!res){ res = Store.get().quizzes[0]; }
  if (!res){ el.innerHTML = `<div class="empty-state">No quiz results yet. <a href="quiz.html">Take a quiz</a> to see your analysis.</div>`; Layout.enter(); return; }

  const t = DEMO.topics.find(x=>x.id===res.topicId) || {};
  const answers = res.answers || [];
  const correct = res.correct, total = res.total, score = res.score;
  const wrong = total - correct;

  // subtopic (concept) performance
  const stMap = {};
  answers.forEach(a=>{ stMap[a.st]=stMap[a.st]||{c:0,t:0}; stMap[a.st].t++; if(a.correct) stMap[a.st].c++; });
  const stRows = Object.entries(stMap).map(([st,v])=>({ st, pct: Mastery.scorePercent(v.c,v.t) })).sort((a,b)=>a.pct-b.pct);
  const weakest = stRows[0];

  // difficulty performance
  const diff = Mastery.difficultyBreakdown(answers);

  const band = Mastery.band(res.mastery);
  const delta = res.mastery - (res.prevMastery ?? res.mastery);

  el.innerHTML = `
    <div class="row g-4">
      <div class="col-lg-4">
        <div class="s-card text-center result-score">
          <div class="overline mb-3">Your Score</div>
          ${UI.radial(score,{size:170,label:'Score'})}
          <div class="mt-3 fw-semibold" data-testid="score-fraction">${correct} / ${total} Correct</div>
          <div class="d-flex justify-content-center gap-3 mt-3">
            <span class="chip easy">✓ ${correct} correct</span>
            <span class="chip hard">✕ ${wrong} incorrect</span>
          </div>
        </div>
      </div>

      <div class="col-lg-8">
        <div class="s-card mb-4" style="border-color:#FECACA;background:linear-gradient(180deg,#fff,#FFF8F8)">
          <div class="overline m-low-t mb-1">Weak concept detected</div>
          <h3 class="mb-1">${UI.esc(weakest? weakest.st : t.name)} ${weakest?`<span class="mono m-low-t">${weakest.pct}%</span>`:''}</h3>
          <p class="text-muted-2 small mb-3">Your answers show difficulty with <strong>${UI.esc(weakest?weakest.st:t.name)}</strong> in ${UI.esc(t.name)}. This is now your recommended revision focus.</p>
          <div class="d-flex align-items-center gap-3 flex-wrap">
            <span class="chip">Topic mastery now: <strong class="ms-1 ${Mastery.textClass(res.mastery)}">${res.mastery}%</strong> ${delta?`<span class="ms-1 ${delta>0?'m-high-t':'m-low-t'}">(${delta>0?'+':''}${delta})</span>`:''}</span>
            <span class="mastery-tag ${band.cls}">${band.label}</span>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-md-6"><div class="s-card h-100">
            <div class="overline mb-3">Concept performance</div>
            ${stRows.map(r=>`<div class="mb-3"><div class="d-flex justify-content-between small fw-semibold mb-1"><span>${UI.esc(r.st)}</span><span class="${Mastery.textClass(r.pct)}">${r.pct}%</span></div><div class="mastery-bar"><span class="${Mastery.colorClass(r.pct)}" data-w="${r.pct}"></span></div></div>`).join('')}
          </div></div>
          <div class="col-md-6"><div class="s-card h-100">
            <div class="overline mb-3">Difficulty performance</div>
            ${['easy','medium','hard'].map(d=>{ const v=diff[d]; const pct=v.t?Mastery.scorePercent(v.c,v.t):0; return `<div class="mb-3"><div class="d-flex justify-content-between small fw-semibold mb-1"><span class="text-capitalize">${d} ${v.t?'':'<span class=\"text-muted-2\">(none)</span>'}</span><span>${v.t?pct+'%':'—'}</span></div><div class="mastery-bar"><span class="${Mastery.colorClass(pct)}" data-w="${v.t?pct:0}"></span></div></div>`; }).join('')}
            <p class="text-muted-2 mb-0" style="font-size:.76rem">${score>=80?'High performance — the next quiz will step up in difficulty.':score<50?'We\'ll serve easier reinforcement questions next and recommend revision.':'Solid — difficulty will stay at this level next time.'}</p>
          </div></div>
        </div>
      </div>

      <div class="col-12">
        <div class="s-card reco-card d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <div class="overline"><span class="chip ai">${UI.icons.spark} Recommended next</span></div>
            <h4 class="mb-1 mt-2">Review ${UI.esc(weakest?weakest.st:t.name)} for ${t.estMin||10} min, then retake</h4>
            <div class="why">${UI.icons.spark} <strong>Why?</strong> You scored ${weakest?weakest.pct:'a low'}% on questions related to ${UI.esc(weakest?weakest.st:t.name)}.</div>
          </div>
          <div class="d-flex gap-2">
            <a href="revision.html" class="btn btn-primary btn-pill" data-testid="results-revision">View revision plan ${UI.icons.arrow}</a>
            <a href="quiz.html?topic=${res.topicId}" class="btn btn-outline-slate btn-pill" data-testid="results-retake">Retake quiz</a>
          </div>
        </div>
      </div>
    </div>`;

  Layout.enter();
  UI.animateRadials(); UI.animateBars();
  gsap.from('.row.g-4 > *',{y:18,duration:.5,stagger:.06,ease:'power3.out',delay:.1});
})();
