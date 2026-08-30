/* global Layout, UI, API, Store, DEMO, Mastery, gsap */
/* AI Tutor — grounded in the uploaded material */
(async function(){
  const topicId = new URLSearchParams(location.search).get('topic') || 't5';
  Layout.mount('tutor', { title:'AI Tutor', crumb:'Answers grounded in your study material' });
  const el = document.getElementById('page-content');
  const t = DEMO.topics.find(x=>x.id===topicId) || DEMO.topics[4];

  const suggestions = {
    t5:['What is the difference between flow control and congestion control?','What is the congestion window (cwnd)?','How does TCP detect congestion?'],
    t6:['Explain additive increase and multiplicative decrease','Why is the decrease multiplicative?','What causes the TCP sawtooth?'],
    default:['Summarize this topic for me','Give me a simple example','What are the key definitions I should know?']
  };
  const sug = suggestions[topicId] || suggestions.default;

  el.innerHTML = `
    <div class="tutor-layout">
      <div class="s-card p-0 chat-panel">
        <div class="chat-head">
          <div class="ai-avatar">${UI.icons.tutor}</div>
          <div class="flex-grow-1">
            <div class="fw-semibold">SynapseEDU Tutor</div>
            <select id="topic-select" class="form-select form-select-sm mt-1" style="max-width:260px" data-testid="tutor-topic">
              ${DEMO.topics.map(x=>`<option value="${x.id}" ${x.id===topicId?'selected':''}>${UI.esc(x.name)}</option>`).join('')}
            </select>
          </div>
          <span class="grounded-badge">${UI.icons.spark} Grounded in your material</span>
        </div>
        <div class="chat-body" id="chat-body" aria-live="polite">
          <div class="msg ai"><div class="mini-av">${UI.icons.logo}</div>
            <div><div class="bub">Hi ${UI.esc(Store.user.name.split(' ')[0])} 👋 I'm your tutor for <strong>${UI.esc(t.name)}</strong>. I answer using <strong>your uploaded ${UI.esc(DEMO.subject.name)} material</strong> — not generic internet knowledge. Ask me anything, or try a suggested question.</div></div>
          </div>
        </div>
        <div class="chat-input">
          <textarea id="chat-text" class="form-control" rows="1" placeholder="Ask about ${UI.esc(t.name)}…" data-testid="tutor-input"></textarea>
          <button class="btn btn-primary btn-pill px-3" id="send-btn" data-testid="tutor-send">Send</button>
        </div>
      </div>

      <div>
        <div class="s-card mb-3">
          <div class="overline mb-2">Suggested questions</div>
          <div id="suggests">${sug.map(q=>`<button class="suggest-q" data-q="${UI.esc(q)}">${UI.esc(q)}</button>`).join('')}</div>
        </div>
        <div class="s-card source-doc-card">
          <div class="overline mb-2">Source material</div>
          <div class="d-flex align-items-center gap-2">
            <span style="color:#1D4ED8">${UI.icons.material}</span>
            <div><div class="small fw-semibold mono">${UI.esc(DEMO.subject.material)}</div><div class="text-muted-2" style="font-size:.72rem">Retrieval-augmented context</div></div>
          </div>
        </div>
      </div>
    </div>`;

  const body = document.getElementById('chat-body');
  const input = document.getElementById('chat-text');
  let currentTopic = topicId;

  function pushUser(text){
    body.insertAdjacentHTML('beforeend', `<div class="msg user"><div class="mini-av">${(Store.user.name[0]||'S').toUpperCase()}</div><div class="bub">${UI.esc(text)}</div></div>`);
    body.scrollTop = body.scrollHeight;
    if (body.lastChild) gsap.from(body.lastChild,{y:10,duration:.3});
  }
  function pushTyping(){
    body.insertAdjacentHTML('beforeend', `<div class="msg ai" id="typing"><div class="mini-av">${UI.icons.logo}</div><div class="bub"><span class="typing"><i></i><i></i><i></i></span></div></div>`);
    body.scrollTop = body.scrollHeight;
  }
  function pushAI(res){
    const tp = document.getElementById('typing'); if (tp) tp.remove();
    const sources = (res.sources||[]).map(s=>`<span class="badge-source">${UI.icons.material} ${UI.esc(s)}</span>`).join('');
    body.insertAdjacentHTML('beforeend', `<div class="msg ai"><div class="mini-av">${UI.icons.logo}</div>
      <div><div class="bub">${UI.nl2br(res.answer)}</div>${sources?`<div class="sources">${sources}</div>`:''}</div></div>`);
    body.scrollTop = body.scrollHeight;
    if (body.lastChild) gsap.from(body.lastChild,{y:10,duration:.35});
  }

  async function ask(text){
    if (!text.trim()) return;
    input.value='';
    pushUser(text);
    pushTyping();
    const res = await API.askTutor(currentTopic, text);
    pushAI(res);
  }

  document.getElementById('send-btn').addEventListener('click', ()=>ask(input.value));
  input.addEventListener('keydown', e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); ask(input.value); } });
  document.getElementById('suggests').addEventListener('click', e=>{ const b=e.target.closest('.suggest-q'); if(b) ask(b.dataset.q); });
  document.getElementById('topic-select').addEventListener('change', e=>{ currentTopic=e.target.value; });

  Layout.enter();
})();
