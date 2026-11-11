import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'docs/image-manifest.json'),'utf8'));
const errors=[];
const check= (condition,message) => {if(!condition)errors.push(message);};
const ids=new Set(), names=new Set();
for(const image of manifest){
  check(!ids.has(image.id),`Duplicate ID: ${image.id}`);ids.add(image.id);
  check(!names.has(image.filename),`Duplicate filename: ${image.filename}`);names.add(image.filename);
  check(image.width>0 && image.height>0,`Invalid dimensions: ${image.id}`);
  check(image.orientation===(image.width>image.height?'landscape':image.width<image.height?'portrait':'square'),`Incorrect orientation: ${image.id}`);
  check(image.filename.includes('-outfit-'),`Unclassified filename: ${image.id}`);
  for(const field of ['src','thumbnail'])check(fs.existsSync(path.join(root,image[field])),`Missing ${field}: ${image.id}`);
}
function walk(directory){return fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry=>entry.name.startsWith('.')?[]:entry.isDirectory()?walk(path.join(directory,entry.name)):[path.join(directory,entry.name)]);}
for(const file of walk(root).filter(file=>/\.(html|css)$/.test(file))){
  const content=fs.readFileSync(file,'utf8');
  const refs=[...content.matchAll(/(?:src|href)=["']([^"']+)["']/g)].map(match=>match[1]);
  refs.push(...[...content.matchAll(/url\(\s*["']?([^)'"\s]+)["']?\s*\)/g)].map(match=>match[1]));
  for(const ref of refs){
    if(/^(?:https?:|mailto:|tel:|data:|#|\/\/)/.test(ref))continue;
    const decoded=decodeURIComponent(ref);
    if(decoded.startsWith('#'))continue;
    const clean=decoded.split(/[?#]/)[0];
    check(fs.existsSync(path.resolve(path.dirname(file),clean)),`Missing reference: ${path.relative(root,file)} -> ${ref}`);
  }
}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(`PASS: ${manifest.length} images, unique IDs/names, native orientation, local photos, HTML/CSS asset references.`);
