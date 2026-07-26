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
      date: '2025.06 — 2025.09',
      company: '某知名互联网公司 · 品牌营销实习生',
      brief: '负责品牌Campaign全链路策划，主导X3端午电影混池宣发方案，沉淀出一套可复用的内容生产SOP。',
      overview: {
        background: '面向年轻消费群体的品牌焕新项目，需要在端午节点打造破圈声量。',
        role: '品牌营销实习生，负责内容策划、Campaign执行与数据复盘。',
        goal: '提升品牌在目标人群中的认知度与好感度，实现内容资产沉淀。'
      },
      media: [
        // Supported types: 'youtube', 'bilibili', 'video', 'image'
        // For youtube/bilibili: provide embed URL
        // For video/image: provide local file path
        // { type: 'bilibili', src: 'https://player.bilibili.com/player.html?bvid=BVxxxxxxxxx', label: '宣发短片' },
        // { type: 'image', src: 'assets/images/hero_1.jpg', label: 'Campaign主视觉' },
        // { type: 'video', src: 'assets/videos/demo.mp4', label: '花絮' },
        // { type: 'youtube', src: 'https://www.youtube.com/embed/xxxxxxxx', label: 'YouTube' },
      ],
      links: [
        { label: '官方账号 ↗', url: 'https://example.com/official-account', type: 'accent' },
        { label: '策划案 PDF', url: 'assets/pdfs/x3-case.pdf', type: 'ghost' },
      ]
    },
    {
      date: '2024.12 — 2025.03',
      company: '某 MCN 机构 · 内容运营实习生',
      brief: '参与头部账号的内容策划与投放优化，输出多条播放量破百万的爆款选题。',
      overview: {
        background: '服务多个千万级粉丝达人账号，覆盖生活方式与泛知识赛道。',
        role: '内容运营实习生，负责选题策划、脚本撰写与投放数据追踪。',
        goal: '提升账号互动率与粉丝增长，建立可复制的内容方法论。'
      },
      media: [
        // { type: 'image', src: 'assets/images/hero_2.jpg', label: '内容矩阵' },
      ],
      links: [
        { label: '官方账号 ↗', url: 'https://example.com/mcn', type: 'accent' },
      ]
    },
    {
      date: '2024.07 — 2024.10',
      company: '某 4A 广告公司 · AE 实习生',
      brief: '协助客户经理跟进快消客户项目，负责Brief拆解、提案准备与结案报告。',
      overview: {
        background: '服务国际快消品牌的中国区市场传播项目，涉及多渠道整合营销。',
        role: 'AE实习生，协助需求拆解、创意brief撰写、提案物料准备与项目协调。',
        goal: '确保项目按时高质量交付，建立客户对团队的信任。'
      },
      media: [
        // { type: 'image', src: 'assets/images/hero_3.jpg', label: '提案现场' },
      ],
      links: [
        { label: '官方账号 ↗', url: 'https://example.com/4a', type: 'accent' },
      ]
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
