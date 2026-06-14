const PW='/home/nmaldaner/.npm/_npx/e41f203b7505f1fb/node_modules/playwright';
const {chromium}=require(PW);
const fs=require('fs');
(async()=>{let br;try{br=await chromium.launch({headless:true})}catch(e){br=await chromium.launch({headless:true,executablePath:require('os').homedir()+'/.cache/ms-playwright/chromium-1223/chrome-linux/chrome'})}
const ctx=await br.newContext({viewport:{width:1280,height:1120},deviceScaleFactor:1.5});
const dir='/home/nmaldaner/projetos/formato-curso-inema/mockups/';
for(const f of ['editorial-textbook','terminal-blueprint','calmo-notebook','editorial-bold']){
  const p=await ctx.newPage();
  await p.goto('file://'+dir+f+'.html',{waitUntil:'networkidle'});
  await p.waitForTimeout(1200); // deixa Google Fonts assentar
  await p.screenshot({path:'/home/nmaldaner/projetos/formato-curso-inema/mockups/render-'+f+'.png'});
  await p.close();
  console.log('render '+f+' ok');
}
await br.close();})().catch(e=>{console.log('ERR',e.stack);process.exit(1)});
