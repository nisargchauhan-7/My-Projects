/* global Layout, UI, API, Store, DEMO, Mastery, gsap */
/* Quiz interface */
(async function(){
  const topicParam = new URLSearchParams(location.search).get('topic');
  Layout.mount('quiz', { title:'Quiz', crumb:'Test your knowledge · adaptive difficulty' });
  const el = document.getElementById('page-content');

  if (!topicParam) return renderPicker();
  return startQuiz(topicParam);

  async function renderPicker(){
    const topics = await API.topics();
    el.innerHTML = `
      <div class="mx-auto" style="max-width:820px">
        <div class="overline">Choose a topic</div>
        <h2 class="mb-1">Which topic do you want to be tested on?</h2>
        <p class="text-muted-2 mb-4">We recommend starting with your weakest areas — that's where mastery improves fastest.</p>
        <div class="d-flex flex-column gap-2">
          ${topics.sort((a,b)=>a.mastery-b.mastery).map(t=>`
            <div class="topic-item ${t.mastery<50?'weak':''}" data-testid="pick-${t.id}" onclick="location.href='quiz.html?topic=${t.id}'">
              <div class="idx">${String(t.idx).padStart(2,'0')}</div>
              <div class="flex-grow-1"><div class="t-name">${UI.esc(t.name)}</div><div class="t-meta">${(DEMO.questions[t.id]||[]).length} questions · Easy → Hard</div></div>
              <span class="mastery-tag ${Mastery.tagClass(t.mastery)}">${t.mastery}%</span>
              <span style="color:#CBD5E1">${UI.icons.arrow}</span>
            </div>`).join('')}
        </div>
      </div>`;
    Layout.enter();
    gsap.from('.topic-item',{y:14,duration:.4,stagger:.05});
  }

  async function startQuiz(topicId){
    el.innerHTML = `<div class="empty-state">Generating your quiz…</div>`;
    const t = DEMO.topics.find(x=>x.id===topicId);
    const { questions } = await API.quiz(topicId);
    if (!questions.length){ el.innerHTML=`<div class="empty-state">No questions available for this topic yet.</div>`; return; }

    let idx=0; const selections = new Array(questions.length).fill(null);

    function render(){
      const q = questions[idx];
      const dChip = { easy:'chip easy', medium:'chip medium', hard:'chip hard' }[q.d];
      el.innerHTML = `
        <div class="quiz-wrap">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <div><div class="overline">${UI.esc(t.name)}</div></div>
            <span class="${dChip}" data-testid="q-difficulty">${q.d.toUpperCase()}</span>
          </div>
          <div class="quiz-progress-head">
            <span class="q-count" data-testid="q-count">Question ${idx+1} of ${questions.length}</span>
            <span class="q-count">${selections.filter(x=>x!==null).length} answered</span>
          </div>
          <div class="quiz-progress-track mb-4"><span style="width:${(idx)/questions.length*100}%"></span></div>

          <div class="s-card q-card" id="qcard">
            <div class="q-text" data-testid="q-text">${UI.esc(q.text)}</div>
            <div id="opts">
              ${q.options.map((o,i)=>`
                <div class="opt ${selections[idx]===i?'selected':''}" data-i="${i}" data-testid="opt-${i}">
                  <span class="key">${String.fromCharCode(65+i)}</span><span class="opt-text">${UI.esc(o)}</span>
                </div>`).join('')}
            </div>
            <div class="d-flex justify-content-between mt-4">
              <button class="btn btn-outline-slate btn-pill" id="prev-btn" ${idx===0?'disabled':''}>‹ Previous</button>
              <button class="btn btn-primary btn-pill px-4" id="next-btn" data-testid="quiz-next">${idx===questions.length-1?'Submit quiz':'Next ›'}</button>
            </div>
          </div>
        </div>`;

      document.querySelectorAll('.opt').forEach(o=>o.addEventListener('click',()=>{
        selections[idx]=+o.dataset.i;
        document.querySelectorAll('.opt').forEach(x=>x.classList.remove('selected'));
        o.classList.add('selected');
      }));
      document.getElementById('prev-btn').addEventListener('click',()=>{ if(idx>0){ idx--; transition(-1); } });
      document.getElementById('next-btn').addEventListener('click',()=>{
        if (selections[idx]===null){ UI.toast('Select an answer to continue','warn'); return; }
        if (idx < questions.length-1){ idx++; transition(1); } else submit();
      });
      gsap.from('#qcard',{x:20,duration:.4,ease:'power2.out'});
    }
    function transition(dir){ render(); }

    async function submit(){
      el.innerHTML = `<div class="empty-state">Evaluating your answers…</div>`;
      const res = await API.submitQuiz(topicId, questions, selections);
      sessionStorage.setItem('synapse_last_result', JSON.stringify(res));
      location.href='results.html';
    }

    render();
    Layout.enter();
  }
})();
