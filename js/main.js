/* ============================================
   ZiXun Ling · Portfolio · Cinematic Edition
   Hero Grid Animation · Scroll Reveal · Detail Overlay
============================================ */

(function () {
  'use strict';

  // ── Elements ──
  const loader       = document.getElementById('loader');
  const loaderProg   = document.getElementById('loaderProgress');
  const heroGrid     = document.getElementById('heroGrid');
  const heroOverlay  = document.getElementById('heroOverlay');
  const gridItems    = heroGrid ? heroGrid.querySelectorAll('.grid-item') : [];
  const navDots      = document.querySelectorAll('.nav-dot');
  const sections     = document.querySelectorAll('.section');
  const revealItems  = document.querySelectorAll('.reveal-item');
  const projectItems = document.querySelectorAll('.project-item');
  const detailOverlay = document.getElementById('detailOverlay');
  const detailBody    = document.getElementById('detailBody');
  const detailClose   = document.getElementById('detailClose');
  const copyWechat    = document.getElementById('copyWechat');
  const heroScroll    = document.querySelector('.hero-scroll');

  // ── Loader & Hero Grid Entrance ──
  let progress = 0;
  const loaderInterval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress > 100) progress = 100;
    loaderProg.style.width = progress + '%';
    if (progress >= 100) {
      clearInterval(loaderInterval);
      setTimeout(() => {
        loader.classList.add('done');
        revealGrid();
      }, 300);
    }
  }, 80);

  function revealGrid() {
    // Staggered grid reveal — center-out rhythm for cinematic feel
    const order = [0, 3, 1, 5, 2, 7, 4, 6, 8]; // asymmetric reveal order
    const staggerBase = 90; // ms between each item
    order.forEach((gridIndex, sequencePos) => {
      const item = gridItems[gridIndex];
      if (item) {
        setTimeout(() => {
          item.classList.add('revealed');
        }, staggerBase * sequencePos);
      }
    });

    // Overlay text reveal after grid is mostly in
    const overlayDelay = staggerBase * order.length * 0.6 + 200;
    setTimeout(() => {
      heroOverlay.classList.add('revealed');
    }, overlayDelay);
  }

  // ── Scroll Down from Hero ──
  if (heroScroll) {
    heroScroll.addEventListener('click', () => {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // ── Navigation Dots: scroll + highlight ──
  navDots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(dot.dataset.target);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Highlight current section
  const allSections = document.querySelectorAll('.section, .hero');
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navDots.forEach((d) => {
            d.classList.toggle('active', d.dataset.target === id);
          });
        }
      });
    },
    { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
  );
  allSections.forEach((s) => sectionObserver.observe(s));

  // ── Scroll Reveal for items ──
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger within group
          const parent = entry.target.parentElement;
          const siblings = parent ? parent.querySelectorAll('.reveal-item') : [];
          const idx = Array.from(siblings).indexOf(entry.target);

          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, idx * 120);

          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );
  revealItems.forEach((item) => revealObserver.observe(item));

  // ── Project Detail Overlay ──
  function openDetail(type, src) {
    detailBody.innerHTML = '';
    let el;

    if (type === 'video') {
      if (/\.(mp4|webm|ogg)$/i.test(src)) {
        el = document.createElement('video');
        el.src = src;
        el.controls = true;
        el.autoplay = true;
      } else {
        // B站 / YouTube iframe
        el = document.createElement('iframe');
        el.src = src;
        el.allow = 'autoplay; encrypted-media';
        el.allowFullscreen = true;
      }
    } else if (type === 'pdf') {
      el = document.createElement('iframe');
      el.src = src;
    } else if (type === 'image') {
      el = document.createElement('img');
      el.src = src;
      el.alt = 'Project preview';
    }

    if (el) {
      detailBody.appendChild(el);
      detailOverlay.classList.add('open');
      detailOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDetail() {
    detailOverlay.classList.remove('open');
    detailOverlay.setAttribute('aria-hidden', 'true');
    detailBody.innerHTML = '';
    document.body.style.overflow = '';
  }

  projectItems.forEach((item) => {
    item.addEventListener('click', () => {
      const type = item.dataset.type;
      const src  = item.dataset.src;
      if (type && src) openDetail(type, src);
    });
  });

  if (detailClose) detailClose.addEventListener('click', closeDetail);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && detailOverlay.classList.contains('open')) closeDetail();
  });

  // ── WeChat Copy ──
  if (copyWechat) {
    copyWechat.addEventListener('click', () => {
      const text = copyWechat.querySelector('.contact-value').textContent.trim();
      navigator.clipboard?.writeText(text).then(() => {
        const tip = copyWechat.querySelector('.contact-copy-tip');
        tip.textContent = '✓ Copied';
        tip.classList.add('copied');
        setTimeout(() => {
          tip.textContent = 'Click to copy';
          tip.classList.remove('copied');
        }, 2000);
      }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (_) {}
        document.body.removeChild(ta);
      });
    });
  }

  // ── Hero Grid Hover Motion (subtle 3D tilt) ──
  gridItems.forEach((item) => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      item.style.transform = `scale(1.02) perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
    });
  });

})();
