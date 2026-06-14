const PW='/home/nmaldaner/.npm/_npx/e41f203b7505f1fb/node_modules/playwright';
const {chromium}=require(PW);
const B='http://127.0.0.1:8137';
(async()=>{let br;try{br=await chromium.launch({headless:true})}catch(e){br=await chromium.launch({headless:true,executablePath:require('os').homedir()+'/.cache/ms-playwright/chromium-1223/chrome-linux/chrome'})}
const ctx=await br.newContext({viewport:{width:1280,height:1180},deviceScaleFactor:1.5});const p=await ctx.newPage();
// landing
await p.goto(B+'/index.html',{waitUntil:'networkidle'});await p.waitForTimeout(900);
await p.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('inema.')).forEach(k=>localStorage.removeItem(k)));
await p.reload({waitUntil:'networkidle'});await p.waitForTimeout(700);
await p.screenshot({path:'verify/v3demo-landing.png'});
// modulo papel, semeado (2 lidos, 1 grifo+nota, 1 duvida)
await p.goto(B+'/curso/trilha1/modulo-1-1.html',{waitUntil:'networkidle'});await p.waitForTimeout(900);
await p.evaluate(()=>{const ids=[...document.querySelectorAll('[data-inema-topic]')].map(e=>e.getAttribute('data-inema-topic'));
 window.INEMA.markRead(ids[0],true);window.INEMA.markRead(ids[1],true);
 const r=document.querySelector('[data-inema-rail="'+ids[2]+'"] [data-inema-doubt-toggle]');if(r)r.click();
 const blk=document.querySelector('[data-inema-block]');const tn=[...blk.childNodes].find(n=>n.nodeType===3&&n.textContent.trim().length>15)||blk.firstChild;
 const rg=document.createRange();rg.setStart(tn,0);rg.setEnd(tn,Math.min(28,tn.textContent.length));window.INEMA.highlight(rg,{color:'yellow',note:'revisar isso depois'});});
await p.waitForTimeout(500);
await p.screenshot({path:'verify/v3demo-modulo-papel.png'});
// escuro
await p.evaluate(()=>window.INEMA.setPref('theme','escuro'));await p.waitForTimeout(700);
await p.screenshot({path:'verify/v3demo-modulo-escuro.png'});
// mobile (papel)
const m=await(await br.newContext({viewport:{width:390,height:880},isMobile:true,deviceScaleFactor:2})).newPage();
await m.goto(B+'/curso/trilha1/modulo-1-1.html',{waitUntil:'networkidle'});await m.waitForTimeout(900);
await m.screenshot({path:'verify/v3demo-mobile.png'});
await br.close();console.log('render demo3 ok');})().catch(e=>{console.log('ERR',e.stack);process.exit(1)});
