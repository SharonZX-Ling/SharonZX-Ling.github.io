/* ============================================
   ZiXun Ling · Portfolio · Cinematic Edition
   Content-Driven: loads content.json for all text
   Hero Grid Animation · Scroll Reveal · Detail Overlay
============================================ */

(function () {
  'use strict';

  // ── Load content ──
  fetch('content.json')
    .then((r) => r.json())
    .then((content) => {
      initHeroText(content.hero);
      initAbout(content.about);
      initInternship(content.internship);
      initProjects(content.projects);
      initOthers(content.others);
      initContact(content.contact);
      initInteractions(content);
    })
    .catch((err) => {
      console.error('Failed to load content.json:', err);
      // Fallback: still init interactions for any pre-rendered HTML
      initInteractions(null);
    });

  // ── Hero text ──
  function initHeroText(hero) {
    if (!hero) return;
    const nameEl = document.querySelector('.hero-name');
    const nameEnEl = document.querySelector('.hero-name-en');
    const roleEl = document.querySelector('.hero-role');
    const taglineEl = document.querySelector('.hero-tagline');
    if (nameEl) nameEl.textContent = hero.name;
    if (nameEnEl) nameEnEl.textContent = hero.nameEn;
    if (roleEl) roleEl.textContent = hero.role;
    if (taglineEl) taglineEl.textContent = hero.tagline;
  }

  // ── About ──
  function initAbout(about) {
    if (!about) return;
    // Bio lines → <p> with <br>
    const leadEl = document.querySelector('.about-lead');
    if (leadEl) leadEl.innerHTML = about.bio.join('<br>');

    // Tags
    const tagsWrap = document.querySelector('.about-tags');
    if (tagsWrap) {
      tagsWrap.innerHTML = '';
      about.tags.forEach((tag) => {
        const span = document.createElement('span');
        span.textContent = tag;
        tagsWrap.appendChild(span);
      });
    }

    // Sidebar
    const sidebar = document.querySelector('.about-sidebar');
    if (sidebar) {
      sidebar.innerHTML = '';
      Object.entries(about.sidebar).forEach(([key, val]) => {
        const detail = document.createElement('div');
        detail.className = 'about-detail';
        detail.innerHTML = `<span class="detail-key">${key}</span><span class="detail-val">${val}</span>`;
        sidebar.appendChild(detail);
      });
    }
  }

  // ── Internship Case Gallery ──
  function initInternship(internship) {
    if (!internship) return;
    const sectionSub = document.querySelector('#internship .section-sub');
    if (sectionSub && internship.subtitle) sectionSub.textContent = internship.subtitle;

    const caseGallery = document.getElementById('caseGallery');
    if (!caseGallery) return;

    internship.items.forEach((item, index) => {
      const article = document.createElement('article');
      article.className = 'case-item reveal-item';
      article.dataset.index = index;

      // ── Header ──
      const header = document.createElement('div');
      header.className = 'case-header';

      const dateEl = document.createElement('div');
      dateEl.className = 'case-date';
      dateEl.textContent = item.date;

      const summary = document.createElement('div');
      summary.className = 'case-summary';

      const company = document.createElement('h3');
      company.className = 'case-company';
      company.textContent = item.company;

      const brief = document.createElement('p');
      brief.className = 'case-brief';
      brief.textContent = item.brief;

      summary.appendChild(company);
      summary.appendChild(brief);

      const toggle = document.createElement('div');
      toggle.className = 'case-toggle';
      toggle.textContent = '+';

      header.appendChild(dateEl);
      header.appendChild(summary);
      header.appendChild(toggle);
      article.appendChild(header);

      // ── Expandable body ──
      const body = document.createElement('div');
      body.className = 'case-body';

      const bodyInner = document.createElement('div');
      bodyInner.className = 'case-body-inner';

      // A. Overview
      if (item.overview) {
        const ov = document.createElement('div');
        ov.className = 'case-overview';

        const blocks = [
          { label: '项目背景', text: item.overview.background },
          { label: '我的职责', text: item.overview.role },
          { label: '项目目标', text: item.overview.goal },
        ];
        blocks.forEach((b) => {
          const blk = document.createElement('div');
          blk.className = 'case-overview-block';
          const h4 = document.createElement('h4');
          h4.textContent = b.label;
          const p = document.createElement('p');
          p.textContent = b.text || '';
          blk.appendChild(h4);
          blk.appendChild(p);
          ov.appendChild(blk);
        });

        bodyInner.appendChild(ov);
      }

      // B. Media showcase
      if (item.media && item.media.length > 0) {
        const mediaWrap = document.createElement('div');
        mediaWrap.className = 'case-media';

        const main = document.createElement('div');
        main.className = 'case-media-main';

        function renderMedia(mediaItem) {
          main.innerHTML = '';
          if (!mediaItem) return;
          if (mediaItem.type === 'youtube' || mediaItem.type === 'bilibili') {
            const iframe = document.createElement('iframe');
            iframe.src = mediaItem.src;
            iframe.allow = 'autoplay; encrypted-media; fullscreen';
            iframe.allowFullscreen = true;
            if (mediaItem.type === 'bilibili') {
              iframe.setAttribute('scrolling', 'no');
              iframe.setAttribute('frameborder', 'no');
              iframe.setAttribute('framespacing', '0');
              iframe.setAttribute('border', '0');
            }
            main.appendChild(iframe);
          } else if (mediaItem.type === 'video') {
            const video = document.createElement('video');
            video.src = mediaItem.src;
            video.controls = true;
            main.appendChild(video);
          } else if (mediaItem.type === 'image') {
            const img = document.createElement('img');
            img.src = mediaItem.src;
            img.alt = mediaItem.label || '';
            main.appendChild(img);
          }
        }

        renderMedia(item.media[0]);
        mediaWrap.appendChild(main);

        // Thumbnails (if more than 1)
        if (item.media.length > 1) {
          const thumbs = document.createElement('div');
          thumbs.className = 'case-media-thumbs';

          item.media.forEach((m, mIdx) => {
            const thumb = document.createElement('div');
            thumb.className = 'case-thumb';
            if (m.type === 'video' || m.type === 'youtube' || m.type === 'bilibili') {
              thumb.classList.add('case-thumb-video');
            }
            if (mIdx === 0) thumb.classList.add('active');

            if (m.thumb) {
              const img = document.createElement('img');
              img.src = m.thumb;
              img.alt = m.label || '';
              thumb.appendChild(img);
            } else if (m.type === 'image') {
              const img = document.createElement('img');
              img.src = m.src;
              img.alt = m.label || '';
              thumb.appendChild(img);
            } else {
              thumb.style.background = 'linear-gradient(135deg, #1A1A2E, #16213E)';
            }

            thumb.addEventListener('click', (e) => {
              e.stopPropagation();
              thumbs.querySelectorAll('.case-thumb').forEach((t) => t.classList.remove('active'));
              thumb.classList.add('active');
              renderMedia(m);
            });

            thumbs.appendChild(thumb);
          });

          mediaWrap.appendChild(thumbs);
        }

        bodyInner.appendChild(mediaWrap);
      }

      // C. Feature Showcase
      if (item.features && item.features.length > 0) {
        const featuresWrap = document.createElement('div');
        featuresWrap.className = 'case-features';

        item.features.forEach((feat) => {
          const featureEl = document.createElement('div');
          featureEl.className = 'case-feature';

          const device = document.createElement('div');
          device.className = 'case-feature-device';

          const video = document.createElement('video');
          video.src = feat.src;
          video.preload = 'metadata';
          video.playsInline = true;
          video.muted = false;
          video.loop = true;

          const overlay = document.createElement('div');
          overlay.className = 'case-feature-overlay';

          const playIcon = document.createElement('div');
          playIcon.className = 'case-feature-play-icon';
          playIcon.textContent = '▶';

          overlay.appendChild(playIcon);
          device.appendChild(video);
          device.appendChild(overlay);

          device.addEventListener('click', () => {
            if (video.paused) {
              featuresWrap.querySelectorAll('.case-feature-device video').forEach((v) => {
                if (v !== video) { v.pause(); v.parentElement.classList.remove('playing'); }
              });
              video.play();
              device.classList.add('playing');
            } else {
              video.pause();
              device.classList.remove('playing');
            }
          });

          video.addEventListener('pause', () => device.classList.remove('playing'));
          video.addEventListener('play', () => device.classList.add('playing'));

          const title = document.createElement('div');
          title.className = 'case-feature-title';
          title.textContent = feat.title;

          featureEl.appendChild(device);
          featureEl.appendChild(title);
          featuresWrap.appendChild(featureEl);
        });

        bodyInner.appendChild(featuresWrap);
      }

      // D. External links
      if (item.links && item.links.length > 0) {
        const linksWrap = document.createElement('div');
        linksWrap.className = 'case-links';

        item.links.forEach((link) => {
          const a = document.createElement('a');
          a.href = link.url;
          a.target = '_blank';
          a.rel = 'noopener';
          a.className = link.type === 'accent' ? 'case-link case-link-accent' : 'case-link case-link-ghost';
          a.textContent = link.label;
          linksWrap.appendChild(a);
        });

        bodyInner.appendChild(linksWrap);
      }

      body.appendChild(bodyInner);
      article.appendChild(body);

      // ── Click to toggle ──
      header.addEventListener('click', () => {
        const isActive = article.classList.contains('active');
        caseGallery.querySelectorAll('.case-item').forEach((c) => c.classList.remove('active'));
        if (!isActive) article.classList.add('active');
      });

      caseGallery.appendChild(article);
    });
  }

  // ── Projects ──
  function initProjects(projects) {
    if (!projects) return;
    const sectionSub = document.querySelector('#projects .section-sub');
    if (sectionSub && projects.subtitle) sectionSub.textContent = projects.subtitle;

    const container = document.querySelector('#projects .project-grid');
    if (!container) return;
    container.className = 'film-portfolio';
    container.innerHTML = '';

    // Gallery color palettes for placeholders
    const palettes = [
      ['#1A1A2E', '#2D1B4E'],
      ['#1A2E1A', '#2E1A1A'],
      ['#2E2A1A', '#1A2E2A'],
      ['#1E1A1A', '#2A1E2A'],
      ['#1A2A3E', '#2D1B2E'],
    ];

    projects.items.forEach((item, index) => {
      const filmCase = document.createElement('div');
      filmCase.className = 'film-case reveal-item';

      // ── Header (clickable cover card) ──
      const header = document.createElement('div');
      if (item.cover) {
        header.className = 'film-case-header';
        header.style.backgroundImage = `url('${item.cover}')`;
      } else {
        header.className = 'film-case-header film-case-header-placeholder';
      }

      const mask = document.createElement('div');
      mask.className = 'film-case-header-mask';

      const content = document.createElement('div');
      content.className = 'film-case-header-content';
      content.innerHTML = `
        <div class="film-case-type">${item.type || ''}</div>
        <h3 class="film-case-title">${item.title}</h3>
        <div class="film-case-meta">
          <div class="film-case-meta-item"><span>Role</span><span>${item.role || ''}</span></div>
          <div class="film-case-meta-item"><span>Duration</span><span>${item.duration || ''}</span></div>
        </div>
      `;

      // Toggle button
      const toggle = document.createElement('div');
      toggle.className = 'film-case-toggle';
      toggle.textContent = '+';

      header.appendChild(mask);
      header.appendChild(content);
      header.appendChild(toggle);

      // ── Expandable Body ──
      const body = document.createElement('div');
      body.className = 'film-case-body';

      const bodyInner = document.createElement('div');
      bodyInner.className = 'film-case-body-inner';

      // 1. Overview
      if (item.intro) {
        const ov = document.createElement('div');
        ov.className = 'film-ov-section';
        ov.innerHTML = `
          <div class="film-ov-label">Project Overview</div>
          <p class="film-ov-intro">${item.intro}</p>
        `;
        bodyInner.appendChild(ov);
      }

      // 2. My Contribution
      if (item.contributions && item.contributions.length > 0) {
        const contrib = document.createElement('div');
        contrib.className = 'film-contrib-section';
        const contribGrid = document.createElement('div');
        contribGrid.className = 'film-contrib-grid';
        item.contributions.forEach((c) => {
          const div = document.createElement('div');
          div.className = 'film-contrib-card';
          div.textContent = c;
          contribGrid.appendChild(div);
        });
        contrib.innerHTML = '<div class="film-ov-label">My Contribution</div>';
        contrib.appendChild(contribGrid);
        bodyInner.appendChild(contrib);
      }

      // 3. Visual Gallery
      if (item.gallery && item.gallery.length > 0) {
        const gallerySection = document.createElement('div');
        gallerySection.className = 'film-gallery-section';
        gallerySection.innerHTML = '<div class="film-ov-label">Visual Gallery</div>';

        const galleryGrid = document.createElement('div');
        galleryGrid.className = 'film-gallery-grid';

        item.gallery.forEach((g, gIdx) => {
          const gItem = document.createElement('div');
          gItem.className = 'film-gallery-item';
          const palette = palettes[gIdx % palettes.length];
          gItem.style.background = `linear-gradient(135deg, ${palette[0]} 0%, ${palette[1]} 100%)`;

          const placeholder = document.createElement('div');
          placeholder.className = 'film-gallery-placeholder';

          const caption = document.createElement('span');
          caption.className = 'film-gallery-caption';
          caption.textContent = g.caption || '';

          placeholder.appendChild(caption);
          gItem.appendChild(placeholder);
          galleryGrid.appendChild(gItem);
        });

        gallerySection.appendChild(galleryGrid);
        bodyInner.appendChild(gallerySection);
      }

      // 4. Achievements
      if (item.achievements && item.achievements.length > 0) {
        const achieveSection = document.createElement('div');
        achieveSection.className = 'film-achieve-section';
        const achieveGrid = document.createElement('div');
        achieveGrid.className = 'film-achieve-grid';
        item.achievements.forEach((a) => {
          const card = document.createElement('div');
          card.className = 'film-achieve-card';
          card.textContent = a;
          achieveGrid.appendChild(card);
        });
        achieveSection.innerHTML = '<div class="film-ov-label">Achievements</div>';
        achieveSection.appendChild(achieveGrid);
        bodyInner.appendChild(achieveSection);
      }

      body.appendChild(bodyInner);
      filmCase.appendChild(header);
      filmCase.appendChild(body);

      // ── Click to toggle ──
      header.addEventListener('click', () => {
        const isActive = filmCase.classList.contains('active');
        // Close all others
        container.querySelectorAll('.film-case').forEach((c) => c.classList.remove('active'));
        // Open this one if it was closed
        if (!isActive) filmCase.classList.add('active');
      });

      container.appendChild(filmCase);
    });
  }

  // ── Others (Timeline) ──
  function initOthers(others) {
    if (!others) return;
    const sectionSub = document.querySelector('#others .section-sub');
    if (sectionSub && others.subtitle) sectionSub.textContent = others.subtitle;

    const timeline = document.querySelector('.editorial-timeline');
    if (!timeline) return;
    timeline.innerHTML = '';

    others.items.forEach((item) => {
      const entry = document.createElement('div');
      entry.className = 'tl-entry reveal-item';
      entry.innerHTML = `
        <span class="tl-year">${item.year}</span>
        <h3 class="tl-title">${item.title}</h3>
        <p class="tl-desc">${item.desc}</p>
      `;
      timeline.appendChild(entry);
    });
  }

  // ── Contact ──
  function initContact(contact) {
    if (!contact) return;
    const sectionSub = document.querySelector('#contact .section-sub');
    if (sectionSub && contact.subtitle) sectionSub.textContent = contact.subtitle;

    const list = document.querySelector('.contact-list');
    if (!list) return;
    list.innerHTML = '';

    contact.items.forEach((item) => {
      if (item.copy) {
        // WeChat copy row
        const row = document.createElement('div');
        row.className = 'contact-row reveal-item';
        row.id = 'copyWechat';
        row.innerHTML = `
          <span class="contact-icon">${item.icon}</span>
          <span class="contact-label">${item.label}</span>
          <span class="contact-value">${item.value}</span>
          <span class="contact-copy-tip">Click to copy</span>
        `;
        list.appendChild(row);
      } else {
        const row = document.createElement('a');
        row.className = 'contact-row reveal-item';
        row.href = item.url;
        row.target = '_blank';
        row.rel = 'noopener';
        row.innerHTML = `
          <span class="contact-icon">${item.icon}</span>
          <span class="contact-label">${item.label}</span>
          <span class="contact-value">${item.value}</span>
          <span class="contact-arrow">↗</span>
        `;
        list.appendChild(row);
      }
    });

    // Footer
    const footer = document.querySelector('.site-footer p');
    if (footer && contact.footer) footer.textContent = contact.footer;
  }

  // ── Interactions (runs after content is rendered) ──
  function initInteractions(content) {
    const loader       = document.getElementById('loader');
    const loaderProg   = document.getElementById('loaderProgress');
    const heroGrid     = document.getElementById('heroGrid');
    const heroOverlay  = document.getElementById('heroOverlay');
    const gridItems    = heroGrid ? heroGrid.querySelectorAll('.grid-item') : [];
    const navDots      = document.querySelectorAll('.nav-dot');
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
      const order = [0, 3, 1, 6, 2, 5, 4, 7];
      const staggerBase = 100;
      order.forEach((gridIndex, sequencePos) => {
        const item = gridItems[gridIndex];
        if (item) {
          setTimeout(() => {
            item.classList.add('revealed');
          }, staggerBase * sequencePos);
        }
      });

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

    // ── Navigation Dots ──
    navDots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(dot.dataset.target);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

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

    // ── Scroll Reveal ──
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
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

    // Observe ALL reveal-items (both pre-rendered and JS-generated)
    const allRevealItems = document.querySelectorAll('.reveal-item');
    allRevealItems.forEach((item) => revealObserver.observe(item));

    // ── Image Gallery Lightbox ──
    // Create lightbox element
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.id = 'imageLightbox';
    lightbox.innerHTML = `
      <button class="lightbox-close" id="lightboxClose">✕</button>
      <button class="lightbox-nav lightbox-prev" id="lightboxPrev">←</button>
      <button class="lightbox-nav lightbox-next" id="lightboxNext">→</button>
      <div class="lightbox-caption" id="lightboxCaption"></div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = document.createElement('img');
    lightbox.appendChild(lightboxImg);

    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCaption = document.getElementById('lightboxCaption');

    let lightboxItems = [];
    let lightboxIndex = 0;

    function openLightbox(items, index) {
      lightboxItems = items;
      lightboxIndex = index;
      updateLightbox();
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function updateLightbox() {
      const item = lightboxItems[lightboxIndex];
      if (!item) return;
      lightboxImg.src = item.src;
      lightboxCaption.textContent = item.caption || '';
      lightboxPrev.style.display = lightboxIndex > 0 ? 'flex' : 'none';
      lightboxNext.style.display = lightboxIndex < lightboxItems.length - 1 ? 'flex' : 'none';
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      lightboxItems = [];
    }

    function nextLightbox() {
      if (lightboxIndex < lightboxItems.length - 1) {
        lightboxIndex++;
        updateLightbox();
      }
    }

    function prevLightbox() {
      if (lightboxIndex > 0) {
        lightboxIndex--;
        updateLightbox();
      }
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevLightbox);
    lightboxNext.addEventListener('click', nextLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    });

    // ── Gallery image click binding ──
    const galleryItems = document.querySelectorAll('.film-gallery-item');
    galleryItems.forEach((item) => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (!img || !img.src) return;
        const allItems = Array.from(item.closest('.film-gallery-grid').querySelectorAll('.film-gallery-item'))
          .filter((gi) => {
            const giImg = gi.querySelector('img');
            return giImg && giImg.src;
          })
          .map((gi) => ({
            src: gi.querySelector('img').src,
            caption: (gi.querySelector('.film-gallery-caption') || {}).textContent || ''
          }));
        const idx = allItems.findIndex((gi) => gi.src === img.src);
        if (idx >= 0) openLightbox(allItems, idx);
      });
    });

    // ── Image lazy loading (now and future) ──
    const lazyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const imgs = entry.target.querySelectorAll('img');
            imgs.forEach((img) => {
              if (!img.classList.contains('loaded') && img.src) {
                img.classList.add('loaded');
              }
            });
            // Also observe child .film-gallery-item for lazy image loading
            lazyObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '200px' }
    );
    document.querySelectorAll('.film-gallery-item').forEach((item) => lazyObserver.observe(item));
    document.querySelectorAll('.film-case-header').forEach((item) => {
      if (item.style.backgroundImage) lazyObserver.observe(item);
    });

    // ── WeChat Copy ──
    const copyWechat = document.getElementById('copyWechat');
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

    // ── Hero Grid Hover Motion ──
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
  }

})();
