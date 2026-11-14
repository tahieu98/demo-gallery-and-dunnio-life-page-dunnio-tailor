(() => {
  'use strict';
  window.lucide?.createIcons();
  const menu = document.querySelector('#site-menu');
  const profile = document.querySelector('#profile-dialog');
  document.querySelector('.menu-trigger').addEventListener('click', () => menu.showModal());
  document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.close).close()));
  [menu, profile].forEach(dialog => dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  }));
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => menu.close()));

  const tabs = [...document.querySelectorAll('.year-tabs [role="tab"]')];
  const panels = [...document.querySelectorAll('.milestone')];
  function selectYear(tab, focus = false) {
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panels.forEach(panel => { panel.hidden = panel.id !== tab.getAttribute('aria-controls'); });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectYear(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
      if (event.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
      if (event.key === 'Home') next = tabs[0];
      if (event.key === 'End') next = tabs[tabs.length - 1];
      if (next) { event.preventDefault(); selectYear(next, true); }
    });
  });

  const chapters = [...document.querySelectorAll('.chapter-links a')];
  const sections = chapters.map(link => document.querySelector(link.hash));
  function updateChapter() {
    const active = sections.filter(section => section.getBoundingClientRect().top <= 190).at(-1) || sections[0];
    chapters.forEach(link => {
      if (link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  let scheduled = false;
  window.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { updateChapter(); scheduled = false; });
  }, {passive: true});
  updateChapter();

  document.querySelectorAll('[data-profile]').forEach(button => button.addEventListener('click', () => {
    const data = window.DUNNIO_PROFILES?.[button.dataset.profile];
    if (!data) return;
    const content = document.querySelector('#profile-content');
    content.replaceChildren();
    const head = document.createElement('div'); head.className = 'profile-head';
    const image = document.createElement('img'); image.src = `../craftmanship-page-dunnio-tailor-assets/${data.image}`; image.alt = data.name;
    const name = document.createElement('h2'); name.id = 'profile-name'; name.textContent = data.name;
    head.append(image, name); content.append(head);
    for (const text of data.paragraphs) {
      const paragraph = document.createElement('p'); paragraph.textContent = text; content.append(paragraph);
    }
    const source = document.createElement('a'); source.href = data.url; source.textContent = 'Read the original profile on Dunnio Tailor'; source.target = '_blank'; source.rel = 'noopener'; source.className = 'text-link profile-source'; content.append(source);
    profile.showModal(); profile.scrollTop = 0;
  }));

  document.querySelector('#newsletter').addEventListener('submit', event => {
    event.preventDefault();
    if (event.currentTarget.reportValidity()) document.querySelector('#newsletter-status').textContent = 'Your email is valid. This preview has not sent a subscription. Contact support@dunniotailor.com to subscribe.';
  });
})();
