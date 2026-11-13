import assert from 'node:assert/strict';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const deps=process.env.DUNNIO_NODE_MODULES||path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
const {chromium}=createRequire(path.join(deps,'package.json'))('playwright');
const base=process.env.DUNNIO_TEST_URL||'http://127.0.0.1:4183';
const output=process.env.DUNNIO_TEST_OUTPUT||fileURLToPath(new URL('../docs/order-4-previews/',import.meta.url));
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true}),results=[];
async function settled(page){await page.evaluate(async()=>{await document.fonts.ready;await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});}
async function checkGroups(page){
 const groups=await page.locator('#mobile-filters .filter-options').evaluateAll(options=>options.map(option=>{
  const box=option.getBoundingClientRect(),rows=[];
  for(const label of option.children){
   const rect=label.getBoundingClientRect(),top=Math.round(rect.top-box.top+option.scrollTop);
   if(!rows.some(row=>Math.abs(row.top-top)<2))rows.push({top,bottom:rect.bottom-box.top+option.scrollTop});
  }
  const visible=rows.filter(row=>row.top>=option.scrollTop-1&&row.bottom<=option.scrollTop+option.clientHeight+1);
  return {name:option.closest('fieldset').querySelector('legend').textContent,rows:rows.length,visible:visible.length,scrollable:option.scrollHeight>option.clientHeight+1};
 }));
 groups.forEach(group=>{
  if(group.rows>3){assert.ok(group.scrollable,`${group.name} has independent scrolling`);assert.equal(group.visible,3,`${group.name} shows exactly three complete rows`);}
  else assert.equal(group.scrollable,false,`${group.name} needs no scrolling for ${group.rows} rows`);
 });
 return groups;
}
try{
 for(const [folder,total,label,id] of [
  ['gallery-page-dunnio-tailor',28,'White Shirt with Gray Waistcoat','gallery-017'],
  ['dunnio-life-page-dunnio-tailor',50,'White Knee-Length Dress','dunnio-life-017']
 ]){
  const page=await browser.newPage({viewport:{width:440,height:956},hasTouch:true}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`${base}/${folder}/improved/index.html`);
  await page.locator('.mobile-filter').click();await settled(page);
  const initial=await checkGroups(page);
  const dialog=page.locator('#mobile-filters');
  const bodyTop=await dialog.locator('.filter-body').evaluate(el=>el.scrollTop);
  await dialog.getByLabel(label,{exact:true}).check();await settled(page);
  assert.equal(await page.locator('.photo-card').count(),total,'Selection remains a draft');
  assert.equal(await dialog.locator('.filter-body').evaluate(el=>el.scrollTop),bodyTop,'Late outfit selection scrolls inside its own group');
  await dialog.getByRole('button',{name:'Apply',exact:true}).click();
  assert.equal(await page.locator('.photo-card').count(),1);assert.equal(await page.locator('.photo-card').getAttribute('data-id'),id);
  await page.locator('.mobile-filter').click();
  assert.equal(await dialog.getByLabel(label,{exact:true}).isChecked(),true);
  await dialog.getByRole('button',{name:'Clear all',exact:true}).click();await settled(page);
  await checkGroups(page);
  assert.equal(await dialog.locator('.filter-body').evaluate(el=>el.scrollTop),0,'Clear all keeps the modal body at the top');
  assert.ok(await dialog.locator('.filter-options').evaluateAll(groups=>groups.every(group=>group.scrollTop===0&&group.scrollLeft===0)),'Rebuilt groups start at the first option');
  await page.screenshot({path:path.join(output,`${folder}-mobile.png`)});
  for(const width of [320,390,440,700]){
   await page.setViewportSize({width,height:956});await settled(page);
   await dialog.locator('.filter-options').evaluateAll(groups=>groups.forEach(group=>{group.scrollTop=0;}));
   await checkGroups(page);
  }
  // Simulate larger future taxonomies: four single-option rows in every field.
  await dialog.locator('.filter-options').evaluateAll(groups=>groups.forEach(group=>{
   const sample=group.firstElementChild;
   while(group.children.length<4)group.append(sample.cloneNode(true));
   [...group.children].slice(4).forEach(child=>child.remove());
   [...group.children].forEach(child=>{child.style.flexBasis='100%';});group.scrollTop=0;
  }));
  await settled(page);await checkGroups(page);
  // Returning to three or two rows must remove unnecessary scroll areas.
  for(const count of [3,2]){
   await dialog.locator('.filter-options').evaluateAll((groups,count)=>groups.forEach(group=>{[...group.children].slice(count).forEach(child=>child.remove());group.scrollTop=0;}),count);
   await settled(page);await checkGroups(page);
  }
  await page.keyboard.press('Escape');await page.setViewportSize({width:1440,height:1000});
  await page.getByRole('button',{name:/^Outfit/}).click();
  assert.ok(await page.locator('#filter-outfit .filter-options').evaluate(el=>el.clientHeight>=el.scrollHeight-1),'Desktop does not get a nested three-row cap');
  assert.deepEqual(errors,[]);results.push({folder,total,initial,status:'PASS'});await page.close();
 }
 console.log(JSON.stringify(results));
 await fs.writeFile(path.join(output,'results.json'),JSON.stringify(results,null,2)+'\n');
}finally{await browser.close();}
