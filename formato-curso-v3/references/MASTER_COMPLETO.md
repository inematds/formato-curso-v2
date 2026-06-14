# MASTER COMPLETO — guia de construcao formato-curso INEMA v3

> **DOCUMENTO UNICO DE CONSTRUCAO.** Tudo que voce precisa para montar uma pagina
> v3 (landing, trilha, modulo) com markup copia-e-cola que CASA com `assets/learn.css`
> e `assets/learn.js`. **Versao:** 3.0 | **Data:** 2026-06-14
>
> **Tese:** SIMPLICIDADE RADICAL + CONTEUDO PROFUNDO. A pagina de aula abre **parecendo
> um reader-mode** (Safari Reader / Gwern), nao um dashboard. A profundidade aparece
> **sem poluir** — por camadas sob demanda (sidenote de margem, "indo mais fundo",
> definicao inline), nunca por densidade visual simultanea. Premium = **quietude**.
>
> **Fontes canonicas (NAO duplicar — referenciar):**
> - `references/DESIGN-SYSTEM.md` — tokens, paleta OKLCH, 5 principios, tipografia.
> - `references/CHECKLIST_REVISAO.md` — travas testaveis de aceitacao (use no fim).
> - `../../V3-DESIGN.md` — design language completo (a tese e o "porque").
> - `../../mockups/v3-prototipo.html` — prototipo de referencia (uma pagina de modulo).
> - `assets/learn.css` + `assets/learn.js` — a IMPLEMENTACAO. Este guia documenta o
>   markup que esses dois consomem. Quando houver conflito, **o codigo manda**.

---

## INDICE

1. [Regra de ouro e erros criticos](#1-regra-de-ouro-e-erros-criticos)
2. [Estrutura do projeto e dos arquivos](#2-estrutura-do-projeto-e-dos-arquivos)
3. [O contrato CSS x JS (data-attributes que voce DEVE usar)](#3-o-contrato-css-x-js-data-attributes-que-voce-deve-usar)
4. [Esqueleto base de pagina (head/body/init)](#4-esqueleto-base-de-pagina-headbodyinit)
5. [Anatomia da PAGINA DE MODULO (a aula)](#5-anatomia-da-pagina-de-modulo-a-aula)
6. [Contrato de conteudo de cada secao (uma ideia + uma figura)](#6-contrato-de-conteudo-de-cada-secao-uma-ideia--uma-figura)
7. [Sistema de SIDENOTES — snippets copia-e-cola](#7-sistema-de-sidenotes--snippets-copia-e-cola)
8. ["Pare e preveja" (recall ativo)](#8-pare-e-preveja-recall-ativo)
9. ["Indo mais fundo" e definicao inline (camadas sob demanda)](#9-indo-mais-fundo-e-definicao-inline-camadas-sob-demanda)
10. [O PAINEL DO ALUNO na margem (data-inema-rail)](#10-o-painel-do-aluno-na-margem-data-inema-rail)
11. [O marcador de PROGRESSO discreto (N de M, sem barras)](#11-o-marcador-de-progresso-discreto-n-de-m-sem-barras)
12. [Knowledge check e Minha jornada](#12-knowledge-check-e-minha-jornada)
13. [Anatomia da PAGINA DE TRILHA (indice)](#13-anatomia-da-pagina-de-trilha-indice)
14. [Anatomia da LANDING editorial (obra, nao infoproduto)](#14-anatomia-da-landing-editorial-obra-nao-infoproduto)
15. [Acento por trilha (so o hue)](#15-acento-por-trilha-so-o-hue)
16. [Checklist final](#16-checklist-final)

---

# 1. Regra de ouro e erros criticos

## 1.1 Regra de ouro (restricao tecnica)

**1 `.html` por pagina**, mais `assets/learn.css` + `assets/learn.js` compartilhados.
Google Fonts via CDN. **Sem build, sem backend.** Abre em `file://`. Tudo e
**progressive enhancement**: a pagina le perfeita com JS desligado — o JS so adiciona
persistencia (lido/duvida/nota/tema) e monta o painel do aluno.

## 1.2 Erros criticos — NUNCA cometer

| # | Erro | Por que rompe a tese |
|---|------|----------------------|
| E1 | Fundo `#fff` ou tinta `#000` puros | Reading-mode rebaixa contraste; papel quente OKLCH em TODO tema (papel/sepia/escuro). |
| E2 | Corpo em **Inter** / sans no corpo | Leitura e a decisao no.1: corpo em **Source Serif 4**, titulo em **Spectral**. |
| E3 | Coluna larga / sem `max-width` | A medida **62-70ch** e o que **cria** a margem onde a profundidade vive. |
| E4 | **Barra de progresso** (qualquer), anel, %, chip de stat | Progresso = `N de M` + 1 filete fino. **Zero** das 3 barras do v2. |
| E5 | Glow ambar/ciano, gradiente em texto, `rounded-xl`, card dentro da licao | Premium = quietude. Cards so no catalogo (trilha/landing), nunca na prosa. |
| E6 | Nota/duvida em **modal ou drawer** | Vivem na **margem** (`data-inema-rail`), ancoradas ao texto. Nunca popup. |
| E7 | Empilhar nuance/fonte/edge-case na dobra | Profundidade SEMPRE em camada (sidenote / `go-deeper` / `dfn`). |
| E8 | Esconder o **essencial** atras de clique | So o raro/aprofundamento dobra. O default ja conta a historia. |
| E9 | Gamificacao (streak, XP, badge, confete, som, placar) | Anti-Duolingo. Calma > placar. |
| E10 | `>2` niveis de aninhamento de camada | Maximo 1-2 niveis; alem disso, **reorganizar** o conteudo. |
| E11 | Sidebar/nav **fixa** roubando largura na leitura | A unica coisa sticky e a `.reader-bar` fina no topo. |
| E12 | Mais de **1 figura por ideia** | Uma ideia por tela = uma figura por ideia. |

Cada item acima tem um teste objetivo correspondente em `CHECKLIST_REVISAO.md`.

---

# 2. Estrutura do projeto e dos arquivos

```
projeto/
├── index.html                       # LANDING editorial (entrada)
├── assets/
│   ├── learn.css                    # folha unica v3 (NAO editar por pagina)
│   ├── learn.js                     # camada de aprendizagem v3 (window.INEMA)
│   ├── inema-head-snippet.html      # cole no <head> (anti-FOUC + link CSS)
│   └── inema-init-snippet.html      # cole antes de </body> (carrega + init)
└── curso/
    ├── trilha1/
    │   ├── index.html               # INDICE da trilha (catalogo de modulos)
    │   ├── modulo-1-1.html          # AULA (pagina de leitura editorial)
    │   ├── modulo-1-2.html
    │   └── ...
    ├── trilha2/  …  trilha6/
```

- **`REL`** = caminho relativo de `assets/` a partir da pagina. Landing na raiz: `REL="."`.
  Index de trilha: `REL=".."`. Pagina de modulo: `REL="../.."`. Troque `REL` nos dois snippets.
- **Nomes de arquivo de modulo:** `modulo-<trilha>-<n>.html` (ex.: `modulo-3-2.html`).
  O `learn.js` deriva o `moduleId` (`"3-2"`) e a trilha (`"3"`) desse padrao e dos
  `data-inema-module` / `data-inema-track` das secoes.

---

# 3. O contrato CSS x JS (data-attributes que voce DEVE usar)

Esta e a parte que NAO pode errar: `learn.css` estiliza e `learn.js` opera sobre estes
hooks. Os nomes tem que casar exatamente.

| Papel | Markup canonico | Quem consome |
|---|---|---|
| Curso (id global) | `<meta name="inema-course" content="fep">` no `<head>` | `learn.js` (`detectCourseId`) |
| Secao/topico | `<section data-inema-topic="modulo-3-1#topico-1" data-inema-module="3-1" data-inema-track="3">` | progresso, rail, scrollspy |
| Bloco com nota | `<div data-inema-block="bloco-1">…</div>` (ancora de grifos/notas) | highlight/notas |
| Painel do aluno | `<aside data-inema-rail="modulo-3-1#topico-1">` (vazio; o JS injeta dentro) | `renderRail` |
| Marcar lida | `[data-inema-read-toggle][aria-pressed]` (o JS cria dentro do rail) | `markRead` |
| Duvida | `[data-inema-doubt-toggle][aria-pressed][data-resolved]` | `toggleDoubt` |
| Grifo do aluno | `<mark class="hl" data-hl="amarelo">…</mark>` (criado por selecao) | highlight/`.selpop` |
| Progresso | `<span data-inema-meter="curso">` ou `"trilha:3"` ou `"modulo:3-1"` | `renderMeters` |
| Filete de progresso | `.progress-line` + `<span data-inema-meter-fill>` (le `--inema-pct`) | `renderMeters` |
| Fracao "N de M" | `<span data-inema-meter-frac>` + `<span data-inema-meter-pct>` | `renderMeters` |
| Jornada (abrir) | `<button data-inema-journey-open>` (+ `[data-inema-journey-badge]`) | `openJourney` |
| Reader-bar: tema | `<button data-inema-set-theme="papel\|sepia\|escuro">` | `setPref('theme')` |
| Reader-bar: fonte | `<button data-inema-set-font="serif\|sans\|hyperlegible">` | `setPref('font')` |
| Reader-bar: tamanho | `<button data-inema-set-fontscale="90\|100\|112\|125">` | `setPref('fontScale')` |
| Reader-bar: medida | `<button data-inema-set-linewidth="62\|66\|70">` (ou `estreito/medio/largo`) | `setPref('lineWidth')` |
| Reader-bar: entrelinha | `<button data-inema-set-leading="1.62\|1.70">` (ou `compacto/confortavel`) | `setPref('leading')` |
| Ciclar pref (1 botao) | `<button data-inema-cycle="theme">` | `cyclePref` |

> **Importante:** o **acento e FIXO** no v3 (`#2C5282`, azul-ardosia). NAO existe seletor
> de acento/trilha na reader-bar (isso era v2). A trilha muda so o **hue** de `--accent`
> via classe no `<html>` (secao 15) — nunca banha a pagina.

Estilos que NAO dependem de data-attribute (classes puras de prosa/editorial) — voce as
escreve a mao e o CSS ja as veste: `.kicker`, `.module-title`, `.deck`, `.aims`, `.toc`,
`.section`, `h2.head`, `h3.sub`, `.prose`, `.predict`, `.figure`/`.diagram`, `.go-deeper`,
`.dfn`, `.sidenote`, `.grif`, `.check`/`.q-item`, `.nextup`, `.colophon`.

---

# 4. Esqueleto base de pagina (head/body/init)

Estrutura identica em landing, trilha e modulo (muda so o conteudo de `<main>` e o `REL`).
O `learn.js` e **feature-detect**: numa landing sem secoes ele so ativa tema/jornada;
numa pagina de modulo ele ativa tudo.

```html
<!doctype html>
<html lang="pt-BR" data-theme="papel">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Modulo 3.1 — Engenharia de Prompts · INEMA.CLUB</title>
  <meta name="inema-course" content="fep"><!-- id do curso: chaveia o localStorage -->

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,400;1,8..60,500&family=IBM+Plex+Mono:wght@400;500&family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">

  <!-- COLE AQUI o conteudo de assets/inema-head-snippet.html
       (script bloqueante anti-FOUC que aplica data-theme/medida ANTES do paint
        + <link rel="stylesheet" href="REL/assets/learn.css">). Troque REL. -->
</head>
<body>
  <a class="skip" href="#reading">Pular para a leitura</a>

  <!-- READER BAR (controles minimos) -->  <!-- secao 5.1 -->
  <!-- MASTHEAD + WAYFINDING (onde estou)  -->  <!-- secao 5.2 -->
  <main class="spread"> … </main>           <!-- secao 5.3+ -->

  <!-- COLE AQUI o conteudo de assets/inema-init-snippet.html
       (<script src="REL/assets/learn.js"> + INEMA.init()). Troque REL. -->
</body>
</html>
```

Os dois snippets (`inema-head-snippet.html`, `inema-init-snippet.html`) ja existem em
`assets/` — **cole-os verbatim** e so substitua `REL`. Eles cuidam de: anti-FOUC de
tema (sem flash a cada navegacao), carregamento de `learn.css`/`learn.js`, e
`INEMA.init()` (idempotente — chamar duas vezes nao duplica listeners).

`init()` aceita opcoes: `INEMA.init({ courseId: "fep" })` (sobrescreve o `<meta>`, raro)
e `INEMA.init({ autoResume: true })` (rola para "continuar de onde parei" no load).

---

# 5. Anatomia da PAGINA DE MODULO (a aula)

Ordem de cima para baixo. Esta e a pagina-coracao do v3 — uma **coluna de leitura
62-70ch + trilho de margem a direita**.

```
┌─ .reader-bar (sticky, fina) ─ wordmark · "~X min" · tema/fonte/tamanho/medida ─┐
│                                                                                 │
│  .masthead → .wayfind  ("Modulo 3/7 · Secao 1 de 7" + .mastery grade silenciosa)│
│                                                                                 │
│  <main class="spread"><div class="leaf">                                        │
│    ┌── .reading (coluna 62-70ch) ──────────┐   ┌── .margin-rail (trilho) ──┐    │
│    │ .kicker                                │   │ <aside data-inema-rail>   │    │
│    │ h1.module-title  +  .deck              │   │   (painel do aluno:       │    │
│    │ .read-meta (aqui · ~14 min · 7 secoes) │   │    marcar lida, duvida,   │    │
│    │ .aims  (o que voce vai entender)       │   │    grifos/notas — secao10)│    │
│    │ nav.toc  (sumario / indice impresso)   │   │ <aside class="sidenote">  │    │
│    │                                        │   │   (notas de autor — sec7) │    │
│    │ <section data-inema-topic> ··· Secao 1 │   │ data-inema-meter "N de M" │    │
│    │   .section-mark · h2.head · .prose     │   │   (progresso — secao 11)  │    │
│    │   .predict · figure · .go-deeper       │   └───────────────────────────┘    │
│    │ <section> ··· Secao 2 … (respira 96px) │                                    │
│    │ .check  (knowledge check, sem nota)    │                                    │
│    │ .journey  (minha jornada, grade)       │                                    │
│    │ .nextup  (UMA proxima acao clara)      │                                    │
│    └────────────────────────────────────────┘                                   │
│  </div></main>                                                                  │
│  footer.colophon                                                                │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 5.1 Reader bar (controles minimos)

A unica coisa sticky. Wordmark + reading-time + grupos segmentados de aparencia. Os
botoes usam os `data-inema-set-*` do contrato (secao 3) — o `learn.js` os hidrata.

```html
<div class="reader-bar">
  <div class="reader-inner">
    <a class="wordmark" href="REL/index.html">INEMA<span class="dot">.</span><span class="club">CLUB</span></a>
    <div class="reader-controls">
      <span class="rc-read" data-inema-readingtime>— min de leitura</span>
      <div class="rc-group" role="group" aria-label="Tema de leitura">
        <button class="rc-btn" data-inema-set-theme="papel"  aria-pressed="true">Papel</button>
        <button class="rc-btn" data-inema-set-theme="sepia"  aria-pressed="false">Sépia</button>
        <button class="rc-btn" data-inema-set-theme="escuro" aria-pressed="false">Escuro</button>
      </div>
      <div class="rc-group" role="group" aria-label="Tamanho do texto">
        <button class="rc-btn" data-inema-set-fontscale="90"  aria-pressed="false">A−</button>
        <button class="rc-btn" data-inema-set-fontscale="100" aria-pressed="true">A</button>
        <button class="rc-btn" data-inema-set-fontscale="125" aria-pressed="false">A+</button>
      </div>
      <div class="rc-group" role="group" aria-label="Fonte de leitura">
        <button class="rc-btn" data-inema-set-font="serif"        aria-pressed="true">Serif</button>
        <button class="rc-btn" data-inema-set-font="hyperlegible" aria-pressed="false"
                title="Atkinson Hyperlegible — legibilidade máxima">Aa↹</button>
      </div>
    </div>
  </div>
</div>
```

## 5.2 Masthead + wayfinding ("onde estou", calmo)

Sem 3 barras. Uma linha mono discreta + a **grade silenciosa** `.mastery` (estilo
mastery do Khan: quadradinhos, nunca barra).

```html
<header class="masthead">
  <nav class="wayfind" aria-label="Onde você está">
    <span>Módulo <b>3</b> / 7 · Trilha 1 Fundamentos</span>
    <span class="sep">·</span>
    <span>Seção <b>1</b> de 7</span>
    <span class="sep">·</span>
    <span class="mastery" aria-label="Percurso do módulo: seção 1 de 7">
      <i class="cur"></i><i></i><i></i><i></i><i></i><i></i><i></i>
    </span>
  </nav>
</header>
```

## 5.3 Spread + abertura do modulo

```html
<main class="spread">
  <div class="leaf">
    <article class="reading" id="reading">

      <p class="kicker">Módulo 3 · Trilha 1 · Fundamentos</p>
      <h1 class="module-title">Fundamentos de <em>Engenharia de Prompts</em></h1>
      <p class="deck">Escrever instruções que um modelo entende de primeira — pensando
        o prompt como um pedido bem-feito, não como uma fórmula mágica.</p>
      <p class="read-meta">
        <span class="here">Lendo agora</span>
        <span>~14 min · módulo inteiro</span>
        <span>7 seções</span>
      </p>

      <!-- objetivos: 3-4 "o que voce vai entender" (1a camada de leitura) -->
      <section class="aims" aria-label="O que você vai entender">
        <h2>O que você vai entender</h2>
        <ul>
          <li>Por que um prompt é um <b>pedido</b>, e quais peças o modelo precisa.</li>
          <li>Como <b>contexto e papel</b> mudam a resposta antes da tarefa.</li>
          <li>Onde a maioria dos prompts falha — e a pergunta que diagnostica isso.</li>
        </ul>
      </section>

      <!-- sumario: indice impresso (2 colunas no desktop) -->
      <nav class="toc" aria-label="Sumário do módulo">
        <p class="toc-head">Sumário — sete movimentos</p>
        <ol>
          <li class="current"><span class="dot-now"></span><span class="n">1</span>
            <a href="#s1"><span class="t">Veja a anatomia de um prompt</span></a></li>
          <li><span class="n">2</span><a href="#s2"><span class="t">Defina o papel e o contexto</span></a><span class="leader"></span></li>
          <!-- … demais secoes … -->
        </ol>
      </nav>

      <!-- SECOES (secao 6) -->
      <!-- KNOWLEDGE CHECK, MINHA JORNADA, NEXTUP (secao 12) -->
    </article>

    <aside class="margin-rail" aria-label="Margem: notas, definições e controles">
      <!-- painel do aluno (secao 10) + sidenotes de autor (secao 7) + meter (secao 11) -->
    </aside>
  </div>
</main>

<footer class="colophon">
  <span>INEMA.CLUB · Caderno do aluno</span>
  <span class="pg">Módulo 3 — fólio iii</span>
  <span>Composto em Spectral &amp; Source Serif 4</span>
</footer>
```

---

# 6. Contrato de conteudo de cada secao (uma ideia + uma figura)

**Cada `<section>` isola UM conceito** e, no maximo, **UMA** figura. A sequencia interna
e sempre **fenomeno/visual concreto → intuicao em palavras simples → formalizacao** — e a
formalizacao **desce** para a margem (sidenote) ou para `go-deeper`. Densidade de
**pensamento**, nao de pixels. Separar generos: o "porque" (explainer) vem antes e
separado do "como" (passo a passo); referencia densa e camada a parte.

A secao DEVE carregar os tres `data-inema-*` (topic/module/track) — sem eles, progresso
e painel do aluno nao funcionam.

```html
<section class="section" id="s1"
         data-inema-topic="modulo-3-1#topico-1"
         data-inema-module="3-1" data-inema-track="3">

  <div class="section-mark">
    <span class="where">Seção 1 de 7</span><span>·</span><span>Anatomia</span>
  </div>
  <h2 class="head"><span class="num">1.</span>Veja a anatomia de um prompt</h2>

  <!-- 1) INTUICAO em prosa enxuta. dropcap so na 1a secao. -->
  <div class="prose" data-inema-block="3-1-b1">
    <p class="lede dropcap">Um prompt não é uma pergunta solta: é um pequeno
      <span class="grif">briefing</span>. Quando o resultado vem morno, quase nunca o
      problema é a redação — é uma <em>peça ausente</em>.</p>

    <h3 class="sub">As cinco peças que um pedido completo carrega</h3>
    <p><strong>Contexto</strong> situa o cenário. <strong>Tarefa</strong> é o pedido
      único. <strong>Formato</strong> diz a forma da resposta… <!-- enfase UNICA:
      italico OU bold, nunca os dois juntos, nunca sublinhar (so links). --></p>
  </div>

  <!-- 2) PARE E PREVEJA antes de revelar (secao 8) -->
  <!-- 3) UMA FIGURA por ideia (secao 6.1) -->
  <!-- 4) "INDO MAIS FUNDO" com a formalizacao densa (secao 9) -->
</section>
```

## 6.1 A figura (uma por ideia, SVG inline que herda o tema)

SVG **inline** (nunca `<img>`), dentro de `<figure class="figure">` com `<figcaption>`.
NAO use cores fixas: aplique as **classes de cor do tema** para o SVG herdar papel/sepia/
escuro automaticamente: `.ink`, `.ink-soft`, `.faint`, `.accent`, `.accent-stroke`,
`.rule-stroke`, `.mark-stroke`, `.mark-fill`, `.wash`. Um unico acento; figura sobria
(estilo ciechanow.ski / 3Blue1Brown), **sem** glow.

```html
<figure class="figure">
  <figcaption><span class="fig-n">Fig. 1</span> · As cinco peças de um <b>briefing</b></figcaption>
  <svg class="diagram" viewBox="0 0 720 232" role="img"
       aria-label="Diagrama: Contexto, Tarefa, Formato e Exemplos compõem o pedido; a Iteração realimenta o contexto.">
    <rect x="20" y="62" width="120" height="64" class="wash accent-stroke" stroke-width="1.2" rx="3"/>
    <text x="80" y="100" text-anchor="middle" font-family="Spectral, serif" font-style="italic"
          font-size="18" class="ink">Contexto</text>
    <!-- … demais peças, com class="ink/ink-soft/faint/accent" … -->
    <path d="M 640 58 C 640 18, 80 18, 80 58" fill="none" class="mark-stroke"
          stroke-width="1.3" stroke-dasharray="4 4"/>
  </svg>
</figure>
```

---

# 7. Sistema de SIDENOTES — snippets copia-e-cola

A **largura restrita da coluna CRIA o trilho** `.margin-rail`; o trilho **vira** a camada
de detalhe. Sidenote = aside curto **ao lado** do trecho (mesma altura no desktop). No
mobile o trilho desmonta (`display:contents`) e a sidenote vira **bloco inline calmo
abaixo do paragrafo**, com filete lateral — **sem JS** (regra em `learn.css` §22).

## 7.1 Sidenote de autor (definicao / fonte / fundo)

Cole as `<aside class="sidenote">` dentro do `<aside class="margin-rail">`. O **tipo** vai
em `data-kind` e pinta o pip: `definicao` (azul/accent), `fonte` (cinza), `fundo` (oxblood/
"indo mais fundo"). O `.tag::before` desenha o pip sozinho — nao precisa de `<span class="pip">`.

```html
<!-- DEFINICAO -->
<aside class="sidenote" data-kind="definicao">
  <div class="tag">Definição</div>
  <b>Briefing.</b> Documento curto que orienta um trabalho: contexto, objetivo,
  restrições e formato esperado. Pedir bem a um modelo é escrever um bom briefing.
</aside>

<!-- FONTE -->
<aside class="sidenote" data-kind="fonte">
  <div class="tag">Fonte</div>
  A ideia de tratar o prompt como pedido estruturado aparece nos guias de prompting da
  Anthropic e da OpenAI, e em <i>Just JavaScript</i> (Dan Abramov).
  <div class="src-line">docs.anthropic.com · justjavascript.com</div>
</aside>

<!-- FUNDO ("indo mais fundo" curto, na margem) -->
<aside class="sidenote" data-kind="fundo">
  <div class="tag">Indo mais fundo</div>
  "Morno" tem nome técnico: contexto vago → <i>distribuição de continuações</i> larga →
  o modelo regride à média. Detalhe completo no bloco ao lado.
</aside>
```

## 7.2 Ancora inline da sidenote (opcional)

Para apontar do corpo para a margem, ponha um marcador discreto no texto. O CSS desenha
`[n]` em mono pequeno; ao focar/`:target`, a `.sidenote` correspondente ganha realce calmo.

```html
…é um pequeno briefing<a class="sidenote-ref" href="#sn-briefing" id="ref-briefing">1</a>.
…
<aside class="sidenote" data-kind="definicao" id="sn-briefing"> … </aside>
```

## 7.3 Definicao inline (a camada MAIS leve — fica no proprio texto)

Quando a glosa e curtissima e nao vale uma sidenote, use `<details class="dfn">`: o termo
fica limpo no texto e a definicao abre **junto ao gatilho**, sem JS. Information scent: a
pista deixa o leitor decidir se aprofunda sem sair do fluxo.

```html
…uma função de quanto do
<details class="dfn"><summary>contexto necessário</summary><span class="body"><b>Contexto
necessário</b> é o conjunto mínimo de fatos e restrições sem os quais a tarefa fica
ambígua — não "tudo o que você sabe".</span></details>
você de fato colocou ali.
```

> **Regra das camadas:** maximo 1-2 niveis. Sidenote/`dfn`/`go-deeper` sao **opt-in** — o
> corpo sem abrir nada **ja conta a historia**. Nunca dobre o essencial.

---

# 8. "Pare e preveja" (recall ativo)

Recall sem motor, sem quiz pontuado, sem gamificacao (estilo *Just JavaScript*). Use
**antes de revelar** a figura ou a resposta de uma secao: o leitor preve, depois compara.
A resposta vive num `<details>` calmo dentro do `.predict`.

```html
<div class="predict">
  <p class="lbl">Pare e preveja</p>
  <p>Antes de ver a figura: dessas cinco peças, qual você acha que, sozinha, costuma
    destravar mais resultados ruins quando é adicionada?</p>
  <details>
    <summary>Ver uma resposta possível</summary>
    <p class="answer">Quase sempre é o <strong>contexto</strong> — ele muda a
      interpretação de <em>todas</em> as outras peças. É o tema da Seção 2.</p>
  </details>
</div>
```

Tom: a pergunta e **uma**, especifica e respondivel de cabeça. "Uma resposta possivel"
(nao "a resposta certa") — convida, nao avalia.

---

# 9. "Indo mais fundo" e definicao inline (camadas sob demanda)

O **caminho-feliz** fica calmo e visivel no corpo. Prova, derivacao, edge case, exemplo
de codigo e referencia densa ficam **dobrados** em `<details class="go-deeper">`. Nativo,
acessivel por teclado/leitor de tela, **sem JS**. A mesma pagina serve iniciante (le o
corpo e segue) e avancado (abre as camadas) — layered UX.

```html
<details class="go-deeper">
  <summary><span class="chev">▸</span> Indo mais fundo: por que o modelo "preenche o buraco"
    <span class="opt">opcional</span></summary>
  <div class="inner">
    <p>O caminho-feliz acima já basta. Esta camada é o <em>porquê</em> mecânico — e pode
      ser pulada sem perda.</p>
    <p>Um modelo é um estimador de continuação… quando o contexto é vago a distribuição
      de continuações fica <em>larga</em> e o modelo recorre ao genérico.</p>
    <pre class="codeblock"><span class="c"># Vago — saída genérica</span>
Escreva um email de cobrança.

<span class="c"># Específico — saída útil</span>
<span class="k">Contexto:</span> cliente atrasou 5 dias, é recorrente, tom cordial.
<span class="k">Tarefa:</span> escreva o email de lembrete.</pre>
  </div>
</details>
```

- O `<span class="chev">▸</span>` gira 90° quando abre. Se voce omitir o `.chev`, o CSS
  desenha um chevron de fallback via `::before`.
- O `<span class="opt">opcional</span>` (canto direito) sinaliza que e camada extra.
- **Maximo 1-2 niveis.** `go-deeper` dentro de `go-deeper` e sinal de que o conteudo
  deveria ser reorganizado, nao aninhado.

Para codigo, use `<pre class="codeblock">` com `.c` (comentario, faint) e `.k`
(palavra-chave, accent). Codigo inline curto: `<code>` (o CSS ja o veste).

---

# 10. O PAINEL DO ALUNO na margem (data-inema-rail)

A camada de aprendizado e **minima e calma** e vive **na margem**, ancorada ao texto —
NUNCA em modal/drawer. Voce so declara um `<aside data-inema-rail="…">` **vazio** por
secao; o `learn.js` (`renderRail`) **injeta** dentro dele: marcar lida, "tenho uma
duvida", e a lista de grifos/notas daquela secao. O valor do atributo = o `topicId`
(igual ao `data-inema-topic` da secao).

```html
<aside class="margin-rail" aria-label="Margem da Seção 1">
  <!-- O JS preenche este aside (marcar lida + duvida + grifos/notas). -->
  <aside data-inema-rail="modulo-3-1#topico-1"></aside>

  <!-- sidenotes de autor (secao 7) e o meter (secao 11) vao logo abaixo -->
</aside>
```

Persistencia em `localStorage`, por curso (`inema.<courseId>.read|doubts|notes|…`). Tudo
e progressive enhancement: com JS desligado, o rail fica vazio e a leitura segue perfeita.

## 10.1 Nota do aluno ancorada (oxblood) — quando voce quer pre-renderizar uma

Geralmente o JS cria isso a partir de um grifo. Se quiser mostrar uma nota estatica de
exemplo (ou seed), o markup e `.note-hand` no rail:

```html
<div class="note-hand">
  <span class="tag">Sua nota · grifo</span>
  "briefing = pedir como eu pediria a um estagiário esperto. Revisar depois."
  <span class="meta">Ancorada em <span style="color:var(--mark)">briefing</span> · hoje</span>
</div>
```

## 10.2 Grifos do aluno

Quando o aluno seleciona texto, o `.selpop` (popover de selecao, posicionado pelo JS)
oferece grifar; o JS envolve a selecao em `<mark class="hl" data-hl="amarelo">`. Cores
disponiveis: `amarelo`, `verde`, `azul`, `rosa`, e `duvida` (oxblood + filete inferior —
para nao depender so de cor, WCAG 1.4.1). Um pip discreto aparece quando ha nota anexa
(`data-has-note="true"`). Voce nao escreve isso a mao; so garanta os `data-inema-block`
nos paragrafos para ancorar.

---

# 11. O marcador de PROGRESSO discreto (N de M, sem barras)

**Zero das 3 barras do v2.** Progresso = um marcador `N de M` em mono + **uma** linha
fina (`.progress-line`, 2px) — NUNCA tres barras lado a lado, anel ou %. O `learn.js`
(`renderMeters`) escreve `--inema-pct` (0..100), preenche a fracao e poe ARIA
(`role=progressbar`, `aria-valuetext="N de M (P%)"`).

```html
<div data-inema-meter="modulo:3-1" aria-label="Progresso do módulo">
  <span data-inema-meter-frac><strong>1</strong> de 7</span>
  <span class="progress-line"><span data-inema-meter-fill></span></span>
  <span data-inema-meter-pct></span>
</div>
```

Escopos aceitos no atributo: `"curso"`, `"trilha:3"`, `"modulo:3-1"`. Ponha o de modulo
no rail; o de curso/trilha pode ir na wayfind ou na jornada.

A grade silenciosa de quadradinhos (`.mastery` na wayfind, `.jgrid` na jornada) e a outra
metade: visao de profundidade **sem barra**. `i.read`/`i.on` = lido, `i.cur` = atual.

---

# 12. Knowledge check e Minha jornada

## 12.1 Knowledge check (auto-checagem, SEM nota)

Ao fim da aula: 3-4 perguntas de auto-checagem. Responder de cabeca, depois **revelar**
para comparar — **sem pontuacao, sem placar** (estilo The Odin Project). Estatico, `<details>`.

```html
<section class="check" aria-label="Auto-checagem">
  <h2>Antes de seguir: três checagens rápidas</h2>
  <p class="intro">Sem nota, sem placar. Responda de cabeça, depois revele para comparar.</p>

  <details class="q-item">
    <summary><span class="qn">01</span><span>Por que uma instrução bem escrita ainda
      pode produzir uma resposta ruim?</span><span class="reveal">Revelar</span></summary>
    <div class="ans"><p>Porque a redação raramente é o problema: falta uma <em>peça</em> —
      quase sempre contexto. Sem ela, o modelo preenche o buraco com o genérico.</p></div>
  </details>
  <!-- 02, 03 … -->
</section>
```

## 12.2 Minha jornada (grade silenciosa) + proxima acao

`.journey` consolida progresso **sem barras** (grades `.jgrid`). O botao
`[data-inema-journey-open]` abre o caderno (o JS monta o overlay com lidos/duvidas/notas).
E **UMA** proxima acao clara (`.nextup`) — engajamento por clareza, nao por contagem.

```html
<section class="journey" aria-label="Minha jornada">
  <div class="journey-top">
    <h2><span class="ico">❧</span> Minha jornada</h2>
    <button class="journey-cta" type="button" data-inema-journey-open>
      Abrir caderno <span class="inema-journey-badge" data-inema-journey-badge data-count="0"></span>
    </button>
  </div>
  <div class="journey-body">
    <div class="jstat">
      <div class="k">Neste módulo</div>
      <div class="v">Seção <em>1</em> de 7 <span class="nm">lida</span></div>
      <div class="jgrid"><i class="cur"></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
    </div>
    <div class="jstat">
      <div class="k">Na trilha</div>
      <div class="v">Módulo <em>3</em> de 7</div>
      <div class="jgrid"><i class="on"></i><i class="on"></i><i class="cur"></i><i></i><i></i><i></i><i></i></div>
    </div>
    <div class="jstat">
      <div class="k">No curso</div>
      <div class="v"><em>21%</em> <span class="nm">percorrido</span></div>
      <div class="jgrid"><i class="on"></i><i class="cur"></i><i></i><i></i><i></i><i></i></div>
    </div>
  </div>
</section>

<div class="nextup">
  <div class="txt">
    <div class="k">Continuar</div>
    <div class="t">Seção 3 — Escreva a tarefa como um pedido único</div>
  </div>
  <a class="go" href="#s3">Próxima →</a>
</div>
```

---

# 13. Anatomia da PAGINA DE TRILHA (indice)

O index de trilha e um **catalogo / indice** — aqui cards SAO permitidos (nunca dentro da
leitura). Mantem reader-bar, paleta de papel e tipografia editorial. **NAO** vira o
dashboard colorido do v2.

```
TRILHA INDEX
├── .reader-bar (igual)
├── .masthead → kicker "Trilha 1 · Fundamentos" + h1.module-title + .deck + meter de trilha
├── nav.toc  (o "curriculo como indice" da trilha: lista dos modulos, sem cor de venda)
├── grade de cards-ancora de modulo (1 por modulo) — cada card:
│     numero "3.1" (mono) · titulo display · 1 frase do "porque" (nao bullet de beneficio)
│     · "~X min" · meter "N de M" do modulo · link "Ler o módulo →"
└── footer.colophon
```

Regras: subtitulo do card e **descritivo do porque**, nao slogan de venda; o acento e o da
trilha (so o hue — secao 15); progresso por `N de M`, nunca barra. Densidade de indice =
prova de seriedade.

---

# 14. Anatomia da LANDING editorial (obra, nao infoproduto)

> **Tom-norte:** o produto parece uma **OBRA que o autor precisava escrever**, nao um
> **produto que o autor precisava vender**. A landing explica *o que e* e *por que existe* —
> nao convence a forca. (Refs: Stripe Press, Just JavaScript, Refactoring UI, CSS-for-JS.)

## 14.1 Estrutura

```
LANDING (index.html)
├── .reader-bar (mesma — papel, tema, fonte, tamanho)
├── HERO TIPOGRAFICO PURO
│     kicker (mono, discreto) · h1 enorme em Spectral · .deck (1-2 frases)
│     headline = DIAGNOSTICO PRECISO DA DOR, nunca promessa de transformação
│     no maximo UMA ilustracao conceitual (SVG sobrio). Sem mockup 3D/screenshot.
├── O QUE E / POR QUE EXISTE
│     2-3 paragrafos de prosa serif (a coluna 62-70ch da identidade). Sem bullets de check.
├── CURRICULO COMO INDICE REAL
│     cada trilha/modulo: titulo + 1 paragrafo do "porque". Densidade = prova de seriedade.
│     NAO "voce vai aprender" com 12 checks verdes. E um indice de livro, nao um funil.
├── PROVA SOCIAL SOBRIA (opcional)
│     1 citacao textual estatica (nome + contexto). Sem carrossel, sem estrelinhas,
│     sem "+10.000 alunos".
├── CTA UNICO sem urgencia + 1 saida de baixo risco ("ler o Módulo 1")
└── footer.colophon
```

## 14.2 Hero tipografico (snippet)

```html
<header class="masthead">
  <p class="kicker">Curso · Engenharia de Prompts</p>
  <h1 class="module-title">Pedir bem a um modelo é uma <em>habilidade</em>,
    não um truque.</h1>
  <p class="deck">A maioria dos prompts falha por uma peça ausente, não por redação.
    Este curso ensina a enxergar a peça que falta — e a colocá-la de volta.</p>
</header>
```

## 14.3 Curriculo como indice (snippet)

```html
<section class="spread">
  <div class="leaf">
    <article class="reading">
      <h2 class="head">O caminho, em seis trilhas</h2>
      <div class="prose">
        <h3 class="sub">Trilha 1 — Fundamentos</h3>
        <p>Por que um prompt é um pedido, e quais peças o modelo precisa para
          respondê-lo. Sai daqui sabendo diagnosticar uma saída morna em vez de
          reescrever no escuro.</p>
        <p><a href="curso/trilha1/index.html">Ver os módulos da Trilha 1 →</a></p>

        <h3 class="sub">Trilha 2 — Disciplina</h3>
        <p>… 1 parágrafo do "porque" por trilha …</p>
      </div>
    </article>
    <aside class="margin-rail" aria-label="Margem"><!-- meter de curso, opcional --></aside>
  </div>
</section>
```

## 14.4 PROIBIDO na landing (o anti-padrao "curso online")

Dashboard de XP/streak/ranking · mascote/confete/badges · cards coloridos na licao ·
sidebar fixa na leitura · hero 3D isometrico de estudante · mockup flutuante de produto ·
contador de alunos · selos de garantia · carrossel de depoimentos com estrelinhas ·
gradiente roxo/ambar · CTA com countdown · "voce vai aprender" com 12 checks · FAQ que e
objecao de venda · paleta dark premium ambar+ciano (= o v2) · headline tipo "domine X em
30 dias". Ver lista completa no anexo de `../../V3-DESIGN.md`.

---

# 15. Acento por trilha (so o hue)

A trilha **nao** colore a pagina. Identidade = rotulo + 1 filete + o **hue** de
`--accent` girado (croma baixo, luminancia travada ~0.40 para manter contraste). Aplique
uma classe/atributo no `<html>` da pagina (ex.: `data-track="1"`) e sobrescreva so
`--accent`/`--accent-soft` num pequeno bloco — o resto da paleta de papel fica igual.

| Trilha | `--accent` (OKLCH) | ~hex | Hue |
|---|---|---|---|
| T1 Fundamentos | `oklch(0.40 0.07 150)` | `#2f5641` | verde |
| T2 Disciplina | `oklch(0.40 0.07 255)` | `#243a63` | azul (default) |
| T3 Frontend | `oklch(0.40 0.07 300)` | `#43345e` | violeta |
| T4 Backend | `oklch(0.40 0.07 70)` | `#54442a` | ocre |
| T5 Multiagente | `oklch(0.40 0.07 200)` | `#1f4a52` | teal |
| T6 Escala | `oklch(0.40 0.07 20)` | `#5e3334` | oxblood |

```html
<!-- na pagina da Trilha 1, dentro do <head> apos o link do learn.css -->
<style>
  html[data-track="1"]{ --accent: oklch(0.40 0.07 150); --accent-soft: oklch(0.47 0.066 150); }
</style>
```

E o filete, nao o banho. Monocromatico domina; o acento aparece quase nunca (figura,
estado, link em foco).

---

# 16. Checklist final

Antes de dar a pagina por pronta, rode **`references/CHECKLIST_REVISAO.md`** (itens
testaveis no render/DevTools). Resumo das travas que mais reprovam:

- [ ] Fundo nunca `#fff`, tinta nunca `#000`; papel quente OKLCH nos 3 temas. (E1)
- [ ] Corpo em **Source Serif 4**, titulo em **Spectral** — nunca Inter. (E2)
- [ ] Coluna **62-70ch**, line-height **1.62-1.70**, corpo **18-19px**. (E3)
- [ ] **Zero** barra de progresso / anel / % / chip de stat / glow ambar+ciano. (E4)
- [ ] No maximo **1 figura por ideia**; secoes respiram (~96px). (E12)
- [ ] Profundidade SEMPRE em camada (sidenote / `go-deeper` / `dfn`); essencial nunca dobrado. (E7, E8)
- [ ] Sidenote funciona na margem (desktop) **e** colapsa inline no mobile **sem JS**.
- [ ] Nota/duvida na margem (`data-inema-rail`), nunca modal/drawer; `localStorage`. (E6)
- [ ] Cada `<section>` tem `data-inema-topic` + `-module` + `-track`.
- [ ] Reader-bar com tema (papel/sepia/escuro), tamanho e fonte (Atkinson) via `data-inema-set-*`.
- [ ] Progresso = `N de M` (`data-inema-meter`) + 1 filete; grade silenciosa onde couber. (E11)
- [ ] **Zero** gamificacao (streak/XP/badge/confete/placar). (E9)
- [ ] Landing = obra editorial: hero tipografico, curriculo-como-indice, CTA unico sem urgencia. (secao 14)
- [ ] `prefers-reduced-motion` e foco-visivel respeitados; pagina le perfeita com JS desligado.
- [ ] 1 `.html` + `assets/` compartilhados; sem build, sem backend; abre em `file://`. (1.1)

---

> **FIM — MASTER COMPLETO v3.** Reading-mode default · papel quente · acento UNICO ·
> sidenotes na margem · profundidade por camadas · progresso "N de M" · zero gamificacao.
> Quando este guia e o codigo (`learn.css`/`learn.js`) divergirem, **o codigo manda** —
> e atualize este guia.
