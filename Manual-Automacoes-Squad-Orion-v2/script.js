document.addEventListener('DOMContentLoaded', () => {

  /* ============ MOBILE SIDEBAR ============ */
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const menuToggle = document.getElementById('menuToggle');

  function openSidebar(){ sidebar.classList.add('open'); overlay.classList.add('show'); }
  function closeSidebar(){ sidebar.classList.remove('open'); overlay.classList.remove('show'); }

  menuToggle?.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });
  overlay?.addEventListener('click', closeSidebar);

  document.querySelectorAll('.sidebar a, .sidebar .nav-link').forEach(el=>{
    el.addEventListener('click', () => { if(window.innerWidth <= 980) closeSidebar(); });
  });

  /* ============ NAV LINK SCROLL (top-level groups) ============ */
  document.querySelectorAll('.nav-link[data-target]').forEach(link => {
    link.addEventListener('click', () => {
      const target = document.getElementById(link.dataset.target);
      if(target){ target.scrollIntoView({behavior:'smooth', block:'start'}); }
    });
    link.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); link.click(); }
    });
    link.setAttribute('tabindex','0');
    link.setAttribute('role','button');
  });

  /* ============ ACTIVE NAV ON SCROLL ============ */
  const sections = Array.from(document.querySelectorAll('main .section'));
  const navLinks = Array.from(document.querySelectorAll('.nav-link[data-target]'));
  const subLinks = Array.from(document.querySelectorAll('.side-sub a'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const id = entry.target.id;
        navLinks.forEach(l => l.classList.toggle('active', l.dataset.target === id));
      }
    });
  }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });
  sections.forEach(s => observer.observe(s));

  const subTargets = subLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const subObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const id = '#' + entry.target.id;
        subLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
      }
    });
  }, { rootMargin: '-10% 0px -75% 0px', threshold: 0 });
  subTargets.forEach(t => subObserver.observe(t));

  /* ============ READING PROGRESS BAR ============ */
  const progressBar = document.getElementById('progressBar');
  function updateProgress(){
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (scrolled / max) * 100 : 0;
    if(progressBar) progressBar.style.width = pct.toFixed(1) + '%';

    const backTop = document.getElementById('backTop');
    if(backTop) backTop.classList.toggle('show', scrolled > 500);
  }
  document.addEventListener('scroll', updateProgress, { passive:true });
  updateProgress();

  document.getElementById('backTop')?.addEventListener('click', () => {
    window.scrollTo({ top:0, behavior:'smooth' });
  });

  /* ============ INTERACTIVE CHECKLIST (localStorage) ============ */
  const checklist = document.getElementById('checklist30');
  if(checklist){
    const STORAGE_KEY = 'orion-checklist-30min';
    let state = {};
    try{ state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }catch(e){ state = {}; }

    function applyState(){
      checklist.querySelectorAll('li').forEach(li => {
        const key = li.dataset.key;
        li.classList.toggle('done', !!state[key]);
      });
    }
    applyState();

    checklist.addEventListener('click', (e) => {
      const li = e.target.closest('li');
      if(!li) return;
      const key = li.dataset.key;
      state[key] = !state[key];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      applyState();
    });

    document.getElementById('resetChecklist')?.addEventListener('click', () => {
      state = {};
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      applyState();
    });
  }

  /* ============ ACCORDIONS ============ */
  document.querySelectorAll('.acc-item').forEach(item => {
    const head = item.querySelector('.acc-head');
    head?.addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });

  /* ============ TABS ============ */
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    const buttons = tabGroup.querySelectorAll('.tab-btn');
    const panels = tabGroup.querySelectorAll('.tab-panel');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        tabGroup.querySelector('#' + btn.dataset.tab)?.classList.add('active');
      });
    });
  });

  /* ============ PINZINHO WATCH WIDGET ============ */
  const watchAvatar = document.getElementById('watchAvatar');
  const watchBubble = document.getElementById('watchBubble');
  const watchText = document.getElementById('watchText');

  const tips = [
    "Já faz 30 minutos? Hora de checar Concierge e Chatbot! 🐧",
    "Fila acima de 20 casos por pessoa? Confira se você é o último recurso disponível.",
    "Cenário 3 com impacto no cliente? Não apague — chame a supervisão.",
    "Mensagem vazia no Chatbot = resposta padrão. Isso não é erro!",
    "Natureza 'Citação' nunca leva sentimento em massa às cegas.",
    "Facebook: não confie na resposta pública, confira sempre a planilha.",
    "Terminou a página do relatório? Não esqueça da tag de revisão final."
  ];
  let tipIndex = 0;

  function showTip(){
    watchText.textContent = tips[tipIndex % tips.length];
    tipIndex++;
    watchBubble.classList.add('show');
  }
  function toggleTip(){
    if(watchBubble.classList.contains('show')){
      watchBubble.classList.remove('show');
    } else {
      showTip();
    }
  }
  watchAvatar?.addEventListener('click', toggleTip);
  watchAvatar?.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggleTip(); }
  });

  // auto-peek once after a short delay to invite interaction
  setTimeout(() => { showTip(); setTimeout(()=>watchBubble.classList.remove('show'), 6000); }, 2500);

});
