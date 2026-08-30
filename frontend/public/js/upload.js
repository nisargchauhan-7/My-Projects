var { Layout, UI, API, DEMO, gsap } = window;
/* Upload Study Material + AI Processing sequence */
(function(){
  Layout.mount('material', { title:'Study Material', crumb:'Upload → AI processing → topic extraction' });
  const el = document.getElementById('page-content');

  let aiTopics = null;
  renderUpload();

  function renderUpload() {
    el.innerHTML = `
      <div class="row g-4">
        <div class="col-lg-8">
          <div class="s-card">
            <div class="overline mb-1">Step 1 · Upload</div>
            <h3 class="mb-1">Add your study material</h3>
            <p class="text-muted-2 small mb-4">SynapseEDU reads your document, extracts the topics, and builds your personalized learning path. PDF works best.</p>

            <div id="dropzone" data-testid="upload-dropzone"
              style="border:2px dashed #CBD5E1;border-radius:16px;padding:48px 24px;text-align:center;cursor:pointer;transition:.2s;background:#FBFCFF">
              <div id="dz-icon" style="width:64px;height:64px;border-radius:16px;margin:0 auto 16px;display:grid;place-items:center;background:#EFF4FF;color:#1D4ED8">
                ${UI.icons.material}
              </div>
              <div class="fw-semibold" style="font-size:1.05rem">Drag &amp; drop your file here</div>
              <div class="text-muted-2 small mb-3">or click to browse — PDF, PPTX or TXT · up to 20 MB</div>
              <button class="btn btn-primary btn-pill" data-testid="browse-btn">Browse files</button>
              <input type="file" id="file-input" accept=".pdf,.ppt,.pptx,.txt" hidden>
            </div>

            <div class="d-flex align-items-center gap-2 mt-3 text-muted-2 small">
              ${UI.icons.spark}
              <span>No file handy? <a href="#" id="use-demo" data-testid="use-demo-file">Use the sample Computer Networks PDF</a></span>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="s-card" style="background:linear-gradient(180deg,#FBFCFF,#F3F7FF);border-color:#DBE4FF">
            <div class="overline mb-2">The learning loop</div>
            ${['Upload material','Understand & extract','Learn & assess','Detect weak areas','Targeted revision'].map((s,i)=>`
              <div class="d-flex align-items-center gap-3 py-2">
                <span class="mono fw-bold" style="width:26px;height:26px;border-radius:8px;display:grid;place-items:center;background:#fff;border:1px solid #C7D2FE;color:#1D4ED8;font-size:.78rem">${i+1}</span>
                <span class="small fw-semibold">${s}</span>
              </div>`).join('')}
          </div>
        </div>
      </div>`;

    const dz = document.getElementById('dropzone');
    const input = document.getElementById('file-input');
    dz.addEventListener('click', ()=>input.click());
    document.querySelector('[data-testid="browse-btn"]').addEventListener('click', e=>{ e.stopPropagation(); input.click(); });
    input.addEventListener('change', ()=>{ if(input.files[0]) startProcessing(input.files[0]); });
    document.getElementById('use-demo').addEventListener('click', e=>{ e.preventDefault(); startProcessing({ name: DEMO.subject.material, size: 1148972 }); });
    ['dragover','dragenter'].forEach(ev=>dz.addEventListener(ev, e=>{ e.preventDefault(); dz.style.borderColor='#1D4ED8'; dz.style.background='#EFF4FF'; }));
    ['dragleave','drop'].forEach(ev=>dz.addEventListener(ev, e=>{ e.preventDefault(); dz.style.borderColor='#CBD5E1'; dz.style.background='#FBFCFF'; }));
    dz.addEventListener('drop', e=>{ if(e.dataTransfer.files[0]) startProcessing(e.dataTransfer.files[0]); });

    Layout.enter();
  }

  function startProcessing(file) {
    aiTopics = null;
    const extractP = API.aiExtract('Transport layer of Computer Networks covering the OSI model, TCP/IP, flow control, routing, congestion control, the AIMD algorithm, slow start and TCP congestion avoidance.').then(t => { aiTopics = t; }).catch(() => {});
    const size = file.size ? (file.size/1024/1024).toFixed(1)+' MB' : '1.1 MB';
    const steps = ['Reading document…','Extracting concepts…','Identifying topics…','Building learning structure…','Preparing assessment…'];
    el.innerHTML = `
      <div class="mx-auto" style="max-width:640px">
        <div class="s-card text-center">
          <div class="overline mb-1">Step 2 · AI Processing</div>
          <div class="position-relative mx-auto mb-3" style="width:96px;height:120px">
            <div style="position:absolute;inset:0;border-radius:12px;background:#EFF4FF;border:1px solid #DBE4FF;display:grid;place-items:center;color:#1D4ED8">${UI.icons.material}</div>
            <div id="scanline" style="position:absolute;left:6px;right:6px;height:3px;top:10px;background:linear-gradient(90deg,transparent,#8B5CF6,transparent);border-radius:4px;box-shadow:0 0 12px #8B5CF6"></div>
          </div>
          <h3 class="mb-1" data-testid="processing-title">Analyzing your material</h3>
          <div class="text-muted-2 small mb-1 mono">${UI.esc(file.name)} · ${size}</div>
          <div id="step-text" class="fw-semibold mt-3" style="color:#7c3aed;min-height:24px">${steps[0]}</div>
          <div class="quiz-progress-track mt-3" style="max-width:360px;margin:0 auto"><span id="proc-bar" style="width:2%"></span></div>
        </div>
      </div>`;

    gsap.to('#scanline', { top:100, duration:1, repeat:-1, yoyo:true, ease:'sine.inOut' });
    let i=0;
    const st = document.getElementById('step-text');
    const bar = document.getElementById('proc-bar');
    const iv = setInterval(()=>{
      i++;
      if (i<steps.length){ st.textContent=steps[i]; bar.style.width=((i+1)/steps.length*100)+'%'; }
      else { clearInterval(iv); bar.style.width='100%';
        st.textContent = 'Finalizing analysis…';
        Promise.race([extractP, new Promise(r => setTimeout(r, 4000))]).then(() => setTimeout(showSummary, 300));
      }
    }, 900);
  }

  function showSummary() {
    const topics = aiTopics ? aiTopics.length : DEMO.topics.length;
    const concepts = DEMO.topics.reduce((a,t)=>a+t.keyConcepts.length+t.definitions.length,0);
    const questions = Object.values(DEMO.questions).reduce((a,q)=>a+q.length,0);
    el.innerHTML = `
      <div class="mx-auto" style="max-width:720px">
        <div class="text-center mb-4">
          <div class="ico green mx-auto" style="width:56px;height:56px;border-radius:16px">${UI.icons.check}</div>
          <h2 class="mt-3 mb-1" data-testid="analysis-complete">Material analyzed</h2>
          <p class="text-muted-2">Your learning path for <strong>${UI.esc(DEMO.subject.name)}</strong> is ready.${aiTopics ? ' <span class="chip ai">'+UI.icons.spark+' Extracted with Gemini</span>' : ''}</p>
        </div>
        <div class="row g-3 mb-4">
          ${[['Topics found',topics,'violet',UI.icons.layers],['Concepts identified',concepts,'blue',UI.icons.spark],['Questions prepared',questions,'amber',UI.icons.quiz],['Learning path','Ready','green',UI.icons.check]]
            .map(([k,v,c,ic])=>`
            <div class="col-6 col-md-3"><div class="s-card text-center summ-card">
              <div class="ico ${c} mx-auto">${ic}</div>
              <div class="stat-value sm" data-testid="summ-${String(k).split(' ')[0].toLowerCase()}">${v}</div>
              <div class="overline mt-1">${k}</div>
            </div></div>`).join('')}
        </div>
        <div class="text-center">
          <a href="topics.html" class="btn btn-primary btn-lg btn-pill px-4" data-testid="explore-topics-btn">Explore topics ${UI.icons.arrow}</a>
        </div>
      </div>`;
    gsap.from('.summ-card', { y:20, scale:.95, duration:.5, stagger:.08, ease:'power3.out' });
  }
})();
