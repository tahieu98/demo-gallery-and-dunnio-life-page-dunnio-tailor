import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
for(const folder of ['gallery-page-dunnio-tailor','dunnio-life-page-dunnio-tailor']){
  const result=spawnSync(process.execPath,[path.join(root,folder,'verify.mjs')],{stdio:'inherit'});
  if(result.status!==0)process.exit(result.status||1);
}
const errors=[];
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.name.startsWith('.')?[]:e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
for(const file of walk(root).filter(f=>f.endsWith('.html'))){
  const html=fs.readFileSync(file,'utf8');
  if(!/<meta\b(?=[^>]*\bname=["']robots["'])(?=[^>]*\bcontent=["'][^"']*noindex)/i.test(html))errors.push(`Missing noindex: ${file}`);
  if(!/<html[^>]*lang="en"/.test(html))errors.push(`Missing English language: ${file}`);
  for(const [,ref]of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)){
    if(/^(?:https?:|mailto:|tel:|data:|#|\/)/.test(ref))continue;
    const target=path.resolve(path.dirname(file),decodeURIComponent(ref.split(/[?#]/)[0]));
    if(!target.startsWith(root+path.sep)||!fs.existsSync(target))errors.push(`Broken or external local reference: ${file} -> ${ref}`);
  }
}
const robots=fs.readFileSync(path.join(root,'robots.txt'),'utf8');
if(!/User-agent: \*\s+Disallow: \//.test(robots)||!robots.includes('GPTBot')||!robots.includes('ClaudeBot'))errors.push('Missing crawler policies');
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log('PASS: combined site is self-contained, links resolve, English HTML has noindex, crawler policies exist.');
