var { Layout, UI, API, Mastery, gsap } = window;
/* Personalized Revision Plan (Screen 11) */
(async function(){
  Layout.mount('learning', { title:'Revision Plan', crumb:'Generated from your performance' });
  const el = document.getElementById('page-content');
  el.innerHTML = `<div class="empty-state">Building your revision plan…</div>`;
  const plan = await API.revision();
  const totalMin = plan.reduce((a,p)=>a+p.minutes,0);

  if (!plan.length){
    el.innerHTML = `<div class="mx-auto text-center" style="max-width:560px"><div class="ico green mx-auto" style="width:56px;height:56px;border-radius:16px">${UI.icons.check}</div><h2 class="mt-3">Nothing to revise 🎉</h2><p class="text-muted-2">All topics are above the revision threshold. Keep practising to push mastery even higher.</p><a href="topics.html" class="btn btn-primary btn-pill">Explore topics</a></div>`;
    Layout.enter(); return;
  }

  el.innerHTML = `
    <div class="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
      <div>
        <div class="overline">${UI.icons.spark} AI-generated · ${plan.length} focus areas</div>
        <h2 class="mb-0">Your next revision</h2>
      </div>
      <span class="chip"><span style="width:14px;height:14px;display:inline-flex">${UI.icons.clock}</span> Total ~${totalMin} min today</span>
    </div>

    <div class="d-flex flex-column gap-3" id="rev-list">
      ${plan.map(p=>`
        <div class="rev-item ${p.rank===2?'p2':''}" data-testid="rev-${p.topic.id}">
          <div class="num">${String(p.rank).padStart(2,'0')}</div>
          <div class="flex-grow-1">
            <div class="d-flex align-items-center gap-2 flex-wrap">
              <h4 class="mb-0">${UI.esc(p.topic.name)}</h4>
              <span class="rev-time">${UI.icons.clock} ${p.minutes} min</span>
              <span class="mastery-tag ${Mastery.tagClass(p.topic.mastery)}">${p.topic.mastery}%</span>
            </div>
            <div class="mt-2 small text-muted-2">Review:</div>
            <div class="d-flex flex-wrap gap-2 mt-1">
              ${p.focus.map(f=>`<span class="chip">${UI.esc(f)}</span>`).join('')}
            </div>
            <div class="why mt-3">${UI.icons.spark} <strong>Why am I seeing this?</strong> ${UI.esc(p.reason)}</div>
            <div class="d-flex gap-2 mt-3">
              <a href="topic.html?id=${p.topic.id}" class="btn btn-primary btn-sm btn-pill">Study now</a>
              <a href="tutor.html?topic=${p.topic.id}" class="btn btn-outline-slate btn-sm btn-pill">Ask tutor</a>
              <a href="quiz.html?topic=${p.topic.id}" class="btn btn-outline-slate btn-sm btn-pill" data-testid="rev-retake-${p.topic.id}">Retake quiz</a>
            </div>
          </div>
        </div>`).join('')}
    </div>

    <div class="s-card mt-4" style="background:#F8FAFC">
      <div class="d-flex align-items-center gap-3">
        <span class="ico violet">${UI.icons.target}</span>
        <div><div class="fw-semibold">The loop that improves your score</div><div class="text-muted-2 small">Study a weak area → retake its quiz → watch mastery rise on your dashboard. Try it now with your #1 focus.</div></div>
        <a href="quiz.html?topic=${plan[0].topic.id}" class="btn btn-ai btn-pill ms-auto" data-testid="rev-loop-cta">Study &amp; retake ${UI.esc(plan[0].topic.name)}</a>
      </div>
    </div>`;

  Layout.enter();
  gsap.from('.rev-item',{y:22,duration:.55,stagger:.1,ease:'power3.out',delay:.1});
})();
