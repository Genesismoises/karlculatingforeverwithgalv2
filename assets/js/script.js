/* ============================================================
   JANA & MARCO WEDDING — JAVASCRIPT
   ============================================================ */

// ---- NAV ----
const nav      = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 60);
});

const openNav = () => {
  navLinks?.classList.add('open');
  navToggle?.classList.add('open');
  navOverlay?.classList.add('show');
  document.body.style.overflow = 'hidden';
};

const closeNav = () => {
  navLinks?.classList.remove('open');
  navToggle?.classList.remove('open');
  navOverlay?.classList.remove('show');
  document.body.style.overflow = '';  
};

navToggle?.addEventListener('click', () => {
  navLinks?.classList.contains('open') ? closeNav() : openNav();
});

navOverlay?.addEventListener('click', closeNav);

document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', closeNav);
});

// ---- COUNTDOWN ----
const weddingDate = new Date('2026-05-14T13:00:00');

const updateCountdown = () => {
  const diff = weddingDate - new Date();
  if (diff <= 0) return;

  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins  = Math.floor((diff % 3600000) / 60000);
  const secs  = Math.floor((diff % 60000) / 1000);

  const pad = n => String(n).padStart(2, '0');
  const setEl = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };

  setEl('cd-days',  pad(days));
  setEl('cd-hours', pad(hours));
  setEl('cd-mins',  pad(mins));
  setEl('cd-secs',  pad(secs));

  // Legacy support for countdown-number class
  const nums = document.querySelectorAll('.countdown-number');
  if (nums.length >= 4) {
    nums[0].textContent = pad(days);
    nums[1].textContent = pad(hours);
    nums[2].textContent = pad(mins);
    nums[3].textContent = pad(secs);
  }
};

if (document.getElementById('cd-days') || document.querySelector('.countdown-number')) {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ---- PETAL CANVAS ANIMATION ----
const canvas = document.getElementById('petalsCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let petals = [];

  const resize = () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  resize();
  window.addEventListener('resize', resize);

  const colors = [
    'rgba(196, 132, 122, 0.55)',  // rose
    'rgba(201, 164, 106, 0.45)',  // gold
    'rgba(232, 213, 176, 0.4)',   // gold light
    'rgba(78,  168, 186, 0.3)',   // teal
    'rgba(247, 242, 236, 0.35)',  // ivory
  ];

  const count = window.innerWidth < 600 ? 18 : 45;

  const createPetal = (x) => ({
    x: x ?? Math.random() * canvas.width,
    y: Math.random() * -200,
    size: Math.random() * 7 + 3,
    speedY: Math.random() * 1.2 + 0.5,
    speedX: (Math.random() - 0.5) * 0.8,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.04,
    opacity: Math.random() * 0.6 + 0.3,
    color: colors[Math.floor(Math.random() * colors.length)],
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: Math.random() * 0.02 + 0.008,
  });

  for (let i = 0; i < count; i++) {
    const p = createPetal();
    p.y = Math.random() * canvas.height; // spread initial positions
    petals.push(p);
  }

  const drawPetal = (p) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size, p.size * 1.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    petals.forEach((p, i) => {
      p.wobble += p.wobbleSpeed;
      p.x += p.speedX + Math.sin(p.wobble) * 0.5;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;

      drawPetal(p);

      if (p.y > canvas.height + 30) {
        petals[i] = createPetal(Math.random() * canvas.width);
      }
    });

    requestAnimationFrame(animate);
  };

  animate();
}

// ---- SCROLL REVEAL ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---- GALLERY LIGHTBOX ----
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
let currentIndex  = 0;
const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => {
    currentIndex = i;
    openLightbox(i);
  });
});

function openLightbox(index) {
  const item = galleryItems[index];
  if (!item || !lightbox) return;
  const img = item.querySelector('img');
  if (!img) return;

  lightboxImg.src = img.getAttribute('data-src') || img.src;
  lightboxImg.alt = img.alt;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox?.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('lightboxClose')?.addEventListener('click', closeLightbox);
document.getElementById('lightboxPrev')?.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
  openLightbox(currentIndex);
});
document.getElementById('lightboxNext')?.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % galleryItems.length;
  openLightbox(currentIndex);
});
lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', (e) => {
  if (!lightbox?.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft')  { currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length; openLightbox(currentIndex); }
  if (e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % galleryItems.length; openLightbox(currentIndex); }
});

// ---- RSVP FORM ----
const rsvpForm  = document.getElementById('rsvpForm');
const confirmMsg = document.getElementById('confirmationMsg');

rsvpForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validateForm(rsvpForm)) return;

  const btn = rsvpForm.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  setTimeout(() => {
    rsvpForm.style.display = 'none';
    confirmMsg?.classList.add('show');
    confirmMsg?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 1200);
});

// ---- CONTACT FORM ----
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validateForm(contactForm)) return;

  const btn = contactForm.querySelector('button[type="submit"]');
  btn.textContent = 'Message Sent ✓';
  btn.disabled = true;
  btn.style.background = 'var(--teal-mid)';
  contactForm.reset();

  setTimeout(() => {
    btn.textContent = 'Send Message';
    btn.disabled = false;
    btn.style.background = '';
  }, 4000);
});

// Form validation helper
function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    if (!field.value.trim()) {
      field.style.borderColor = 'var(--rose)';
      valid = false;
      field.addEventListener('input', () => field.style.borderColor = '', { once: true });
    }
  });
  const email = form.querySelector('[type="email"]');
  if (email?.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    email.style.borderColor = 'var(--rose)';
    valid = false;
  }
  // Check radio groups
  form.querySelectorAll('.radio-group').forEach(group => {
    const checked = group.querySelector('input:checked');
    if (!checked) {
      group.style.outline = '2px solid var(--rose)';
      valid = false;
      group.querySelectorAll('input').forEach(r => {
        r.addEventListener('change', () => group.style.outline = '', { once: true });
      });
    }
  });
  return valid;
}

// ---- FAQ ACCORDION ----
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// ---- BACKGROUND MUSIC ----
const musicBtn = document.getElementById('musicBtn');
const bgMusic  = document.getElementById('bgMusic');

let musicPlaying = localStorage.getItem('musicPlaying') !== 'false';
const savedTime  = parseFloat(localStorage.getItem('musicTime') || '0');
if (savedTime > 0 && bgMusic) bgMusic.currentTime = savedTime;

window.addEventListener('load', () => {
  if (!bgMusic || !musicPlaying) {
    updateMusicBtn(false);
    return;
  }

  bgMusic.muted = false;
  bgMusic.play()
    .then(() => updateMusicBtn(true))
    .catch(() => {
      bgMusic.muted = true;
      updateMusicBtn(true);
      const start = (e) => {
        if (e.target === musicBtn) return;
        bgMusic.muted = false;
        bgMusic.play().then(() => updateMusicBtn(true));
        document.removeEventListener('click', start);
        window.removeEventListener('scroll', start);
      };
      document.addEventListener('click', start);
      window.addEventListener('scroll', start, { once: true });
    });
});

window.addEventListener('beforeunload', () => {
  if (bgMusic) localStorage.setItem('musicTime', bgMusic.currentTime);
});

musicBtn?.addEventListener('click', () => {
  if (!bgMusic) return;
  if (bgMusic.paused || bgMusic.muted) {
    bgMusic.muted = false;
    bgMusic.play();
    musicPlaying = true;
  } else {
    bgMusic.pause();
    musicPlaying = false;
  }
  updateMusicBtn(musicPlaying);
  localStorage.setItem('musicPlaying', musicPlaying);
});

function updateMusicBtn(playing) {
  if (!musicBtn) return;
  const icon = musicBtn.querySelector('.music-icon');
  if (icon) icon.textContent = playing ? '♫' : '♪';
  musicBtn.title = playing ? 'Pause music' : 'Play music';
}

// ---- SMOOTH SCROLL for in-page anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
