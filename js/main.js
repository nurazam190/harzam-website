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

const sampleDialog = document.querySelector('[data-sample-dialog]');
const sampleTitle = document.querySelector('[data-dialog-title]');

document.querySelectorAll('[data-sample]').forEach((button) => {
  button.addEventListener('click', () => {
    if (!sampleDialog || typeof sampleDialog.showModal !== 'function') return;
    sampleTitle.textContent = `${button.dataset.sample} Sample`;
    sampleDialog.showModal();
  });
});

document.querySelector('[data-dialog-close]')?.addEventListener('click', () => sampleDialog.close());
sampleDialog?.addEventListener('click', (event) => {
  if (event.target === sampleDialog) sampleDialog.close();
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
