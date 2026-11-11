(() => {
  'use strict';
  const items = window.DUNNIO_IMAGES;
  const viewer = createImageViewer();
  const grid = document.querySelector('.gallery-page-list');
  const anchors = [...grid.querySelectorAll('.gallery-item')];
  let visibleCount = Math.min(25, items.length);
  let scheduled = false;
  function layout() {
    scheduled = false;
    const visible = anchors.slice(0,visibleCount);
    if (!visible.length) return;
    const width = visible[0].getBoundingClientRect().width;
    const columns = Math.max(1,Math.round(grid.clientWidth/width));
    const heights = Array(columns).fill(0);
    visible.forEach(anchor => {
      const column = heights.indexOf(Math.min(...heights));
      anchor.style.position='absolute'; anchor.style.left=`${column*width}px`; anchor.style.top=`${heights[column]}px`;
      heights[column] += anchor.getBoundingClientRect().height + 10;
    });
    grid.style.height=`${Math.max(...heights)}px`; grid.style.position='relative';
  }
  function scheduleLayout() { if(!scheduled){scheduled=true;requestAnimationFrame(layout);} }
  anchors.forEach((anchor,index)=>{
    if(index>=visibleCount)anchor.classList.add('reference-hidden');
    anchor.addEventListener('click',event=>{event.preventDefault();viewer.open(items,index,anchor);});
    anchor.querySelector('img').addEventListener('load',scheduleLayout);
  });
  const more=document.querySelector('.load-more-btn');
  function loadMore(event) {
    event?.preventDefault(); visibleCount=items.length;
    anchors.forEach(anchor=>anchor.classList.remove('reference-hidden'));
    if(more)more.parentElement.hidden=true;
    layout();
  }
  more?.addEventListener('click',loadMore);
  const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){loadMore();observer.disconnect();}},{rootMargin:'200px'});
  if(more)observer.observe(more);
  window.addEventListener('resize',scheduleLayout); layout();

  const menu=document.createElement('dialog'); menu.className='reference-menu';menu.setAttribute('aria-label','Main navigation');
  const close=document.createElement('button');close.type='button';close.className='reference-close';close.textContent='×';close.setAttribute('aria-label','Close menu');
  const nav=document.querySelector('.mega-menu').cloneNode(true);nav.removeAttribute('class');
  menu.append(close,nav);document.body.append(menu);close.addEventListener('click',()=>menu.close());
  menu.addEventListener('click',event=>{if(event.target===menu)menu.close();});
  const bars=document.querySelector('.header-bars-btn');bars.setAttribute('role','button');bars.setAttribute('tabindex','0');bars.setAttribute('aria-label','Open menu');
  bars.addEventListener('click',()=>menu.showModal());bars.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)){event.preventDefault();menu.showModal();}});
  document.querySelectorAll('.header-menu nav>ul>li>.nolink').forEach(span=>{
    span.setAttribute('role','button');span.addEventListener('click',()=>menu.showModal());span.addEventListener('keydown',event=>{if(event.key==='Enter')menu.showModal();});
  });
  const language=document.querySelector('.header-action-has-mobile-event');
  if(language){
    language.setAttribute('aria-label','Select language'); language.setAttribute('aria-expanded','false');
    language.addEventListener('click',event=>{event.preventDefault();const open=language.parentElement.classList.toggle('reference-language-open');language.setAttribute('aria-expanded',String(open));});
    language.parentElement.querySelectorAll('.change-lang').forEach(link=>link.addEventListener('click',event=>{
      event.preventDefault();window.open(link.dataset.lang === 'en' ? `https://dunniotailor.com/${window.DUNNIO_PAGE}.html` : `https://dunniotailor-com.translate.goog/${window.DUNNIO_PAGE}.html?_x_tr_sl=en&_x_tr_tl=${encodeURIComponent(link.dataset.lang)}&_x_tr_hl=${encodeURIComponent(link.dataset.lang)}`,'_blank','noopener');
    }));
  }
  document.addEventListener('click',event=>{if(language&&!language.parentElement.contains(event.target)){language.parentElement.classList.remove('reference-language-open');language.setAttribute('aria-expanded','false');}});
  const form=document.querySelector('#t4t-mail-registration-form');
  if(form){
    const input=form.querySelector('input:not([type=hidden]):not([type=submit])');
    if(input){input.type='email';input.required=true;input.setAttribute('aria-label','Email address');input.autocomplete='email';}
    const status=document.createElement('p');status.setAttribute('role','status');status.className='reference-form-status';form.append(status);
    form.addEventListener('submit',event=>{event.preventDefault();if(form.reportValidity()){status.textContent='Demo: your email is valid. No subscription has been sent. Contact support@dunniotailor.com to subscribe.';}});
  }
  function deepLink(){const id=new URLSearchParams(location.hash.slice(1)).get('photo');const index=items.findIndex(item=>item.id===id);if(index>=0)viewer.open(items,index);}
  window.addEventListener('hashchange',deepLink);deepLink();
})();
