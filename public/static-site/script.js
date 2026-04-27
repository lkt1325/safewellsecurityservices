/* =========================================================
   SAFEWELL — Vanilla JS
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Year ----------
  document.getElementById('year').textContent = new Date().getFullYear();

  // ---------- Header scroll state ----------
  const header = document.getElementById('siteHeader');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 30);
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Mobile nav ----------
  const burger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    nav.classList.toggle('open');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('open'); nav.classList.remove('open');
  }));

  // ---------- Active nav link by section ----------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => sectionObs.observe(s));

  // ---------- Reveal on scroll ----------
  const revealEls = document.querySelectorAll('.reveal, .reveal-left');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el, i) => {
    el.style.transitionDelay = (i % 6) * 60 + 'ms';
    revealObs.observe(el);
  });

  // ---------- Counters ----------
  const counters = document.querySelectorAll('.num');
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const duration = 1600;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countObs.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(c => countObs.observe(c));

  // ---------- Service card spotlight ----------
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
    });
  });

  // ---------- Slider ----------
  const slidesEl = document.getElementById('slides');
  const slides = slidesEl.querySelectorAll('.slide');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('dots');
  let idx = 0, autoTimer;

  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    b.addEventListener('click', () => goTo(i, true));
    dotsWrap.appendChild(b);
  });
  const dots = dotsWrap.querySelectorAll('button');

  function goTo(n, manual) {
    idx = (n + slides.length) % slides.length;
    slidesEl.style.transform = `translateX(-${idx * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    slides.forEach((s, i) => s.classList.toggle('active', i === idx));
    if (manual) restartAuto();
  }
  function restartAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(idx + 1), 4000);
  }
  prevBtn.addEventListener('click', () => goTo(idx - 1, true));
  nextBtn.addEventListener('click', () => goTo(idx + 1, true));

  // Touch swipe
  let startX = 0;
  slidesEl.addEventListener('touchstart', e => startX = e.touches[0].clientX, { passive: true });
  slidesEl.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) goTo(idx + (dx < 0 ? 1 : -1), true);
  });

  goTo(0);
  restartAuto();

  // ---------- Contact form ----------
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (!data.name || !data.email) {
      status.textContent = '⚠️  Please add your name and email.';
      status.style.color = '#ff6b6b';
      return;
    }
    status.style.color = '#FFD700';
    status.textContent = '✓ Thanks ' + data.name.split(' ')[0] + '! Our team will reach out within 24 hours.';
    form.reset();
  });

  // ---------- Custom cursor ----------
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (window.matchMedia('(min-width: 901px)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`; });
    const animateRing = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateRing);
    };
    animateRing();
    document.querySelectorAll('a, button, input, textarea, select').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('grow'));
      el.addEventListener('mouseleave', () => ring.classList.remove('grow'));
    });
  }

  // ---------- Hero parallax ----------
  const heroBg = document.querySelector('.hero-bg');
  document.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight && heroBg) {
      heroBg.style.transform = `translateY(${y * 0.25}px) scale(1.12)`;
    }
  }, { passive: true });

  // ---------- Particle background ----------
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let W, H, particles;
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    const count = Math.min(70, Math.floor(W * H / 22000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.6 + 0.4,
    }));
  }
  function tick() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(255,215,0,0.6)';
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    });
    // Connect lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          ctx.strokeStyle = `rgba(255,215,0,${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  }
  window.addEventListener('resize', resize);
  resize(); tick();

});
