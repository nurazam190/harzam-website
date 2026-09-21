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

const CASE_STUDIES = Object.freeze({
  arjun: Object.freeze({
    category: 'Fresh Graduate — Human Resources',
    name: 'Arjun Nair',
    title: 'Turning Internship Experience Into Career Value',
    overviewTitle: 'Early-career HR candidate with practical exposure',
    overview: 'A recent Human Resource Management graduate seeking an entry-level HR role after gaining hands-on experience across recruitment support, onboarding administration and employee records during an internship.',
    facts: Object.freeze([
      Object.freeze(['Career stage', 'Fresh graduate']),
      Object.freeze(['Target direction', 'Human Resources']),
      Object.freeze(['Positioning focus', 'Practical exposure and potential'])
    ]),
    challenge: 'The original resume treated the internship as a short list of routine tasks. Relevant HR exposure was easy to miss, transferable strengths were disconnected from the target role and the overall profile felt academic rather than employment-ready.',
    approach: Object.freeze([
      'Opened with a focused early-career profile aligned to HR opportunities.',
      'Reframed internship duties around the recruitment and onboarding workflow.',
      'Prioritised relevant HR systems, documentation and communication skills.',
      'Used clear, ATS-conscious headings and role-relevant language.'
    ]),
    examples: Object.freeze([
      Object.freeze({
        before: 'Helped the HR team with recruitment and arranging interviews.',
        after: 'Screened and organised more than 100 job applications based on role requirements, qualifications and relevant experience.'
      }),
      Object.freeze({
        before: 'Prepared documents for new employees.',
        after: 'Prepared onboarding documentation and coordinated pre-employment requirements to support a smooth new-joiner experience.'
      })
    ]),
    transformationTitle: 'From limited experience to relevant evidence',
    transformation: 'The resume now presents the internship as credible exposure to real HR processes, connecting Arjun’s actions, knowledge and transferable strengths directly to entry-level employer needs.',
    result: 'Recruiters can quickly see where Arjun has contributed, which HR processes he understands and why his early experience provides a practical foundation for a first full-time HR role.',
    resume: 'assets/resumes/HARZAM_Arjun_Nair_Fresh_Graduate_Resume.pdf'
  }),
  daniel: Object.freeze({
    category: 'Experienced Professional — Sales Operations',
    name: 'Daniel Tan Wei Jian',
    title: 'Turning Daily Responsibilities Into Measurable Career Achievements',
    overviewTitle: 'Five years of sales operations experience, made measurable',
    overview: 'An experienced sales operations professional whose background spans reporting, order coordination, process improvement and cross-functional support in a fast-moving commercial environment.',
    facts: Object.freeze([
      Object.freeze(['Career stage', 'Experienced professional']),
      Object.freeze(['Target direction', 'Sales Operations']),
      Object.freeze(['Positioning focus', 'Impact and progression'])
    ]),
    challenge: 'Daniel’s original resume described what he was responsible for but not the scale, consistency or value of his work. Repeated task-based bullets made five years of growth appear static and left his operational impact unproven.',
    approach: Object.freeze([
      'Separated core ownership from higher-value achievements.',
      'Added credible scope, frequency and outcome measures where supported.',
      'Made progression visible through stronger role-by-role emphasis.',
      'Connected reporting and coordination work to commercial outcomes.'
    ]),
    examples: Object.freeze([
      Object.freeze({
        before: 'Prepared quotations and followed up with other departments.',
        after: 'Prepared approximately 80 quotations monthly and reduced average turnaround time by 30% through structured request tracking and stronger internal follow-up.'
      }),
      Object.freeze({
        before: 'Helped the sales team process customer orders.',
        after: 'Supported six sales representatives and processed an average of 120 customer orders monthly while maintaining accurate pricing and delivery requirements.'
      })
    ]),
    transformationTitle: 'From activity lists to business contribution',
    transformation: 'Daily responsibilities were translated into evidence of ownership, process discipline and measurable operational value—without losing the practical detail that establishes credibility.',
    result: 'The revised story demonstrates a professional who has progressed beyond administration to become a dependable sales operations contributor with visible commercial and process impact.',
    resume: 'assets/resumes/HARZAM_Daniel_Tan_Experienced_Professional_Resume.pdf'
  }),
  aina: Object.freeze({
    category: 'Career Transition — Administration to Human Resources',
    name: 'Aina Rahman',
    title: 'Repositioning Transferable Skills for a New Career Direction',
    overviewTitle: 'An administration professional moving into Human Resources',
    overview: 'An experienced administrator pursuing an HR career after building relevant strengths in employee support, confidential documentation, coordination and day-to-day people-facing operations.',
    facts: Object.freeze([
      Object.freeze(['Career stage', 'Career transition']),
      Object.freeze(['Target direction', 'Human Resources']),
      Object.freeze(['Positioning focus', 'Transferable skills and HR exposure'])
    ]),
    challenge: 'The original resume was anchored to an administrative job title and gave equal weight to every office task. HR-adjacent experience was buried, while the connection between existing strengths and the intended career direction was left for recruiters to infer.',
    approach: Object.freeze([
      'Created a transition-focused profile that explains the new direction clearly.',
      'Brought employee support and confidential records experience forward.',
      'Mapped coordination, communication and documentation strengths to HR needs.',
      'Retained an honest distinction between transferable experience and formal HR ownership.'
    ]),
    examples: Object.freeze([
      Object.freeze({
        before: 'Handled staff documents and answered employee questions.',
        after: 'Maintained confidential employee records and responded to day-to-day staff enquiries with accuracy, discretion and timely follow-through.'
      }),
      Object.freeze({
        before: 'Helped with attendance records and office administration.',
        after: 'Reviewed monthly attendance records and followed up on missing information before submission to HR, supporting accurate and timely administration.'
      })
    ]),
    transformationTitle: 'From job title to transferable value',
    transformation: 'The new resume does not overstate Aina’s HR experience. Instead, it makes the relevant overlap unmistakable and shows how proven administrative strengths can transfer into a people-focused function.',
    result: 'Employers receive a credible transition narrative: Aina understands the change she is making, already offers relevant capabilities and can contribute while developing deeper HR expertise.',
    resume: 'assets/resumes/HARZAM_Aina_Rahman_Career_Transition_Resume.pdf'
  })
});

const portfolioDialog = document.querySelector('[data-portfolio-dialog]');
const dialogClose = document.querySelector('[data-dialog-close]');
const dialogBody = document.querySelector('[data-dialog-body]');
let lastCaseStudyTrigger = null;

function replaceListItems(container, items) {
  if (!container) return;
  const fragment = document.createDocumentFragment();
  items.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.textContent = item;
    fragment.append(listItem);
  });
  container.replaceChildren(fragment);
}

function renderCaseStudy(study) {
  const setText = (selector, value) => {
    const element = portfolioDialog?.querySelector(selector);
    if (element) element.textContent = value;
  };

  setText('[data-dialog-category]', study.category);
  setText('[data-dialog-title]', study.name);
  setText('[data-dialog-summary]', study.title);
  setText('[data-overview-title]', study.overviewTitle);
  setText('[data-overview-text]', study.overview);
  setText('[data-challenge]', study.challenge);
  setText('[data-transformation-title]', study.transformationTitle);
  setText('[data-transformation]', study.transformation);
  setText('[data-result]', study.result);

  const facts = portfolioDialog?.querySelector('[data-overview-facts]');
  if (facts) {
    const factFragment = document.createDocumentFragment();
    study.facts.forEach(([term, detail]) => {
      const wrapper = document.createElement('div');
      const termElement = document.createElement('dt');
      const detailElement = document.createElement('dd');
      termElement.textContent = term;
      detailElement.textContent = detail;
      wrapper.append(termElement, detailElement);
      factFragment.append(wrapper);
    });
    facts.replaceChildren(factFragment);
  }

  replaceListItems(portfolioDialog?.querySelector('[data-approach]'), study.approach);

  const examples = portfolioDialog?.querySelector('[data-examples]');
  if (examples) {
    const exampleFragment = document.createDocumentFragment();
    study.examples.forEach((example) => {
      const row = document.createElement('div');
      const before = document.createElement('div');
      const after = document.createElement('div');
      const arrow = document.createElement('span');
      const beforeLabel = document.createElement('span');
      const afterLabel = document.createElement('span');
      const beforeQuote = document.createElement('blockquote');
      const afterQuote = document.createElement('blockquote');

      row.className = 'case-example';
      before.className = 'case-copy before';
      after.className = 'case-copy after';
      arrow.className = 'case-example-arrow';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '→';
      beforeLabel.textContent = 'Before';
      afterLabel.textContent = 'After';
      beforeQuote.textContent = `“${example.before}”`;
      afterQuote.textContent = `“${example.after}”`;
      before.append(beforeLabel, beforeQuote);
      after.append(afterLabel, afterQuote);
      row.append(before, arrow, after);
      exampleFragment.append(row);
    });
    examples.replaceChildren(exampleFragment);
  }

  const resumeLink = portfolioDialog?.querySelector('[data-dialog-resume]');
  if (resumeLink) {
    resumeLink.href = study.resume;
    resumeLink.setAttribute('aria-label', `View ${study.name} full resume PDF in a new tab`);
  }
  if (dialogBody) dialogBody.scrollTop = 0;
}

function openCaseStudy(event) {
  const study = CASE_STUDIES[event.currentTarget.dataset.caseStudy];
  if (!portfolioDialog || !study || typeof portfolioDialog.showModal !== 'function') return;
  lastCaseStudyTrigger = event.currentTarget;
  renderCaseStudy(study);
  document.body.classList.add('portfolio-modal-open');
  portfolioDialog.showModal();
  requestAnimationFrame(() => dialogClose?.focus());
}

document.querySelectorAll('[data-case-study]').forEach((button) => {
  button.addEventListener('click', openCaseStudy);
});

dialogClose?.addEventListener('click', () => portfolioDialog?.close());
document.querySelector('[data-dialog-contact]')?.addEventListener('click', () => portfolioDialog?.close());

portfolioDialog?.addEventListener('click', (event) => {
  if (event.target !== portfolioDialog) return;
  const bounds = portfolioDialog.getBoundingClientRect();
  const clickedBackdrop = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  if (clickedBackdrop) portfolioDialog.close();
});

portfolioDialog?.addEventListener('close', () => {
  document.body.classList.remove('portfolio-modal-open');
  lastCaseStudyTrigger?.focus({ preventScroll: true });
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
