/* ═══════════════════════════════════════════
   Lord Bismark — v3 script.js
   Markmix Studios Limited
═══════════════════════════════════════════ */

/* ════════════════════════════════
   THEME — persisted in localStorage
════════════════════════════════ */
(function initTheme() {
  const root   = document.documentElement;
  const btn    = document.getElementById('theme-toggle');
  const metaTC = document.getElementById('meta-theme-color');

  const DARK_BG  = '#09090e';
  const LIGHT_BG = '#f5f3ee';

  // Respect saved preference, then system preference
  function getPreferred() {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (metaTC) metaTC.setAttribute('content', theme === 'light' ? LIGHT_BG : DARK_BG);
    localStorage.setItem('theme', theme);
  }

  applyTheme(getPreferred());

  if (btn) {
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  // Keep in sync if user changes OS preference while tab is open
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'light' : 'dark');
    }
  });
})();


/* ════════════════════════════════
   STAGGERED CARD REVEAL
════════════════════════════════ */
(function initReveal() {
  const cards = document.querySelectorAll('.link-card');

  // Use IntersectionObserver if available (no setTimeout cascade needed)
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const i = parseInt(entry.target.dataset.index || 0, 10);
          setTimeout(() => entry.target.classList.add('visible'), i * 70);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach((card) => io.observe(card));
  } else {
    // Fallback
    cards.forEach((card, i) => {
      setTimeout(() => card.classList.add('visible'), 180 + i * 70);
    });
  }
})();


/* ════════════════════════════════
   RIPPLE on click
════════════════════════════════ */
(function initRipple() {
  // Inject keyframe once
  const s = document.createElement('style');
  s.textContent = '@keyframes ripple-out { to { transform: scale(1); opacity: 0; } }';
  document.head.appendChild(s);

  document.querySelectorAll('.link-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      const rect   = card.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height) * 1.5;
      const ripple = document.createElement('span');

      Object.assign(ripple.style, {
        position:     'absolute',
        width:        size + 'px',
        height:       size + 'px',
        left:         (e.clientX - rect.left - size / 2) + 'px',
        top:          (e.clientY - rect.top  - size / 2) + 'px',
        background:   'rgba(207,170,90,0.15)',
        borderRadius: '50%',
        transform:    'scale(0)',
        animation:    'ripple-out 0.55s ease forwards',
        pointerEvents:'none',
        zIndex:       '0',
      });

      card.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
})();


/* ════════════════════════════════
   AVATAR SPIN speed on hover
════════════════════════════════ */
(function initAvatarHover() {
  const spin = document.querySelector('.avatar-spin');
  const ring = document.querySelector('.avatar-ring');
  if (!spin || !ring) return;

  ring.addEventListener('mouseenter', () => { spin.style.animationDuration = '1.5s'; });
  ring.addEventListener('mouseleave', () => { spin.style.animationDuration = '6s'; });
})();


/* ════════════════════════════════
   FOOTER YEAR
════════════════════════════════ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
