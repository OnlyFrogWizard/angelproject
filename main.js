/* ── LOAD CONTENT FROM CMS JSON ───────────────────── */
async function loadContent() {
  try {
    const res = await fetch('content/texts.json');
    const data = await res.json();
    return data;
  } catch (e) {
    console.warn('Could not load content/texts.json, using fallback.');
    return null;
  }
}

/* ── APPLY TRANSLATIONS ───────────────────────────── */
function applyTranslations(data, lang) {
  const t = data[lang];
  if (!t) return;

  // Helper
  const set = (sel, val) => {
    document.querySelectorAll(sel).forEach(el => { if (val !== undefined) el.textContent = val; });
  };

  // Logo / nav
  document.querySelectorAll('[data-cms="site_name"]').forEach(el => el.textContent = t.site_name);
  set('[data-cms="nav_about"]',    t.nav_about);
  set('[data-cms="nav_approach"]', t.nav_approach);
  set('[data-cms="nav_contact"]',  t.nav_contact);

  // Hero
  set('[data-cms="hero_eyebrow"]',     t.hero_eyebrow);
  set('[data-cms="hero_title_line1"]', t.hero_title_line1);
  set('[data-cms="hero_title_em"]',    t.hero_title_em);
  set('[data-cms="hero_title_line2"]', t.hero_title_line2);
  set('[data-cms="hero_sub"]',         t.hero_sub);
  set('[data-cms="hero_cta1"]',        t.hero_cta1);
  set('[data-cms="hero_cta2"]',        t.hero_cta2);

  // About
  set('[data-cms="about_eyebrow"]', t.about_eyebrow);
  set('[data-cms="about_title"]',   t.about_title);
  set('[data-cms="about_p1"]',      t.about_p1);
  set('[data-cms="about_p2"]',      t.about_p2);
  set('[data-cms="about_cred1"]',   t.about_cred1);
  set('[data-cms="about_cred2"]',   t.about_cred2);
  set('[data-cms="about_cred3"]',   t.about_cred3);
  set('[data-cms="about_cred4"]',   t.about_cred4);

  // Approach
  set('[data-cms="approach_eyebrow"]', t.approach_eyebrow);
  set('[data-cms="approach_title"]',   t.approach_title);
  set('[data-cms="approach_sub"]',     t.approach_sub);
  set('[data-cms="card1_title"]',      t.card1_title);
  set('[data-cms="card1_text"]',       t.card1_text);
  set('[data-cms="card2_title"]',      t.card2_title);
  set('[data-cms="card2_text"]',       t.card2_text);
  set('[data-cms="card3_title"]',      t.card3_title);
  set('[data-cms="card3_text"]',       t.card3_text);

  // Quotes
  set('[data-cms="quote1_text"]',   t.quote1_text);
  set('[data-cms="quote1_author"]', '— ' + t.quote1_author);
  set('[data-cms="quote2_text"]',   t.quote2_text);
  set('[data-cms="quote2_author"]', '— ' + t.quote2_author);
  set('[data-cms="quote3_text"]',   t.quote3_text);
  set('[data-cms="quote3_author"]', '— ' + t.quote3_author);

  // Contact
  set('[data-cms="contact_eyebrow"]', t.contact_eyebrow);
  set('[data-cms="contact_title"]',   t.contact_title);
  set('[data-cms="contact_sub"]',     t.contact_sub);
  set('[data-cms="contact_email"]',   t.contact_email);
  set('[data-cms="contact_phone"]',   t.contact_phone);
  set('[data-cms="contact_hours"]',   t.contact_hours);
  set('[data-cms="form_name"]',       t.form_name);
  set('[data-cms="form_email"]',      t.form_email);
  set('[data-cms="form_message"]',    t.form_message);
  set('[data-cms="form_send"]',       t.form_send);

  // Footer
  set('[data-cms="footer_copy"]',  t.footer_copy);

  // Loader
  const loaderEl = document.getElementById('loader-text');
  if (loaderEl) loaderEl.textContent = t.loader_word || 'breathe';
}

/* ── LANG TOGGLE ──────────────────────────────────── */
let currentLang = 'en';
let cmsData     = null;

function switchLang(lang) {
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.lang === lang)
  );
  document.documentElement.lang = lang;
  if (cmsData) applyTranslations(cmsData, lang);
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => switchLang(btn.dataset.lang));
});

/* ── LOADER ───────────────────────────────────────── */
window.addEventListener('load', async () => {
  cmsData = await loadContent();
  if (cmsData) applyTranslations(cmsData, currentLang);

  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    const heroInner = document.querySelector('.hero-inner');
    if (heroInner) heroInner.classList.add('visible');
  }, 2200);
});

/* ── SCROLL NAV ───────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── SCROLL REVEAL ────────────────────────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 120);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── QUOTE CAROUSEL ───────────────────────────────── */
const slides = document.querySelectorAll('.quote-slide');
const dots   = document.querySelectorAll('.quote-dot');
let current  = 0;
let quoteTimer;

function goToSlide(index) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = index;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}

function startTimer() {
  quoteTimer = setInterval(() => {
    goToSlide((current + 1) % slides.length);
  }, 7000);
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    clearInterval(quoteTimer);
    goToSlide(parseInt(dot.dataset.index));
    startTimer();
  });
});

startTimer();
