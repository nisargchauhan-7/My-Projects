var { Layout, UI, API, Store, DEMO, Mastery } = window;
/* Topic Learning */
(async function(){
  const id = new URLSearchParams(location.search).get('id') || 't5';
  Layout.mount('learning', { title:'Topic', crumb:'Learn from your material' });
  const el = document.getElementById('page-content');
  el.innerHTML = `<div class="empty-state">Loading…</div>`;
  const t = await API.topic(id);
  const band = Mastery.band(t.mastery);
  const related = (t.related||[]).map(r=>DEMO.topics.find(x=>x.id===r)).filter(Boolean);

  el.innerHTML = `
    <a href="topics.html" class="small text-muted-2 d-inline-flex align-items-center gap-1 mb-3">‹ All topics</a>
    <div class="row g-4">
      <div class="col-lg-8">
        <div class="s-card mb-4">
          <div class="d-flex align-items-start justify-content-between gap-3 mb-2">
            <div>
              <div class="overline">Topic ${String(t.idx).padStart(2,'0')} · ${UI.esc(DEMO.subject.name)}</div>
              <h1 style="font-size:2rem">${UI.esc(t.name)}</h1>
            </div>
            <div class="text-end"><div class="stat-value sm ${Mastery.textClass(t.mastery)}">${t.mastery}%</div><span class="mastery-tag ${band.cls}">${band.label}</span></div>
          </div>
          <p style="font-size:1.02rem;color:var(--synapse-ink-2)">${UI.esc(t.summary)}</p>
          <div class="d-flex flex-wrap gap-2 mt-3">
            <a href="tutor.html?topic=${t.id}" class="btn btn-ai btn-pill" data-testid="ask-tutor-btn">${UI.icons.tutor} Ask AI Tutor</a>
            <a href="quiz.html?topic=${t.id}" class="btn btn-primary btn-pill" data-testid="start-quiz-btn">${UI.icons.quiz} Start Quiz</a>
          </div>
        </div>

        <div class="s-card mb-4">
          <h4 class="mb-3">Key concepts</h4>
          <div class="row g-2">
            ${t.keyConcepts.map(k=>`<div class="col-md-6"><div class="d-flex align-items-center gap-2 p-2 rounded" style="background:#F8FAFC;border:1px solid var(--synapse-border)"><span style="color:#1D4ED8;width:16px;height:16px;display:inline-flex">${UI.icons.check}</span><span class="small fw-semibold">${UI.esc(k)}</span></div></div>`).join('')}
          </div>
        </div>

        <div class="s-card mb-4">
          <h4 class="mb-3">Important definitions</h4>
          ${t.definitions.map(d=>`<div class="mb-3"><span class="badge-source mono">${UI.esc(d.term)}</span><p class="mt-2 mb-0 small" style="color:var(--synapse-ink-2)">${UI.esc(d.def)}</p></div>`).join('')}
        </div>

        <div class="s-card">
          <h4 class="mb-3">Examples</h4>
          <ul class="list-clean">
            ${t.examples.map(ex=>`<li class="d-flex gap-2 py-2" style="border-bottom:1px solid var(--synapse-border)"><span class="mono" style="color:#8B5CF6">›</span><span class="small">${UI.esc(ex)}</span></li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="s-card mb-4 text-center">
          <div class="overline mb-3">Your progress</div>
          ${UI.radial(t.mastery,{size:150})}
          <div class="mt-3">
            <div class="mastery-bar"><span class="${Mastery.colorClass(t.mastery)}" data-w="${t.mastery}"></span></div>
            <p class="text-muted-2 small mt-2 mb-0">${t.mastery<50?'This topic needs review. Take the quiz to build mastery.':t.mastery<75?'You\'re developing here — keep practising.':'Strong grasp. Test yourself to confirm.'}</p>
          </div>
        </div>
        <div class="s-card">
          <div class="overline mb-2">Related concepts</div>
          ${related.length?related.map(r=>`<a href="topic.html?id=${r.id}" class="d-flex align-items-center justify-content-between py-2 text-decoration-none" style="border-bottom:1px solid var(--synapse-border)"><span class="small fw-semibold" style="color:var(--synapse-ink)">${UI.esc(r.name)}</span><span class="mastery-tag ${Mastery.tagClass(Store.masteryOf(r.id))}">${Store.masteryOf(r.id)}%</span></a>`).join(''):'<p class="text-muted-2 small mb-0">No linked topics.</p>'}
        </div>
      </div>
    </div>`;

  Layout.enter();
  UI.animateRadials(); UI.animateBars();
})();
