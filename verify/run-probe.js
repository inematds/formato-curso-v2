const PW = '/home/nmaldaner/.npm/_npx/e41f203b7505f1fb/node_modules/playwright';
const EXEC = '/home/nmaldaner/.cache/ms-playwright/chromium-1223/chrome-linux/chrome';
const URL = 'file:///home/nmaldaner/projetos/formato-curso-inema/verify/v1-probe.html';

(async () => {
  const { chromium } = require(PW);
  let browser;
  try {
    browser = await chromium.launch({ headless: true, executablePath: EXEC });
  } catch (e) {
    console.log('FALLBACK_NO_EXECPATH: ' + e.message);
    browser = await chromium.launch({ headless: true });
  }

  const results = {};
  const consoleMsgs = [];
  const pageErrors = [];

  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') consoleMsgs.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', e => pageErrors.push(String(e)));

  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForTimeout(1300); // Tailwind CDN

  // sanity: did Tailwind apply? check that a known utility class produces a computed style
  results.tailwindApplied = await page.evaluate(() => {
    const el = document.querySelector('.bg-dark-800');
    if (!el) return 'no .bg-dark-800 element';
    const bg = getComputedStyle(el).backgroundColor;
    return bg;
  });

  // (a) THEME TOGGLE
  const beforeTheme = await page.evaluate(() => ({
    hasDark: document.documentElement.classList.contains('dark'),
    bodyBg: getComputedStyle(document.body).backgroundColor
  }));
  // which icons visible before
  const iconsBefore = await page.evaluate(() => ({
    darkIconHidden: document.getElementById('theme-toggle-dark-icon').classList.contains('hidden'),
    lightIconHidden: document.getElementById('theme-toggle-light-icon').classList.contains('hidden')
  }));
  await page.click('#theme-toggle');
  await page.waitForTimeout(250);
  const afterTheme = await page.evaluate(() => ({
    hasDark: document.documentElement.classList.contains('dark'),
    bodyBg: getComputedStyle(document.body).backgroundColor
  }));
  const iconsAfter = await page.evaluate(() => ({
    darkIconHidden: document.getElementById('theme-toggle-dark-icon').classList.contains('hidden'),
    lightIconHidden: document.getElementById('theme-toggle-light-icon').classList.contains('hidden')
  }));
  results.theme = {
    beforeHasDark: beforeTheme.hasDark, afterHasDark: afterTheme.hasDark,
    beforeBodyBg: beforeTheme.bodyBg, afterBodyBg: afterTheme.bodyBg,
    classToggled: beforeTheme.hasDark !== afterTheme.hasDark,
    bgChanged: beforeTheme.bodyBg !== afterTheme.bodyBg,
    iconsBefore, iconsAfter
  };
  // toggle back to dark for the rest of tests
  await page.click('#theme-toggle');
  await page.waitForTimeout(150);

  // (b) TOGGLE TOPIC
  const topic1 = page.locator('.topic-item').first();
  const expl1 = topic1.locator('.topic-explanation');
  const beforeExpand = await expl1.evaluate(el => getComputedStyle(el).display);
  await topic1.locator('button').click();
  await page.waitForTimeout(150);
  const afterExpand = await expl1.evaluate(el => getComputedStyle(el).display);
  await topic1.locator('button').click();
  await page.waitForTimeout(150);
  const afterCollapse = await expl1.evaluate(el => getComputedStyle(el).display);
  results.toggleTopic = {
    beforeDisplay: beforeExpand, afterExpandDisplay: afterExpand, afterCollapseDisplay: afterCollapse,
    expandsOk: beforeExpand === 'none' && afterExpand === 'block',
    collapsesOk: afterCollapse === 'none'
  };

  // (c) OPEN MODAL
  await page.click('button[onclick="openModal(\'modal-1-1\')"]');
  await page.waitForTimeout(400);
  const modalState = await page.evaluate(() => {
    const m = document.getElementById('modal-1-1');
    const hidden = m.classList.contains('hidden');
    const disp = getComputedStyle(m).display;
    const iframe = m.querySelector('iframe');
    return { hidden, display: disp, hasIframe: !!iframe, iframeSrc: iframe ? iframe.getAttribute('src') : null,
             bodyOverflow: document.body.style.overflow };
  });
  // check iframe actually has a contentDocument that loaded
  await page.waitForTimeout(900);
  const iframeLoaded = await page.evaluate(() => {
    const iframe = document.querySelector('#modal-1-1 iframe');
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      return { reachable: true, hasBody: !!(doc && doc.body), bodyChildren: doc && doc.body ? doc.body.children.length : 0 };
    } catch (e) { return { reachable: false, err: String(e) }; }
  });
  results.modal = { ...modalState, iframeLoaded };
  // close it (ESC)
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
  results.modal.afterEscHidden = await page.evaluate(() => document.getElementById('modal-1-1').classList.contains('hidden'));

  // (d) MOBILE 390px OVERFLOW
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(400);
  const overflow = await page.evaluate(() => {
    const de = document.documentElement;
    const scrollW = de.scrollWidth;
    const clientW = de.clientWidth;
    const innerW = window.innerWidth;
    // find elements wider than viewport
    const offenders = [];
    document.querySelectorAll('*').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.right > innerW + 1 || r.width > innerW + 1) {
        offenders.push({ tag: el.tagName, cls: (el.className && el.className.toString().slice(0,60)) || '', right: Math.round(r.right), w: Math.round(r.width) });
      }
    });
    return { scrollW, clientW, innerW, hasHorizontalOverflow: scrollW > clientW + 1, offenders: offenders.slice(0, 10) };
  });
  results.mobile390 = overflow;

  // (e) console / pageerror
  results.consoleMsgs = consoleMsgs;
  results.pageErrors = pageErrors;

  console.log('===RESULTS_JSON_START===');
  console.log(JSON.stringify(results, null, 2));
  console.log('===RESULTS_JSON_END===');

  await browser.close();
})().catch(e => { console.log('FATAL: ' + (e && e.stack || e)); process.exit(1); });
