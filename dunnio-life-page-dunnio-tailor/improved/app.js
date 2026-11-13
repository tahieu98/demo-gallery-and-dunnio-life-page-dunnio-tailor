(() => {
  'use strict';
  const items = window.DUNNIO_IMAGES;
  const colorOrder = ['black','charcoal','navy','blue','green','olive','gray','brown','beige','ivory','white','burgundy','red','pink','orange'];
  const orientationOrder = ['portrait','landscape','square'];
  const $ = selector => document.querySelector(selector);
  const viewer = createImageViewer();
  const storageKey = `dunnio-saved-${window.DUNNIO_PAGE}`;
  let saved;
  try { saved = new Set(JSON.parse(localStorage.getItem(storageKey) || '[]')); } catch { saved = new Set(); }
  const params = new URLSearchParams(location.search);
  const state = {color: params.get('color') || 'all', orientation: params.get('orientation') || 'all', q: params.get('q') || '', sort: params.get('sort') || 'curated', saved: params.get('saved') === '1'};
  if (!items.some(item => item.color === state.color)) state.color = 'all';
  if (!orientationOrder.includes(state.orientation)) state.orientation = 'all';
  if (!['curated','source','name'].includes(state.sort)) state.sort = 'curated';
  let filtered = [], toastTimer;
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/đ/g,'d');
  const el = (tag, className, text) => {
    const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node;
  };
  function toast(message) {
    $('.toast').textContent = message; $('.toast').hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { $('.toast').hidden = true; }, 2400);
  }
  function persist() { try { localStorage.setItem(storageKey, JSON.stringify([...saved])); } catch { toast('Browser storage is unavailable. Photos will be saved for this session only.'); } }
  function syncURL() {
    const url = new URL(location.href); url.search = '';
    Object.entries(state).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== 'curated') url.searchParams.set(key, key === 'saved' ? '1' : value);
    });
    try { history.replaceState(null, '', url); } catch { /* file:// still works without history */ }
  }
  function updateSavedLabel() {
    $('.save-filter').textContent = `♡ Saved (${saved.size})`;
    $('.save-filter').setAttribute('aria-pressed', String(state.saved));
  }
  function buildChips() {
    const colors = ['all', ...colorOrder.filter(color => items.some(item => item.color === color))];
    $('.color-filters').replaceChildren(...colors.map(color => {
      const sample = items.find(item => item.color === color);
      const button = el('button','color-chip'); button.type = 'button'; button.dataset.color = color;
      button.setAttribute('aria-pressed', String(state.color === color));
      if (sample) { const swatch = el('span','swatch'); swatch.style.setProperty('--swatch', sample.colorHex); swatch.setAttribute('aria-hidden','true'); button.append(swatch); }
      button.append(el('span','',sample?.colorLabel || 'All'));
      button.append(el('span','chip-count', String(color === 'all' ? items.length : items.filter(item => item.color === color).length)));
      button.addEventListener('click', () => { state.color = color; render(); }); return button;
    }));
  }
  function card(item) {
    const article = el('article','photo-card'); article.dataset.id = item.id;
    const button = el('button','photo-open'); button.type = 'button'; button.setAttribute('aria-label', `View photo: ${item.alt}`);
    const img = el('img'); img.src = item.src; img.alt = item.alt; img.width = item.width; img.height = item.height; img.loading = 'lazy'; img.decoding = 'async';
    button.append(img,el('span','photo-number',String(item.order).padStart(2,'0')),el('span','photo-expand','↗'));
    button.addEventListener('click', () => viewer.open(filtered, filtered.findIndex(photo => photo.id === item.id), button));
    const save = el('button','save-photo', saved.has(item.id) ? '♥' : '♡'); save.type = 'button';
    save.setAttribute('aria-label', `${saved.has(item.id) ? 'Unsave' : 'Save'} photo: ${item.subject}`); save.setAttribute('aria-pressed',String(saved.has(item.id)));
    save.addEventListener('click', () => {
      if (saved.has(item.id)) saved.delete(item.id); else saved.add(item.id);
      persist(); toast(saved.has(item.id) ? 'Added to your saved collection.' : 'Photo removed from your saved collection.');
      if (state.saved) { render(); $('.save-filter').focus(); }
      else { save.textContent = saved.has(item.id) ? '♥' : '♡'; save.setAttribute('aria-pressed',String(saved.has(item.id))); save.setAttribute('aria-label',`${saved.has(item.id) ? 'Unsave' : 'Save'} photo: ${item.subject}`); updateSavedLabel(); }
    });
    const caption = el('div','photo-caption'); const copy = el('div');
    copy.append(el('h3','',item.subject),el('p','',`${item.colorLabel} · ${item.orientationLabel}`));
    caption.append(copy, el('span','',`${item.width} × ${item.height}`)); article.append(button,save,caption); return article;
  }
  function render() {
    filtered = items.filter(item => (state.color === 'all' || item.color === state.color) && (state.orientation === 'all' || item.orientation === state.orientation) && (!state.saved || saved.has(item.id)) && normalize(`${item.subject} ${item.colorLabel} ${item.filename} ${item.originalName}`).includes(normalize(state.q.trim())));
    const compare = (a,b) => state.sort === 'name' ? a.subject.localeCompare(b.subject,'en') : a.order-b.order;
    filtered.sort((a,b) => colorOrder.indexOf(a.color)-colorOrder.indexOf(b.color) || orientationOrder.indexOf(a.orientation)-orientationOrder.indexOf(b.orientation) || compare(a,b));
    const groups = colorOrder.filter(color => filtered.some(item => item.color === color));
    if (state.sort === 'source') groups.sort((a,b) => Math.min(...filtered.filter(x=>x.color===a).map(x=>x.order))-Math.min(...filtered.filter(x=>x.color===b).map(x=>x.order)));
    if (state.sort === 'name') groups.sort((a,b)=>items.find(x=>x.color===a).colorLabel.localeCompare(items.find(x=>x.color===b).colorLabel,'en'));
    // The lightbox follows the same color / orientation / within-group order as the DOM.
    filtered = groups.flatMap(color => orientationOrder.flatMap(orientation => filtered.filter(item => item.color===color && item.orientation===orientation).sort(compare)));
    $('#collections').replaceChildren(...groups.map((color,groupIndex) => {
      const photos = filtered.filter(item=>item.color===color), sample = photos[0];
      const section = el('section','color-section'); section.setAttribute('aria-labelledby',`heading-${color}`);
      const heading = el('div','color-heading'), title = el('h2'); title.id = `heading-${color}`;
      const swatch = el('span','swatch'); swatch.style.setProperty('--swatch',sample.colorHex); swatch.setAttribute('aria-hidden','true');
      title.append(el('span','section-number',String(groupIndex+1).padStart(2,'0')),swatch,document.createTextNode(sample.colorLabel));
      heading.append(title,el('p','',`${photos.length} ${photos.length === 1 ? 'moment' : 'moments'} · A distinctive shade`)); section.append(heading);
      orientationOrder.forEach(orientation => {
        const subset = photos.filter(item=>item.orientation===orientation); if (!subset.length) return;
        section.append(el('h3','orientation-title',`${subset[0].orientationLabel} / ${subset.length}`));
        const grid = el('div','photo-grid'); grid.dataset.orientation = orientation; grid.append(...subset.map(card)); section.append(grid);
      }); return section;
    }));
    $('.empty-state').hidden = filtered.length > 0;
    $('#result-count').textContent = `${filtered.length} / ${items.length} photos${state.saved ? ' · Saved collection' : ''}`;
    $('.reset-filter').hidden = state.color === 'all' && state.orientation === 'all' && !state.q && !state.saved && state.sort === 'curated';
    document.querySelectorAll('.color-chip').forEach(chip => chip.setAttribute('aria-pressed',String(chip.dataset.color === state.color)));
    updateSavedLabel(); syncURL();
  }
  function reset() { Object.assign(state,{color:'all',orientation:'all',q:'',sort:'curated',saved:false}); $('#search').value=''; $('#orientation').value='all'; $('#sort').value='curated'; render(); }
  $('#search').value = state.q; $('#orientation').value = state.orientation; $('#sort').value = state.sort;
  $('#search').addEventListener('input', event => { state.q=event.target.value; render(); });
  $('#orientation').addEventListener('change', event => { state.orientation=event.target.value; render(); });
  $('#sort').addEventListener('change', event => { state.sort=event.target.value; render(); });
  $('.save-filter').addEventListener('click', () => { state.saved=!state.saved; render(); });
  $('.reset-filter').addEventListener('click',reset); $('.empty-reset').addEventListener('click',reset);
  $('.back-top').addEventListener('click', () => { window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}); $('.brand').focus(); });
  const menu = $('.menu-dialog'); $('.mobile-menu').addEventListener('click',()=>menu.showModal()); $('.menu-close').addEventListener('click',()=>menu.close()); menu.addEventListener('click',event=>{if(event.target===menu)menu.close();});
  buildChips(); render();
  function deepLink() { const id = new URLSearchParams(location.hash.slice(1)).get('photo'); const index = items.findIndex(item=>item.id===id); if(index>=0)viewer.open(items,index); }
  window.addEventListener('hashchange',deepLink); deepLink();
})();
