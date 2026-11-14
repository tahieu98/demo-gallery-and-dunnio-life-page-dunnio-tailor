import assert from 'node:assert/strict';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const deps = process.env.DUNNIO_NODE_MODULES || path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
const {chromium} = createRequire(path.join(deps, 'package.json'))('playwright');
const base = process.env.DUNNIO_TEST_URL || 'http://127.0.0.1:4195/demo-gallery-and-dunnio-life-page-dunnio-tailor';
const root = fileURLToPath(new URL('../', import.meta.url));
const output = process.env.DUNNIO_TEST_OUTPUT || path.join(root, 'docs/order-5-previews');
await fs.mkdir(output, {recursive:true});
const browser = await chromium.launch({headless:true});
const results = [];
try {
  for (const variant of ['original', 'proposed']) {
    console.log('Checking', variant);
    const page = await browser.newPage({viewport:{width:1440,height:1000}});
    page.setDefaultTimeout(10000);
    const errors = [], failed = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if(r.status() >= 400 && r.url().startsWith(base)) failed.push(`${r.status()} ${r.url()}`); });
    await page.goto(`${base}/craftmanship-page-dunnio-tailor-${variant}/`, {waitUntil:'networkidle'});
    await page.evaluate(async () => { await document.fonts.ready; });
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.evaluate(async () => { document.querySelectorAll('img').forEach(i=>{i.loading='eager';}); await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
    await page.evaluate(() => window.scrollTo(0,0));
    const imageErrors = await page.locator('img').evaluateAll(images => images.filter(i => !i.naturalWidth).map(i => i.src));
    assert.deepEqual(imageErrors, [], 'All visible and lazy images load');
    for (const width of [320,375,390,600,768,1024,1440,1920]) {
      await page.setViewportSize({width,height:1000});
      await page.evaluate(() => window.scrollTo(0,0));
      const bounds = await page.evaluate(() => ({width:innerWidth,scroll:document.documentElement.scrollWidth}));
      assert.ok(bounds.scroll <= bounds.width + 1, `${variant} fits ${width}px: ${JSON.stringify(bounds)}`);
      if(width === 390 || width === 1440) {
        await page.screenshot({path:path.join(output,`${variant}-${width}.png`),fullPage:true});
        await page.screenshot({path:path.join(output,`${variant}-${width}-viewport.png`)});
      }
    }
    await page.setViewportSize({width:1440,height:1000});
    if(variant === 'proposed') {
      for (const year of ['2009','2011','2013','2016','2019','2023','2025','2026']) {
        await page.getByRole('tab',{name:year,exact:true}).click();
        assert.equal(await page.getByRole('tabpanel').count(), 1);
        assert.equal(await page.locator(`#year-${year}`).isVisible(), true);
      }
      await page.getByRole('tab',{name:'2026',exact:true}).press('Home');
      assert.equal(await page.getByRole('tab',{name:'2009',exact:true}).getAttribute('aria-selected'),'true');
      await page.getByRole('tab',{name:'2009',exact:true}).press('ArrowRight');
      assert.equal(await page.getByRole('tab',{name:'2011',exact:true}).getAttribute('aria-selected'),'true');
      await page.getByRole('tab',{name:'2011',exact:true}).press('End');
      assert.equal(await page.getByRole('tab',{name:'2026',exact:true}).getAttribute('aria-selected'),'true');
      for(const label of ["Read Duy's story",'Meet Hiếu','Meet Đoàn']) {
        const trigger = page.getByRole('button',{name:label,exact:true});
        await trigger.click();
        assert.equal(await page.locator('#profile-dialog').isVisible(), true);
        assert.ok(await page.locator('#profile-content p').count() > 20);
        await page.keyboard.press('Escape');
        assert.equal(await trigger.evaluate(el => el === document.activeElement),true,'Profile focus returns to opener');
      }
      for(const pillar of ['Production','Technology','Platform']) {
        const summary = page.locator('.pillar summary').filter({hasText:pillar});
        const details = page.locator('.pillar').filter({has:page.locator('summary').filter({hasText:pillar})});
        if(!(await details.getAttribute('open')) && !(await details.evaluate(el=>el.open))) await summary.click();
        assert.equal(await details.evaluate(el=>el.open),true);
      }
      await page.locator('.chapter-links a[href="#pillars"]').click();
      await page.waitForFunction(() => document.querySelector('.chapter-links a[href="#pillars"]').getAttribute('aria-current') === 'location');
      await page.setViewportSize({width:390,height:844});
      await page.getByRole('button',{name:'Open menu',exact:true}).click();
      assert.equal(await page.locator('#site-menu').isVisible(),true);
      await page.locator('#site-menu').getByRole('link',{name:'The founder',exact:true}).click();
      assert.equal(await page.locator('#site-menu').isVisible(),false);
      await page.getByRole('button',{name:'Open menu',exact:true}).click();
      await page.keyboard.press('Escape');
      assert.equal(await page.getByRole('button',{name:'Open menu',exact:true}).evaluate(el=>el===document.activeElement),true);
      await page.getByLabel('Email address',{exact:true}).fill('design-review@example.com');
      const submissions=[];
      page.on('request', request => { if(request.method()==='POST')submissions.push(request.url()); });
      await page.getByRole('button',{name:'Subscribe',exact:true}).click();
      assert.match(await page.locator('#newsletter-status').textContent(),/has not sent/);
      assert.deepEqual(submissions,[]);
      await page.emulateMedia({reducedMotion:'reduce'});
      assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');
      await page.screenshot({path:path.join(output,'proposed-newsletter-mobile.png')});
    } else {
      console.log('Original profiles');
      for (const name of ['HIEU NGUYEN DUC','DOAN TRAN VAN','DUY DAT NGUYEN']) {
        await page.locator('.staff-item-title a').filter({hasText:name}).click();
        assert.equal(await page.locator('.profile-dialog').isVisible(),true);
        await page.keyboard.press('Escape');
      }
      await page.setViewportSize({width:390,height:844});
      console.log('Original menu');
      await page.getByRole('button',{name:'Open menu',exact:true}).first().click();
      assert.equal(await page.locator('.reference-menu').isVisible(),true);
      await page.getByRole('button',{name:'Close menu',exact:true}).click();
      await page.getByLabel('Email address',{exact:true}).fill('design-review@example.com');
      console.log('Original newsletter');
      await page.getByRole('button',{name:'Submit',exact:true}).click();
      assert.match(await page.locator('.reference-form-status').textContent(),/No subscription/);
      const footer = page.locator('.footer-menu-item .nolink').filter({hasText:'Custom'});
      console.log('Original footer');
      await footer.click();
      assert.equal(await footer.getAttribute('aria-expanded'),'true');
    }
    assert.deepEqual(errors,[],'No runtime errors');
    assert.deepEqual(failed,[],'No missing local assets');
    results.push({variant,status:'PASS',viewports:[320,375,390,600,768,1024,1440,1920],images:'all loaded',runtimeErrors:errors,failedAssets:failed});
    await page.close();
  }
  const noJs = await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
  await noJs.goto(`${base}/craftmanship-page-dunnio-tailor-proposed/`);
  assert.equal(await noJs.locator('.milestone:visible').count(),8,'No-JS timeline remains readable');
  assert.ok(await noJs.locator('noscript a').count()===3,'No-JS profile links exist');
  await noJs.close();
  // Plain HTML files also work without a server or fetch calls.
  const filePage = await browser.newPage();
  await filePage.goto(new URL('../craftmanship-page-dunnio-tailor-proposed/index.html',import.meta.url).href);
  await filePage.getByRole('button',{name:"Read Duy's story",exact:true}).click();
  assert.equal(await filePage.locator('#profile-dialog').isVisible(),true);
  await filePage.close();
  await fs.writeFile(path.join(output,'results.json'),JSON.stringify({date:'2026-11-15',base,results,noJavaScript:'PASS',fileProtocol:'PASS'},null,2)+'\n');
  console.log(JSON.stringify(results,null,2));
} finally { await browser.close(); }
