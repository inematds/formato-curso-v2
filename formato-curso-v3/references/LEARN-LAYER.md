# LEARN-LAYER — contrato técnico (formato-curso-v3)

Contrato fiel da camada de aprendizagem do **formato-curso-v3**. Reflete o que
`assets/learn.js` (IIFE `window.INEMA`, sem build, sem deps) realmente faz e o
que `assets/learn.css` espera. Nada aqui é aspiracional: cada nome de chave,
atributo e método existe no código.

Princípios do motor (portados do v2, blindados):

- **Enhancement progressivo.** Se o JS quebrar ou o `localStorage` estiver
  bloqueado, o curso continua 100% legível. Toda I/O passa por wrappers no-throw;
  falha sempre cai no estado seguro.
- **Idempotente / re-entrant.** `INEMA.init()` pode rodar em qualquer página
  (landing, trilha, módulo) e mais de uma vez — guard `S.bound`/`S.inited` evita
  duplicar listeners. Feature-detect por presença de `data-inema-*`: só ativa o
  que existe na página.
- **Anti-XSS.** Todo texto do usuário entra via `textContent`; grifo é
  `<mark>` com `appendChild(textNode)`, nunca `innerHTML` de dado.

---

## 1. Modelo de dados — localStorage

### 1.1 Namespace de chaves

Estado **por curso** usa o prefixo `inema.<courseId>.<nome>`. O `courseId` vem de
`<meta name="inema-course" content="...">`; sem meta, é derivado do último
segmento do `pathname` (sanitizado, lowercase) — fallback final `"curso"`.

`SCHEMA_VERSION = 1`.

| Chave | Conteúdo | Reuso v2 |
|---|---|---|
| `inema.<courseId>.read` | progresso de leitura por tópico | sim |
| `inema.<courseId>.doubts` | dúvidas declaradas por tópico | sim |
| `inema.<courseId>.notes` | grifos/notas por bloco | sim |
| `inema.<courseId>.checks` | respostas de checagem leve | sim |
| `inema.<courseId>.meta` | checkpoint / "continuar de onde parei" | sim |
| `inema.prefs` | **GLOBAL** (cross-curso): tema, fonte, leitura | sim (com adaptações v3) |

Regra de robustez: leitura via `storageGet` faz `JSON.parse` defensivo; se o
valor está corrompido, **só aquela chave** é removida e devolve o fallback (`{}`).
Escrita via `storageSet` é sempre no-throw; `QuotaExceededError` dispara um toast
("Armazenamento cheio. Exporte sua jornada…") e retorna `false`, sem derrubar a UI.

**Modo efêmero.** Se `probeStorage()` falha (storage indisponível/bloqueado),
`S.ephemeral = true` e todo o estado vive num espelho em memória (`S.mem`); um
toast avisa "Modo leitura: seu progresso não será salvo neste navegador."

### 1.2 `read` — leitura

```jsonc
{ "modulo-1-1#topico-3": true, "modulo-1-2#topico-1": true }
```

Mapa `topicId → true`. **Ausência = não-lido**; o código nunca grava `false`
(desmarcar faz `delete`). O `topicId` é o valor de `data-inema-topic` da seção.

### 1.3 `doubts` — dúvidas por tópico

```jsonc
{
  "modulo-1-1#topico-3": { "ts": 1718380800000, "resolved": false, "note": "fiquei confuso aqui" }
}
```

`note` é texto livre, opcional (campo inline na margem). `resolved` controla o
filtro "só não resolvidas" na jornada. Toggle remove a chave inteira.

### 1.4 `notes` — grifos e notas por bloco

Mapa `blockId → array de registros`. `blockId` = `data-inema-block` do parágrafo.

```jsonc
{
  "m1-1-p4": [
    {
      "id": "n_1718380800000_a1b2",
      "ts": 1718380800000,
      "color": "yellow",                 // yellow|green|blue|pink|doubt
      "quote": "trecho grifado",         // SEMPRE gravado
      "note": "minha anotação" ,         // ou null
      "anchor": { "blockId": "m1-1-p4", "startOffset": 12, "endOffset": 28 },
      "tags": [],                         // "doubt" empurra "duvida"
      "orphan": false                     // true quando a âncora não reaplica
    }
  ]
}
```

Notas com `color: "doubt"` (ou `tags` contendo `"duvida"`) também entram na lista
de dúvidas consolidada da jornada. `orphan: true` marca um grifo cujo trecho não
foi reencontrado no DOM (re-render por `quote` falhou) — ele continua listado na
jornada, mas sem botão "ir ao trecho".

### 1.5 `checks` — checagem leve

```jsonc
{ "modulo-1-1#q1": { "choice": "b", "correct": true, "ts": 1718380800000 } }
```

Nunca bloqueia o aluno; apenas registra a escolha e se bateu com a resposta
declarada via `INEMA.registerCheck`.

### 1.6 `meta` — checkpoint

```jsonc
{
  "lastTopicAnchor": "modulo-1-2#topico-1",
  "lastModuleHref": "/cursos/fep/modulo-1-2.html",
  "lastScroll": 1840,
  "lastVisitedTs": 1718380800000,
  "completedAt": "2026-06-14T12:00:00.000Z"   // só após 100%
}
```

`saveCheckpoint()` é debounced (400ms) e dispara em `markRead`, `visibilitychange`
(hidden) e `pagehide`. `completedAt` é gravado uma única vez quando o curso chega
a 100% (toast de parabéns).

### 1.7 `inema.prefs` — GLOBAL, cross-curso

```jsonc
{
  "schemaVersion": 1,
  "theme": "papel",            // papel(default) | sepia | escuro
  "font": "serif",             // serif(default) | sans | hyperlegible
  "fontScale": 100,            // 90 | 100 | 112 | 125
  "lineWidth": 66,             // 62 | 66 | 70  (ch)
  "leading": 1.66,             // 1.62 | 1.66 | 1.70
  "reducedMotionOverride": null // null | true | false
}
```

`migratePrefs()` preenche defaults, saneia valores fora do domínio (→ default),
fixa `schemaVersion` e **remove a pref legada `accent` do v2** (no v3 o acento é
fixo `#2C5282`, vive no CSS; **não há `--accent` setado pelo JS** e o
`data-accent` legado é removido do `<html>`).

#### Temas v3 (adaptação)

Não há `.dark` do Tailwind — v3 é CSS próprio. O eixo de leitura mora inteiro em
`data-theme` no `<html>`, **sempre setado explicitamente** (inclusive `"papel"`):

| theme | `data-theme` | `color-scheme` |
|---|---|---|
| papel (default) | `papel` | `light` |
| sepia | `sepia` | `light` |
| escuro | `escuro` | `dark` |

#### Atributos e CSS vars escritos por `applyPrefs()` no `<html>`

| pref | atributo | CSS var | valor |
|---|---|---|---|
| theme | `data-theme` | — (+ `style.colorScheme`) | papel/sepia/escuro |
| font | `data-font` | `--font-disp`, `--font-body` | serif/sans/hyperlegible |
| fontScale | `data-fontscale` | `--fontscale` | ex. `112%` |
| lineWidth | `data-line-width` | `--measure` | slug `estreito\|medio\|largo` + `66ch` |
| leading | `data-leading` | `--leading` | slug `compacto\|confortavel` + `1.66` |
| reducedMotionOverride | `data-reduced-motion` (`"reduce"` ou ausente) | — | — |

Slugs: `lineWidthSlug` (≤62 estreito / ≥70 largo / senão medio);
`leadingSlug` (≤1.66 compacto / senão confortavel). Também remove `data-accent` e
`classList.remove('dark')` (limpeza do legado).

---

## 2. API pública — `window.INEMA`

IIFE auto-bootstrap. Guard de idempotência: se `window.INEMA.__core` já existe,
não recria. Auto-aplica prefs no `DOMContentLoaded` mesmo sem `init()`.

### Boot
- `init(opts) → API` — boot idempotente/re-entrant. `opts`: `{ courseId?, autoResume? }`. Faz: probe de storage, detecta courseId, `applyPrefs()`, `syncAppearanceUI()`, `bindGlobalListeners()`, `rehydrateAll()`, `setupTOC()`, e se `autoResume` rola para o checkpoint.
- `applyPrefs() → prefs` — reaplica `data-*` + CSS vars no `<html>`.

### Progresso
- `markRead(itemId, bool?) → void` — marca/desmarca leitura (default `true`). Repinta controles + medidores, salva checkpoint, dispara `inema:read` e `inema:progress`.
- `isRead(itemId) → boolean`
- `progress(scope) → { done, total, pct }` — `scope`: `"curso"` (default) | `"trilha:N"` | `"modulo:X-Y"`. Usa o manifesto se houver; senão deriva do DOM (`data-inema-topic` no escopo).
- `renderMeters() → void` — repinta todos os `[data-inema-meter]` visíveis.

### Dúvida
- `toggleDoubt(itemId) → boolean` — liga/desliga a dúvida do tópico.
- `setDoubtResolved(itemId, bool) → record`
- `setDoubtNote(itemId, text) → record` — grava o texto livre.
- `listDoubts() → array` — consolida dúvidas de tópico **+** grifos `color:doubt`, ordenado por `ts` desc.

### Notas / highlight
- `highlight(range, opts) → id|null` — cria grifo a partir de um `Range`. `opts`: `{ color?, note?, tags? }`. Recusa fora de `[data-inema-block]`; limita a um bloco. Usa `TreeWalker` + replace de text nodes, **nunca** `Range.surroundContents`.
- `promoteToNote(id, text) → boolean` — adiciona/edita o texto da nota de um grifo.
- `editNote(id, patch) → boolean` — `patch`: `{ note?, color?, tags? }`.
- `removeNote(id) → boolean` — desfaz os `<mark>` (replace por text node + `normalize`) e remove o registro.
- `renderHighlights(container?) → void` — reaplica grifos do storage (tolerante por nota; marca `orphan` quando não reancorou).

### Painel do aluno por seção (NOVO no v3)
- `renderRail(sectionId) → void` — (re)monta o `<aside data-inema-rail>` da seção. Ver §3.
- `renderAllRails() → void` — monta o rail de todas as seções.

### Jornada (modal acessível)
- `openJourney() / closeJourney() → void` — modal com focus-trap, `inert` nos irmãos, Esc fecha, retorna foco.
- `renderJourney(mountEl) → void` — progresso, "continuar", dúvidas (filtro "só não resolvidas"), notas (filtro por cor), backup (export/import/reset).

### Continuar de onde parei
- `saveCheckpoint(topicId?) → void` — debounced 400ms; sem `topicId` usa o tópico mais visível.
- `resume() → boolean` — rola para `lastTopicAnchor` (ou `lastScroll`).

### Export / Import (round-trip lossless)
- `exportJSON() → string` — `{ schemaVersion, courseId, exportedAt, read, doubts, notes, checks, meta }`.
- `importJSON(text, opts) → { ok, applied, skipped, errors }` — `opts.mode`: `"merge"` (default, dedup por id) | `"replace"` (confirma antes). Rejeita `schemaVersion` ausente ou mais nova.
- `downloadJSON() → void` — baixa `inema-<courseId>-<data>.json` (fallback data-URI).

### Tema / prefs (só tema/fonte/tamanho/largura/entrelinha — **acento é fixo**)
- `setPref(key, val) → prefs` — `key` ∈ `theme|font|fontScale|lineWidth|leading|reducedMotionOverride`.
- `getPrefs() → prefs`
- `cyclePref(key) → prefs` — cicla `theme|font|fontScale|lineWidth|leading`.

### Checagem leve
- `registerCheck(id, def) → void` — `def`: `{ q, options, answer, explain }`.
- `submitCheck(id, choice) → { correct }`.

### Interno (uso avançado / testes) — `INEMA._internal`
`storageGet, storageSet, safeJSON, probeStorage, migrate, domTotals, coreVars,
resetCourse, courseId()`.

### Eventos (`CustomEvent` em `document`, `bubbles`)
`inema:read`, `inema:doubt`, `inema:note`, `inema:progress` (com `detail.kind`:
`init|read|prefs|check`). Para reagir: `document.addEventListener('inema:progress', fn)`.

---

## 3. Painel da margem — `[data-inema-rail]` + `renderRail`

`renderRail(sectionId)` é **idempotente** (limpa `rail.innerHTML` e remonta). Para
cada seção `<section data-inema-topic="...">`, encontra o `<aside>` da margem por
duas rotas:

1. `[data-inema-rail="<topicId>"]` em qualquer lugar do documento; ou
2. um `[data-inema-rail]` **dentro** da própria seção, sem valor (ancorado por containment).

### 3.1 Markup que o autor escreve

```html
<section data-inema-topic="modulo-1-1#topico-3"
         data-inema-module="1-1"
         data-inema-track="1">
  <h2 id="topico-3">Título do tópico</h2>

  <p data-inema-block="m1-1-p1">Parágrafo anotável…</p>
  <p data-inema-block="m1-1-p2">Outro parágrafo anotável…</p>

  <!-- o JS injeta o painel do aluno AQUI dentro -->
  <aside data-inema-rail="modulo-1-1#topico-3"></aside>
</section>
```

Regras do contrato:
- `data-inema-topic` é o **topicId** (chave de `read`/`doubts`). Convenção:
  `modulo-<X-Y>#topico-<N>` — o parser extrai módulo/trilha daí.
- `data-inema-block` é **obrigatório** em todo parágrafo que se quer anotável;
  sem ele o trecho não é grifável ("Este trecho não é anotável.").
- O `<aside data-inema-rail>` começa **vazio**; o JS preenche.

### 3.2 O que `renderRail` injeta (estrutura)

```html
<aside data-inema-rail="modulo-1-1#topico-3">
  <div class="control">
    <div class="lbl">Esta secao</div>

    <button class="read-toggle" data-inema-read-toggle="modulo-1-1#topico-3"
            aria-pressed="false">
      <span class="read-box"><svg …><path d="M5 12.5l4.2 4.2L19 7"/></svg></span>
      <span class="read-txt">
        <b data-inema-read-label>Marcar como lida</b>
        <span class="read-sub">guarda seu progresso</span>
      </span>
    </button>

    <button class="doubt-btn" data-inema-doubt-toggle="modulo-1-1#topico-3"
            aria-pressed="false">
      <span class="q">?</span><span class="txt">Tenho uma duvida</span>
    </button>

    <div class="doubt-note" data-inema-doubt-note="modulo-1-1#topico-3">
      <textarea data-inema-doubt-field="modulo-1-1#topico-3"
                placeholder="O que ficou confuso? (so voce ve)"></textarea>
    </div>
  </div>

  <!-- uma .note-hand por grifo/nota ancorado nos blocos desta seção -->
  <div class="note-hand" data-inema-handnote="n_…">
    <div class="tag">Grifo</div>            <!-- ou "Duvida" -->
    <span>“trecho grifado”</span>
    <span class="body">texto da nota</span> <!-- se houver -->
    <span class="meta">
      <button class="inema-link" data-inema-handnote-go="n_…">ir ao trecho</button>
      <button class="inema-link" data-inema-handnote-note="n_…">anotar</button>
      <button class="inema-link" data-inema-handnote-del="n_…">excluir</button>
    </span>
  </div>
</aside>
```

Comportamento ligado pelos atributos (delegação em um único listener no `<main>`):

- **`[data-inema-read-toggle]`** — `aria-pressed`, classe `is-read`; o label
  alterna "Marcar como lida" ↔ "Lido"; a seção ganha `.is-read`.
- **`[data-inema-doubt-toggle]`** — `aria-pressed`, classe `is-doubt`,
  `data-resolved` quando resolvida; abre/fecha o campo inline (`data-open` no
  `.doubt-note`). O `textarea` (`[data-inema-doubt-field]`) salva via `input`
  debounced (`setDoubtNote`). Nunca abre modal — a dúvida vive na margem.
- **`.note-hand`** — uma por grifo/nota dos blocos da seção, ordenadas por `ts`
  asc; ações ir/anotar/excluir. Grifos sem trecho mostram "nota sem ancora".

`renderRailForBlock(blockId)` re-renderiza só o rail da seção que contém aquele
bloco (chamado após criar/editar/remover grifo). `renderAllRails()` percorre
todas as seções (chamado no `init`/import/reset).

### 3.3 Seleção → popover de grifo

Ao selecionar texto dentro de um `[data-inema-block]`, o JS posiciona um
`.selpop` (`[data-inema-selpop]`, `role="toolbar"`) com 5 swatches
(`[data-inema-swatch]` = `yellow|green|blue|pink|doubt`) + ações **Anotar** /
**Copiar** (`[data-inema-act="note"|"copy"]`). Clicar num swatch chama
`highlight(range, { color })`. Clicar num `mark.hl` abre o mini-menu Nota/Excluir.

---

## 4. Manifesto (agregação de progresso cross-página)

Sem manifesto, `progress()` deriva do DOM da **página atual** (conta
`[data-inema-topic]` no escopo). Com manifesto, agrega o curso inteiro
(útil em páginas de módulo que não contêm todos os tópicos).

Duas formas de fornecer (a global vence):

```html
<!-- 1) global -->
<script>window.INEMA_MANIFEST = { /* … */ };</script>

<!-- 2) inline -->
<script type="application/json" data-inema-manifest>
{ "tracks": [ … ] }
</script>
```

Formato:

```jsonc
{
  "tracks": [
    {
      "n": "1",                      // ou "track": "1"
      "title": "Trilha de Fundamentos",
      "modules": [
        { "id": "1-1", "title": "Módulo 1.1", "topics": 4, "href": "modulo-1-1.html" },
        { "id": "1-2", "title": "Módulo 1.2", "topics": 3, "href": "modulo-1-2.html" }
      ]
    }
  ]
}
```

`progress("modulo:1-1")` casa `id`; `progress("trilha:1")` soma `topics` dos
módulos da trilha; `progress("curso")` soma tudo. O numerador (`done`) vem das
chaves `read=true` cujo `topicId` (`modulo-<id>#…`) cai no escopo. Medidor é só
**"N de M (P%)"** + `.progress-line` (uma linha) — **nunca** três barras/anéis.

### Markup de medidor

```html
<div data-inema-meter="curso">
  <span data-inema-meter-frac></span>   <!-- "<strong>N</strong> de M" -->
  <span data-inema-meter-pct></span>    <!-- "P%" (opcional) -->
  <div class="progress-line">
    <span class="progress-line__fill" data-inema-meter-fill></span>
  </div>
</div>
```

O JS escreve `--inema-pct` (o CSS calcula a largura), `role="progressbar"`,
`aria-valuenow`/`aria-valuetext` ("N de M (P%)"), e `data-complete="true"` em 100%.

### Jornada e contador de dúvidas

- `[data-inema-journey-open]` — abre o modal "Minha jornada".
- `[data-inema-journey-badge]` — recebe `textContent`/`data-count` com o nº de
  dúvidas não resolvidas (`data-count="0"` esconde via CSS).

---

## 5. Como incluir numa página

A ordem importa por causa do **anti-FOUC**. Os snippets prontos estão em
`assets/inema-head-snippet.html` e `assets/inema-init-snippet.html`. Troque `REL`
pelo caminho relativo até `assets/` (ex.: `"."`, `".."`, `"../.."`).

### 5.1 No topo do `<head>` (anti-FOUC + CSS) — `inema-head-snippet.html`

Cole **antes** de qualquer `<style>`/`<link>`/fonte. É um `<script>` **bloqueante
de propósito**: lê `inema.prefs` e aplica `data-theme` + CSS vars no `<html>`
**antes do primeiro paint**, matando o flash de tema a cada navegação. É
independente do `learn.js` — se o módulo grande falhar, o tema já foi aplicado;
qualquer erro cai no default `papel`. Logo após, o `<link>` do CSS:

```html
<head>
  <!-- 1º: anti-FOUC bloqueante (script do snippet de head) -->
  <script> /* lê inema.prefs → data-theme/data-font/--fontscale/--measure/--leading */ </script>
  <!-- 2º: a folha de estilos -->
  <link rel="stylesheet" href="REL/assets/learn.css">
  <!-- meta do curso (define o courseId; senão é derivado do path) -->
  <meta name="inema-course" content="fep">
</head>
```

### 5.2 Imediatamente antes de `</body>` (carrega + init) — `inema-init-snippet.html`

```html
  <script src="REL/assets/learn.js"></script>
  <script>
    if (window.INEMA && typeof window.INEMA.init === 'function') {
      window.INEMA.init();               // ou INEMA.init({ autoResume: true })
    }
  </script>
</body>
```

`init()` é idempotente: chamar mais de uma vez não duplica listeners. Ele só
reforça a consistência via `applyPrefs()` (o anti-FOUC já aplicou o tema).
`init({ courseId: "fep" })` sobrescreve o `<meta>` (raro);
`init({ autoResume: true })` já rola para "continuar de onde parei" no load.

### 5.3 Checklist mínimo da página

- [ ] Snippet anti-FOUC no topo do `<head>`, antes de tudo.
- [ ] `<link>` para `learn.css`.
- [ ] `<meta name="inema-course" content="…">` (recomendado).
- [ ] Seções com `data-inema-topic` (+ `data-inema-module`/`data-inema-track`).
- [ ] Parágrafos anotáveis com `data-inema-block`.
- [ ] `<aside data-inema-rail="<topicId>"></aside>` vazio por seção.
- [ ] Opcional: `[data-inema-meter]`, `[data-inema-journey-open]`,
      `[data-inema-journey-badge]`, manifesto, painel de aparência
      (`[data-inema-appearance]` + `[data-inema-set-*]`).
- [ ] Snippet de `learn.js` + `INEMA.init()` antes de `</body>`.
