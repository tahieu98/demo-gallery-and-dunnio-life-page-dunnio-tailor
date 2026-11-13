import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const context = {window: {}, URLSearchParams};
vm.runInNewContext(fs.readFileSync(new URL('../shared/gallery-filters.js', import.meta.url), 'utf8'), context);
const model = context.window.DunnioFilters;
const photos = [
  {id:'c', order:3, outfit:'black-tuxedo', color:'black', occasions:['wedding','formal-event'], situation:'outdoor'},
  {id:'a', order:1, outfit:'navy-suit', color:'navy', occasions:['business','formal-event'], situation:'indoor'},
  {id:'b', order:2, outfit:'gray-suit', color:'gray', occasions:['wedding','business'], situation:'outdoor'}
];
const ids = (state, saved = new Set()) => Array.from(model.filter(photos, state, saved), p => p.id);

test('unfiltered photos retain source order rather than color grouping', () => {
  assert.deepEqual(ids(model.empty()), ['a','b','c']);
});
test('values OR inside a facet and AND across four facets', () => {
  assert.deepEqual(ids({...model.empty(),outfit:['black-tuxedo','gray-suit'],color:['black','navy'],occasion:['wedding'],situation:['outdoor']}), ['c']);
  assert.deepEqual(ids({...model.empty(),color:['black','gray']}), ['b','c']);
  assert.deepEqual(ids({...model.empty(),color:['black'],situation:['indoor']}), []);
});
test('saved photos intersect facets and an empty saved set returns no results', () => {
  assert.deepEqual(ids({...model.empty(),saved:true}, new Set(['c','a'])), ['a','c']);
  assert.deepEqual(ids({...model.empty(),saved:true,color:['black']}, new Set(['a'])), []);
  assert.deepEqual(ids({...model.empty(),saved:true}), []);
});
test('URL parsing drops invalid and duplicate values and ignores retired filters', () => {
  const state = model.parse('color=black,missing,black&occasion=wedding&orientation=portrait&q=missing&saved=1',photos);
  assert.deepEqual(ids(state, new Set(['c'])), ['c']);
  assert.equal(model.serialize(state), 'color=black&occasion=wedding&saved=1');
  assert.deepEqual(ids(model.parse('outfit=unknown&saved=false',photos)), ['a','b','c']);
});
test('URL round trip retains multiple selections without changing source data', () => {
  const state = {...model.empty(),outfit:['gray-suit','black-tuxedo'],situation:['outdoor']};
  const before = JSON.stringify(photos);
  assert.deepEqual(ids(model.parse(model.serialize(state),photos)), ['b','c']);
  assert.equal(JSON.stringify(photos),before);
});
