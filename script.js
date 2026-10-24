/* ===================================================
   script.js – Wedding Invitation Interactions
   =================================================== */

'use strict';

/* ---- 1. Floating Petals ---- */
(function spawnPetals() {
  const container = document.getElementById('petals');
  const COUNT = 22;

  for (let i = 0; i < COUNT; i++) {
    const petal = document.createElement('div');
    petal.classList.add('petal');

    const size   = 10 + Math.random() * 14;         // 10–24px
    const left   = Math.random() * 100;              // % across screen
    const delay  = Math.random() * 14;               // s
    const dur    = 8 + Math.random() * 10;           // 8–18s fall
    const hue    = 335 + Math.random() * 20;         // pinkish hues
    const rot    = Math.random() * 360;              // initial rotation

    petal.style.cssText = `
      width: ${size}px;
      height: ${size * 1.5}px;
      left: ${left}%;
      animation-duration: ${dur}s;
      animation-delay: -${delay}s;
      background: radial-gradient(ellipse at 40% 30%, hsl(${hue},65%,82%), hsl(${hue},50%,64%) 80%);
      transform: rotate(${rot}deg);
      border-radius: 50% 20% 50% 20%;
    `;

    container.appendChild(petal);
  }
})();


/* ---- 2. Intersection Observer – staggered reveal ---- */
(function animateOnLoad() {
  const elements = document.querySelectorAll('.animate');

  /* Small helper to trigger with delay */
  elements.forEach(el => {
    const delay = parseInt(el.dataset.delay || 0, 10);
    setTimeout(() => {
      el.classList.add('visible');
    }, delay + 300); // 300ms base offset after page load
  });
})();


/* ---- 3. Live Countdown ---- */
(function countdown() {
  // Wedding date: Friday, 30 October 2026, 16:30 local
  const WEDDING = new Date('2026-10-30T16:30:00');

  const daysEl    = document.getElementById('cd-days');
  const hoursEl   = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const now  = new Date();
    const diff = WEDDING - now;

    if (diff <= 0) {
      daysEl.textContent = hoursEl.textContent =
      minutesEl.textContent = secondsEl.textContent = '00';

      // Show congratulations pulse
      const cdSection = document.querySelector('.countdown-section');
      if (cdSection && !cdSection.querySelector('.congrats')) {
        const msg = document.createElement('p');
        msg.className = 'congrats';
        msg.textContent = '🎉 مبروك الزواج! 🎉';
        msg.style.cssText = 'font-size:1.4rem;color:#8b3a52;margin-top:16px;animation:iconPulse 1s ease-in-out infinite;';
        cdSection.appendChild(msg);
      }
      return;
    }

    const totalSecs = Math.floor(diff / 1000);
    const secs      = totalSecs % 60;
    const mins      = Math.floor(totalSecs / 60) % 60;
    const hrs       = Math.floor(totalSecs / 3600) % 24;
    const days      = Math.floor(totalSecs / 86400);

    daysEl.textContent    = pad(days);
    hoursEl.textContent   = pad(hrs);
    minutesEl.textContent = pad(mins);
    secondsEl.textContent = pad(secs);
  }

  tick();
  setInterval(tick, 1000);
})();


/* ---- 4. Card subtle parallax on mouse move (desktop only) ---- */
(function cardParallax() {
  const card = document.getElementById('card');
  if (!card) return;

  // Skip on touch devices — causes jitter on mobile
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (isTouch) return;

  document.addEventListener('mousemove', (e) => {
    const { innerWidth: W, innerHeight: H } = window;
    const cx = e.clientX / W - 0.5;  // -0.5 … 0.5
    const cy = e.clientY / H - 0.5;

    const rotX = (cy * -6).toFixed(2);   // max ±3°
    const rotY = (cx *  6).toFixed(2);
    const tx   = (cx *  6).toFixed(2);   // subtle translate
    const ty   = (cy *  6).toFixed(2);

    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translate(${tx}px, ${ty}px)`;
  });

  document.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translate(0,0)';
    card.style.transition = 'transform 0.6s ease';
    setTimeout(() => { card.style.transition = ''; }, 600);
  });
})();
