/* Controller shared by Style Gallery and Dunnio Life. No runtime dependencies. */
window.DunnioGallery = {
  mount() {
    'use strict';
    const model = window.DunnioFilters, items = window.DUNNIO_IMAGES;
    const $ = selector => document.querySelector(selector);
    const viewer = createImageViewer(), grid = $('#collections');
    const storageKey = `dunnio-saved-${window.DUNNIO_PAGE}`;
    const labels = {outfit:'Outfit',color:'Color',occasion:'Occasion',situation:'Situation'};
    const names = {'wedding':'Wedding','business':'Business','formal-event':'Formal event','smart-casual':'Smart casual','indoor':'Indoor','outdoor':'Outdoor'};
    let saved = new Set(), state = model.parse(location.search, items), draft = null, filtered = [];
    let toastTimer, layoutFrame, optionRowsFrame, activePanel = null;
    const optionRowsObserver=new ResizeObserver(scheduleOptionRows);
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (Array.isArray(stored)) saved = new Set(stored.filter(id => items.some(item => item.id === id)));
    } catch { /* Local saving remains available for this session. */ }
    const clone = value => ({...value,...Object.fromEntries(model.fields.map(field=>[field,[...value[field]]]))});
    const el = (tag, className, text) => {
      const node = document.createElement(tag);
      if (className) node.className = className;
      if (text !== undefined) node.textContent = text;
      return node;
    };
    function toast(message) {
      $('.toast').textContent = message; $('.toast').hidden = false;
      clearTimeout(toastTimer); toastTimer = setTimeout(()=>{$('.toast').hidden=true;},2400);
    }
    function persist() {
      try {localStorage.setItem(storageKey,JSON.stringify([...saved]));}
      catch {toast('Browser storage is unavailable. Photos are saved for this session only.');}
    }
    function options(field) {
      const values = [...new Set(items.flatMap(item=>field==='occasion' ? item.occasions : [item[field]]))];
      return values.map(value => {
        const sample = items.find(item=>field==='occasion' ? item.occasions.includes(value) : item[field]===value);
        const label = field==='outfit' ? sample.outfitLabel : field==='color' ? sample.colorLabel : names[value];
        return {value,label,hex:field==='color' ? sample.colorHex : null};
      }).sort((a,b)=>a.label.localeCompare(b.label,'en'));
    }
    const optionMap = Object.fromEntries(model.fields.map(field=>[field,options(field)]));
    function fillGroup(container, field) {
      const fieldset=el('fieldset','filter-group'), legend=el('legend','',labels[field]);
      const choices=el('div',`filter-options ${field==='color' ? 'color-filters' : ''}`);
      fieldset.append(legend,choices);
      optionMap[field].forEach(option=>{
        const label=el('label','filter-option'), input=el('input');
        input.type='checkbox'; input.value=option.value; input.dataset.field=field; input.checked=draft[field].includes(option.value);
        const text=el('span','',option.label);
        label.append(input);
        if (option.hex) { const swatch=el('span','swatch'); swatch.style.setProperty('--swatch',option.hex); swatch.setAttribute('aria-hidden','true'); label.append(swatch); }
        label.append(text); choices.append(label);
        input.addEventListener('change',()=>{
          draft[field]=input.checked ? [...draft[field],option.value] : draft[field].filter(value=>value!==option.value);
          updatePreview(container.closest('.filter-panel'));
          scheduleOptionRows();
        });
      });
      container.append(fieldset);
    }
    function updatePreview(panel) {
      const count=model.filter(items,draft,saved).length;
      panel.querySelector('.filter-preview').textContent=`${count} matching ${count===1?'photo':'photos'}`;
    }
    function populate(panel, fields) {
      if(panel.id==='mobile-filters')optionRowsObserver.disconnect();
      const body=panel.querySelector('.filter-body'); body.replaceChildren();
      fields.forEach(field=>fillGroup(body,field));
      if (panel.id==='mobile-filters') {
        const label=el('label','saved-option'), input=el('input'); input.type='checkbox'; input.checked=draft.saved;
        label.append(input,document.createTextNode(`Saved photos only (${saved.size})`)); body.append(label);
        input.addEventListener('change',()=>{draft.saved=input.checked;updatePreview(panel);});
        body.querySelectorAll('.filter-options').forEach(choices=>optionRowsObserver.observe(choices));
        scheduleOptionRows();
      }
      body.scrollTop=0;
      updatePreview(panel);
    }
    function apply(panel) {
      state=clone(draft); close(panel); render();
    }
    function close(panel) {
      if (panel.id==='mobile-filters') panel.close(); else panel.hidePopover();
    }
    function positionPanel(panel, trigger) {
      const box=trigger.getBoundingClientRect();
      panel.style.left=`${Math.max(12,Math.min(box.left,innerWidth-panel.offsetWidth-12))}px`;
      const naturalHeight=panel.querySelector('.filter-heading').scrollHeight+panel.querySelector('.filter-body').scrollHeight+panel.querySelector('.filter-footer').scrollHeight+2;
      const below=innerHeight-box.bottom-22, above=box.top-22;
      const minimum=Math.min(naturalHeight,280);
      let top=12, space=innerHeight-24;
      if(below>=minimum){top=box.bottom+10;space=below;}
      else if(above>=minimum){space=above;top=box.top-10-Math.min(naturalHeight,above);}
      // A low landscape viewport needs the full viewport height to keep actions visible.
      panel.style.top=`${Math.max(12,top)}px`;
      panel.style.maxHeight=`${space}px`;
    }
    document.querySelectorAll('.filter-trigger').forEach(trigger=>{
      const field=trigger.dataset.field, panel=$(`#filter-${field}`);
      panel.addEventListener('beforetoggle',event=>{
        if (event.newState==='open') {
          draft=clone(state); activePanel=panel; populate(panel,[field]);
          trigger.setAttribute('aria-expanded','true');
          requestAnimationFrame(()=>positionPanel(panel,trigger));
        } else {
          trigger.setAttribute('aria-expanded','false');
          activePanel=null; draft=null;
        }
      });
    });
    document.querySelectorAll('.filter-panel').forEach(panel=>{
      panel.querySelector('.apply-filters').addEventListener('click',()=>apply(panel));
      panel.querySelector('.cancel-filters').addEventListener('click',()=>close(panel));
      panel.querySelector('.clear-filters').addEventListener('click',()=>{
        if (panel.id==='mobile-filters') draft=model.empty();
        else draft[panel.dataset.field]=[];
        populate(panel,panel.id==='mobile-filters' ? model.fields : [panel.dataset.field]);
      });
    });
    const mobile=$('#mobile-filters'), mobileTrigger=$('.mobile-filter');
    function optionRows(choices) {
      const box=choices.getBoundingClientRect(), rows=[];
      for(const option of choices.children){
        const rect=option.getBoundingClientRect(), top=rect.top-box.top+choices.scrollTop;
        const last=rows.at(-1), bottom=rect.bottom-box.top+choices.scrollTop;
        if(!last || Math.abs(last.top-top)>1)rows.push({top,bottom});
        else last.bottom=Math.max(last.bottom,bottom);
      }
      return rows;
    }
    function limitOptionRows() {
      if(!mobile.open || !matchMedia('(max-width:700px)').matches)return;
      mobile.querySelectorAll('.filter-options').forEach(choices=>{
        const scrollTop=choices.scrollTop;
        choices.classList.remove('is-scrollable');
        choices.style.removeProperty('--option-rows-height');
        choices.removeAttribute('tabindex');choices.removeAttribute('role');choices.removeAttribute('aria-label');
        if(optionRows(choices).length<=3)return;
        // Reserve scrollbar space before measuring: it can change how chips wrap.
        choices.classList.add('is-scrollable');
        const rows=optionRows(choices), padding=parseFloat(getComputedStyle(choices).paddingBottom)||0;
        choices.style.setProperty('--option-rows-height',`${Math.ceil(rows[2].bottom+padding)}px`);
        choices.setAttribute('tabindex','0');choices.setAttribute('role','region');
        choices.setAttribute('aria-label',`${choices.closest('fieldset').querySelector('legend').textContent} options`);
        choices.scrollTop=scrollTop;
      });
    }
    function scheduleOptionRows(){cancelAnimationFrame(optionRowsFrame);optionRowsFrame=requestAnimationFrame(limitOptionRows);}
    new MutationObserver(scheduleOptionRows).observe(mobile.querySelector('.filter-body'),{childList:true,subtree:true,characterData:true});
    document.fonts?.ready.then(scheduleOptionRows);
    mobileTrigger.addEventListener('click',()=>{
      document.querySelectorAll('.filter-popover:popover-open').forEach(panel=>panel.hidePopover());
      draft=clone(state); populate(mobile,model.fields); mobile.showModal();
      document.body.classList.add('filters-open'); mobileTrigger.setAttribute('aria-expanded','true');
    });
    mobile.addEventListener('close',()=>{
      cancelAnimationFrame(optionRowsFrame);optionRowsObserver.disconnect();
      draft=null; document.body.classList.remove('filters-open'); mobileTrigger.setAttribute('aria-expanded','false');
      if (matchMedia('(max-width:700px)').matches) mobileTrigger.focus();
    });
    mobile.addEventListener('keydown',event=>{
      if(event.key!=='Tab') return;
      const focusable=[...mobile.querySelectorAll('button:not(:disabled),input:not(:disabled),[tabindex="0"]')];
      const first=focusable[0], last=focusable.at(-1);
      if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
    });
    mobile.addEventListener('click',event=>{if(event.target===mobile){
      const box=mobile.getBoundingClientRect();
      if(event.clientX<box.left || event.clientX>box.right || event.clientY<box.top || event.clientY>box.bottom)mobile.close();
    }});
    mobile.querySelector('.filter-close').addEventListener('click',()=>mobile.close());
    matchMedia('(max-width:700px)').addEventListener('change',()=>{
      if(mobile.open) mobile.close();
      document.querySelectorAll('.filter-popover:popover-open').forEach(panel=>panel.hidePopover());
    });
    function updateLabels() {
      document.querySelectorAll('.filter-trigger').forEach(trigger=>{
        const count=state[trigger.dataset.field].length;
        trigger.querySelector('.filter-count').textContent=count ? ` (${count})` : '';
        trigger.classList.toggle('is-active',count>0);
      });
      $('.save-filter').textContent=`♡ Saved (${saved.size})`;
      $('.save-filter').setAttribute('aria-pressed',String(state.saved));
      const count=model.fields.reduce((total,field)=>total+state[field].length,0)+(state.saved?1:0);
      mobileTrigger.querySelector('span').textContent=count ? `Filter (${count})` : 'Filter';
      mobileTrigger.classList.toggle('is-active',count>0);
    }
    function card(item) {
      const article=el('article','photo-card gallery-item');
      Object.assign(article.dataset,{id:item.id,color:item.color,outfit:item.outfit,situation:item.situation});
      const open=el('button','photo-open'); open.type='button'; open.setAttribute('aria-label',`View photo: ${item.alt}`);
      const image=el('img'); image.src=item.thumbnail; image.alt=item.alt;
      image.width=item.thumbnailWidth; image.height=item.thumbnailHeight; image.loading='lazy'; image.decoding='async';
      image.addEventListener('load',scheduleLayout);
      const caption=el('span','photo-caption');
      caption.append(el('strong','',item.outfitLabel),el('span','',`${item.colorLabel} · ${item.occasions.map(value=>names[value]).join(', ')} · ${names[item.situation]}`));
      open.append(image,caption); open.addEventListener('click',()=>viewer.open(filtered,filtered.findIndex(photo=>photo.id===item.id),open));
      const save=el('button','save-photo',saved.has(item.id)?'♥':'♡'); save.type='button';
      const updateSave=()=>{
        save.textContent=saved.has(item.id)?'♥':'♡'; save.setAttribute('aria-pressed',String(saved.has(item.id)));
        save.setAttribute('aria-label',`${saved.has(item.id)?'Unsave':'Save'} photo: ${item.outfitLabel}`);
      };
      updateSave();
      save.addEventListener('click',()=>{
        if(saved.has(item.id)) saved.delete(item.id); else saved.add(item.id);
        persist(); updateSave(); updateLabels();
        if(state.saved){render();(matchMedia('(max-width:700px)').matches?mobileTrigger:$('.save-filter')).focus();}
        toast(saved.has(item.id)?'Added to your saved collection.':'Photo removed from your saved collection.');
      });
      article.append(open,save); return article;
    }
    function layout() {
      const cards=[...grid.children]; if(!cards.length){grid.style.height='0px';return;}
      const width=cards[0].getBoundingClientRect().width;
      const columns=Math.max(1,Math.round(grid.clientWidth/width)), heights=Array(columns).fill(0);
      cards.forEach(card=>{
        const column=heights.indexOf(Math.min(...heights));
        card.style.left=`${column*width}px`; card.style.top=`${heights[column]}px`;
        heights[column]+=card.getBoundingClientRect().height+10;
      });
      grid.style.height=`${Math.max(...heights)}px`;
    }
    function scheduleLayout(){cancelAnimationFrame(layoutFrame);layoutFrame=requestAnimationFrame(layout);}
    function syncURL() {
      const url=new URL(location.href); url.search=model.serialize(state);
      try {history.replaceState(null,'',url);} catch { /* file:// filtering remains functional. */ }
    }
    function render() {
      filtered=model.filter(items,state,saved); grid.replaceChildren(...filtered.map(card));
      $('.empty-state').hidden=filtered.length>0;
      $('#collection-status').textContent=`${filtered.length} of ${items.length} photos${state.saved?', saved collection':''}.`;
      updateLabels(); syncURL(); layout();
    }
    $('.save-filter').addEventListener('click',()=>{state.saved=!state.saved;render();});
    $('.empty-reset').addEventListener('click',()=>{state=model.empty();render();});
    window.addEventListener('resize',()=>{scheduleLayout();scheduleOptionRows();if(activePanel)positionPanel(activePanel,$(`[popovertarget="${activePanel.id}"]`));});
    new ResizeObserver(scheduleLayout).observe(grid);
    $('.back-top').addEventListener('click',()=>{window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});$('.brand').focus();});
    const menu=$('.menu-dialog'); $('.mobile-menu').addEventListener('click',()=>menu.showModal()); $('.menu-close').addEventListener('click',()=>menu.close());
    menu.addEventListener('click',event=>{if(event.target===menu)menu.close();});
    window.addEventListener('popstate',()=>{state=model.parse(location.search,items);render();});
    function deepLink(){const id=new URLSearchParams(location.hash.slice(1)).get('photo');const index=items.findIndex(item=>item.id===id);if(index>=0)viewer.open(items,index);}
    window.addEventListener('hashchange',deepLink);
    render(); deepLink();
  }
};
