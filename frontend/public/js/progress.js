/* global Layout, UI, API, Store, DEMO, Mastery, gsap */
/* Progress / Mastery Dashboard (Screen 12) + Weak Topic Analysis (Screen 10) */
(async function(){
  Layout.mount('progress', { title:'Progress', crumb:'Mastery over time · learning profile' });
  const el = document.getElementById('page-content');
  el.innerHTML = `<div class="empty-state">Loading analytics…</div>`;
  const p = await API.performance();

  const sorted = [...p.topics].sort((a,b)=>a.mastery-b.mastery);
  const weakest = sorted[0];

  // series for the line chart: baseline (initial overall) + history
  const initialOverall = Math.round(DEMO.topics.reduce((a,t)=>a+t.initialMastery,0)/DEMO.topics.length);
  let series = [initialOverall, ...p.history.map(h=>h.overall)];
  if (series.length===1) series = [initialOverall, p.overall];
  const line = buildLine(series);

  el.innerHTML = `
    <div class="bento">
      <div class="s-card" style="grid-column:span 4">
        <div class="text-center">
          <div class="overline mb-3">Overall Mastery</div>
          ${UI.radial(p.overall,{size:160})}
          <div class="mt-3 d-flex justify-content-center gap-3">
            <div><div class="stat-value sm">${p.completed}</div><div class="overline">Completed</div></div>
            <div><div class="stat-value sm">${p.topics.length}</div><div class="overline">Topics</div></div>
            <div><div class="stat-value sm">${p.quizzes.length}</div><div class="overline">Quizzes</div></div>
          </div>
        </div>
      </div>

      <div class="s-card" style="grid-column:span 8">
        <div class="section-head"><h4 class="mb-0">Mastery over time</h4><span class="chip"><span class="legend-dot" style="background:#1D4ED8"></span>Overall mastery</span></div>
        ${line}
        <p class="text-muted-2 small mb-0 mt-2">${series[series.length-1]>series[0]?`Up <strong class="m-high-t">${series[series.length-1]-series[0]} pts</strong> since you started — the loop is working.`:'Take quizzes on weak topics to move this line up.'}</p>
      </div>

      <div class="s-card" style="grid-column:span 7">
        <div class="section-head"><h4 class="mb-0">Your learning profile</h4><a href="revision.html" class="small">Get revision plan ${UI.icons.arrow}</a></div>
        <div id="profile">
          ${sorted.map(t=>`
            <div class="profile-bar-row" data-testid="profile-${t.id}">
              <div class="nm text-truncate">${UI.esc(t.name)}</div>
              <div class="mastery-bar"><span class="${Mastery.colorClass(t.mastery)}" data-w="${t.mastery}"></span></div>
              <div class="pct ${Mastery.textClass(t.mastery)}">${t.mastery}%</div>
            </div>`).join('')}
        </div>
      </div>

      <div class="s-card" style="grid-column:span 5">
        <div class="s-card mb-3" style="border-color:#FECACA;background:linear-gradient(180deg,#fff,#FFF8F8);box-shadow:none">
          <div class="overline m-low-t mb-1">Weakest concept</div>
          <h3 class="mb-1">${UI.esc(weakest.name)} <span class="mono m-low-t">${weakest.mastery}%</span></h3>
          <p class="text-muted-2 small mb-0">${UI.esc(weakest.name)} is currently your weakest concept. Your recent answers show difficulty with ${UI.esc(weakest.subtopics.slice(0,2).join(' and '))}. Prioritise this in your next session.</p>
        </div>
        <div class="section-head"><h5 class="mb-0">Recent quiz scores</h5></div>
        <div class="list-clean">
          ${p.quizzes.length? p.quizzes.map(q=>{ const t=DEMO.topics.find(x=>x.id===q.topicId)||{}; return `
            <div class="perf-row"><div><div class="fw-semibold small">${UI.esc(t.name||'Topic')}</div><div class="text-muted-2" style="font-size:.72rem">${q.correct}/${q.total} correct</div></div><span class="mastery-tag ${Mastery.tagClass(q.score)}">${q.score}%</span></div>`; }).join('')
            : '<p class="text-muted-2 small">No quizzes yet — <a href="quiz.html">take one</a> to populate your analytics.</p>'}
        </div>
      </div>
    </div>`;

  Layout.enter();
  UI.animateRadials(); UI.animateBars();
  gsap.from('.bento > *',{y:20,duration:.55,stagger:.06,ease:'power3.out',delay:.1});
  const path = document.querySelector('#line-path');
  if (path){ const len=path.getTotalLength(); path.style.strokeDasharray=len; path.style.strokeDashoffset=len; path.getBoundingClientRect(); path.style.transition='stroke-dashoffset 1.4s ease-in-out'; path.style.strokeDashoffset=0; }

  function buildLine(data){
    const w=560,h=180,pad=28;
    const max=100,min=Math.max(0,Math.min(...data)-10);
    const x=i=>pad+(i/(Math.max(1,data.length-1)))*(w-pad*2);
    const y=v=>h-pad-((v-min)/(max-min))*(h-pad*2);
    const d='M'+data.map((v,i)=>`${x(i)},${y(v)}`).join(' L');
    const area=`M${x(0)},${h-pad} L`+data.map((v,i)=>`${x(i)},${y(v)}`).join(' L')+` L${x(data.length-1)},${h-pad} Z`;
    const dots=data.map((v,i)=>`<circle cx="${x(i)}" cy="${y(v)}" r="4" fill="#1D4ED8" stroke="#fff" stroke-width="2"/>`).join('');
    return `<svg viewBox="0 0 ${w} ${h}" class="chart-svg" preserveAspectRatio="xMidYMid meet">
      <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1D4ED8" stop-opacity=".18"/><stop offset="1" stop-color="#1D4ED8" stop-opacity="0"/></linearGradient></defs>
      ${[0,25,50,75,100].map(g=>`<line x1="${pad}" y1="${y(g)}" x2="${w-pad}" y2="${y(g)}" stroke="#E2E8F0" stroke-width="1"/><text x="4" y="${y(g)+4}" font-size="10" fill="#94A3B8" font-family="JetBrains Mono">${g}</text>`).join('')}
      <path d="${area}" fill="url(#ag)"/>
      <path id="line-path" d="${d}" fill="none" stroke="#1D4ED8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      ${dots}
    </svg>`;
  }
})();
