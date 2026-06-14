# CHECKLIST_REVISAO — formato-curso INEMA v3

Itens **testaveis** (verificaveis no HTML/CSS render ou via DevTools). Marcar `[x]` so
quando o teste passa. Reprovar a pagina se qualquer item PRESENTE-OBRIGATORIO faltar ou
qualquer item PROIBIDO aparecer.

## A. Cor e papel

- [ ] **Papel sem `#fff` puro.** `--paper` (e fundo de `body`) NUNCA e `#ffffff`/`#fff`/
  `rgb(255,255,255)` em nenhum tema. Light ~`#f4efe4`; sepia ~`#efe2cc`; escuro ~`#211f1c`.
  Teste: computed `background-color` de `body` != branco puro.
- [ ] **Tinta sem `#000` puro.** `--ink` nunca `#000`/`#000000`/`rgb(0,0,0)`; off-black
  quente (~`#26211b` light, ~`#e6e2da` escuro). Teste: computed `color` do corpo != preto puro.
- [ ] **1 acento.** Existe exatamente UM token de acento (`--accent`) usado na pagina;
  nenhum segundo croma decorativo competindo. Sem glow/gradiente ambar+ciano. Trilha
  muda so o HUE de `--accent` (croma baixo), nunca banha a pagina.
- [ ] **Contraste AA por tema.** Corpo (ink sobre paper) >= 4.5:1 em CADA tema
  (light/sepia/escuro). Teste: contrast checker nos 3 temas; texto pequeno >= 4.5:1,
  texto grande >= 3:1.

## B. Tipografia

- [ ] **Serif no corpo.** `font-family` do `body`/corpo resolve para Source Serif 4 (ou
  Georgia/serif fallback) — **NAO Inter**, NAO sans no corpo. Titulos em Spectral.
- [ ] **Measure 62-70ch.** A coluna de leitura tem `max-width` na faixa 62-70ch.
- [ ] **Line-height 1.62-1.70** no corpo; **corpo 18-19px** (renderizado, faixa 15-25).
- [ ] **Toggle de a11y presente.** Existe controle que troca a fonte para Atkinson
  Hyperlegible. Existe toggle de tema (claro/sepia/escuro) e de tamanho.

## C. Estrutura de profundidade

- [ ] **Sidenote na margem no desktop e inline no mobile.** Em >=1081px a `.sidenote/
  .marginnote` aparece no rail lateral (mesma altura do trecho). Em <=1080px ela
  colapsa: oculta por padrao e expande inline abaixo do paragrafo via checkbox-hack +
  `<label>`, **sem JS**. Teste: redimensionar e togglar pelo simbolo (e por teclado).
- [ ] **Profundidade sempre em camada.** Nuance/derivacao/referencia densa em sidenote,
  `<details>` "indo mais fundo" ou definicao inline — nunca empilhada na dobra.
- [ ] **Essencial nunca escondido.** Caminho-feliz legivel no corpo; so o raro/
  aprofundamento fica atras de clique. Max 1-2 niveis de aninhamento.
- [ ] **1 figura por ideia.** Nenhuma secao tem mais de 1 figura/metafora visual forte.
- [ ] **Gap de secao ~96px.** Espaco entre secoes = `--s9` (96px), respiro abundante.

## D. Camada de aprendizado

- [ ] **SEM 3 barras.** Nenhuma barra de progresso (`<progress>`/div-barra), nenhum
  anel, nenhum percentual gritante, nenhum chip de stat. Teste: grep por barra/anel/`%`.
- [ ] **Progresso agrega.** Existe `N de M` (mono, `--ink-faint`) + grade silenciosa de
  quadradinhos por modulo + **1 proxima acao** clara ("continuar -> proxima aula").
- [ ] **SEM cards-na-licao.** Nenhum card colorido/elevado dentro do corpo da aula
  (cards = so catalogo/indice). Dentro da licao so hairlines, asides nivel-1 e figuras.
- [ ] **SEM gamificacao.** Zero streak, XP, badge, leaderboard, placar, confete, som,
  mascote, contador de alunos. Recall = "pare e preveja" + knowledge check estatico.
- [ ] **Duvida e nota na margem.** Ambas vivem no rail ancoradas ao texto, em
  `localStorage` — nunca em modal/drawer. Duvida usa `--accent` como unico estado colorido.

## E. Manifesto e tom

- [ ] **Manifesto presente.** A entrada/landing declara o "porque existe" (obra, nao
  produto); headline = diagnostico da dor, sem "domine X em 30 dias", sem countdown,
  sem "+10.000 alunos", sem carrossel de depoimentos com estrelinhas.

## F. Responsivo e robustez

- [ ] **Mobile sem overflow horizontal.** Em 360-414px de largura nao ha scroll
  horizontal; nada estoura a viewport. Teste: DevTools mobile, `document.body.scrollWidth
  <= window.innerWidth`.
- [ ] **Le perfeita com JS desligado.** Desativar JS: corpo, sidenotes (CSS puro),
  `<details>` e navegacao continuam funcionais. Tudo e progressive enhancement.
- [ ] **`prefers-reduced-motion` e `prefers-color-scheme` respeitados.** Sem animacao/
  pulse com reduce-motion; tema inicial segue o esquema do sistema. Foco-visivel
  acessivel (outline `2px var(--accent)` offset 2px).
- [ ] **Export/import round-trip.** Exportar o estado (progresso/notas/duvidas do
  `localStorage`) e reimportar reproduz exatamente o mesmo estado — sem perda nem
  duplicacao. Teste: export -> limpar storage -> import -> estado identico.

## G. Restricao tecnica

- [ ] **1 `.html` auto-contido.** Sem build, sem backend; Google Fonts/Tailwind via CDN;
  JS inline opcional. Abre em `file://`.
