const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---- custom cursor ---- */
const dot = document.getElementById('cursorDot');
if (dot) {
  let mx=0,my=0,dx=0,dy=0;
  window.addEventListener('mousemove', e=>{mx=e.clientX;my=e.clientY;});
  function loopCursor(){
    dx += (mx-dx)*0.18; dy += (my-dy)*0.18;
    dot.style.left = dx+'px'; dot.style.top = dy+'px';
    requestAnimationFrame(loopCursor);
  }
  loopCursor();
  document.querySelectorAll('a, .g-item, .badge, .mbtn').forEach(el=>{
    el.addEventListener('mouseenter', ()=>dot.classList.add('grow'));
    el.addEventListener('mouseleave', ()=>dot.classList.remove('grow'));
  });
}

/* ---- nav scroll state ---- */
const nav = document.getElementById('siteNav');
const progressBar = document.getElementById('progressBar');
if (nav) {
  window.addEventListener('scroll', ()=>{
    nav.classList.toggle('scrolled', window.scrollY > 60);
    if (progressBar) {
      const h = document.documentElement;
      const pct = (h.scrollTop)/(h.scrollHeight - h.clientHeight)*100;
      progressBar.style.width = pct+'%';
    }
  });
}

/* ---- active nav link by current page ---- */
(function(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(l=>{
    const href = l.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      l.classList.add('active');
    }
  });
})();

/* mobile nav toggle */
const navToggle = document.getElementById('navToggle');
const navLinksWrap = document.getElementById('navLinks');
if (navToggle && navLinksWrap) {
  navToggle.addEventListener('click', ()=>{
    navToggle.classList.toggle('open');
    navLinksWrap.classList.toggle('open');
  });
  navLinksWrap.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>{
    navToggle.classList.remove('open');
    navLinksWrap.classList.remove('open');
  }));
}

/* ---- hero parallax on scroll + mouse ---- */
const heroMedia = document.getElementById('heroMedia');
if (heroMedia) {
  const heroImg = heroMedia.querySelector('img');
  window.addEventListener('scroll', ()=>{
    const y = window.scrollY;
    heroMedia.style.transform = `translateY(${y*0.35}px)`;
  });
  const heroEl = document.querySelector('.hero');
  if (heroEl && heroImg) {
    heroEl.addEventListener('mousemove', e=>{
      const r = e.currentTarget.getBoundingClientRect();
      const px = (e.clientX - r.left)/r.width - 0.5;
      const py = (e.clientY - r.top)/r.height - 0.5;
      heroImg.style.transform = `scale(1.08) translate(${px*-16}px, ${py*-10}px)`;
    });
  }
}

/* ---- reveal band letter-by-letter reveal driven by scroll ---- */
const revealWordEl = document.getElementById('revealWord');
const revealBand = document.getElementById('revealBand');
if (revealWordEl && revealBand) {
  const text = revealWordEl.textContent;
  revealWordEl.innerHTML = text.split('').map(ch=>`<span class="r-chunk">${ch===' '?'&nbsp;':ch}</span>`).join('');
  const chunks = revealWordEl.querySelectorAll('.r-chunk');

  function updateReveal(){
    const rect = revealBand.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height + vh;
    const progressed = Math.min(Math.max((vh - rect.top)/total, 0), 1);
    const n = chunks.length;
    chunks.forEach((c,i)=>{
      const start = i/n;
      const end = start + 1/n*2.2;
      let local = (progressed - start)/(end-start);
      local = Math.min(Math.max(local,0),1);
      c.style.opacity = (0.08 + local*0.92).toFixed(2);
    });
  }
  window.addEventListener('scroll', updateReveal);
  updateReveal();
}

/* ---- fade up on scroll ---- */
const fxEls = document.querySelectorAll('.fx');
if (fxEls.length) {
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  },{threshold:0.15});
  fxEls.forEach(el=>io.observe(el));
}

/* ---- gallery tilt on mouse move ---- */
document.querySelectorAll('.g-item').forEach(item=>{
  item.addEventListener('mousemove', e=>{
    const r = item.getBoundingClientRect();
    const px = (e.clientX - r.left)/r.width - 0.5;
    const py = (e.clientY - r.top)/r.height - 0.5;
    const img = item.querySelector('img');
    img.style.transform = `scale(1.08) translate(${px*-8}px, ${py*-8}px)`;
  });
  item.addEventListener('mouseleave', ()=>{
    item.querySelector('img').style.transform = '';
  });
});

/* ---- lightbox ---- */
const galleryItems = Array.from(document.querySelectorAll('.g-item'));
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
if (lightbox && lightboxImg && galleryItems.length) {
  let lbIndex = 0;
  function openLightbox(i){
    lbIndex = i;
    lightboxImg.src = galleryItems[i].dataset.full;
    lightbox.classList.add('open');
  }
  galleryItems.forEach((item,i)=>{
    item.addEventListener('click', ()=>openLightbox(i));
  });
  const lbClose = document.getElementById('lightboxClose');
  if (lbClose) lbClose.addEventListener('click', ()=>lightbox.classList.remove('open'));
  lightbox.addEventListener('click', e=>{ if(e.target===lightbox) lightbox.classList.remove('open'); });
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  if (lbPrev) lbPrev.addEventListener('click', e=>{
    e.stopPropagation();
    lbIndex = (lbIndex - 1 + galleryItems.length)%galleryItems.length;
    lightboxImg.src = galleryItems[lbIndex].dataset.full;
  });
  if (lbNext) lbNext.addEventListener('click', e=>{
    e.stopPropagation();
    lbIndex = (lbIndex + 1)%galleryItems.length;
    lightboxImg.src = galleryItems[lbIndex].dataset.full;
  });
  window.addEventListener('keydown', e=>{
    if(!lightbox.classList.contains('open')) return;
    if(e.key==='Escape') lightbox.classList.remove('open');
    if(e.key==='ArrowRight' && lbNext) lbNext.click();
    if(e.key==='ArrowLeft' && lbPrev) lbPrev.click();
  });
}

/* ---- magnetic button ---- */
document.querySelectorAll('.mbtn').forEach(btn=>{
  btn.addEventListener('mousemove', e=>{
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width/2;
    const y = e.clientY - r.top - r.height/2;
    btn.style.transform = `translate(${x*0.18}px, ${y*0.35}px)`;
  });
  btn.addEventListener('mouseleave', ()=>{ btn.style.transform=''; });
});

/* ---- level tabs (events page) ---- */
document.querySelectorAll('.tab-row').forEach(row=>{
  const btns = row.querySelectorAll('.tab-btn');
  btns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const target = btn.dataset.tab;
      btns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-panel').forEach(p=>{
        p.classList.toggle('active', p.id === target);
      });
    });
  });
});
