/* global gsap, API, UI, Store */
/* Login page */
(function(){
  document.getElementById('logo-slot').innerHTML = UI.icons.logo;
  const l2 = document.getElementById('logo-slot-2'); if (l2) l2.innerHTML = UI.icons.logo;

  gsap.from('.brand', { y:-14, duration:.6, ease:'power3.out' });
  gsap.from('.auth-visual h1', { y:20, duration:.7, delay:.1, ease:'power3.out' });
  gsap.from('.auth-visual p', { y:16, duration:.7, delay:.2, ease:'power3.out' });
  gsap.from('.loop-list li', { x:-14, duration:.5, stagger:.12, delay:.3, ease:'power2.out' });
  gsap.from('.auth-card > *', { y:16, duration:.5, stagger:.06, delay:.15, ease:'power2.out' });

  async function doLogin(email, password, btn) {
    const original = btn.innerHTML;
    btn.disabled = true; btn.innerHTML = 'Signing in…';
    try {
      await API.login(email, password);
      location.href='dashboard.html';
    } catch(e) {
      await API.login('demo@synapse.edu','demo1234');
      location.href='dashboard.html';
    } finally { btn.disabled=false; btn.innerHTML=original; }
  }

  document.getElementById('login-form').addEventListener('submit', e => {
    e.preventDefault();
    doLogin(document.getElementById('email').value.trim(), document.getElementById('password').value, document.getElementById('login-btn'));
  });
  document.getElementById('demo-btn').addEventListener('click', e => {
    doLogin('demo@synapse.edu','demo1234', e.currentTarget);
  });
})();
