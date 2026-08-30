/* global Store, UI, DEMO, gsap */
/* App shell: renders sidebar + topbar, guards auth, wires page transitions */
window.Layout = {
  nav: [
    { key:'dashboard', label:'Dashboard', href:'dashboard.html', icon:'dashboard' },
    { key:'learning', label:'My Learning', href:'topics.html', icon:'learning' },
    { key:'material', label:'Study Material', href:'upload.html', icon:'material' },
    { key:'topics', label:'Topics', href:'topics.html', icon:'topics' },
    { key:'tutor', label:'AI Tutor', href:'tutor.html', icon:'tutor' },
    { key:'quiz', label:'Quizzes', href:'quiz.html', icon:'quiz' },
    { key:'progress', label:'Progress', href:'progress.html', icon:'progress' }
  ],
  soon: [
    { label:'Projects', icon:'projects' },
    { label:'Career', icon:'career' },
    { label:'Opportunities', icon:'opp' },
    { label:'Community', icon:'community' }
  ],

  guard() {
    if (!Store.user) { location.replace('login.html'); return false; }
    return true;
  },

  mount(active, opts={}) {
    if (!this.guard()) return;
    const u = Store.user;
    const initials = (u.name||'S').split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase();

    const sideLinks = this.nav.map(n => `
      <a class="side-link ${n.key===active?'active':''}" href="${n.href}" data-testid="nav-${n.key}">
        ${UI.icons[n.icon]}<span>${n.label}</span>
      </a>`).join('');

    const soonLinks = this.soon.map(n => `
      <span class="side-link disabled" data-testid="soon-${n.label.toLowerCase()}">
        ${UI.icons[n.icon]}<span>${n.label}</span><span class="soon-badge">Soon</span>
      </span>`).join('');

    document.body.insertAdjacentHTML('afterbegin', `
      <div class="app-shell">
        <aside class="sidebar" id="sidebar">
          <div class="brand">
            <span class="logo-mark">${UI.icons.logo}</span>
            <span>SynapseEDU<small>Learning Hub</small></span>
          </div>
          <nav>${sideLinks}</nav>
          <div class="nav-group-label">Coming Soon</div>
          <nav>${soonLinks}</nav>
          <div class="sidebar-foot">
            <div class="user-chip">
              <div class="avatar">${initials}</div>
              <div style="min-width:0">
                <div class="nm text-truncate">${UI.esc(u.name)}</div>
                <div class="em text-truncate">${UI.esc(u.email)}</div>
              </div>
              <button class="btn btn-sm btn-outline-slate ms-auto" style="padding:4px 8px" title="Log out"
                data-testid="logout-btn" onclick="Store.logout();location.href='login.html'">⏻</button>
            </div>
          </div>
        </aside>

        <div class="main-wrap">
          <header class="topbar">
            <button class="hamburger btn btn-outline-slate btn-sm" onclick="document.getElementById('sidebar').classList.toggle('open')">☰</button>
            <div>
              <div class="page-title" data-testid="page-title">${opts.title||''}</div>
              ${opts.crumb?`<div class="crumb">${opts.crumb}</div>`:''}
            </div>
            <div class="ms-auto d-flex align-items-center gap-2">
              <span class="subject-pill" data-testid="current-subject">${UI.icons.layers} ${DEMO.subject.name}</span>
            </div>
          </header>
          <main class="page" id="page-content"></main>
        </div>
      </div>
    `);
  },

  enter() {
    const el = document.getElementById('page-content');
    if (window.gsap && el) gsap.from(el, { y:14, duration:.45, ease:'power2.out' });
  }
};
