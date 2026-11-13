/* Shared model; plain script so the demos also work from file://. */
(() => {
  'use strict';
  const fields = ['outfit', 'color', 'occasion', 'situation'];
  const values = (photo, field) => field === 'occasion' ? photo.occasions : [photo[field]];
  const empty = () => ({outfit: [], color: [], occasion: [], situation: [], saved: false});
  function filter(photos, state, saved = new Set()) {
    return photos.filter(photo => (!state.saved || saved.has(photo.id)) && fields.every(field =>
      !state[field]?.length || state[field].some(value => values(photo, field).includes(value))
    )).sort((a, b) => a.order - b.order);
  }
  function parse(search, photos) {
    const params = new URLSearchParams(search), state = empty();
    fields.forEach(field => {
      const allowed = new Set(photos.flatMap(photo => values(photo, field)));
      state[field] = [...new Set((params.get(field) || '').split(',').filter(value => allowed.has(value)))];
    });
    state.saved = params.get('saved') === '1';
    return state;
  }
  function serialize(state) {
    const params = new URLSearchParams();
    fields.forEach(field => { if (state[field].length) params.set(field, state[field].join(',')); });
    if (state.saved) params.set('saved', '1');
    return params.toString();
  }
  window.DunnioFilters = {fields, empty, filter, parse, serialize};
})();
