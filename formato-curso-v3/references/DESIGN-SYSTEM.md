# DESIGN-SYSTEM — formato-curso INEMA v3

> Condensado de `V3-DESIGN.md`. Fonte canonica para implementacao.

## Tese

**SIMPLICIDADE RADICAL + CONTEUDO PROFUNDO.** Leitura-primeiro, calma, foco. A
profundidade aparece SEM poluir — por **camadas sob demanda** (sidenotes de margem,
divulgacao progressiva, "indo mais fundo", definicoes inline), nunca por densidade
visual simultanea. A pagina de aula **abre parecendo um reader-mode** (Safari Reader /
Gwern), nao um dashboard. Premium nasce da **quietude**, nao do enfeite.

**Restricao tecnica (regra de ouro):** 1 `.html` auto-contido, Google Fonts/Tailwind
via CDN, JS inline opcional, **sem build, sem backend**, abre em `file://`. Tudo e
progressive enhancement: le perfeita com JS desligado.

## Os 5 principios

- **P1 — Reading-mode como DEFAULT, nao modo extra.** Abre ja como coluna unica de
  leitura, papel quente, serif de corpo, controles minimos (tema, tamanho, fonte).
  Tema escuro = apenas mais um tema, nunca a base. Calma vem do layout quieto, nao de
  esconder o chrome (nav e "indo mais fundo" sempre descobriveis).
- **P2 — Uma ideia por tela = uma figura por ideia.** Cada secao isola UM conceito e
  no maximo UMA figura. Sequencia: **fenomeno/visual concreto -> intuicao simples ->
  formalizacao**. Densidade de pensamento, nao densidade visual.
- **P3 — Profundidade por CAMADAS sob demanda (iceberg), nunca por densidade.** Coluna
  central enxuta; nuance/definicao/fonte/"por que" em camadas reveladas quando o leitor
  pede. O default ja conta a historia; aprofundar e opt-in. **Nunca esconder o
  essencial.** Maximo 1-2 niveis; alem disso, reorganizar.
- **P4 — Sidenotes de margem como motor da divulgacao progressiva (CSS puro).** A
  largura restrita cria a margem; a margem vira a camada de detalhe. Nota mora AO LADO
  do trecho (mesma altura) — nunca footnote/popover/drawer/modal. Mobile: colapsa para
  inline expansivel via checkbox-hack + `<label>`, sem JS, acessivel por teclado.
- **P5 — Distintividade por tipografia + ilustracao + ritmo, nao por cromo escuro.**
  Assinatura = par display-serif + body-serif, ilustracao autoral sobria (1 por ideia),
  ritmo calmo. Subtitulos descritivos sao a 1a camada de leitura (layer-cake).

## Tokens / paleta (tema CLARO "paper" — default)

Cor em OKLCH (fonte); hex como fallback. **Nunca `#000`/`#fff` puros.** Monocromatico
quente + UM acento reservado a estado/figura.

| Token | OKLCH | ~hex | Uso |
|---|---|---|---|
| `--paper` | `oklch(0.971 0.012 86)` | `#f4efe4` | Fundo (papel quente) |
| `--paper-raised` | `oklch(0.985 0.010 86)` | `#faf6ec` | Superficie elevada (cartao raso) |
| `--paper-margin` | `oklch(0.962 0.012 88)` | `#efe8da` | Gutter da margem |
| `--paper-deep` | `oklch(0.935 0.014 86)` | `#ece5d6` | Borda/sombra de papel |
| `--ink` | `oklch(0.255 0.012 70)` | `#26211b` | Tinta de corpo (quase-preta, quente) |
| `--ink-soft` | `oklch(0.455 0.012 70)` | `#5b5347` | Texto secundario |
| `--ink-faint` | `oklch(0.610 0.013 75)` | `#8a8073` | Metadados, rotulos, "N de M" |
| `--rule` | `oklch(0.855 0.012 82)` | `#d8cfbc` | Hairline 1px |
| `--rule-soft` | `oklch(0.900 0.011 84)` | `#e3dccb` | Regra ainda mais leve |
| `--accent` | `oklch(0.385 0.075 255)` | `#243a63` | **Acento unico**: figura/codigo, estado "duvida", link foco. Reservado. |
| `--accent-soft` | `oklch(0.470 0.070 258)` | `#3a527e` | Variante (hover/2o nivel) |
| `--accent-wash` | `oklch(0.945 0.010 80)` | `#e7e2d8` | Fundo de bloco do acento, raríssimo |
| `--mark` | `oklch(0.560 0.105 35)` | `#7a2230` | Oxblood: "nao fazer"/atencao (raro, semantico) |
| `--highlight` | `oklch(0.905 0.105 100)` | `#f0e08c` | Marca-texto sobre 1 termo, nunca paragrafos |

**Regra de cor:** UM proposito funcional por vez. Nunca decoracao. Default visivel =
monocromatico.

**Acento por trilha** (so rotulo + filete + `--accent` girado em HUE, croma baixo,
lightness travada ~0.39 — nunca banha a pagina):

| Trilha | OKLCH | ~hex | Hue |
|---|---|---|---|
| T1 Fundamentos | `oklch(0.40 0.07 150)` | `#2f5641` | verde |
| T2 Disciplina | `oklch(0.40 0.07 255)` | `#243a63` | azul (default) |
| T3 Frontend | `oklch(0.40 0.07 300)` | `#43345e` | violeta |
| T4 Backend | `oklch(0.40 0.07 70)` | `#54442a` | ocre |
| T5 Multiagente | `oklch(0.40 0.07 200)` | `#1f4a52` | teal |
| T6 Escala | `oklch(0.40 0.07 20)` | `#5e3334` | oxblood |

## Temas (1 toggle: papel / sepia / escuro)

Mesmo conjunto minimo de controles do reader-mode. Escuro NAO e a base e NAO volta ao
dark premium ambar/ciano do v2.

- **Papel (default):** ver tabela acima.
- **Sepia:** `--paper oklch(0.945 0.030 75)` (~`#efe2cc`), `--ink oklch(0.290 0.020 60)`.
- **Escuro (calmo, sem ambar):** `--paper oklch(0.245 0.010 70)` (~`#211f1c`),
  `--paper-raised oklch(0.285 0.010 70)`, `--ink oklch(0.900 0.008 80)` (~`#e6e2da`,
  off-white quente, nunca `#fff`), `--accent oklch(0.700 0.060 255)`. Contraste
  rebaixado de proposito; zero glow.

## Tipografia

Par com caracter, fora do Inter. Hierarquia por **tamanho/peso, nunca por cor**.

| Papel | Familia | Fallback | Pesos |
|---|---|---|---|
| **Display** | Spectral | Georgia, serif | 300-700 + italico |
| **Corpo** | Source Serif 4 | Georgia, serif | 400/500/600 + italico |
| **Mono / rotulo** | IBM Plex Mono | ui-monospace | 400/500 |
| **A11y (toggle)** | Atkinson Hyperlegible | sans | 400/700 |

```html
<link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,400&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

**Numeros duros (Butterick — travas de qualidade):** corpo **18-19px** (faixa 15-25);
line-height **1.62-1.70**; **measure 62-70ch** (a restricao que libera a margem).

```css
:root{
  --serif-disp:"Spectral",Georgia,serif;
  --serif-body:"Source Serif 4",Georgia,serif;
  --mono:"IBM Plex Mono",ui-monospace,monospace;
  --measure:66ch; --leading:1.66;
  --size-body:clamp(1.05rem,0.6rem + 0.7vw,1.18rem);
}
.column{ max-width:var(--measure); }
body{ font-family:var(--serif-body); font-size:var(--size-body);
  line-height:var(--leading); color:var(--ink); background:var(--paper); }
```

**Escala (~1.25):** Kicker 0.72rem caps mono `0.22em` · h1 `clamp(2.0rem,1.2rem+2.4vw,3.0rem)`
display · h2 `clamp(1.5rem,1.1rem+1.2vw,1.95rem)` display · h3 subtitulo descritivo
1.22rem/600 display (1a camada) · corpo `--size-body` · sidenote 0.85rem/1.45 body ·
legenda/metadata 0.78rem mono.

**Craft tipografico (anti "IA-default"):** aspas curvas; travessao (—) != hifen; UM
unico estilo de enfase (bold OU italico, nunca juntos, nunca sublinhar exceto links);
espaco entre paragrafos OU indent (nunca os dois); all-caps so abaixo de 1 linha com
leve letterspacing; links sublinhado discreto, NAO mudar de cor no hover.

## Espaco e elevacao

Base 8px: `--s1 4 · --s2 8 · --s3 12 · --s4 16 · --s5 24 · --s6 32 · --s7 48 · --s8 64 · --s9 96`.
Gap entre paragrafos `--s5`; **gap entre secoes `--s9` (96px)** — cada secao respira.
Grid desktop: `grid-template-columns: minmax(0, var(--measure)) clamp(220px, 26vw, 320px)`
(coluna de leitura + rail de margem). Coluna+rail somam ~1100-1180px max.

Elevacao minima (papel, nao material): N0 corpo sem sombra/borda; N1 figura/aside
`1px solid var(--rule)` + `--paper-raised` (+ filete `0 1px 0 var(--paper-deep)`, nao
glow); N2 nav sticky hairline inferior + backdrop leve, sem blur pesado/dark glass.
`--radius: 4px` (quase reto, nada de `rounded-xl`). Foco-visivel outline `2px var(--accent)`
offset 2px.

## Sidenotes / camadas de profundidade

- **Sidenote (Tufte, CSS puro):** aside curto ancorado ao lado do paragrafo (mesma
  altura). Mobile (`@media max-width:1080px`): `.sidenote/.marginnote` vira
  `display:none`; `<input type="checkbox" class="margin-toggle">` + `<label>` com
  simbolo; `:checked + .sidenote` -> `display:block` inline. Sem JS, teclado-acessivel.
- **"Indo mais fundo":** `<details><summary>Indo mais fundo</summary>…` para
  prova/derivacao/referencia densa. Nativo, sem JS, max 1-2 niveis.
- **Definicao inline:** termo limpo no texto, definicao curta sob demanda junto ao
  gatilho (information scent — leitor decide aprofundar sem sair do fluxo).
- **Foco da secao (opcional):** esmaecer levemente o que nao e a secao atual, calmo,
  sem pulse, respeitando `prefers-reduced-motion`. Reading time `X min de leitura`
  (palavras/~225 wpm).
- **Recall sem motor:** "pare e preveja antes de revelar" + knowledge check estatico
  (3-4 perguntas) ao fim da aula. Sem gamificacao.

## Camada de aprendizado — MINIMA (localStorage)

- **Progresso silencioso (mata as 3 barras):** `N de M` (mono, `--ink-faint`) + grade
  silenciosa de quadradinhos por modulo (estilo mastery do Khan) + **1 proxima acao**
  clara. Sem barra, anel, percentual gritante ou chip de stat.
- **Marcar lido:** check sobrio ao fim; alterna o quadradinho. Sem confete/som/streak.
- **Duvida:** ancorada na **margem** ao lado do ponto exato (usa `--accent` como unico
  estado colorido), nunca modal/drawer. Persistida local.
- **Nota:** tambem na margem (mesmo rail dos sidenotes). Mobile: inline expansivel.

## EVITAR (anti-padrao "curso online")

Dashboard de XP/streak/ranking · mascote/confete/badges · cards coloridos dentro da
licao (cards = so catalogo/indice) · sidebar fixa roubando largura na leitura · hero 3D
isometrico · mockup de produto flutuante · contador de alunos · selos de garantia ·
carrossel de depoimentos com estrelinhas · gradiente roxo/ambar · CTA com countdown ·
"voce vai aprender" com 12 checks · FAQ que e objecao de venda · **paleta dark premium
ambar+ciano (= o v2, virou slop)** · display ultra-bold em todo heading · `#fff`/`#000`
puros · Inter sozinho no corpo · 3 barras de progresso · gamificacao · profundidade
empilhada na dobra.

## Landing/index (tom)

> O produto parece uma OBRA que o autor precisava escrever, nao um PRODUTO que precisava
> vender. Explica *o que e* e *por que existe* — nao convence a forca.

Hero tipografico puro (headline = diagnostico preciso da dor; "domine X em 30 dias"
PROIBIDO) · curriculo como indice real (titulo + 1 paragrafo do "porque") · prova social
sobria (citacao estatica, sem carrossel/estrelinhas/"+10.000 alunos") · CTA unico sem
urgencia + saida de baixo risco ("ler o Modulo 1").

## Referencias-norte (verificadas, ao vivo)

- **gwern.net** + **edwardtufte.github.io/tufte-css** — leitura profunda self-contained
  + sidenotes (a espinha tecnica).
- **justjavascript.com** — uma ideia por tela + "pare e preveja" (recall sem quiz).
- **ciechanow.ski** / **3blue1brown.com** — uma figura forte por ideia.
- **stripe.press** / **every.to** — tom editorial premium pela quietude.
- **refactoringui.com** / **css-for-js.dev** — landing de autor sem infoproduto.
- Apoio: NN/g Progressive Disclosure / Layer-Cake / Information Scent · Quanta Magazine ·
  MasterClass (premium = quietude) · Khan Academy (mastery grid) · iA Typography.
