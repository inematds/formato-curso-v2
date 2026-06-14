const PW = '/home/nmaldaner/.npm/_npx/e41f203b7505f1fb/node_modules/playwright';
const EXEC = '/home/nmaldaner/.cache/ms-playwright/chromium-1223/chrome-linux/chrome';
const URL = 'file:///home/nmaldaner/projetos/formato-curso-inema/verify/v1-probe.html';

(async () => {
  const { chromium } = require(PW);
  const browser = await chromium.launch({ headless: true, executablePath: EXEC });
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForTimeout(1300);

  const out = {};

  // confirm iframe load via load event listener attached fresh, then open modal
  await page.evaluate(() => {
    window.__iframeLoaded = false;
    const ifr = document.querySelector('#modal-1-1 iframe');
    ifr.addEventListener('load', () => { window.__iframeLoaded = true; });
  });
  await page.click("button[onclick=\"openModal('modal-1-1')\"]");
  await page.waitForTimeout(1500);
  out.iframeLoadEventFired = await page.evaluate(() => window.__iframeLoaded);
  // bounding box of iframe (is it actually visible & sized?)
  out.iframeBox = await page.evaluate(() => {
    const ifr = document.querySelector('#modal-1-1 iframe');
    const r = ifr.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height), visible: r.width > 100 && r.height > 100 };
  });

  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);

  // Light mode body background investigation
  await page.click('#theme-toggle');
  await page.waitForTimeout(250);
  out.lightMode = await page.evaluate(() => {
    const body = document.body;
    const cs = getComputedStyle(body);
    return {
      htmlHasDark: document.documentElement.classList.contains('dark'),
      bodyClasses: body.className,
      bodyComputedBg: cs.backgroundColor,
      // what would f8fafc be vs ffffff
      note: 'spec body rule = #f8fafc (248,250,252); bg-dark-900 light override = #ffffff'
    };
  });

  console.log('===R2_START===');
  console.log(JSON.stringify(out, null, 2));
  console.log('===R2_END===');
  await browser.close();
})().catch(e => { console.log('FATAL: ' + (e && e.stack || e)); process.exit(1); });
