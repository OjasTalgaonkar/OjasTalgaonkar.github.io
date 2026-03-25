/* ============================================================
   MAIN.JS — CURSOR + PANEL SYSTEM
   ============================================================ */

'use strict';

/* ── CURSOR ── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function animateCursor() {
  rx += (mx - rx) * 0.15;
  ry += (my - ry) * 0.15;

  if (dot)  { dot.style.left  = mx + 'px'; dot.style.top  = my + 'px'; }
  if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .menu-item').forEach(el => {
  el.addEventListener('mouseenter', () => ring && ring.classList.add('hovered'));
  el.addEventListener('mouseleave', () => ring && ring.classList.remove('hovered'));
});

document.addEventListener('mousedown', () => {
  if (dot) dot.style.transform = 'translate(-50%,-50%) scale(2)';
});
document.addEventListener('mouseup', () => {
  if (dot) dot.style.transform = 'translate(-50%,-50%) scale(1)';
});

/* ── PANEL SYSTEM ── */
const PANELS = {
  about:   { from: 'left',   el: null },
  work:    { from: 'right',  el: null },
  tech:    { from: 'top',    el: null },
  contact: { from: 'bottom', el: null },
};

let activePanel = null;
let isTransitioning = false;

function getPanel(id) { return document.getElementById('panel-' + id); }
function getHub()     { return document.getElementById('hub'); }

/* Open a panel */
function openPanel(id) {
  if (isTransitioning) return;
  const p = PANELS[id];
  if (!p) return;

  const el = getPanel(id);
  if (!el) return;

  isTransitioning = true;

  // Dim hub
  const hub = getHub();
  if (hub) hub.classList.add('hide');

  // Activate panel
  el.classList.add('active');

  // Trigger scroll-reveals inside panel
  setTimeout(() => {
    triggerReveal(el);
    isTransitioning = false;
  }, 600);

  activePanel = id;

  // Update URL hash
  history.pushState({ panel: id }, '', '#' + id);
}

/* Close active panel */
function closePanel(id) {
  if (isTransitioning) return;
  const el = getPanel(id || activePanel);
  if (!el) return;

  isTransitioning = true;
  el.classList.add('closing');

  setTimeout(() => {
    el.classList.remove('active', 'closing');
    el.scrollTop = 0;

    const hub = getHub();
    if (hub) hub.classList.remove('hide');

    activePanel = null;
    isTransitioning = false;
    history.pushState({}, '', window.location.pathname);
  }, 500);
}

/* Keyboard */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && activePanel) closePanel();
});

/* ── SCROLL REVEAL OBSERVER ── */
function triggerReveal(container) {
  const elements = container.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* Global observer for hub elements */
triggerReveal(document.body);

/* ── EXPOSE GLOBALLY ── */
window.openPanel  = openPanel;
window.closePanel = closePanel;

/* ── STAGGERED MENU ITEMS ── */
document.querySelectorAll('.menu-item').forEach((item, i) => {
  item.style.opacity = '0';
  item.style.transform = 'translateX(-20px)';
  setTimeout(() => {
    item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    item.style.opacity    = '1';
    item.style.transform  = 'translateX(0)';
    // After reveal anim finishes, remove inline styles so CSS hover takes over cleanly
    setTimeout(() => {
      item.style.transition = '';
      item.style.opacity    = '';
      item.style.transform  = '';
    }, 350);
  }, 1350 + i * 90);
});

/* ── HASH ROUTING (back button) ── */
window.addEventListener('popstate', e => {
  if (e.state && e.state.panel) {
    openPanel(e.state.panel);
  } else if (activePanel) {
    closePanel();
  }
});

/* ── TYPING INDICATOR (bottom bar) ── */
const statusEl = document.getElementById('status-text');
const statuses = [
  'SYSTEM: NOMINAL',
  'COGNITIVE WORLD: ACCESSIBLE',
  'METAVERSE: CONNECTED',
  'SHADOWS DETECTED: 0',
  'PERSONA: ACTIVE',
];
let si = 0;
if (statusEl) {
  setInterval(() => {
    si = (si + 1) % statuses.length;
    statusEl.style.opacity = '0';
    setTimeout(() => {
      statusEl.textContent = statuses[si];
      statusEl.style.opacity = '1';
    }, 200);
    statusEl.style.transition = 'opacity 0.2s';
  }, 3500);
}
