const apps={
  projects:{title:'Projects.app',body:`<h3>Selected work</h3><p>Products built from concept to deployed experience.</p><article class="project"><h4>Ora Jewellers</h4><span class="tag">Full development</span><span class="tag">Jewellery</span><span class="tag">Responsive web</span><p>A complete jewellery website experience, developed end to end with a refined product presentation and a customer-facing browsing flow.</p><a href="https://orajweles.lovable.app/" target="_blank" rel="noreferrer noopener">Visit project ↗</a></article><article class="project"><h4>3D Interactive Website</h4><span class="tag">3D web</span><span class="tag">Interactive UI</span><span class="tag">Recorded demo</span><p>An experimental interactive 3D web experience. The project is complete; a screen recording is available while its public deployment is pending.</p><video class="project-video" controls preload="metadata"><source src="assets/videos/3d-interactive-website-demo.mp4" type="video/mp4" />Your browser does not support this video.</video><span class="tag">Not publicly deployed</span></article><article class="project"><h4>Mahalaxmi Jewellers</h4><span class="tag">MERN</span><span class="tag">E-commerce</span><span class="tag">Real-time catalog</span><p>Full-stack jewellery e-commerce experience with category filtering, authentication, cart, product detail pages, multiple checkout options, responsive motion, and WhatsApp click-to-chat.</p><a href="https://mahalaxmi-jwellers-owb2-ivory.vercel.app/" target="_blank" rel="noreferrer noopener">Visit live site ↗</a></article><article class="project"><h4>SmartChef</h4><span class="tag">AI integration</span><span class="tag">REST APIs</span><p>AI-driven recipe recommendations shaped by mood, dietary preferences, and available ingredients to suggest personalised meals in real time.</p></article><article class="project"><h4>StudyMentor</h4><span class="tag">SaaS</span><span class="tag">AI mentorship</span><p>AI-powered study-planning product with adaptive learning logic that adjusts content difficulty and pacing around individual progress.</p></article>`},
  skills:{title:'Skills.app',body:`<h3>Technical toolkit</h3><p>Comfortable moving across product, interface, API, data, and deployment work.</p><div class="skill-list">${['JavaScript (ES6+)','React.js','Next.js','Node.js','Express.js','MongoDB','Mongoose ODM','REST APIs','Tailwind CSS','HTML5','CSS3','Python','C++','NumPy','Pandas','GCP','AWS Gen AI','Git & GitHub'].map(x=>`<span class="tag">${x}</span>`).join('')}</div><h3 style="margin-top:30px">Learning direction</h3><p>Machine-learning fundamentals, cloud-native development, and practical AI systems.</p>`},
  proof:{title:'Proof.app',body:`<h3>What I bring</h3><div class="project"><h4>End-to-end product thinking</h4><p>From early idea through polished, deployed, user-facing web applications.</p></div><div class="project"><h4>Data-aware decisions</h4><p>Google Data Analytics training informs feature choices and UX iteration.</p></div><div class="project"><h4>Practical AI integration</h4><p>Building AI-enabled product experiences without losing sight of usability and scale.</p></div><div class="project"><h4>Cloud foundations</h4><p>Training across Google Cloud and AWS Generative AI, alongside hands-on development practice.</p></div><p><small>Claims based on Rohan Hiremathswami’s supplied résumé; no unverified user-growth metric is shown.</small></p>`},
  founder:{title:'Founder.txt',body:`<div class="founder-layout"><div class="founder-avatar-card"><div class="avatar-wrapper"><img src="assets/portraits/rohan-avatar.png" alt="Rohan Hiremathswami Avatar" class="founder-avatar-img" /><span class="avatar-online-dot"></span></div><div class="avatar-info"><h4>Rohan Hiremathswami</h4><p class="avatar-title">Full-Stack & AI Developer</p><span class="avatar-location">📍 Kolhapur, IN</span><a href="https://www.linkedin.com/in/rohan-hiremathswami" target="_blank" rel="noreferrer noopener" class="avatar-btn">LinkedIn Profile ↗</a><a href="https://github.com/hiremathswami" target="_blank" rel="noreferrer noopener" class="avatar-btn secondary">GitHub ⌘</a></div></div><div class="founder-details"><div class="gen-header"><span class="gen-badge" id="aiStreamBadge">🟢 CHATGPT AI // STREAMING RESPONSE...</span><span class="click-hint">Click text block to regenerate ↺</span></div><h3 class="gen-target" data-full="Building in public, learning in depth."></h3><p class="gen-target" data-full="I’m Rohan Hiremathswami, a BCA Computer Science student and full-stack developer from Kolhapur. I build web products that combine strong product thinking with modern web engineering."></p><p class="gen-target" data-full="My work spans AI-powered SaaS concepts, e-commerce experiences, and interactive applications built with the MERN stack. I’m currently deepening my machine-learning and cloud knowledge while seeking internships and collaborative projects where I can contribute real value."></p><div class="founder-stats-grid"><div class="stat-box"><b>DEGREE</b><span>BCA Computer Science</span></div><div class="stat-box"><b>CORE STACK</b><span>MERN + Python</span></div><div class="stat-box"><b>FOCUS AREA</b><span>Full-Stack + AI</span></div></div></div></div>`},
  whiteboard:{title:'Whiteboard.app',body:`<h3>Leave a note</h3><p>Stored only in this browser on this device.</p><form class="note-form" id="noteForm"><input id="noteInput" maxlength="160" required placeholder="A project idea, collaboration note, or hello…" aria-label="New note" /><button>Add note</button></form><ul class="notes" id="notes"></ul>`}
};

const layer=document.querySelector('#windowLayer'),template=document.querySelector('#windowTemplate');

function openApp(key){
  const app=apps[key];if(!app)return;
  layer.innerHTML='';
  layer.classList.remove('closing');
  const node=template.content.cloneNode(true);
  node.querySelector('h2').textContent=app.title;
  node.querySelector('.window-body').innerHTML=app.body;
  node.querySelector('.close').addEventListener('click',closeApp);
  layer.append(node);
  
  // Trigger smooth enter transition
  requestAnimationFrame(()=>{
    layer.classList.add('active');
    node.querySelector('.close')?.focus();
  });

  if(key==='whiteboard')setupNotes();
  // Apply ChatGPT stream animation across ALL app sections
  initGeneratingText(layer);
}

function closeApp(){
  layer.classList.add('closing');
  setTimeout(()=>{
    layer.classList.remove('active');
    layer.classList.remove('closing');
    layer.innerHTML='';
  }, 220);
}

document.addEventListener('click',e=>{
  const b=e.target.closest('[data-open]');
  if(b)openApp(b.dataset.open);
  if(e.target===layer)closeApp();
});

document.addEventListener('keydown',e=>{
  if(e.key==='Escape')closeApp();
});

const clock=document.querySelector('#clock');
function tick(){
  clock.textContent=new Intl.DateTimeFormat('en-IN',{hour:'2-digit',minute:'2-digit',hour12:true,timeZone:'Asia/Kolkata'}).format(new Date())+' IST';
}
tick();
setInterval(tick,30000);

document.querySelector('#themeToggle').addEventListener('click',()=>{
  document.body.classList.toggle('night');
  localStorage.setItem('rohan-os-theme-v1',document.body.classList.contains('night')?'night':'day');
});
if(localStorage.getItem('rohan-os-theme-v1')==='night')document.body.classList.add('night');

function setupNotes(){
  const list=document.querySelector('#notes'),input=document.querySelector('#noteInput'),form=document.querySelector('#noteForm');
  let notes=[];
  try{notes=JSON.parse(localStorage.getItem('rohan-os-whiteboard-v1')||'[]')}catch{}
  const render=()=>list.innerHTML=notes.map((n,i)=>`<li>${escapeHtml(n)} <button aria-label="Delete note" data-delete="${i}">×</button></li>`).join('');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    notes.unshift(input.value.trim());
    localStorage.setItem('rohan-os-whiteboard-v1',JSON.stringify(notes));
    input.value='';
    render();
  });
  list.addEventListener('click',e=>{
    const i=e.target.dataset.delete;
    if(i!==undefined){
      notes.splice(i,1);
      localStorage.setItem('rohan-os-whiteboard-v1',JSON.stringify(notes));
      render();
    }
  });
  render();
}

function escapeHtml(value){const d=document.createElement('div');d.textContent=value;return d.innerHTML}

/* Global ChatGPT-style Token Streaming Animation Engine across all sections */
function initGeneratingText(container){
  // Select all headings, paragraphs, and cards in the opened window
  let targets = Array.from(container.querySelectorAll('.gen-target, .window-body > h3, .window-body > p, .project h4, .project > p'));
  
  targets = targets.filter(el => {
    const text = el.getAttribute('data-full') || el.textContent.trim();
    return text.length > 0 && !el.querySelector('video') && !el.querySelector('input') && !el.querySelector('button');
  });

  const badge = container.querySelector('#aiStreamBadge');
  if(badge) badge.textContent = '🟢 CHATGPT AI // STREAMING RESPONSE...';

  // Pre-process and clear text upfront to prevent flash rendering
  targets.forEach(el => {
    if(!el.getAttribute('data-full')){
      el.setAttribute('data-full', el.textContent.trim());
    }
    el.textContent = '';
    el.title = 'Click to regenerate AI response';
    el.classList.add('clickable-text');
  });

  let currentIdx = 0;
  function streamNext(){
    if(currentIdx < targets.length){
      const el = targets[currentIdx];
      const fullText = el.getAttribute('data-full');
      
      // Allow single element re-stream on click
      el.onclick = (e) => {
        e.stopPropagation();
        streamChatGPTTokenText(el, fullText);
      };
      
      streamChatGPTTokenText(el, fullText, () => {
        currentIdx++;
        setTimeout(streamNext, 70);
      });
    } else {
      if(badge) badge.textContent = '✓ STREAM COMPLETE';
    }
  }

  setTimeout(streamNext, 80);
}

function streamChatGPTTokenText(el, text, onComplete){
  if(!text) return;
  if(el._streamTimer) clearTimeout(el._streamTimer);
  el.textContent = '';
  el.classList.add('is-generating');
  
  // Split into words and tokens
  const words = text.match(/\S+|\s+/g) || [text];
  let tokenIdx = 0;
  
  const cursor = document.createElement('span');
  cursor.className = 'chatgpt-cursor';
  cursor.textContent = '▋';
  el.appendChild(cursor);
  
  function step(){
    if(tokenIdx < words.length){
      const token = words[tokenIdx];
      const span = document.createElement('span');
      span.className = 'chatgpt-token';
      if(token.trim() === ''){
        span.innerHTML = token.replace(/ /g, '&nbsp;');
      } else {
        span.textContent = token;
      }
      cursor.insertAdjacentElement('beforebegin', span);
      tokenIdx++;
      
      // Smooth ChatGPT-style token pacing (~45-75ms per word + sentence pauses)
      let delay = 45 + Math.floor(Math.random() * 30);
      if(token.includes('.') || token.includes('!') || token.includes('?')){
        delay += 280; // micro-pause at sentence boundary
      } else if(token.includes(',') || token.includes(';')){
        delay += 140; // pause at clause break
      }
      
      el._streamTimer = setTimeout(step, delay);
    } else {
      el.classList.remove('is-generating');
      el._streamTimer = null;
      if(onComplete) onComplete();
      setTimeout(()=>{
        cursor.classList.add('fade-out');
        setTimeout(()=>cursor.remove(), 400);
      }, 700);
    }
  }
  
  step();
}




