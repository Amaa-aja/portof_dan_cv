// ---------- Init AOS ----------
AOS.init({ duration: 700, once: true });

// ---------- Helpers ----------
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

// ---------- NAVBAR & MOBILE MENU ----------
const hamburger = $('#hamburger');
const navLinks = $('#nav-links');
const mobileOverlay = $('#mobile-overlay');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('show');
    mobileOverlay.style.display = open ? 'block' : 'none';
    hamburger.setAttribute('aria-expanded', String(open));
    mobileOverlay.setAttribute('aria-hidden', String(!open));
    if (!open) mobileOverlay.style.display = 'none';
  });

  // close when overlay clicked
  mobileOverlay.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('show');
    mobileOverlay.style.display = 'none';
    hamburger.setAttribute('aria-expanded', 'false');
  });

  // close mobile menu on link click
  $$('.nav-link').forEach(a => a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('show');
    mobileOverlay.style.display = 'none';
    hamburger.setAttribute('aria-expanded', 'false');
  }));
}

// ---------- ACTIVE NAV LINK (IntersectionObserver) ----------
const sections = $$('main section[id]');
const navItems = $$('.nav-link');

if ('IntersectionObserver' in window && sections.length) {
  const obsOptions = { root: null, threshold: 0.55 };
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navItems.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
      }
    });
  }, obsOptions);
  sections.forEach(sec => obs.observe(sec));
} else {
  // fallback: simple scroll
  window.addEventListener('scroll', () => {
    let current = sections[0]?.id || '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    navItems.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  });
}

// ---------- TYPED SUBTITLE ----------
(() => {
  const el = $('#typed-role');
  if (!el) return;
  const words = ['API system', 'basic phyton', 'a database', 'How to clear bug'];
  let i = 0, j = 0, forward = true;
  const typeSpeed = 70, pause = 1000;

  function tick(){
    const word = words[i];
    if (forward) {
      j++;
      el.textContent = word.slice(0,j);
      if (j === word.length) { forward = false; setTimeout(tick, pause); return; }
    } else {
      j--;
      el.textContent = word.slice(0,j);
      if (j === 0) { forward = true; i = (i+1) % words.length; }
    }
    setTimeout(tick, forward ? typeSpeed : 30);
  }
  tick();
})();

// ---------- PROJECT FILTER ----------
const filterBtns = $$('.filter-btn');
const projectCards = $$('.project-card');

if (filterBtns.length) {
  filterBtns.forEach(btn => btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const tags = card.dataset.tags?.split(',')?.map(s=>s.trim()) || [];
      if (filter === 'all' || tags.includes(filter)) {
        card.style.display = '';
        card.setAttribute('aria-hidden','false');
      } else {
        card.style.display = 'none';
        card.setAttribute('aria-hidden','true');
      }
    });
  }));
}

// ---------- TILT EFFECT for cards ----------
function attachTilt(card){
  const inner = card.querySelector('.flip-card-inner');
  if(!inner) return;
  const rect = () => card.getBoundingClientRect();

  function onMove(e){
    const r = rect();
    const x = ( (e.clientX ?? (e.touches && e.touches[0].clientX)) - r.left ) / r.width;
    const y = ( (e.clientY ?? (e.touches && e.touches[0].clientY)) - r.top ) / r.height;
    const rotY = (x - 0.5) * 14; // -7..7
    const rotX = (0.5 - y) * 10; // -5..5
    inner.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  }
  function onLeave(){ inner.style.transform = ''; }

  card.addEventListener('mousemove', onMove);
  card.addEventListener('touchmove', onMove, {passive:true});
  card.addEventListener('mouseleave', onLeave);
  card.addEventListener('touchend', onLeave);
}

// initialize tilt for each project-card
projectCards.forEach(attachTilt);

// ---------- FLIP on click for mobile (tap) ----------
projectCards.forEach(card => {
  card.addEventListener('click', (e) => {
    // if clicking a button inside card (like open), don't flip
    if (e.target.closest('.open-project') || e.target.closest('a')) return;
    card.classList.toggle('flipped');
    setTimeout(() => card.classList.remove('flipped'), 4000); // auto reset to avoid stuck
  });
});

// ---------- PROJECT MODAL ----------
const modal = $('#project-modal');
const modalTitle = $('#modal-title');
const modalDesc = $('#modal-desc');
const modalMedia = $('.modal-media') || null;
const openBtns = $$('.open-project');

openBtns.forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    const card = e.target.closest('.project-card');
    if (!card) return;
    const title = card.dataset.title || 'Project';
    const desc = card.dataset.desc || '';
    const img = card.dataset.img || '';

    if (modal && modalTitle && modalDesc) {
      modalTitle.textContent = title;
      modalDesc.textContent = desc;
      if (modalMedia) modalMedia.style.backgroundImage = img ? `url(${img})` : '';
      modal.classList.add('show');
      modal.setAttribute('aria-hidden','false');
    }
  });
});

// close modal
if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.closest('.modal-close')) {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden','true');
    }
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); }
  });
}

// ---------- BACK TO TOP ----------
const backToTop = $('#backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 320) backToTop.style.display = 'flex';
    else backToTop.style.display = 'none';
  });
  backToTop.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
}

// ---------- CONTACT FORM (fake submit) ----------
const form = $('#contact-form');
const toast = $('#toast');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // quick feedback
    toast.textContent = 'Message sent — I will reply soon! ✨';
    toast.style.opacity = '1';
    setTimeout(()=>{ toast.style.opacity = '0'; }, 2600);
    form.reset();
  });
}

// ---------- small polish: current year ----------
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
