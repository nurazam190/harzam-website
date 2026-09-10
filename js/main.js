/**
 * HARZAM contact configuration
 * Replace each empty string with the official full URL when confirmed.
 * Examples: https://wa.me/60..., mailto:hello@..., https://linkedin.com/...
 */
const CONTACT_CONFIG = Object.freeze({
  whatsapp: '',
  email: '',
  linkedin: '',
  instagram: '',
  threads: '',
  shopee: ''
});

const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
const navLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];

function setMenu(open) {
  menuToggle?.setAttribute('aria-expanded', String(open));
  menuToggle?.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  nav?.classList.toggle('open', open);
  header?.classList.toggle('menu-visible', open);
  document.body.classList.toggle('menu-open', open);
}

menuToggle?.addEventListener('click', () => {
  setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
});

navLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 920) setMenu(false);
});

function updateHeader() {
  header?.classList.toggle('scrolled', window.scrollY > 20);
}

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

document.querySelectorAll('[data-accordion] button').forEach((button) => {
  button.addEventListener('click', () => {
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    button.setAttribute('aria-expanded', String(!isOpen));
    if (panel) panel.hidden = isOpen;
  });
});

document.querySelectorAll('[data-contact]').forEach((link) => {
  const channel = link.dataset.contact;
  const url = CONTACT_CONFIG[channel];

  if (url) {
    link.href = url;
    link.removeAttribute('aria-disabled');
    if (!url.startsWith('mailto:')) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
  } else {
    link.setAttribute('aria-disabled', 'true');
    link.addEventListener('click', (event) => event.preventDefault());
  }
});

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const RESUME_SAMPLES = Object.freeze([
  Object.freeze({
    category: 'Fresh Graduate',
    name: 'Mike Ross',
    description: 'ATS-friendly structure focused on education, internship experience, projects and transferable skills.',
    image: 'assets/resume-samples/mike-ross-fresh-graduate.png.png',
    alt: 'Fresh Graduate resume sample for Mike Ross'
  }),
  Object.freeze({
    category: 'Experienced Professional',
    name: 'Harvey Specter',
    description: 'Achievement-focused resume structure designed to present senior experience, responsibilities and professional impact clearly.',
    image: 'assets/resume-samples/harvey-specter-experienced.png.png',
    alt: 'Experienced Professional resume sample for Harvey Specter'
  }),
  Object.freeze({
    category: 'Career Transition',
    name: 'Jessica Pearson',
    description: 'A strategically positioned resume that highlights transferable skills, leadership experience and relevant strengths for a new career direction.',
    image: 'assets/resume-samples/jessica-pearson-career-transition.png.png',
    alt: 'Career Transition resume sample for Jessica Pearson'
  })
]);

const sampleDialog = document.querySelector('[data-sample-dialog]');
const sampleTitle = document.querySelector('[data-dialog-title]');
const sampleCategory = document.querySelector('[data-dialog-category]');
const sampleDescription = document.querySelector('[data-dialog-description]');
const sampleImage = document.querySelector('[data-dialog-image]');
const sampleCount = document.querySelector('[data-dialog-count]');
const sampleMedia = document.querySelector('.dialog-media');
const sampleClose = document.querySelector('[data-dialog-close]');
let currentSampleIndex = 0;
let lastSampleTrigger = null;

function renderSample(index) {
  currentSampleIndex = (index + RESUME_SAMPLES.length) % RESUME_SAMPLES.length;
  const sample = RESUME_SAMPLES[currentSampleIndex];
  if (sampleTitle) sampleTitle.textContent = sample.name;
  if (sampleCategory) sampleCategory.textContent = sample.category;
  if (sampleDescription) sampleDescription.textContent = sample.description;
  if (sampleImage) {
    sampleImage.src = sample.image;
    sampleImage.alt = sample.alt;
  }
  if (sampleCount) sampleCount.textContent = `${currentSampleIndex + 1} of ${RESUME_SAMPLES.length}`;
  if (sampleMedia) sampleMedia.scrollTop = 0;
}

function openSample(event) {
  if (!sampleDialog || typeof sampleDialog.showModal !== 'function') return;
  lastSampleTrigger = event.currentTarget;
  renderSample(Number(event.currentTarget.dataset.sampleIndex));
  document.body.classList.add('sample-modal-open');
  sampleDialog.showModal();
  requestAnimationFrame(() => sampleClose?.focus());
}

document.querySelectorAll('[data-sample-index]').forEach((button) => {
  button.addEventListener('click', openSample);
});

sampleClose?.addEventListener('click', () => sampleDialog?.close());
document.querySelector('[data-dialog-previous]')?.addEventListener('click', () => renderSample(currentSampleIndex - 1));
document.querySelector('[data-dialog-next]')?.addEventListener('click', () => renderSample(currentSampleIndex + 1));
document.querySelector('[data-view-packages]')?.addEventListener('click', () => sampleDialog?.close());

sampleDialog?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') renderSample(currentSampleIndex - 1);
  if (event.key === 'ArrowRight') renderSample(currentSampleIndex + 1);
});

sampleDialog?.addEventListener('click', (event) => {
  if (event.target !== sampleDialog) return;
  const bounds = sampleDialog.getBoundingClientRect();
  const clickedBackdrop = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  if (clickedBackdrop) sampleDialog.close();
});

sampleDialog?.addEventListener('close', () => {
  document.body.classList.remove('sample-modal-open');
  lastSampleTrigger?.focus({ preventScroll: true });
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const observedSections = document.querySelectorAll('main section[id]');
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-35% 0px -60%', threshold: 0 });
  observedSections.forEach((section) => sectionObserver.observe(section));
}
