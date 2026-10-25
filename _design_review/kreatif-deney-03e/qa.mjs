import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve('_design_review/kreatif-deney-03e');fs.mkdirSync(root+'/qa',{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const results=[];
for(const [w,h] of [[390,844],[320,568],[768,1024],[1280,720],[1440,900]]){
 const p=await browser.newPage({viewport:{width:w,height:h}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(pathToFileURL(root+'/index.html').href);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(150);
 const initial=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,bagCount:document.querySelectorAll('main img[src$="seamless-pack.jpg"]').length,missing:[...document.images].filter(i=>i.complete&&!i.naturalWidth).length,cta:document.querySelector('.btn').getBoundingClientRect().bottom}));
 await p.screenshot({path:root+`/qa/${w}-ilk.jpg`,type:'jpeg',quality:85});
 await p.evaluate(async()=>{for(const img of document.images) img.loading='eager'; await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));scrollTo({top:0,behavior:'instant'});}); await p.waitForTimeout(100); initial.missingAfterLoad=await p.evaluate(()=>[...document.images].filter(i=>!i.naturalWidth).length);
 await p.screenshot({path:root+`/qa/${w}-tam.jpg`,fullPage:true,type:'jpeg',quality:80});
 await p.locator('[data-urun="seamless"]').click();const dialog=await p.locator('#urunDiyalog').evaluate(e=>e.open);await p.keyboard.press('Escape');
 const focus=await p.evaluate(()=>document.activeElement.dataset.urun==='seamless');
 if(w<901){await p.locator('#menuDugme').click();await p.keyboard.press('Escape');}
 await p.locator('.btn').click();await p.waitForTimeout(500);
 const anchor=await p.locator('#koleksiyon').evaluate(e=>e.getBoundingClientRect().top);
 await p.evaluate(()=>scrollTo({top:160,behavior:'instant'}));await p.waitForTimeout(150);
 await p.screenshot({path:root+`/qa/${w}-hareket.jpg`,type:'jpeg',quality:85});
 results.push({w,...initial,dialog,focus,anchor,errors});await p.close();
}
const p=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await p.goto(pathToFileURL(root+'/index.html').href);await p.evaluate(()=>scrollTo(0,160));await p.waitForTimeout(100);results.push({reduced:await p.locator('#merkezGorsel').evaluate(e=>getComputedStyle(e).transform)});await p.close();
await browser.close();fs.writeFileSync(root+'/qa/sonuc.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));

