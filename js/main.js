/* ============================================
   Sharon Ling · 个人作品集 · 交互脚本
============================================ */

(function () {
  'use strict';

  // ============= 元素 =============
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.section');
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menuToggle');
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const copyWechat = document.getElementById('copyWechat');
  const opens = document.querySelectorAll('.btn-open, .card-cover');

  // ============= 导航点击 → 平滑滚动 + 关闭移动端菜单 =============
  navItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(item.dataset.target);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // 移动端关闭菜单
      sidebar.classList.remove('open');
      menuToggle.classList.remove('open');
    });
  });

  // ============= 移动端汉堡菜单 =============
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    menuToggle.classList.toggle('open');
  });

  // ============= 滚动监听：高亮当前板块 =============
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navItems.forEach((n) => {
            n.classList.toggle('active', n.dataset.target === id);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );
  sections.forEach((s) => observer.observe(s));

  // ============= 弹窗预览 =============
  function openModal(type, src) {
    modalBody.innerHTML = '';
    let el;

    if (type === 'video') {
      // 优先用 video 标签；如果 src 是 B站/YT 链接则用 iframe
      if (/\.(mp4|webm|ogg)$/i.test(src)) {
        el = document.createElement('video');
        el.src = src;
        el.controls = true;
        el.autoplay = true;
      } else {
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
      el.alt = '作品预览';
    }

    if (el) {
      modalBody.appendChild(el);
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    modalBody.innerHTML = '';
    document.body.style.overflow = '';
  }

  // 绑定"打开"按钮
  opens.forEach((el) => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const type = el.dataset.type;
      const src = el.dataset.src;
      if (type && src) openModal(type, src);
    });
  });

  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  // ============= 复制微信号 =============
  if (copyWechat) {
    copyWechat.addEventListener('click', () => {
      const text = copyWechat.querySelector('.contact-value').textContent.trim();
      navigator.clipboard?.writeText(text).then(
        () => {
          const tip = copyWechat.querySelector('.copy-tip');
          const old = tip.textContent;
          tip.textContent = '✓ 已复制';
          setTimeout(() => (tip.textContent = old), 1800);
        },
        () => {
          // 兜底：旧浏览器
          const ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); } catch (_) {}
          document.body.removeChild(ta);
        }
      );
    });
  }

  // ============= 卡片进入动画 =============
  const cards = document.querySelectorAll('.card, .timeline-item');
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  cards.forEach((c) => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(20px)';
    c.style.transition = 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.25s ease, border-color 0.25s ease';
    fadeObserver.observe(c);
  });
})();
