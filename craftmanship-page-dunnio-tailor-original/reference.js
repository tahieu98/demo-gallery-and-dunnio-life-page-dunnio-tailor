(() => {
  'use strict';
  const menu = document.createElement('dialog');
  menu.className = 'reference-menu';
  menu.setAttribute('aria-label', 'Main navigation');
  const close = document.createElement('button');
  close.className = 'reference-close';
  close.type = 'button';
  close.textContent = '\u00d7';
  close.setAttribute('aria-label', 'Close menu');
  const nav = document.querySelector('.mega-menu').cloneNode(true);
  nav.removeAttribute('class');
  menu.append(close, nav);
  document.body.append(menu);
  close.addEventListener('click', () => menu.close());
  menu.addEventListener('click', event => { if (event.target === menu) menu.close(); });
  const triggers = document.querySelectorAll('.header-bars-btn,.header-menu nav>ul>li>.nolink');
  triggers.forEach(trigger => {
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('tabindex', '0');
    trigger.setAttribute('aria-label', 'Open menu');
    trigger.addEventListener('click', () => menu.showModal());
    trigger.addEventListener('keydown', event => {
      if (['Enter', ' '].includes(event.key)) { event.preventDefault(); menu.showModal(); }
    });
  });
  const language = document.querySelector('.header-action-has-mobile-event');
  if (language) {
    language.setAttribute('role', 'button');
    language.setAttribute('aria-label', 'Select language');
    language.setAttribute('aria-expanded', 'false');
    language.addEventListener('click', event => {
      event.preventDefault();
      language.setAttribute('aria-expanded', String(language.parentElement.classList.toggle('reference-language-open')));
    });
    language.parentElement.querySelectorAll('.change-lang').forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      const lang = encodeURIComponent(link.dataset.lang || 'en');
      window.open(lang === 'en' ? 'https://dunniotailor.com/our-tailors' : `https://dunniotailor-com.translate.goog/our-tailors?_x_tr_sl=en&_x_tr_tl=${lang}&_x_tr_hl=${lang}`, '_blank', 'noopener');
    }));
  }
  document.addEventListener('click', event => {
    if (language && !language.parentElement.contains(event.target)) {
      language.parentElement.classList.remove('reference-language-open');
      language.setAttribute('aria-expanded', 'false');
    }
  });
  document.querySelectorAll('.footer-menu-item>ul>li.expanded>.nolink').forEach(trigger => {
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('aria-expanded', 'false');
    const toggle = () => trigger.setAttribute('aria-expanded', String(trigger.nextElementSibling.classList.toggle('reference-footer-open')));
    trigger.addEventListener('click', toggle);
    trigger.addEventListener('keydown', event => { if (['Enter', ' '].includes(event.key)) { event.preventDefault(); toggle(); } });
  });
  const form = document.querySelector('#t4t-mail-registration-form');
  if (form) {
    const input = form.querySelector('input:not([type=hidden]):not([type=submit])');
    input.type = 'email'; input.required = true; input.autocomplete = 'email'; input.setAttribute('aria-label', 'Email address');
    const status = document.createElement('p'); status.setAttribute('role', 'status'); status.className = 'reference-form-status'; form.append(status);
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (form.reportValidity()) status.textContent = 'Demo: email validated. No subscription has been sent. Contact support@dunniotailor.com to subscribe.';
    });
  }
  const profile = document.createElement('dialog');
  profile.className = 'profile-dialog'; profile.setAttribute('aria-labelledby', 'profile-title');
  const profileClose = close.cloneNode(true); profileClose.setAttribute('aria-label', 'Close profile');
  const article = document.createElement('article'); profile.append(profileClose, article); document.body.append(profile);
  profileClose.addEventListener('click', () => profile.close());
  profile.addEventListener('click', event => { if (event.target === profile) profile.close(); });
  document.querySelectorAll('[data-profile]').forEach(link => link.addEventListener('click', event => {
    const data = window.DUNNIO_PROFILES?.[link.dataset.profile];
    if (!data) return;
    event.preventDefault(); article.replaceChildren();
    const image = document.createElement('img'); image.src = `../craftmanship-page-dunnio-tailor-assets/${data.image}`; image.alt = data.name;
    const heading = document.createElement('h2'); heading.id = 'profile-title'; heading.textContent = data.name; article.append(image, heading);
    for (const text of data.paragraphs) { const p = document.createElement('p'); p.textContent = text; article.append(p); }
    const source = document.createElement('a'); source.href = data.url; source.className = 'profile-source'; source.textContent = 'Read the profile on Dunnio Tailor'; source.target = '_blank'; source.rel = 'noopener'; article.append(source);
    profile.showModal(); profile.scrollTop = 0;
  }));
})();
