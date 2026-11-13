import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = fileURLToPath(new URL('..', import.meta.url));
for (const folder of ['gallery-page-dunnio-tailor', 'dunnio-life-page-dunnio-tailor']) {
  test(`${folder}: manifest and browser paths resolve to the same real images`, () => {
    const base = path.join(root, folder);
    const rows = JSON.parse(fs.readFileSync(path.join(base,'docs/image-manifest.json'),'utf8'));
    const context = {window:{}};
    vm.runInNewContext(fs.readFileSync(path.join(base,'assets/image-data.js'),'utf8'),context);
    assert.equal(rows.length,folder.startsWith('gallery') ? 28 : 50);
    rows.forEach((row,i) => {
      const runtime = context.window.DUNNIO_IMAGES[i];
      for (const key of ['src','thumbnail']) {
        const manifestPath = path.resolve(base,row[key]);
        const browserPath = path.resolve(base,'improved',runtime[key]);
        assert.ok(fs.existsSync(manifestPath),`${row.id}: ${key} manifest path must exist`);
        assert.equal(browserPath,manifestPath,`${row.id}: ${key} browser/manifest agreement`);
      }
      assert.ok(row.outfitLabel && row.situation && row.occasions.length);
      assert.equal(runtime.outfit,row.outfit);
      assert.ok(row.filename.includes(row.outfit));
    });
  });
}
