import assert from 'node:assert/strict';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const deps = process.env.DUNNIO_NODE_MODULES || path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
const {chromium} = createRequire(path.join(deps,'package.json'))('playwright');
const browser = await chromium.launch({headless:true});
const base = process.env.DUNNIO_TEST_URL || 'http://127.0.0.1:4183';
const out = new URL('../docs/order-2-previews/',import.meta.url);
await fs.mkdir(out,{recursive:true});
const results=[];
try {
  for (const [folder,total] of [['gallery-page-dunnio-tailor',28],['dunnio-life-page-dunnio-tailor',50]]) {
    const page = await browser.newPage({viewport:{width:1440,height:1000}});
    const errors=[]; page.on('pageerror',e=>errors.push(e.message));
    page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()}: ${response.url()}`);});
    await page.goto(`${base}/${folder}/improved/`);
    await page.locator('.photo-card').last().waitFor();
    assert.equal(await page.locator('.filter-trigger').count(),4,'Four separate PC facet buttons');
    assert.equal(await page.locator('.photo-card').count(),total);
    assert.equal(await page.locator('[aria-label="Search photos"],#orientation,.result-bar,.color-section').count(),0);
    assert.equal(await page.locator('.filter-popover:visible').count(),0);
    assert.ok(await page.locator('.filter-row').evaluate(row=>new Set([...row.children].map(x=>Math.round(x.getBoundingClientRect().top))).size===1),'Single toolbar row');
    await page.getByRole('button',{name:'Color',exact:true}).click();
    const panel = page.locator('#filter-color');
    await panel.getByLabel('Black',{exact:true}).check();
    assert.equal(await page.locator('.photo-card').count(),total,'Draft does not apply early');
    await panel.getByRole('button',{name:'Cancel',exact:true}).click();
    assert.equal(await page.locator('.photo-card').count(),total);
    await page.getByRole('button',{name:'Color',exact:true}).click();
    assert.equal(await panel.getByLabel('Black',{exact:true}).isChecked(),false);
    await panel.getByLabel('Black',{exact:true}).check();
    await panel.getByRole('button',{name:'Apply',exact:true}).click();
    const blackCount = await page.locator('.photo-card').count();
    assert.ok(blackCount>0 && blackCount<total);
    assert.ok(await page.locator('.photo-card').evaluateAll(cards=>cards.every(card=>card.dataset.color==='black')));
    await page.reload();
    assert.equal(await page.locator('.photo-card').count(),blackCount,'URL restores selections');
    await page.getByRole('button',{name:/^Color/}).click();
    await panel.getByLabel('Navy',{exact:true}).check();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.photo-card').count(),blackCount,'Escape discards draft');
    await page.goto(`${base}/${folder}/improved/`);
    await page.locator('.save-photo').first().click();
    await page.locator('.filter-row .save-filter').click();
    assert.equal(await page.locator('.photo-card').count(),1);
    await page.reload();
    assert.equal(await page.locator('.photo-card').count(),1,'Saved persists');
    await page.locator('.photo-open').click();
    assert.equal(await page.locator('dialog[open]').count(),1,'Viewer opens');
    assert.match(await page.locator('.viewer-caption').textContent(),/Indoor|Outdoor/,'Viewer exposes new metadata on mobile too');
    await page.keyboard.press('Escape');
    await page.goto(`${base}/${folder}/improved/`);
    const targets=folder.startsWith('gallery')
      ? {Outfit:'Black Tuxedo',Color:'Black',Occasion:'Wedding',Situation:'Outdoor'}
      : {Outfit:'Black Waistcoat with White Shirt',Color:'Black',Occasion:'Wedding',Situation:'Indoor'};
    for (const [field,value] of Object.entries(targets)) {
      await page.getByRole('button',{name:field,exact:true}).click();
      const facet=page.locator(`#filter-${field.toLowerCase()}`);
      await facet.getByLabel(value,{exact:true}).check();
      await facet.getByRole('button',{name:'Apply',exact:true}).click();
    }
    assert.equal(await page.locator('.photo-card').count(),folder.startsWith('gallery')?3:2,'Four facets intersect correctly');
    await page.getByRole('button',{name:/^Situation/}).click();
    const situation=page.locator('#filter-situation');
    await situation.getByLabel(targets.Situation,{exact:true}).uncheck();
    const opposite=targets.Situation==='Indoor'?'Outdoor':'Indoor';
    if(await situation.getByLabel(opposite,{exact:true}).count()) {
      await situation.getByLabel(opposite,{exact:true}).check();
      await situation.getByRole('button',{name:'Apply',exact:true}).click();
      assert.equal(await page.locator('.photo-card').count(),0);
      await page.getByRole('button',{name:'View all photos',exact:true}).click();
      assert.equal(await page.locator('.photo-card').count(),total);
    } else { await page.keyboard.press('Escape'); }
    await page.goto(`${base}/${folder}/improved/`);
    await page.getByRole('button',{name:'Color',exact:true}).click();
    await panel.getByLabel('Black',{exact:true}).check();
    await page.locator('#page-title').click();
    assert.equal(await page.locator('.photo-card').count(),total,'Outside click discards edits');
    await page.getByRole('button',{name:'Color',exact:true}).click();
    assert.equal(await panel.getByLabel('Black',{exact:true}).isChecked(),false);
    await page.keyboard.press('Escape');
    await page.screenshot({path:fileURLToPath(new URL(`${folder}-desktop.png`,out)),fullPage:false});
    await page.getByRole('button',{name:'Color',exact:true}).click();
    await page.screenshot({path:fileURLToPath(new URL(`${folder}-desktop-popover.png`,out)),fullPage:false});
    await page.keyboard.press('Escape');
    for (const width of [1024,768]) {
      await page.setViewportSize({width,height:1000});
      await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      assert.ok(await page.locator('.filter-row').evaluate(row=>new Set([...row.children].map(x=>Math.round(x.getBoundingClientRect().top))).size===1),`${width}px single row`);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width}px tablet no overflow after layout`);
    }
    await page.setViewportSize({width:390,height:844});
    await page.locator('.mobile-filter').click();
    const modal=page.locator('#mobile-filters');
    assert.equal(await modal.locator('fieldset').count(),4);
    await page.keyboard.press('Shift+Tab');
    assert.ok(await modal.evaluate(el=>el.contains(document.activeElement)),'Modal traps keyboard focus');
    await modal.getByLabel('Black',{exact:true}).check();
    assert.equal(await page.locator('.photo-card').count(),total);
    await modal.getByRole('button',{name:'Apply',exact:true}).click();
    assert.equal(await page.locator('.photo-card').count(),blackCount);
    assert.equal(await page.locator('.mobile-filter').evaluate(el=>el===document.activeElement),true,'Focus returns to mobile trigger');
    await page.locator('.mobile-filter').click();
    await modal.getByRole('button',{name:'Clear all',exact:true}).click();
    await modal.getByRole('button',{name:'Apply',exact:true}).click();
    assert.equal(await page.locator('.photo-card').count(),total);
    await page.screenshot({path:fileURLToPath(new URL(`${folder}-mobile.png`,out)),fullPage:false});
    await page.locator('.mobile-filter').click();
    assert.equal(await modal.locator('.filter-body').evaluate(el=>el.scrollTop),0,'Reopened filters start at top');
    await page.screenshot({path:fileURLToPath(new URL(`${folder}-mobile-filters.png`,out)),fullPage:false});
    await page.keyboard.press('Escape');
    for (const width of [320,575,576,991,992,1199,1200,1440]) {
      await page.setViewportSize({width,height:900});
      await page.waitForTimeout(60);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width}px no overflow`);
      const overlaps=await page.locator('.photo-card').evaluateAll(cards=>{
        const boxes=cards.map(c=>c.getBoundingClientRect());
        return boxes.some((a,i)=>boxes.slice(i+1).some(b=>a.left<b.right-1&&a.right>b.left+1&&a.top<b.bottom-1&&a.bottom>b.top+1));
      });
      assert.equal(overlaps,false,`${width}px no tile overlap`);
    }
    const original=await browser.newPage({viewport:{width:1440,height:900}});
    await original.goto(`${base}/${folder}/original/`);
    const sourceRatios=await original.locator('.gallery-item img').evaluateAll(images=>images.slice(0,10).map(image=>image.getBoundingClientRect().height/image.getBoundingClientRect().width));
    const newRatios=await page.locator('.photo-open img').evaluateAll(images=>images.slice(0,10).map(image=>image.getBoundingClientRect().height/image.getBoundingClientRect().width));
    sourceRatios.forEach((ratio,i)=>assert.ok(Math.abs(ratio-newRatios[i])<.02,`Original thumbnail ratio ${i+1} preserved`));
    for(const width of [390,768,1024,1440]) {
      await original.setViewportSize({width,height:900});await page.setViewportSize({width,height:900});
      const sourceColumns=await original.locator('.gallery-page-list').evaluate(el=>Math.round(el.clientWidth/el.querySelector('.gallery-item').getBoundingClientRect().width));
      const newColumns=await page.locator('#collections').evaluate(el=>Math.round(el.clientWidth/el.querySelector('.photo-card').getBoundingClientRect().width));
      assert.equal(newColumns,sourceColumns,`${width}px matches original column count`);
    }
    await original.close();
    await page.setViewportSize({width:844,height:390});
    await page.getByRole('button',{name:'Outfit',exact:true}).click();
    const shortPanel=page.locator('#filter-outfit');
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    assert.ok(await shortPanel.evaluate(panel=>{
      const box=panel.getBoundingClientRect(), apply=panel.querySelector('.apply-filters').getBoundingClientRect();
      return box.top>=0 && box.bottom<=innerHeight && apply.top>=box.top && apply.bottom<=box.bottom;
    }),'Landscape tablet keeps entire Apply button inside the popover');
    await shortPanel.getByRole('button',{name:'Cancel',exact:true}).click();
    const filePage=await browser.newPage({viewport:{width:390,height:844}});
    const fileErrors=[];filePage.on('pageerror',error=>fileErrors.push(error.message));
    await filePage.goto(new URL(`../${folder}/improved/index.html`,import.meta.url).href);
    assert.equal(await filePage.locator('.photo-card').count(),total,'file:// opens without a web server');
    await filePage.locator('.mobile-filter').click();
    await filePage.locator('#mobile-filters').getByLabel('Black',{exact:true}).check();
    await filePage.locator('#mobile-filters').getByRole('button',{name:'Apply',exact:true}).click();
    assert.equal(await filePage.locator('.photo-card').count(),blackCount,'file:// filters work');
    assert.deepEqual(fileErrors,[]);
    await filePage.close();
    assert.deepEqual(errors,[]);
    results.push({folder,total,blackCount,status:'PASS'});
    await page.close();
  }
  await fs.writeFile(new URL('../docs/order-2-browser-results.json',import.meta.url),JSON.stringify(results,null,2)+'\n');
  console.log(JSON.stringify(results));
} finally { await browser.close(); }
