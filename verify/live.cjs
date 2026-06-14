const PW='/home/nmaldaner/.npm/_npx/e41f203b7505f1fb/node_modules/playwright';
const {chromium}=require(PW);
(async()=>{let b;try{b=await chromium.launch({headless:true})}catch(e){b=await chromium.launch({headless:true,executablePath:require('os').homedir()+'/.cache/ms-playwright/chromium-1223/chrome-linux/chrome'})}
const p=await(await b.newContext()).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('https://inematds.github.io/formato-curso-v2/demo/curso/trilha1/modulo-1-1.html',{waitUntil:'networkidle'});
await p.waitForTimeout(800);
const r=await p.evaluate(()=>{const I=window.INEMA;const ids=[...document.querySelectorAll('[data-inema-topic]')].map(e=>e.getAttribute('data-inema-topic'));I.markRead(ids[0],true);I.setPref('theme','sepia');return{api:!!I,total:I.progress('curso').total,done:I.progress('curso').done,theme:document.documentElement.getAttribute('data-theme')};});
console.log('INEMA carregou:',r.api,'| progresso curso done/total:',r.done+'/'+r.total,'| tema:',r.theme,'| pageerrors:',errs.length);
await b.close();})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
