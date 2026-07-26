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
    // Staggered grid reveal — center-out rhythm for cinematic feel (8 items)
    const order = [0, 3, 1, 6, 2, 5, 4, 7]; // asymmetric reveal order
    const staggerBase = 100; // ms between each item
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

  // ── Internship Case Gallery (accordion expansion) ──
  // ── Data: add new items here ──
  const internshipData = [
    {
      date: '2026.06 — 2026.09',
      company: '叠纸 · 恋与深空 · 品牌营销策划实习生',
      brief: '参与6月17日恋与深空【电影卡】版本的品牌营销，协助品牌联动、线下快闪、内容生态营销等多类型营销活动的创意策划与执行。',
      overview: {
        background: '该版本主打浪漫与高雅的品牌调性，借助经典电影赋魅男主，面向泛三次元受众，在端午节点打造破圈声量。',
        role: '品牌营销策划实习生，负责内容策划、Campaign执行与落地。',
        goal: '提升品牌在目标人群中的认知度，塑造恋与深空"浪漫"的品牌调性。'
      },
      media: [
        { type: 'bilibili', src: '//player.bilibili.com/player.html?isOutside=true&aid=116752058944791&bvid=BV1T8JM6WEuh&cid=39127416968&p=1', label: '品牌宣传片' },
      ],
      links: [
        { label: '联动详情 ↗', url: 'https://www.xiaohongshu.com/discovery/item/6a2d4d9c000000001702d479?source=webshare&xhsshare=pc_web&xsec_token=AByDKNVDo2xEK_SgW9qQoWaFVXTVqNVkBwfMXWoeBFNEg=&xsec_source=pc_share', type: 'accent' },
      ]
    },
    {
      date: '2026.03 — 2026.05',
      company: 'OPPO · 营销策划实习生',
      brief: '在OPPO Find X9s Pro与Find X9 Ultra新品首销期，围绕新品传播需求，参与UGC内容营销项目全周期运营，通过用户共创内容强化产品认知与社区传播。',
      overview: {
        background: '新品上市阶段，需要通过真实用户内容激发用户参与，构建以用户体验为核心的内容传播生态。',
        role: '作为营销策划实习生，参与【晒新机】与【O游世界】线上活动策划与运营，负责活动选题策划、Brief撰写、内容模板设计及数据复盘，推动UGC内容生产与传播落地。',
        goal: '围绕产品核心卖点挖掘用户表达场景，将"产品功能"转化为"用户体验"，提升新品口碑与社区影响力。'
      },
      media: [
        // { type: 'image', src: 'assets/images/hero_2.jpg', label: '内容矩阵' },
      ],
      links: [
        { label: '官方账号 ↗', url: 'https://www.xiaohongshu.com/discovery/item/69e84fd5000000001a037842?source=webshare&xhsshare=pc_web&xsec_token=ABtwUOJTrvVvkuKqMH0kI9HIU44zgfMoq1mAPdSb9Ryc4=&xsec_source=pc_share', type: 'accent' },
      ]
    },
    {
      date: '2026.01 — 2026.02',
      company: '芒果TV · 海外内容运营实习生',
      brief: '参与海外内容运营与AIGC视频生产全流程，探索AI工具赋能视频创作，并参与纪录片制作与海外传播。',
      overview: {
        background: '探索AIGC技术在内容生产中的应用，提升视频包装效率，助力优质内容海外传播。',
        role: '参与纪录片《狮子山下的年轻人》制作及AI视频包装工作，负责素材协作、内容包装、海外传播文案撰写与工具优化反馈。',
        goal: '通过技术赋能与内容运营，提升内容生产效率，推动优质内容触达海外用户。'
      },
      media: [
        { type: 'youtube', src: 'https://www.youtube.com/embed/88ToBh2m-Eg?si=nvfqxoNlpD8XZPDp', label: '纪录片《狮子山下的年轻人》' },
      ],
      links: []
    },
  ];

  // ── Render gallery ──
  const caseGallery = document.getElementById('caseGallery');
  if (caseGallery) {
    internshipData.forEach((item, index) => {
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

        // Render first media item by default
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

        // Thumbnails (if more than 1 media item)
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

            // Thumbnail preview: use image if available, otherwise gradient placeholder
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
              // Placeholder for video embeds without thumbnail
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

      // C. External links
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
        // Close all
        caseGallery.querySelectorAll('.case-item').forEach((c) => c.classList.remove('active'));
        // Open this one if it was closed
        if (!isActive) {
          article.classList.add('active');
        }
      });

      caseGallery.appendChild(article);
    });

    // Re-observe newly created reveal items
    caseGallery.querySelectorAll('.reveal-item').forEach((item) => revealObserver.observe(item));
  }

})();
