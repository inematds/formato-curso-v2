/* Smoke v3: motor + temas papel/sepia/escuro + renderRail na margem + agregacao + export/import. */
const PW = '/home/nmaldaner/.npm/_npx/e41f203b7505f1fb/node_modules/playwright';
const { chromium } = require(PW);
const B = 'http://127.0.0.1:8137';
const M1 = B + '/curso/trilha1/modulo-1-1.html';
const M2 = B + '/curso/trilha1/modulo-1-2.html';
const R = { pass: [], fail: [], consoleErrors: [] };
const ok = (c, m) => (c ? R.pass : R.fail).push((c ? 'OK  ' : 'XX  ') + m);
const transp = (c) => !c || c === 'rgba(0, 0, 0, 0)' || c === 'transparent';

(async () => {
  let b; try { b = await chromium.launch({ headless: true }); }
  catch (e) { b = await chromium.launch({ headless: true, executablePath: require('os').homedir() + '/.cache/ms-playwright/chromium-1223/chrome-linux/chrome' }); }
  const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  p.on('console', (m) => { if (m.type() === 'error') R.consoleErrors.push(m.text()); });
  p.on('pageerror', (e) => R.consoleErrors.push('PAGEERR ' + e.message));
  await p.goto(M1, { waitUntil: 'networkidle' }); await p.waitForTimeout(700);
  await p.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('inema.')).forEach((k) => localStorage.removeItem(k)));
  await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(600);

  const api = await p.evaluate(() => {
    const I = window.INEMA; if (!I) return { ok: false };
    const M = ['init', 'markRead', 'isRead', 'progress', 'toggleDoubt', 'highlight', 'exportJSON', 'importJSON', 'setPref', 'openJourney'];
    return { ok: true, missing: M.filter((m) => typeof I[m] !== 'function') };
  });
  ok(api.ok, 'window.INEMA existe'); if (api.ok) ok(api.missing.length === 0, 'API ok (faltando ' + JSON.stringify(api.missing) + ')');

  const topics = await p.evaluate(() => [...document.querySelectorAll('[data-inema-topic]')].map((e) => e.getAttribute('data-inema-topic')));
  ok(topics.length === 7, 'modulo-1-1 tem 7 topicos (' + topics.length + ')');
  ok(await p.evaluate(() => window.INEMA.progress('curso').total) === 14, 'manifesto total curso=14 cross-modulo');

  // renderRail: a margem de cada secao foi populada com o painel do aluno
  const rail = await p.evaluate(() => {
    const rails = [...document.querySelectorAll('[data-inema-rail]')];
    const withRead = rails.filter((r) => r.querySelector('[data-inema-read-toggle]')).length;
    const withDoubt = rails.filter((r) => r.querySelector('[data-inema-doubt-toggle]')).length;
    return { rails: rails.length, withRead, withDoubt };
  });
  ok(rail.withRead >= 7, 'renderRail montou "marcar lida" em cada secao na MARGEM (' + rail.withRead + '/' + rail.rails + ')');
  ok(rail.withDoubt >= 7, 'renderRail montou "tenho duvida" na margem (' + rail.withDoubt + ')');

  // clica marcar-lida no rail da secao 1
  const click = await p.evaluate((ids) => {
    const rail = document.querySelector('[data-inema-rail="' + ids[0] + '"]');
    const btn = rail && rail.querySelector('[data-inema-read-toggle]');
    if (!btn) return { has: false };
    const before = btn.getAttribute('aria-pressed'); btn.click();
    return { has: true, before, after: btn.getAttribute('aria-pressed'), read: window.INEMA.isRead(ids[0]), prog: window.INEMA.progress('curso').done };
  }, topics);
  ok(click.has, 'botao marcar-lida existe no rail');
  if (click.has) ok(click.before !== click.after && click.read === true && click.prog === 1, 'clique marca lido + progresso sobe (' + click.before + '->' + click.after + ', done=' + click.prog + ')');

  // reload -> persiste
  await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(600);
  ok(await p.evaluate((ids) => window.INEMA.isRead(ids[0]), topics) === true, 'lido persiste apos reload');

  // duvida na margem
  const doubt = await p.evaluate((ids) => { const r = document.querySelector('[data-inema-rail="' + ids[1] + '"] [data-inema-doubt-toggle]'); if (!r) return -1; r.click(); return window.INEMA.listDoubts ? window.INEMA.listDoubts().length : 1; }, topics);
  ok(doubt >= 1, 'duvida na margem registra (' + doubt + ')');

  // highlight -> aparece <mark> + na margem da secao
  const hl = await p.evaluate(() => {
    const blk = document.querySelector('[data-inema-block]'); if (!blk) return { ok: false, why: 'sem block' };
    const tn = [...blk.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim().length > 12) || blk.firstChild;
    const r = document.createRange(); r.setStart(tn, 0); r.setEnd(tn, Math.min(14, tn.textContent.length));
    let id; try { id = window.INEMA.highlight(r, { color: 'yellow', note: 'minha nota v3' }); } catch (e) { return { ok: false, why: 'throw ' + e.message }; }
    const mark = document.querySelector('mark.hl, mark[data-hl]');
    const inRail = [...document.querySelectorAll('[data-inema-rail]')].some((x) => /minha nota v3/.test(x.textContent));
    return { ok: !!id, mark: !!mark, markBg: mark && getComputedStyle(mark).backgroundColor, inRail };
  });
  ok(hl.ok, 'highlight() sem erro (' + (hl.why || '') + ')');
  ok(hl.mark && !transp(hl.markBg), 'grifo tem <mark> com cor (' + hl.markBg + ')');
  ok(hl.inRail, 'nota do aluno aparece na MARGEM da secao');

  // temas papel/sepia/escuro aplicam e mudam o fundo
  const bgs = {};
  for (const t of ['papel', 'sepia', 'escuro']) { await p.evaluate((th) => window.INEMA.setPref('theme', th), t); await p.waitForTimeout(350); bgs[t] = await p.evaluate(() => ({ dt: document.documentElement.getAttribute('data-theme'), bg: getComputedStyle(document.body).backgroundColor })); }
  ok(bgs.papel.dt === 'papel' && bgs.sepia.dt === 'sepia' && bgs.escuro.dt === 'escuro', 'data-theme aplica papel/sepia/escuro');
  ok(new Set([bgs.papel.bg, bgs.sepia.bg, bgs.escuro.bg]).size === 3, 'os 3 temas tem fundos distintos (' + JSON.stringify({ papel: bgs.papel.bg, sepia: bgs.sepia.bg, escuro: bgs.escuro.bg }) + ')');

  // export + cross-modulo
  const exp = await p.evaluate(() => window.INEMA.exportJSON());
  await p.goto(M2, { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
  const m2 = await p.evaluate(() => ({ dt: document.documentElement.getAttribute('data-theme'), done: window.INEMA.progress('curso').done }));
  ok(m2.dt === 'escuro', 'tema persiste ao navegar p/ modulo-1-2 (' + m2.dt + ')');
  ok(m2.done === 1, 'progresso do curso agrega cross-modulo no modulo-1-2 (done=' + m2.done + ')');
  const rt = await p.evaluate((payload) => { Object.keys(localStorage).filter((k) => k.startsWith('inema.demo3')).forEach((k) => localStorage.removeItem(k)); const before = window.INEMA.progress('curso').done; const res = window.INEMA.importJSON(payload, { mode: 'merge' }); return { before, after: window.INEMA.progress('curso').done, ok: res && res.ok !== false }; }, exp);
  ok(rt.ok && rt.before === 0 && rt.after === 1, 'import round-trip restaura (' + rt.before + '->' + rt.after + ')');

  // mobile sem overflow horizontal
  const mp = await (await b.newContext({ viewport: { width: 390, height: 860 }, isMobile: true })).newPage();
  await mp.goto(M1, { waitUntil: 'networkidle' }); await mp.waitForTimeout(600);
  const ov = await mp.evaluate(() => ({ hs: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  ok(!ov.hs, 'mobile SEM overflow horizontal (' + ov.sw + ' vs ' + ov.cw + ')');

  ok(R.consoleErrors.length === 0, 'sem erros de console (' + R.consoleErrors.length + ': ' + R.consoleErrors.slice(0, 2).join(' | ') + ')');
  await p.screenshot({ path: '/home/nmaldaner/projetos/formato-curso-inema/verify/v3-smoke-state.png' });
  await b.close();
  console.log(JSON.stringify(R, null, 2));
  console.log('\nRESUMO v3: ' + R.pass.length + ' OK, ' + R.fail.length + ' FALHA');
  process.exit(R.fail.length ? 1 : 0);
})().catch((e) => { console.log('FATAL ' + e.stack); process.exit(2); });
