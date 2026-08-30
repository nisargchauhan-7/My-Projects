var { UI, API, Store, gsap } = window;
/* Login + Register page with real email/password auth (client-side demo store or Node backend) */
(function(){
  document.getElementById('logo-slot').innerHTML = UI.icons.logo;
  const l2 = document.getElementById('logo-slot-2'); if (l2) l2.innerHTML = UI.icons.logo;
  Store.seedDemoUser();

  gsap.from('.brand', { y:-14, duration:.6, ease:'power3.out' });
  gsap.from('.auth-visual h1', { y:20, duration:.7, delay:.1, ease:'power3.out' });
  gsap.from('.auth-visual p', { y:16, duration:.7, delay:.2, ease:'power3.out' });
  gsap.from('.loop-list li', { x:-14, duration:.5, stagger:.12, delay:.3, ease:'power2.out' });
  gsap.from('.auth-card > *', { y:16, duration:.5, stagger:.06, delay:.15, ease:'power2.out' });

  const $ = id => document.getElementById(id);
  const errBox = $('auth-error');
  let mode = 'login';

  function showErr(msg){ errBox.textContent = msg; errBox.style.display = 'block'; gsap.from(errBox, { y:-6, duration:.25 }); return false; }
  function clearErr(){ errBox.style.display = 'none'; errBox.textContent = ''; }

  function setMode(m){
    mode = m; clearErr();
    const isReg = m === 'register';
    $('name-wrap').style.display = isReg ? 'block' : 'none';
    $('login-extra').style.display = isReg ? 'none' : 'flex';
    $('auth-overline').textContent = isReg ? 'Get started' : 'Welcome back';
    $('auth-title').textContent = isReg ? 'Create your account' : 'Sign in to continue';
    $('auth-sub').textContent = isReg ? 'Start building your personalized learning profile.' : 'Access your personalized Computer Networks learning profile.';
    $('login-btn').textContent = isReg ? 'Create account' : 'Sign in';
    $('toggle-text').textContent = isReg ? 'Already have an account?' : 'New to SynapseEDU?';
    $('auth-toggle').textContent = isReg ? 'Sign in' : 'Create an account';
    $('password').setAttribute('autocomplete', isReg ? 'new-password' : 'current-password');
    if (isReg) { $('email').value = ''; $('password').value = ''; if ($('name')) $('name').value = ''; }
    else { $('email').value = 'demo@synapse.edu'; $('password').value = 'demo1234'; if ($('name')) $('name').value = ''; }
    $(isReg && $('name') ? 'name' : 'email').focus();
  }

  $('auth-toggle').addEventListener('click', e => { e.preventDefault(); setMode(mode === 'login' ? 'register' : 'login'); });

  async function submit(btn){
    clearErr();
    const email = $('email').value.trim();
    const password = $('password').value;
    const name = $('name') ? $('name').value.trim() : '';
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return showErr('Please enter a valid email address.');
    if (!password) return showErr('Please enter your password.');
    if (mode === 'register' && password.length < 6) return showErr('Password must be at least 6 characters.');

    const original = btn.innerHTML;
    btn.disabled = true; btn.innerHTML = mode === 'register' ? 'Creating…' : 'Signing in…';
    try {
      if (mode === 'register') await API.register(name, email, password);
      else await API.login(email, password);
      location.href = 'dashboard.html';
    } catch (e) {
      showErr(e.message || 'Something went wrong. Please try again.');
      btn.disabled = false; btn.innerHTML = original;
    }
  }

  $('login-form').addEventListener('submit', e => { e.preventDefault(); submit($('login-btn')); });

  $('demo-btn').addEventListener('click', async e => {
    clearErr();
    const btn = e.currentTarget; const o = btn.innerHTML; btn.disabled = true; btn.innerHTML = 'Loading…';
    try { await API.login('demo@synapse.edu', 'demo1234'); location.href = 'dashboard.html'; }
    catch (err) { showErr('Demo login failed. Please try again.'); btn.disabled = false; btn.innerHTML = o; }
  });
})();
