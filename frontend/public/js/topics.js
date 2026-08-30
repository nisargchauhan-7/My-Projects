/* global Layout, UI, API, Store, DEMO, Mastery, gsap */
/* Topic Explorer */
(async function(){
  Layout.mount('topics', { title:'Topics', crumb:'Extracted from your material · weak areas flagged' });
  const el = document.getElementById('page-content');
  el.innerHTML = `<div class="empty-state">Loading topics…</div>`;
  const topics = await API.topics();
  const weakId = Mastery.weakest(DEMO.topics, Store.get().mastery).id;

  el.innerHTML = `
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
      <div>
        <div class="overline">${UI.esc(DEMO.subject.name)} · ${topics.length} topics</div>
        <h2 class="mb-0">Topic Explorer</h2>
      </div>
      <div class="d-flex gap-2">
        <span class="chip"><span class="legend-dot" style="background:var(--mastery-high)"></span>Strong</span>
        <span class="chip"><span class="legend-dot" style="background:var(--mastery-med)"></span>Developing</span>
        <span class="chip"><span class="legend-dot" style="background:var(--mastery-low)"></span>Needs review</span>
      </div>
    </div>
    <div class="d-flex flex-column gap-3" id="topic-list">
      ${topics.map(t=>{
        const band = Mastery.band(t.mastery);
        const weak = t.id===weakId;
        return `<div class="topic-item ${weak?'weak':''}" data-testid="topic-${t.id}" onclick="location.href='topic.html?id=${t.id}'">
          <div class="idx">${String(t.idx).padStart(2,'0')}</div>
          <div class="flex-grow-1" style="min-width:0">
            <div class="d-flex align-items-center gap-2">
              <span class="t-name text-truncate">${UI.esc(t.name)}</span>
              ${weak?'<span class="weak-flag">Weakest</span>':''}
            </div>
            <div class="t-meta">${UI.esc(t.subtopics.join(' · '))}</div>
            <div class="mastery-bar mt-2" style="max-width:320px"><span class="${Mastery.colorClass(t.mastery)}" data-w="${t.mastery}"></span></div>
          </div>
          <div class="text-end">
            <div class="stat-value sm ${Mastery.textClass(t.mastery)}">${t.mastery}%</div>
            <span class="mastery-tag ${band.cls}">${band.label}</span>
          </div>
          <span style="color:#CBD5E1">${UI.icons.arrow}</span>
        </div>`;
      }).join('')}
    </div>`;

  Layout.enter();
  gsap.from('.topic-item', { x:-16, duration:.5, stagger:.05, ease:'power3.out' });
  UI.animateBars();
})();
