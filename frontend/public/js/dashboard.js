/* global Layout, UI, API, Store, DEMO, Mastery, gsap */
/* Dashboard */
(async function(){
  Layout.mount('dashboard', { title:'Dashboard', crumb:'Your learning overview' });
  const el = document.getElementById('page-content');
  el.innerHTML = `<div class="empty-state">Loading your profile…</div>`;

  const d = await API.dashboard();
  const u = Store.user;
  const hour = new Date().getHours();
  const greet = hour<12?'Good morning':hour<18?'Good afternoon':'Good evening';
  const w = d.weakest;
  const rec = d.recommended;
  const bandOverall = Mastery.band(d.overall);

  const actIcon = a => ({green:'ico green',blue:'ico blue',amber:'ico amber',red:'ico red'})[a.color]||'ico blue';

  el.innerHTML = `
    <section class="hero-banner mb-4">
      <img class="bg-net" src="https://images.unsplash.com/photo-1644088379091-d574269d422f?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600" alt="">
      <div class="content">
        <div class="overline" style="color:rgba(255,255,255,.65)">${greet}, ${UI.esc(u.name.split(' ')[0])}</div>
        <div class="d-flex flex-wrap align-items-end justify-content-between gap-3 mt-1">
          <div>
            <div class="overline" style="color:rgba(255,255,255,.55)">Current subject</div>
            <div class="subject-name">${UI.esc(d.subject.name)}</div>
            <div style="color:rgba(255,255,255,.7); font-size:.9rem; margin-top:6px">${UI.icons.material.replace('currentColor','rgba(255,255,255,.7)')} <span class="mono">${UI.esc(d.subject.material)}</span></div>
          </div>
          <a href="upload.html" class="btn btn-ai btn-pill" data-testid="upload-cta">＋ Upload new material</a>
        </div>
      </div>
    </section>

    <div class="bento">
      <div class="s-card hover-lift bento col-span-3 stat-card" style="grid-column:span 3">
        <div class="ico blue">${UI.icons.target}</div>
        <div class="overline">Overall Mastery</div>
        <div class="stat-value ${Mastery.textClass(d.overall)}" data-testid="stat-overall">${d.overall}%</div>
        <span class="mastery-tag ${bandOverall.cls} mt-2 d-inline-block">${bandOverall.label}</span>
      </div>
      <div class="s-card hover-lift stat-card" style="grid-column:span 3">
        <div class="ico violet">${UI.icons.layers}</div>
        <div class="overline">Topics</div>
        <div class="stat-value" data-testid="stat-topics">${d.topicsCount}</div>
        <div class="text-muted-2 small mt-2">extracted from your material</div>
      </div>
      <div class="s-card hover-lift stat-card" style="grid-column:span 3">
        <div class="ico green">${UI.icons.check}</div>
        <div class="overline">Completed</div>
        <div class="stat-value" data-testid="stat-completed">${d.completed}</div>
        <div class="text-muted-2 small mt-2">of ${d.topicsCount} topics studied</div>
      </div>
      <div class="s-card hover-lift stat-card" style="grid-column:span 3; border-color:#FECACA">
        <div class="ico red">${UI.icons.alert}</div>
        <div class="overline">Weakest Area</div>
        <div class="stat-value sm m-low-t text-truncate" data-testid="stat-weakest">${UI.esc(w.name)}</div>
        <div class="mono m-low-t fw-bold mt-1">${w.mastery}%</div>
      </div>

      <div class="s-card reco-card hover-lift" style="grid-column:span 7">
        <div class="d-flex align-items-center gap-2 mb-1">
          <span class="chip ai">${UI.icons.spark} AI Recommended</span>
          <span class="overline">Next best action</span>
        </div>
        <h3 class="mb-1">${rec?('Review '+UI.esc(rec.topic.name)):'You\'re all caught up 🎉'}</h3>
        ${rec?`
        <div class="d-flex align-items-center gap-3 text-muted-2 small mb-2">
          <span>${UI.icons.clock} ${rec.minutes} min</span>
          <span>·</span>
          <span>Focus: ${rec.focus.map(f=>UI.esc(f)).join(', ')}</span>
        </div>
        <div class="why">${UI.icons.spark} <strong>Why am I seeing this?</strong> ${UI.esc(rec.reason)}</div>
        <div class="d-flex gap-2 mt-3">
          <a href="revision.html" class="btn btn-primary btn-pill" data-testid="start-revision">Start revision ${UI.icons.arrow}</a>
          <a href="topic.html?id=${rec.topic.id}" class="btn btn-outline-slate btn-pill">Open topic</a>
        </div>`:`<p class="text-muted-2">Every topic is above the revision threshold. Keep practising to raise mastery further.</p>`}
      </div>

      <div class="s-card" style="grid-column:span 5">
        <div class="section-head"><h4 class="mb-0">Recent activity</h4><a href="progress.html" class="small">View all</a></div>
        <div class="list-clean">
          ${d.activity.map(a=>`
            <div class="activity-row">
              <div class="dot ${actIcon(a)}">${UI.icons[a.icon]||UI.icons.book}</div>
              <div style="min-width:0"><div class="fw-semibold small">${UI.esc(a.text)}</div><div class="text-muted-2" style="font-size:.76rem">${UI.esc(a.meta)}</div></div>
            </div>`).join('')}
        </div>
      </div>

      <div class="s-card" style="grid-column:span 12">
        <div class="section-head"><h4 class="mb-0">Learning profile</h4><a href="topics.html" class="small">Explore topics ${UI.icons.arrow}</a></div>
        ${d===null?'':''}
        <div id="profile-mini"></div>
      </div>
    </div>`;

  // mini profile bars
  const topics = await API.topics();
  document.getElementById('profile-mini').innerHTML = topics.map(t=>`
    <div class="profile-bar-row">
      <div class="nm text-truncate">${UI.esc(t.name)}</div>
      <div class="mastery-bar"><span class="${Mastery.colorClass(t.mastery)}" data-w="${t.mastery}"></span></div>
      <div class="pct ${Mastery.textClass(t.mastery)}">${t.mastery}%</div>
    </div>`).join('');

  Layout.enter();
  gsap.from('.bento > *', { y:20, duration:.6, stagger:.05, ease:'power3.out', delay:.1 });
  UI.animateBars();
})();
