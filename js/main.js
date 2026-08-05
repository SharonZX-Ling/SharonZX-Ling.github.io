/* ============================================
   ZiXun Ling · Portfolio · Cinematic Edition
   Content-Driven: loads content.json for all text
   Hero Grid Animation · Scroll Reveal · Detail Overlay
============================================ */

(function () {
  'use strict';

  // ── Accordion scroll positioning utility ──
  // Smooth-scrolls so the element's top sits at a comfortable offset below the viewport top.
  // On mobile, accounts for the fixed nav bar height.
  // `force` skips the tolerance check and always scrolls (used when opening new content).
  function scrollToAccordionHeader(element, customOffset, force) {
    var rect = element.getBoundingClientRect();
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var isMobile = window.innerWidth <= 768;
    var offset = customOffset != null ? customOffset : (isMobile ? 72 : 28);
    var targetY = scrollTop + rect.top - offset;
    if (targetY < 0) targetY = 0;
    // Only scroll if forced or the element isn't already near the top of the viewport
    if (force || rect.top < -50 || rect.top > offset + 20) {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  }

  // Guard against rapid accordion clicks — prevents overlapping timers
  var accordionAnimating = false;

  // ── Load content (cache-bust to ensure fresh data) ──
  fetch('content.json?v=' + Date.now())
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

      const expandHint = document.createElement('div');
      expandHint.className = 'case-expand-hint';
      expandHint.innerHTML = '<span>查看项目详情</span><span class="case-expand-arrow">↓</span>';

      summary.appendChild(company);
      summary.appendChild(brief);
      summary.appendChild(expandHint);

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
          { label: '项目成果', text: item.overview.goal },
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
      var mediaRendered = false; // Track whether media has been rendered (lazy load)
      if (item.media && item.media.length > 0) {
        var mediaWrap = document.createElement('div');
        mediaWrap.className = 'case-media';

        var main = document.createElement('div');
        main.className = 'case-media-main';

        function renderMedia(mediaItem) {
          main.innerHTML = '';
          if (!mediaItem) return;
          if (mediaItem.type === 'youtube' || mediaItem.type === 'bilibili') {
            var iframe = document.createElement('iframe');
            // Build URL with autoplay=0 to prevent auto-play
            var src = mediaItem.src;
            if (mediaItem.type === 'bilibili') {
              src += (src.indexOf('?') !== -1 ? '&' : '?') + 'autoplay=0';
            }
            iframe.src = src;
            // Do NOT include 'autoplay' in allow — prevents mobile auto-play
            iframe.allow = 'encrypted-media; fullscreen';
            iframe.allowFullscreen = true;
            if (mediaItem.type === 'bilibili') {
              iframe.setAttribute('scrolling', 'no');
              iframe.setAttribute('frameborder', 'no');
              iframe.setAttribute('framespacing', '0');
              iframe.setAttribute('border', '0');
            }
            main.appendChild(iframe);
          } else if (mediaItem.type === 'video') {
            var video = document.createElement('video');
            video.src = mediaItem.src;
            video.controls = true;
            video.preload = 'none';
            main.appendChild(video);
          } else if (mediaItem.type === 'image') {
            var img = document.createElement('img');
            img.src = mediaItem.src;
            img.alt = mediaItem.label || '';
            main.appendChild(img);
          }
        }

        // Lazy: don't render media yet — store reference for later
        var currentMedia = item.media[0];
        // Placeholder will be filled when accordion opens
        mediaWrap.appendChild(main);

        // Thumbnails (if more than 1)
        if (item.media.length > 1) {
          var thumbs = document.createElement('div');
          thumbs.className = 'case-media-thumbs';

          item.media.forEach(function(m, mIdx) {
            var thumb = document.createElement('div');
            thumb.className = 'case-thumb';
            if (m.type === 'video' || m.type === 'youtube' || m.type === 'bilibili') {
              thumb.classList.add('case-thumb-video');
            }
            if (mIdx === 0) thumb.classList.add('active');

            if (m.thumb) {
              var timg = document.createElement('img');
              timg.src = m.thumb;
              timg.alt = m.label || '';
              thumb.appendChild(timg);
            } else if (m.type === 'image') {
              var timg2 = document.createElement('img');
              timg2.src = m.src;
              timg2.alt = m.label || '';
              thumb.appendChild(timg2);
            } else {
              thumb.style.background = 'linear-gradient(135deg, #1A1A2E, #16213E)';
            }

            thumb.addEventListener('click', function(e) {
              e.stopPropagation();
              thumbs.querySelectorAll('.case-thumb').forEach(function(t) { t.classList.remove('active'); });
              thumb.classList.add('active');
              currentMedia = m;
              renderMedia(m);
            });

            thumbs.appendChild(thumb);
          });

          mediaWrap.appendChild(thumbs);
        }

        bodyInner.appendChild(mediaWrap);

        // Expose render/clear for accordion toggle
        article._renderMedia = function() { renderMedia(currentMedia); };
        article._clearMedia = function() { main.innerHTML = ''; };
      }

      // C. Feature Showcase
      if (item.features && item.features.length > 0) {
        var featuresWrap = document.createElement('div');
        featuresWrap.className = 'case-features';

        item.features.forEach(function(feat) {
          var featureEl = document.createElement('div');
          featureEl.className = 'case-feature';

          var device = document.createElement('div');
          device.className = 'case-feature-device';

          // Lazy: create a placeholder div, iframe added on expand
          var placeholder = document.createElement('div');
          placeholder.className = 'case-feature-placeholder';
          var playIcon = document.createElement('div');
          playIcon.className = 'case-feature-play-icon';
          playIcon.textContent = '▶';
          placeholder.appendChild(playIcon);

          device.appendChild(placeholder);

          var title = document.createElement('div');
          title.className = 'case-feature-title';
          title.textContent = feat.title;

          featureEl.appendChild(device);
          featureEl.appendChild(title);
          featuresWrap.appendChild(featureEl);
        });

        bodyInner.appendChild(featuresWrap);

        // Lazy render: create iframes only when accordion expands
        article._renderFeatures = function() {
          featuresWrap.querySelectorAll('.case-feature').forEach(function(el, idx) {
            var feat = item.features[idx];
            var device = el.querySelector('.case-feature-device');
            // Skip if already rendered
            if (device.querySelector('iframe')) return;
            device.innerHTML = '';
            if (feat.type === 'bilibili') {
              var iframe = document.createElement('iframe');
              var src = feat.src;
              src += (src.indexOf('?') !== -1 ? '&' : '?') + 'autoplay=0&high_quality=1';
              iframe.src = src;
              iframe.setAttribute('scrolling', 'no');
              iframe.setAttribute('frameborder', 'no');
              iframe.setAttribute('framespacing', '0');
              iframe.setAttribute('border', '0');
              iframe.setAttribute('allowfullscreen', 'true');
              iframe.allow = 'encrypted-media; fullscreen';
              device.appendChild(iframe);
            } else if (feat.type === 'youtube') {
              var ytIframe = document.createElement('iframe');
              ytIframe.src = feat.src;
              ytIframe.allow = 'encrypted-media; fullscreen';
              ytIframe.setAttribute('allowfullscreen', 'true');
              device.appendChild(ytIframe);
            } else {
              // Fallback: local video
              var video = document.createElement('video');
              video.src = feat.src;
              video.controls = true;
              video.preload = 'none';
              video.playsInline = true;
              device.appendChild(video);
            }
          });
        };

        // Clear: remove iframes when accordion collapses
        article._clearFeatures = function() {
          featuresWrap.querySelectorAll('.case-feature').forEach(function(el) {
            var device = el.querySelector('.case-feature-device');
            device.innerHTML = '';
            var placeholder = document.createElement('div');
            placeholder.className = 'case-feature-placeholder';
            var playIcon = document.createElement('div');
            playIcon.className = 'case-feature-play-icon';
            playIcon.textContent = '▶';
            placeholder.appendChild(playIcon);
            device.appendChild(placeholder);
          });
        };
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
      header.addEventListener('click', function() {
        if (accordionAnimating) return; // Ignore clicks during transition
        var isActive = article.classList.contains('active');

        // Close ALL items immediately — and clear their media to stop playback
        caseGallery.querySelectorAll('.case-item').forEach(function(c) {
          c.classList.remove('active');
          if (c._clearMedia) c._clearMedia();
          if (c._clearFeatures) c._clearFeatures();
        });

        if (!isActive) {
          // Phase 1: let collapsing items settle (CSS transition ~0.6s with ease-out-expo,
          //           ~80% complete at 200ms) so scroll position is accurate
          accordionAnimating = true;
          setTimeout(function() {
            // Phase 2: open new item + lazy render media
            article.classList.add('active');
            if (article._renderMedia) article._renderMedia();
            if (article._renderFeatures) article._renderFeatures();
            // Phase 3: smooth scroll to bring expanded content top into comfortable view
            scrollToAccordionHeader(bodyInner, 80, true);
            accordionAnimating = false;
          }, 200);
        }
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
        <div class="film-case-expand-hint"><span>查看项目详情</span><span class="film-case-expand-arrow">↓</span></div>
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
          gItem.dataset.index = gIdx;

          if (g.src) {
            // Real image
            gItem.classList.add('film-gallery-item-img');
            const img = document.createElement('img');
            img.src = g.src;
            img.alt = g.caption || '';
            img.loading = 'lazy';
            gItem.appendChild(img);
          } else {
            // Placeholder
            const palette = palettes[gIdx % palettes.length];
            gItem.style.background = `linear-gradient(135deg, ${palette[0]} 0%, ${palette[1]} 100%)`;
          }

          const placeholder = document.createElement('div');
          placeholder.className = 'film-gallery-placeholder';

          const caption = document.createElement('span');
          caption.className = 'film-gallery-caption';
          caption.textContent = g.caption || '';

          // Click hint
          const zoomHint = document.createElement('div');
          zoomHint.className = 'film-gallery-zoom';
          zoomHint.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>';

          placeholder.appendChild(caption);
          placeholder.appendChild(zoomHint);
          gItem.appendChild(placeholder);

          // Store gallery data for lightbox
          gItem._galleryItems = item.gallery;
          gItem._galleryIndex = gIdx;
          gItem._projectTitle = item.title;

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
        if (accordionAnimating) return; // Ignore clicks during transition
        const isActive = filmCase.classList.contains('active');
        // Close ALL items immediately
        container.querySelectorAll('.film-case').forEach((c) => c.classList.remove('active'));
        if (!isActive) {
          // Phase 1: let collapsing items settle so scroll position is accurate
          accordionAnimating = true;
          setTimeout(() => {
            // Phase 2: open new item
            filmCase.classList.add('active');
            // Phase 3: smooth scroll to bring expanded content top into comfortable view
            scrollToAccordionHeader(bodyInner, 80, true);
            accordionAnimating = false;
          }, 200);
        }
      });

      container.appendChild(filmCase);
    });
  }

  // ── Others (Public Welfare Editorial Gallery) ──
  function initOthers(others) {
    if (!others) return;
    const sectionSub = document.querySelector('#others .section-sub');
    if (sectionSub && others.subtitle) sectionSub.textContent = others.subtitle;

    const container = document.getElementById('welfareStory');
    if (!container) return;
    container.innerHTML = '';

    // Warm color palettes for placeholders
    const welfarePalettes = [
      ['#2A1F18', '#3D2B1F'],  // warm brown
      ['#1F2A22', '#2B3D30'],  // warm green
      ['#2A2418', '#3D3220'],  // warm gold-brown
    ];

    // ── Header: Organization + Period ──
    const header = document.createElement('div');
    header.className = 'welfare-header reveal-item';
    header.innerHTML =
      '<div class="welfare-org">' + (others.organization || '') + '</div>' +
      '<div class="welfare-period">' + (others.period || '') + '</div>';
    container.appendChild(header);

    // ── Intro paragraph ──
    if (others.intro) {
      const intro = document.createElement('p');
      intro.className = 'welfare-intro reveal-item';
      intro.textContent = others.intro;
      container.appendChild(intro);
    }

    // ── State for fold/unfold & carousel auto-play ──
    var welfareExpanded = false;
    var carouselAutoTimer = null;
    var carouselResumeTimer = null;

    // ── Stats row (clickable toggle) ──
    if (others.stats && others.stats.length > 0) {
      const stats = document.createElement('div');
      stats.className = 'welfare-stats reveal-item';
      stats.setAttribute('role', 'button');
      stats.setAttribute('tabindex', '0');
      others.stats.forEach((s) => {
        const stat = document.createElement('div');
        stat.className = 'welfare-stat';
        stat.innerHTML =
          '<span class="welfare-stat-value">' + s.value + '</span>' +
          '<span class="welfare-stat-label">' + s.label + '</span>';
        stats.appendChild(stat);
      });
      container.appendChild(stats);

      // ── Toggle hint ──
      const hint = document.createElement('div');
      hint.className = 'welfare-stats-hint reveal-item';
      hint.innerHTML =
        '<span class="welfare-stats-hint-text">点击展开</span>' +
        '<svg class="welfare-stats-hint-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>';
      container.appendChild(hint);

      // ── Gallery (initially collapsed) ──
      if (others.gallery && others.gallery.length > 0) {
        const gallery = document.createElement('div');
        gallery.className = 'welfare-gallery welfare-gallery-collapsed';

        // Prepare lightbox items (only for single-image entries)
        var lightboxItems = [];
        others.gallery.forEach(function(g) {
          if (g.src) {
            lightboxItems.push({ src: g.src, caption: g.title + (g.caption ? ' — ' + g.caption : '') });
          } else if (g.images && g.images.length > 0) {
            // Carousel entries: add first image for lightbox reference
            lightboxItems.push({ src: g.images[0].src || '', caption: g.title + (g.caption ? ' — ' + g.caption : '') });
          } else {
            lightboxItems.push({ src: '', caption: g.title });
          }
        });

        others.gallery.forEach(function(g, gIdx) {
          const entry = document.createElement('div');
          entry.className = 'welfare-entry';
          if (gIdx === 0) entry.classList.add('welfare-entry-featured');
          if (gIdx % 2 === 1) entry.classList.add('welfare-entry-reverse');

          // ── Image container ──
          const imgWrap = document.createElement('div');
          imgWrap.className = 'welfare-entry-image';

          // Check if this entry has multiple images → carousel
          if (g.images && g.images.length > 1) {
            // ── Carousel ──
            var carouselEl = document.createElement('div');
            carouselEl.className = 'welfare-carousel';

            var track = document.createElement('div');
            track.className = 'welfare-carousel-track';

            var currentSlide = 0;
            var totalSlides = g.images.length;

            g.images.forEach(function(imgData, slideIdx) {
              var slide = document.createElement('div');
              slide.className = 'welfare-carousel-slide';

              if (imgData.src) {
                var img = document.createElement('img');
                img.src = imgData.src;
                img.alt = g.title || '';
                img.loading = 'lazy';
                img.addEventListener('error', function() {
                  slide.classList.add('welfare-carousel-slide-ph');
                  img.remove();
                  var palette = welfarePalettes[slideIdx % welfarePalettes.length];
                  slide.style.background = 'linear-gradient(135deg, ' + palette[0] + ', ' + palette[1] + ')';
                  var label = document.createElement('div');
                  label.className = 'welfare-carousel-slide-label';
                  label.textContent = g.title || '';
                  slide.appendChild(label);
                });
                slide.appendChild(img);
              } else {
                slide.classList.add('welfare-carousel-slide-ph');
                var palette = welfarePalettes[slideIdx % welfarePalettes.length];
                slide.style.background = 'linear-gradient(135deg, ' + palette[0] + ', ' + palette[1] + ')';
                var label = document.createElement('div');
                label.className = 'welfare-carousel-slide-label';
                label.textContent = g.title || '';
                slide.appendChild(label);
              }

              track.appendChild(slide);
            });

            carouselEl.appendChild(track);

            // ── Prev / Next arrows ──
            var prevBtn = document.createElement('button');
            prevBtn.className = 'welfare-carousel-nav welfare-carousel-prev';
            prevBtn.setAttribute('aria-label', 'Previous');
            prevBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>';

            var nextBtn = document.createElement('button');
            nextBtn.className = 'welfare-carousel-nav welfare-carousel-next';
            nextBtn.setAttribute('aria-label', 'Next');
            nextBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>';

            carouselEl.appendChild(prevBtn);
            carouselEl.appendChild(nextBtn);

            // ── Slide navigation ──
            function goToSlide(idx) {
              currentSlide = idx;
              track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
              prevBtn.classList.toggle('hidden', currentSlide === 0);
              nextBtn.classList.toggle('hidden', currentSlide === totalSlides - 1);
            }

            prevBtn.addEventListener('click', function(e) {
              e.stopPropagation();
              if (currentSlide > 0) {
                goToSlide(currentSlide - 1);
                pauseAutoPlay();
              }
            });

            nextBtn.addEventListener('click', function(e) {
              e.stopPropagation();
              if (currentSlide < totalSlides - 1) {
                goToSlide(currentSlide + 1);
                pauseAutoPlay();
              }
            });

            // ── Auto-play ──
            function startAutoPlay() {
              if (carouselAutoTimer) clearInterval(carouselAutoTimer);
              carouselAutoTimer = setInterval(function() {
                if (currentSlide < totalSlides - 1) {
                  goToSlide(currentSlide + 1);
                } else {
                  goToSlide(0);
                }
              }, 2000);
            }

            function pauseAutoPlay() {
              if (carouselAutoTimer) clearInterval(carouselAutoTimer);
              carouselAutoTimer = null;
              if (carouselResumeTimer) clearTimeout(carouselResumeTimer);
              carouselResumeTimer = setTimeout(function() {
                if (welfareExpanded) startAutoPlay();
              }, 5000);
            }

            function stopAutoPlay() {
              if (carouselAutoTimer) clearInterval(carouselAutoTimer);
              carouselAutoTimer = null;
              if (carouselResumeTimer) clearTimeout(carouselResumeTimer);
              carouselResumeTimer = null;
            }

            // ── Touch swipe ──
            var isTouchDevice = window.matchMedia('(hover: none)').matches;
            if (isTouchDevice) {
              var touchStartX = 0;
              carouselEl.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
              }, { passive: true });
              carouselEl.addEventListener('touchend', function(e) {
                var swipeX = e.changedTouches[0].screenX - touchStartX;
                if (Math.abs(swipeX) > 50) {
                  if (swipeX < 0 && currentSlide < totalSlides - 1) {
                    goToSlide(currentSlide + 1);
                  } else if (swipeX > 0 && currentSlide > 0) {
                    goToSlide(currentSlide - 1);
                  }
                  pauseAutoPlay();
                }
              }, { passive: true });
            }

            // Initialize first slide
            goToSlide(0);

            imgWrap.appendChild(carouselEl);
            // No Lightbox for carousel — cursor default
            imgWrap.style.cursor = 'default';

            // Store auto-play control on the gallery for external access
            gallery._startCarousel = startAutoPlay;
            gallery._stopCarousel = stopAutoPlay;

          } else {
            // ── Single image (original behavior) ──
            var imgSrc = g.src || (g.images && g.images.length === 1 ? g.images[0].src : '');
            if (imgSrc) {
              var img = document.createElement('img');
              img.src = imgSrc;
              img.alt = g.title || '';
              img.loading = 'lazy';
              img.addEventListener('error', function() {
                imgWrap.classList.add('welfare-entry-placeholder');
                img.remove();
                var palette = welfarePalettes[gIdx % welfarePalettes.length];
                imgWrap.style.background = 'linear-gradient(135deg, ' + palette[0] + ', ' + palette[1] + ')';
                var label = document.createElement('div');
                label.className = 'welfare-entry-ph-label';
                label.textContent = g.title || '';
                imgWrap.appendChild(label);
              });
              imgWrap.appendChild(img);
            } else {
              imgWrap.classList.add('welfare-entry-placeholder');
              var palette = welfarePalettes[gIdx % welfarePalettes.length];
              imgWrap.style.background = 'linear-gradient(135deg, ' + palette[0] + ', ' + palette[1] + ')';
              var label = document.createElement('div');
              label.className = 'welfare-entry-ph-label';
              label.textContent = g.title || '';
              imgWrap.appendChild(label);
            }

            // Lightbox data for single-image entries
            imgWrap._galleryItems = lightboxItems;
            imgWrap._galleryIndex = gIdx;
            imgWrap._projectTitle = others.organization || '';
          }

          // ── Caption text ──
          const textWrap = document.createElement('div');
          textWrap.className = 'welfare-entry-text';
          textWrap.innerHTML =
            '<h3 class="welfare-entry-title">' + (g.title || '') + '</h3>' +
            '<p class="welfare-entry-caption">' + (g.caption || '') + '</p>';

          entry.appendChild(imgWrap);
          entry.appendChild(textWrap);
          gallery.appendChild(entry);
        });

        container.appendChild(gallery);

        // ── Toggle handler: shared by stats + hint ──
        function toggleGallery() {
          welfareExpanded = !welfareExpanded;
          if (welfareExpanded) {
            gallery.classList.remove('welfare-gallery-collapsed');
            gallery.classList.add('welfare-gallery-expanded');
            stats.classList.add('expanded');
            hint.querySelector('.welfare-stats-hint-text').textContent = '点击收起';
            hint.querySelector('.welfare-stats-hint-chevron').style.transform = 'rotate(180deg)';
            // Start carousel auto-play
            if (gallery._startCarousel) gallery._startCarousel();
            // Scroll stats into view
            scrollToAccordionHeader(stats);
          } else {
            gallery.classList.remove('welfare-gallery-expanded');
            gallery.classList.add('welfare-gallery-collapsed');
            stats.classList.remove('expanded');
            hint.querySelector('.welfare-stats-hint-text').textContent = '点击展开';
            hint.querySelector('.welfare-stats-hint-chevron').style.transform = 'rotate(0deg)';
            // Stop carousel auto-play
            if (gallery._stopCarousel) gallery._stopCarousel();
          }
        }

        // Both stats and hint trigger the same toggle
        stats.addEventListener('click', toggleGallery);
        hint.addEventListener('click', toggleGallery);

        // Keyboard accessibility: Enter/Space to toggle
        stats.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleGallery();
          }
        });
        hint.setAttribute('role', 'button');
        hint.setAttribute('tabindex', '0');
        hint.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleGallery();
          }
        });
      }
    }
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
        // Copy-to-clipboard row (e.g. Email)
        const row = document.createElement('div');
        row.className = 'contact-row contact-copy reveal-item';
        row.dataset.copyText = item.value;
        row.innerHTML = `
          <span class="contact-icon">${item.icon}</span>
          <span class="contact-label">${item.label}</span>
          <span class="contact-value">${item.value}</span>
          <span class="contact-copy-tip">点击复制</span>
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

    // ── Mobile Nav Toggle ──
    const navMobile = document.getElementById('navMobile');
    const navMobileToggle = document.getElementById('navMobileToggle');
    const navMobileLinks = document.querySelectorAll('.nav-mobile-menu a, .nav-mobile-logo');

    if (navMobileToggle && navMobile) {
      navMobileToggle.addEventListener('click', () => {
        navMobile.classList.toggle('open');
      });

      // Close menu when a link is clicked
      navMobileLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
          navMobile.classList.remove('open');
          // Smooth scroll to target
          const targetId = link.dataset.target;
          if (targetId) {
            const target = document.getElementById(targetId);
            if (target) {
              e.preventDefault();
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        });
      });
    }

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

    // ── Premium Lightbox with Thumbnail Navigation ──
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.id = 'imageLightbox';
    lightbox.innerHTML = `
      <div class="lightbox-backdrop"></div>
      <button class="lightbox-close" id="lightboxClose" aria-label="Close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="lightbox-counter" id="lightboxCounter"></div>
      <div class="lightbox-stage">
        <button class="lightbox-nav lightbox-prev" id="lightboxPrev" aria-label="Previous">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div class="lightbox-image-wrap" id="lightboxImageWrap">
          <div class="lightbox-image-inner" id="lightboxImageInner">
            <img class="lightbox-image" id="lightboxImage" alt="" />
            <div class="lightbox-placeholder" id="lightboxPlaceholder"></div>
          </div>
          <div class="lightbox-caption" id="lightboxCaption"></div>
        </div>
        <button class="lightbox-nav lightbox-next" id="lightboxNext" aria-label="Next">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
      <div class="lightbox-thumbs" id="lightboxThumbs">
        <div class="lightbox-thumbs-track" id="lightboxThumbsTrack"></div>
      </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxClose      = document.getElementById('lightboxClose');
    const lightboxPrev       = document.getElementById('lightboxPrev');
    const lightboxNext       = document.getElementById('lightboxNext');
    const lightboxImage      = document.getElementById('lightboxImage');
    const lightboxPlaceholder= document.getElementById('lightboxPlaceholder');
    const lightboxCaption    = document.getElementById('lightboxCaption');
    const lightboxCounter    = document.getElementById('lightboxCounter');
    const lightboxThumbs     = document.getElementById('lightboxThumbs');
    const lightboxThumbsTrack= document.getElementById('lightboxThumbsTrack');
    const lightboxImageInner = document.getElementById('lightboxImageInner');

    let lbItems = [];
    let lbIndex = 0;
    let lbProjectTitle = '';

    // Color palettes for placeholder lightbox items
    const lbPalettes = [
      ['#1A1A2E', '#2D1B4E'],
      ['#1A2E1A', '#2E1A1A'],
      ['#2E2A1A', '#1A2E2A'],
      ['#1E1A1A', '#2A1E2A'],
      ['#1A2A3E', '#2D1B2E'],
    ];

    function openLightbox(items, index, projectTitle) {
      lbItems = items;
      lbIndex = index;
      lbProjectTitle = projectTitle || '';
      renderThumbs();
      updateLightbox(true);
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function renderThumbs() {
      lightboxThumbsTrack.innerHTML = '';
      lbItems.forEach((item, idx) => {
        const thumb = document.createElement('div');
        thumb.className = 'lightbox-thumb';
        thumb.dataset.index = idx;

        if (item.src) {
          const img = document.createElement('img');
          img.src = item.src;
          img.alt = item.caption || '';
          thumb.appendChild(img);
        } else {
          const palette = lbPalettes[idx % lbPalettes.length];
          thumb.style.background = `linear-gradient(135deg, ${palette[0]}, ${palette[1]})`;
          const label = document.createElement('span');
          label.className = 'lightbox-thumb-label';
          label.textContent = (idx + 1).toString();
          thumb.appendChild(label);
        }

        thumb.addEventListener('click', (e) => {
          e.stopPropagation();
          lbIndex = idx;
          updateLightbox();
        });

        lightboxThumbsTrack.appendChild(thumb);
      });
    }

    function updateLightbox(isOpen) {
      const item = lbItems[lbIndex];
      if (!item) return;

      // Animate image transition
      lightboxImageInner.classList.add('transitioning');

      setTimeout(() => {
        if (item.src) {
          lightboxImage.src = item.src;
          lightboxImage.alt = item.caption || '';
          lightboxImage.style.display = 'block';
          lightboxPlaceholder.style.display = 'none';
        } else {
          // Show styled placeholder
          lightboxImage.style.display = 'none';
          lightboxPlaceholder.innerHTML = '';
          const palette = lbPalettes[lbIndex % lbPalettes.length];
          lightboxPlaceholder.style.background = `linear-gradient(135deg, ${palette[0]}, ${palette[1]})`;
          const label = document.createElement('div');
          label.className = 'lightbox-placeholder-text';
          label.textContent = item.caption || '';
          lightboxPlaceholder.appendChild(label);
          lightboxPlaceholder.style.display = 'flex';
        }

        lightboxCaption.textContent = item.caption || '';
        lightboxCounter.textContent = (lbIndex + 1) + ' / ' + lbItems.length;

        // Nav button visibility
        lightboxPrev.classList.toggle('hidden', lbIndex === 0);
        lightboxNext.classList.toggle('hidden', lbIndex === lbItems.length - 1);

        // Thumbnail active state
        lightboxThumbsTrack.querySelectorAll('.lightbox-thumb').forEach((t, i) => {
          t.classList.toggle('active', i === lbIndex);
        });

        // Scroll active thumbnail into view
        const activeThumb = lightboxThumbsTrack.querySelector('.lightbox-thumb.active');
        if (activeThumb) {
          activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }

        lightboxImageInner.classList.remove('transitioning');
      }, isOpen ? 0 : 200);
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      lbItems = [];
      // Clear media after transition
      setTimeout(() => {
        lightboxImage.src = '';
        lightboxThumbsTrack.innerHTML = '';
      }, 400);
    }

    function nextLightbox() {
      if (lbIndex < lbItems.length - 1) {
        lbIndex++;
        updateLightbox();
      }
    }

    function prevLightbox() {
      if (lbIndex > 0) {
        lbIndex--;
        updateLightbox();
      }
    }

    // Event listeners
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); prevLightbox(); });
    lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); nextLightbox(); });

    // Click backdrop to close
    lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-stage').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    });

    // ── Gallery item click → open lightbox ──
    document.querySelectorAll('.film-gallery-item').forEach((item) => {
      item.addEventListener('click', () => {
        if (!item._galleryItems || item._galleryItems.length === 0) return;
        openLightbox(item._galleryItems, item._galleryIndex, item._projectTitle);
      });
    });

    // ── Welfare gallery image click → open lightbox ──
    document.querySelectorAll('.welfare-entry-image').forEach((item) => {
      item.addEventListener('click', () => {
        if (!item._galleryItems || item._galleryItems.length === 0) return;
        openLightbox(item._galleryItems, item._galleryIndex, item._projectTitle);
      });
    });

    // ── Lightbox touch swipe (mobile) ──
    const isTouchDevice2 = window.matchMedia('(hover: none)').matches;
    if (isTouchDevice2) {
      let touchStartX = 0;
      let touchEndX = 0;
      let touchStartY = 0;
      let touchEndY = 0;

      lightboxImageInner.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });

      lightboxImageInner.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        const swipeX = touchEndX - touchStartX;
        const swipeY = touchEndY - touchStartY;
        // Only horizontal swipes (not vertical scroll on thumbs)
        if (Math.abs(swipeX) > 50 && Math.abs(swipeX) > Math.abs(swipeY)) {
          if (swipeX < 0) nextLightbox();
          else prevLightbox();
        }
      }, { passive: true });
    }

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
    document.querySelectorAll('.welfare-entry-image').forEach((item) => lazyObserver.observe(item));
    document.querySelectorAll('.film-case-header').forEach((item) => {
      if (item.style.backgroundImage) lazyObserver.observe(item);
    });

    // ── Contact Copy-to-Clipboard ──
    document.querySelectorAll('.contact-copy').forEach((row) => {
      row.addEventListener('click', () => {
        const text = row.dataset.copyText || row.querySelector('.contact-value').textContent.trim();
        const tip = row.querySelector('.contact-copy-tip');
        const done = () => {
          if (tip) {
            tip.textContent = '✓ 已复制邮箱';
            tip.classList.add('copied');
            setTimeout(() => {
              tip.textContent = '点击复制';
              tip.classList.remove('copied');
            }, 2000);
          }
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
        } else {
          fallbackCopy(text, done);
        }
      });
    });

    function fallbackCopy(text, cb) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (_) {}
      document.body.removeChild(ta);
      if (cb) cb();
    }

    // ── Hero Grid Hover Motion (desktop only — skip on touch devices) ──
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    if (!isTouchDevice) {
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
  }

})();
