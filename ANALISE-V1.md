# ANALISE-V1 — Consolidacao das 4 auditorias da skill `formato-curso` (v1)

> **AVISO (read-only):** NADA foi alterado na skill v1. Os arquivos em
> `/home/nmaldaner/.claude/skills/formato-curso/` (`SKILL.md`,
> `references/MASTER_COMPLETO.md`, `references/DESIGN-SYSTEM.md`,
> `references/SVG-FUTURISTA.md`, `references/CHECKLIST_REVISAO.md`) foram **apenas
> lidos**. Este relatorio so escreve este `.md` dentro do projeto. As correcoes
> abaixo sao **recomendacoes**, nao patches aplicados.

Auditoria-chefe / cetico. Consolidei 4 auditorias independentes (A1 = consistencia
documental; A2 = runtime CSS/JS/HTML/SVG estatico; A3 = a11y/responsivo/didatica;
A4 = montagem verbatim em Chromium via Playwright). Para cada achado julguei **REAL**
ou **FALSO-POSITIVO**, com dedup entre auditorias e validacao no codigo-fonte da skill.

Data: 2026-06-14.

---

## 1. Sumario executivo

A skill v1 esta **saudavel no caminho feliz e majoritariamente coerente**, mas nao
e ainda uma "fonte unica confiavel": ela carrega **inconsistencias internas reais**
(que confundiriam um agente) e **lacunas de acessibilidade nos componentes
interativos**. A montagem verbatim em Chromium (A4) **passou** em todos os checks de
runtime (theme toggle, accordion, modal, responsivo 390px, zero pageerrors), o que
derruba varios "achados de runtime" como artefatos de ambiente `file://`.

**Bugs reais por severidade (apos dedup e descarte de falsos-positivos): 16**

| Severidade | Qtd | Natureza |
|---|---|---|
| Alta | 6 | 3 de coerencia documental (contagem de topicos; versao/data; numeracao dos erros) + 3 de a11y de componente (accordion, modal, theme toggle sem nome acessivel) + acoplamento fragil do `toggleTopic` a classe de cor + cobertura de light-mode incompleta. (ver tabela) |
| Media | 7 | contradicoes de politica (zero-raster vs inemaimg; hand-drawn; Excalidraw), hex do Purple, light-mode `text-white`/`border-primary/30`, skip link, `aria-current`, nav densa no mobile, theme-toggle sem null-guard. |
| Baixa | 3+ | FOUC de tema, gradientes (texto vs uso real), `font-weight 700` no snippet hero, painel SVG no light, body `#fff` vs `#f8fafc`, etc. |

**Vale mexer?** Para uso interno/educacional, a v1 **serve como esta** (renderiza e
funciona). Mas **antes de trata-la como fonte canonica unica**, vale uma rodada de
reconciliacao barata e de alto retorno: unificar a contagem de topicos, casar
versao/data, alinhar a numeracao dos "Erros Criticos", e resolver as contradicoes de
politica de imagem/estilo. A a11y dos componentes (accordion/modal/toggle) e a
cobertura de light-mode sao os unicos pontos que afetam o **produto entregue ao
aluno** — e boa parte ja foi **antecipada pelo v2/v3** (ver Secao 6). Veredito do
cetico: **mexer pouco e cirurgicamente** (coerencia + a11y minima), nao reescrever.

---

## 2. BUGS confirmados (so os REAIS)

| # | Sev | Area | Problema | Evidencia (verificada no fonte) | Correcao sugerida |
|---|-----|------|----------|----------|-------------------|
| B1 | Alta | Coerencia / contagem de topicos | Quatro formulacoes conflitantes: "EXATAMENTE 6" vs "MINIMO 6" vs "6-8" vs "6 secoes ricas". | `MASTER` L235 `EXATAMENTE 6 Topicos`; L183/L455 `6-8`; L477 `6 secoes ricas`; `SKILL` L103/L166 `MINIMO 6`. (confirmado por grep) | Padronizar uma regra unica. Provavel intencao: **6-8 secoes por modulo, minimo 6**. Corrigir o "EXATAMENTE 6" e o "6 secoes ricas". |
| B2 | Alta | Coerencia / versao do MASTER | Cabecalho e rodape do mesmo arquivo divergem em versao E data. | `MASTER` L4 `Versao: 2.0 \| Data: 2026-01-20`; L1135-1136 `Ultima atualizacao: 2026-03-10` + `Versao: 1.0`. (confirmado) | Unificar para uma versao/data so. Se 2026-03-10 e a atual, cabecalho deve refletir. |
| B3 | Alta | Coerencia / numeracao dos "Erros Criticos" | `SKILL` numera erros #1-#17 (com 10/11 invertidos na tabela) e cita "#17"; `MASTER` so tem subsecoes 1.1-1.10 (10 itens). O "#17" nao existe como numero no MASTER. | `SKILL` tabela L94-110 (#1-#17, ordem 10/11 trocada), L17/L53 citam "#17"; `MASTER` Sec.1 L23-216 = 1.1-1.10. | Alinhar os dois sistemas (ou MASTER numera 17, ou SKILL passa a citar "Sec.1.10"). Corrigir a inversao 10/11. |
| B4 | Alta | JS / `toggleTopic` | O acordeao usa `button.closest('.bg-dark-800')` para achar o card, mas `.bg-dark-800` e classe **utilitaria de cor**, nao semantica — usada tambem no modal (L1017), nos cards (L561/L661) e em `bg-dark-800/50`. Quebra silenciosa se a cor do card mudar; risco de pegar container errado em inline. | `MASTER` L970 `closest('.bg-dark-800')`. Note que L968 ja usa `closest('.topic-item')` — o padrao semantico existe e nao foi usado p/ o card. | Adicionar `class="module-card"` no `<div>` do card e usar `closest('.module-card')`. Nunca acoplar JS a classe de cor do Tailwind. |
| B5 | Alta | CSS / cobertura light-mode | Varias classes usadas nos componentes nao tem override em `html:not(.dark)`: `divide-dark-600`, `bg-red-900/20`, `bg-emerald-900/20`, `bg-blue-900/20`, `border-red-500/30`, `text-red-400`, `text-blue-400`. Ficam escuras/translucidas sobre branco no tema claro. | Bloco light-mode (`MASTER` Sec.1.5/8.1) cobre `bg-dark-*`, acento, primary, sky, yellow — nao os listados. Componentes 7.9/7.11/7.13 usam essas classes. | Acrescentar os overrides faltantes (ver A2 para os hex). Idealmente **gerar** a lista a partir das classes realmente usadas, ou migrar para CSS custom properties. |
| B6 | Alta | CSS / `text-white` invisivel no claro | `text-white` em titulo de timeline e `<strong>` de resumo fica branco sobre card branco no light mode — titulo praticamente invisivel. Sem override de `.text-white`. | `MASTER` L806 `<h4 ... text-white>` e L838 `<strong class="text-white">`; **zero** override `html:not(.dark) .text-white` (confirmado). (L582/L854/L1024 sao sobre botao emerald / X do modal — NAO afetados.) | `html:not(.dark) .text-white { color:#111827 }` OU trocar por `text-neutral-100` (que ja tem override). |
| B7 | Alta | a11y / accordion | Botao do topico sem `aria-expanded`/`aria-controls`; painel sem `id`/`role`/`aria-labelledby`; sem pista visual de estado (chevron). Leitor de tela anuncia so "botao". | `MASTER` §7.2 botao sem aria; §9.1 so faz `classList.toggle('active')`. Grep aria-* no MASTER inteiro = 1 ocorrencia. | `aria-expanded`/`aria-controls` no botao; `id`/`role=region`/`aria-labelledby` no painel; alternar `aria-expanded` no `toggleTopic` (inclusive zerando irmaos); chevron que gira via `[aria-expanded=true]`. |
| B8 | Alta | a11y / modal | Modal nao e dialog acessivel: sem `role=dialog`/`aria-modal`/`aria-labelledby`; sem mover foco ao abrir, sem focus-trap (Tab vaza p/ a pagina e p/ o iframe inteiro), sem retorno de foco ao fechar. Botao "×" sem `aria-label`. | `MASTER` §9.3 L1016 sem role/aria; `openModal` L1040 so remove `hidden`. Iframe carrega pagina completa = ordem de tab inclui tudo. | `role=dialog aria-modal=true aria-labelledby=...`; salvar `activeElement`, mover foco p/ dentro, trap de Tab, restaurar foco no close; `aria-label="Fechar"` no ×. |
| B9 | Alta | a11y / theme toggle | Botao de tema sem nome acessivel: so dois `<svg>` (sol/lua), sem `aria-label`/`<title>`/texto; SVGs sem `aria-hidden`. | `MASTER` §5.2 L408 `<button id="theme-toggle">` + 2 SVGs sem aria. | `aria-label="Alternar tema claro/escuro"` no botao; `aria-hidden="true"` nos icones. |
| B10 | Media | Politica / zero-raster vs inemaimg | Contradicao direta: `DESIGN-SYSTEM` proibe "Zero imagens raster — sem PNG/JPG", mas `SKILL` dedica secao inteira a gerar PNGs com `inemaimg` (hero/thumb/fundo). | `DESIGN-SYSTEM` §2.1 L36; `SKILL` L47-84. | Reconciliar: SVG obrigatorio p/ diagrama conceitual; marcar `inemaimg`/raster decorativo como **excecao explicita** ao "zero raster", ou liberar raster decorativo no DESIGN-SYSTEM. |
| B11 | Media | Politica / hand-drawn vs Excalidraw | `DESIGN-SYSTEM` lista Excalidraw/"hand-drawn" como referencia valida, mas `MASTER` e `SVG-FUTURISTA` proibem hand-drawn explicitamente. | `DESIGN-SYSTEM` §3.1 L78; `MASTER` §1.10 L207; `SVG-FUTURISTA` Princ.2 L11; `SKILL` erro #17 L110. | Remover Excalidraw das referencias aceitas, ou marca-lo como contra-exemplo ("o que NAO fazer"). |
| B12 | Media | Cor / Purple dark | Hex do Purple em dark mode diverge: `#a78bfa` (violet-400) no DESIGN-SYSTEM vs `#c084fc` (purple-400) no MASTER e SVG. | `DESIGN-SYSTEM` L171 `#a78bfa`; `MASTER` L307 e `SVG-FUTURISTA` L38 `#c084fc`. | Corrigir DESIGN-SYSTEM p/ `#c084fc` (purple-400 real). |
| B13 | Media | CSS / `border-primary/30` | Componente Dica/Conceito usa `border-primary/30`, mas o light-mode so cobre `border-primary/40`. A borda fica amarelo-neon translucido no claro. | `MASTER` 7.10 L764 `border border-primary/30`; light-mode cobre so `/40` (L922/L1108). | Trocar componente p/ `/40` OU adicionar override `border-primary/30`. Auditar todos os sufixos de opacidade usados vs declarados. |
| B14 | Media | a11y / skip link + `aria-current` | Sem skip link (nav denso identico em toda pagina + breadcrumb → ~8-10 tabs ate o conteudo). Trilha ativa e item do breadcrumb marcados so por cor, sem `aria-current`. | `MASTER` §1.6 (nav identico), §8.1 sem skip link; §5.2 L396 ativo so por cor; §7.6 breadcrumb sem `aria-label`/`aria-current`. Grep skip/sr-only/aria-current = 0. | Skip link como 1o elemento do `<body>` + `id` no `<main>`; `aria-current="page"` na trilha ativa e no breadcrumb final; `<nav aria-label>` no breadcrumb. |
| B15 | Media | Responsivo / nav no mobile | Logo + INEMA.CLUB + 4-6 botoes de trilha + toggle numa unica linha `h-14` com `space-x-1`, sem wrap nem hamburguer. Alvos de toque apertados (~30px) em ~360px. | `MASTER` §5.2 nav `h-14`; §1.6 proibe nav simplificado nas internas. | Em `<=sm`, colapsar trilhas em dropdown/sheet ou `overflow-x-auto`; alvos >=44px. |
| B16 | Media | JS / theme toggle sem null-guard | Se a pagina nao tiver os 3 elementos do toggle, `getElementById` + `.classList`/`addEventListener` dispara TypeError e **derruba todo o `<script>` seguinte**. Nav e copiado a mao → facil faltar um icone. | `MASTER` §9.2 L987-1006 usa os elementos sem checar null. | `if (toggle && darkIcon && lightIcon) {...}` ou optional chaining; mover init de tema p/ `<head>` (resolve tambem FOUC, ver S2). |

**Bugs de baixa severidade confirmados (reais, mas cosmeticos / risco baixo):**

- **B17 (baixa, CSS/cosmetico):** no light mode o `<body>` renderiza `#ffffff`, nao o
  `#f8fafc` que a spec **enfatiza** como cor solida. Causa: `<body class="bg-dark-900">`
  (L932) + regra de classe `.bg-dark-900{background:#fff}` (L71/898) vence a regra de
  tipo `body{background:#f8fafc}` (L68/897) por especificidade. **Validado em runtime
  (A4): `getComputedStyle(body).backgroundColor = rgb(255,255,255)`.** Fix: tirar
  `bg-dark-900` do `<body>` ou subir especificidade (`body.bg-dark-900`).
- **B18 (baixa, JS):** FOUC de tema — `<html class="dark">` e fixo (L870) e o init que le
  `localStorage` roda no fim do body. Usuario em light ve flash escuro a cada carga.
  Fix: script inline minimo no `<head>` antes do CSS. (mesma correcao do B16.)
- **B19 (baixa, SVG):** snippet hero (`SVG-FUTURISTA` §4.1 L112/L122) usa
  `font-weight="700"` em "Origem"/"Resultado", contra o proprio Principio 8/checklist
  (titulos = 600, 700 so p/ 1 rotulo-chave isolado). O exemplo canonico viola a regra
  que estabelece. Fix: `600` no snippet, ou nota de que sao os rotulos-chave permitidos.
- **B20 (baixa, SVG):** painel envoltorio `bg-dark-900/40` (Principio 7) sem override de
  light-mode → fundo escuro translucido sobre branco no claro. Fix: override de
  `bg-dark-900/40` ou usar classe ja coberta.
- **B21 (baixa, SVG):** colisao potencial de IDs de `defs` quando ha >1 SVG do mesmo
  modulo na pagina — a instrucao e "prefixe por modulo" (`m41-glow`), nao "por SVG".
  Dois SVGs com `m41-glow` referenciam o mesmo def. Fix: prefixo unico por instancia
  (`m41-fig1-glow`) + item no checklist.
- **B22 (baixa, JS/perf):** modal por iframe nao e lazy — todos os iframes (6-8) dao
  fetch no parse inicial; `closeModal` so adiciona `.hidden`, nao descarrega.
  Fix: `src` vazio no HTML, setar em `openModal`, `about:blank` em `closeModal`.
- **B23 (baixa, JS):** `closeModal` reseta `body.style.overflow='auto'` incondicional e
  ESC sempre chama `closeModal` mesmo sem modal aberto. Fix: checar se ainda ha modal
  aberto antes de resetar o scroll-lock.
- **B24 (baixa, HTML/a11y):** botao "×" do modal e o toggle sao operaveis por teclado
  (elementos nativos), mas o "×" so tem o glifo `&times;` — sem `aria-label="Fechar"`.
  (parte de B8, mantido aqui p/ rastreio.)

---

## 3. SUGESTOES de melhoria (nao-bugs), priorizadas

1. **(Alta prioridade) Gerar os overrides de light-mode a partir das classes
   realmente usadas** — ou migrar para **CSS custom properties** (`--accent` trocada por
   `html:not(.dark)`), eliminando a lista manual por sufixo de opacidade. Resolve B5,
   B6, B13, B20 de uma vez e impede regressao futura. (A2)
2. **(Alta) Propagar tema ao iframe do modal** — apos togglar, `iframe.contentDocument
   .documentElement.classList.toggle('dark', ...)` e/ou `?theme=` na query; documentar a
   limitacao de `localStorage` em `file://`. (O modal em si esta correto em runtime; o
   gap e a sincronizacao de tema entre pagina-pai e iframe.) (A2)
3. **(Media) Camada minima de wayfinding na pagina de modulo** — TOC com ancoras
   `#topico-N` (os ids ja existem) + indicador "Modulo X.Y — N de M da trilha". Modulos
   tem 500-800 linhas / 6-8 secoes e hoje o unico wayfinding interno e o breadcrumb de 3
   niveis. (A3) — **ja coberto pelo v2/v3** (ver S6); portar so o minimo p/ v1.
4. **(Media) Stat grids responsivos e code block com overflow** — `grid-cols-4` fixo →
   `grid-cols-2 sm:grid-cols-4`; padronizar `<pre class="... overflow-x-auto">`. (A3)
5. **(Media) Reset global defensivo de reduced-motion** — `@media (prefers-reduced-motion:
   reduce){ *{animation-duration:.001ms!important;transition-duration:.001ms!important} }`
   e preferir `transition-colors` a `transition-all` nos hovers. (A3)
6. **(Baixa) Componente opcional "Checagem rapida"** (1-3 perguntas com resposta
   revelavel reusando `toggleTopic`) ao fim de secoes-chave, para recuperacao ativa —
   hoje o "Resumo do Modulo" e revisao passiva. (A3)
7. **(Baixa) Documentar a regra do nav inline sem iframe** — se o dev inlinar o conteudo
   do modulo no modal (tentacao recorrente), os ids do nav (`#theme-toggle` etc.)
   colidem; orientar remover/renomear o nav embutido ou escopar por classe + data-attr. (A2)
8. **(Baixa) Desambiguar referencias-fonte** — DESIGN-SYSTEM cita `2cerebro`/`mastercodex`;
   MASTER/SVG citam `opus48/trilha4`. Indicar qual e a referencia canonica de cada
   dominio (SVG = opus48; design geral = mastercodex). (A1)
9. **(Baixa) Notas de desambiguacao de tokens** — `#38bdf8` (sky-400) cobre tanto o link
   INEMA.CLUB quanto o ciano dos diagramas (mesmo token, papeis distintos); especificar
   `w-6 h-6` p/ numero de topico no checklist de trilha; mover a "Parte 5 / bordas dark"
   p/ fora da Sec.1.5 (Light Mode) ou renomear a secao. (A1)
10. **(Baixa) Texto dos gradientes vs uso real** — DESIGN-SYSTEM diz "gradiente so no
    hero", mas templates usam gradiente sutil em headers/box-conceito/resumo. Ajustar o
    texto p/ "nao empilhar gradiente sobre gradiente" em vez de "so no hero". (A1)
11. **(Baixa) Faixa de botoes de trilha** — trocar "4-6 botoes de trilha" (obrigatorio)
    por "um botao por trilha (tipicamente 3-6)", ja que T4-T6 sao opcionais e um curso de
    3 trilhas teria 3 botoes, violando o minimo 4. (A1)

---

## 4. Pontos fortes (o que NAO mexer)

- **SVGs nascem acessiveis e responsivos:** `role="img"` + `aria-label` obrigatorios,
  `viewBox` + `w-full h-auto`, e animacao sempre sob `@media (prefers-reduced-motion:
  no-preference)`. E o ponto da skill com a11y/reduced-motion **bem feitos** — manter.
- **Runtime do caminho feliz solido (validado por montagem verbatim, A4):** theme
  toggle, `toggleTopic` (acordeao fecha os irmaos corretamente), `openModal`/ESC e
  responsividade 390px **PASSAM** em Chromium, **zero pageerrors**. A abordagem **iframe
  no modal (DRY)** e acertada — o problema e so a sincronizacao de tema, nao a escolha.
- **Light mode com contraste pensado por tema:** acento trocado p/ `-600`/`-800` em fundo
  claro (com a justificativa correta: `-600` "fica neon"), fundo solido sem gradiente p/
  evitar manchas, e bordas suavizadas no dark (`border-dark-600` → `#374151` +
  `divide-dark-600`). Boa intencao de legibilidade — manter (so completar as lacunas).
- **Referencias de secao integras:** todas as `Sec. 7.4b / 1.6 / 1.8 / 1.10` citadas no
  SKILL e no CHECKLIST **existem** no MASTER e tratam do tema correto — **nenhuma
  referencia quebrada**. Isso e raro e valioso.
- **Regras de identidade consistentes entre os 4 arquivos:** tabela de cores por trilha
  (T1-T6) em classes Tailwind; "Mapa da Trilha" (nome oficial, proibicao de "Navegacao
  Rapida", subtitulo punchy) identico em SKILL/MASTER/CHECKLIST; Principio 8 do SVG
  ("intensidade contida": `stdDeviation 1.8`, `font-weight 600`, `stroke-width 2`)
  coerente em todos; light mode de Amber/Rose em `-800` consistente. Nucleo estavel.
- **Postura pro-movimento-seguro:** DESIGN-SYSTEM ja bane `rotate`/`bounce` e restringe a
  transicoes de cor — limita risco de motion sickness por design.

---

## 5. Falsos-positivos descartados (transparencia)

Estes apareceram nas auditorias mas **nao sao bugs da skill** — sao artefatos de
montagem/ambiente ou conclusoes que a montagem verbatim (A4) refutou:

- **`SecurityError` ao ler `iframe.contentDocument` (A2/A4):** FALSO-POSITIVO. Acontece
  porque o teste serve por `file://` (origem opaca `null`). Em producao (mesma origem
  `http`) nao ocorre. A4 confirmou: modal abre, iframe visivel e dimensionado
  (1150x625), ESC fecha. **O modal funciona** — o gap real e so o tema nao propagar p/ o
  iframe (capturado em B8/sugestao 2), nao o `SecurityError`.
- **Warning `cdn.tailwindcss.com should not be used in production` (A4):** FALSO-POSITIVO.
  Inerente a abordagem self-contained `file://` que a v1 prescreve de proposito. Nao
  quebra nada (`pageErrors=[]`). So relevante se um dia migrar p/ build de producao.
- **`iframe src` auto-referenciado (A4):** FALSO-POSITIVO declarado pelo proprio auditor
  — foi suposicao de montagem (um arquivo unico de teste), nao comportamento do template.
- **`localStorage` isolado no iframe em `file://` (A2):** PARCIALMENTE FALSO-POSITIVO.
  E uma limitacao real **so de `file://`**, nao do template em `http`. Mantido apenas
  como nota de documentacao dentro da sugestao 2, nao como bug.
- **"`text-white` invisivel" nas linhas 582/854/1024 (subconjunto de A2):**
  FALSO-POSITIVO parcial. Essas ocorrencias sao sobre **fundo colorido** (botao
  `bg-emerald-600`) ou sao o `hover:text-white` do "×" do modal — **nao** ficam
  invisiveis no claro. O bug B6 e real **apenas** nas linhas 806 e 838 (texto sobre card
  claro). Escopo corrigido.
- **"IDs duplicados no nav por causa do modal" (A2):** FALSO-POSITIVO no fluxo prescrito.
  Como o modal usa **iframe** (documento separado), os ids do nav **nao colidem**. O
  risco so existe **se** o dev inlinar o conteudo — virou a sugestao 7 (documentacao),
  nao um bug do template.
- **"Numero em circulo `w-12 h-12` divergente nas secoes de modulo" (A1):**
  FALSO-POSITIVO. Os tamanhos (`w-6 h-6` pequeno / `w-12 h-12` grande) sao **coerentes**
  no MASTER e no CHECKLIST de modulo. A unica acao util e adicionar a especificacao
  `w-6 h-6` no checklist de **trilha** — rebaixado a sugestao 9 (clareza), nao bug.
- **Referencia "Sec. 1.5 Parte 5" para bordas dark (A1):** a **referencia funciona** (a
  secao existe e tem Parte 5). Nao e bug; e so confuso ter regra de dark dentro de secao
  chamada "Light Mode". Rebaixado a sugestao 9 (organizacao).

---

## 6. Nota final — como a v1 se compara ao v2/v3 (sem alterar a v1 agora)

> Esta secao e comparativa. Reforco: **nao se propoe mexer na v1 por causa do v2/v3.**
> O objetivo e mostrar quais lacunas da v1 **ja estao resolvidas** nas evolucoes, para
> calibrar o quanto vale (ou nao) investir numa correcao da v1.

- **Wayfinding e progresso (sugestao 3, parte de B-didatica):** lacuna real da v1
  (sem TOC/indicador/“continuar de onde parei” dentro do modulo). O **v2 ja entrega**
  essa camada de aprendizagem — progresso, marcar-lido, "minha jornada", anotacoes —
  exatamente o que falta na v1. Logo, **se o caminho e migrar p/ v2/v3, nao vale portar
  wayfinding p/ a v1**; vale so o minimo se a v1 continuar em uso isolado.
- **Sistema de temas / modo leitura:** a v1 tem so `dark`/light por `.dark`. O **v2/v3
  introduzem `data-theme` ortogonal ao `.dark`** (sepia/foco/alto-contraste, tamanho de
  fonte/largura/entrelinha). Isso **muda a estrategia de light-mode**: a sugestao 1
  (migrar p/ CSS custom properties) **so faz sentido de verdade no eixo v2/v3** — na v1
  ela seria retrabalho descartavel.
- **Render/contraste por tema validados no v3:** os artefatos do projeto (`verify/`
  v3-*.png, demos sepia/foco/contraste) mostram que o eixo de temas multiplos **ja foi
  exercitado fora da v1**. A v1 nao precisa absorver isso.
- **O que o v2/v3 NAO resolvem automaticamente (e seguem valendo como debito da v1
  isolada):** as **inconsistencias documentais** (B1 contagem de topicos, B2 versao/data,
  B3 numeracao de erros) e as **contradicoes de politica** (B10 raster, B11 hand-drawn,
  B12 Purple) sao do **texto da skill**, nao da camada de UI — se o v2/v3 herdam o mesmo
  MASTER/DESIGN-SYSTEM como base, **herdam tambem essas contradicoes**. Esse e o unico
  bloco cuja correcao na fonte teria retorno alem da v1. (Nao implica editar a v1 agora —
  e uma observacao p/ a base compartilhada.)
- **A11y de componente (B7/B8/B9):** se o v2/v3 reusam os mesmos templates de
  accordion/modal/toggle da v1, **herdam os mesmos gaps de a11y**. Vale conferir se o
  v2/v3 ja corrigiram aria-expanded/role=dialog/aria-label — se sim, a v1 fica como
  "legado conhecido"; se nao, e o item com maior impacto no aluno e o melhor candidato a
  correcao na base comum.

**Conclusao do cetico:** a v1 e uma base **boa e funcional**, com **integridade
referencial impecavel** e runtime aprovado, mas com **inconsistencias documentais reais**
e **a11y de componente fraca**. Para a v1 **isolada**, vale uma correcao cirurgica de
coerencia + a11y minima. No contexto **v2/v3**, a maior parte das lacunas de UI/didatica
ja esta endereçada — o que sobra como divida da **base compartilhada** sao as
contradicoes de texto (topicos, versao, numeracao, politicas de imagem/estilo) e,
possivelmente, a a11y dos componentes herdados. **Nada disso foi alterado nesta auditoria.**
