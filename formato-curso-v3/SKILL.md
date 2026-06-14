---
name: formato-curso-v3
description: curso INEMA v3 — pagina de LEITURA editorial, papel quente + serif + 1 acento azul-ardosia, profundidade na MARGEM via sidenotes, camada de aprendizagem minima, self-contained; rompe com o dark-ambar do v1/v2. Use SEMPRE que o usuario pedir para criar, editar ou revisar paginas HTML de curso no estilo v3 / editorial / reading-mode — landing, index de trilha, ou pagina de aula/modulo — e tambem ao mencionar sidenotes na margem, "indo mais fundo", marcar lido/duvida/nota na margem, "minha jornada", temas papel/sepia/escuro, ou quando disser "formato de curso v3", "reading-mode", "leitura editorial". Acione tambem quando o usuario quiser romper com o dark premium ambar/ciano do v1/v2 e ir para a pagina de leitura calma.
---

# Formato Curso v3 — INEMA (pagina de leitura editorial)

A **v3 rompe com o v1/v2** (dark premium ambar/ciano, Inter, dashboard de curso com 3 barras de progresso). A pagina de aula agora **abre parecendo um reader-mode** (Safari Reader / Gwern / Tufte): **papel quente** (nunca `#fff`/`#000`), **serif no corpo** (Source Serif 4) + display serif (Spectral), **um unico acento de tinta** azul-ardosia (`#2C5282`) reservado a estados, e a **profundidade desce para a MARGEM** (sidenotes a la Tufte, CSS puro) ou para `<details>` "Indo mais fundo". A camada de aprendizagem e **minima e calma** (marcar lido, duvida e nota ancoradas na margem, marcador de percurso silencioso "N de M", zero gamificacao). Tese: **simplicidade radical no layout + profundidade no conteudo**.

Tudo continua **self-contained**: 1 `.html` por pagina, Google Fonts via CDN, `learn.css`/`learn.js` (inline ou por caminho relativo), sem build, sem backend, abre em `file://`. A camada de aprendizagem e **progressive enhancement**: a aula le perfeita com JS desligado.

## Referencia obrigatoria

**SEMPRE leia `/home/nmaldaner/projetos/formato-curso-inema/V3-DESIGN.md` antes de criar ou editar qualquer pagina v3.** Ele e a fonte-de-verdade do design language: tese e os 5 principios, tokens em OKLCH (papel/tinta/acento), tipografia (numeros duros de Butterick), o modelo de leitura+profundidade (sidenotes / `<details>` / def inline), a camada de aprendizagem minima, a tabela "v2 -> v3" e o checklist de aceitacao. Esta skill resume o **contrato de markup**; o V3-DESIGN.md tem o **porque** e a calibracao.

## Assets da camada (assets/) e como plugar

A camada v3 vive em **dois assets** + **dois snippets** copia-e-cola (em `assets/`):

| Arquivo / snippet | O que e | Onde vai |
|---|---|---|
| **`assets/learn.css`** | Tokens OKLCH + 3 temas (`data-theme`: papel/sepia/escuro), prefs de leitura (`data-font`/`data-line-width`/`data-leading`/`data-fontscale`), layout `.reading` + `.margin-rail`, `.sidenote`/`.sidenote-ref`, `.go-deeper`, `.progress-line`, `mark.hl`, painel do aluno, acento FIXO `#2C5282`. | No `<head>`, via `<link rel="stylesheet" href="REL/assets/learn.css">`, **depois** do anti-FOUC e das fontes. |
| **`assets/learn.js`** | IIFE `window.INEMA`. Feature-detect por presenca de `data-inema-*`: monta o painel do aluno de cada secao (`<aside data-inema-rail>`), re-aplica grifos, hidrata medidores "N de M" + `.progress-line`, monta jornada e seletor de aparencia. Idempotente. | `<script src="REL/assets/learn.js">` imediatamente antes de `</body>`. |
| **Snippet anti-FOUC** (`assets/inema-head-snippet.html`) | Script **bloqueante** minusculo, com try/catch: le `inema.prefs` (global, cross-curso) e seta `data-theme` + `color-scheme` + `--measure`/`--leading`/`--fontscale` + `data-font`/`--font-disp`/`--font-body` ANTES do primeiro paint. Default `papel` no erro. | **PRIMEIRO no `<head>`**, ACIMA de fontes e do `learn.css`. |
| **Snippet init** (`assets/inema-init-snippet.html`) | `learn.js` + `INEMA.init()` (probe de storage, le `<meta name="inema-course">`, monta tudo). | No FIM da pagina, antes de `</body>`. |

**Regra de ouro de ordem:**
1. **Anti-FOUC PRIMEIRO** no `<head>` (mata o flash de tema a cada navegacao; default `papel`).
2. **Fontes** (Spectral + Source Serif 4 + IBM Plex Mono via Google Fonts CDN).
3. **`learn.css`** no `<head>`, depois das fontes.
4. **`learn.js`** antes de `</body>`.
5. **`INEMA.init()`** por ultimo (no snippet init).

Troque `REL` pelo caminho relativo da pasta `assets` (`.`, `..`, `../..`). Para `file://` 100% offline, pode colar `learn.css`/`learn.js` inline (mantendo o padrao copia-e-cola); o anti-FOUC e o init sao sempre inline. **Diferenca-chave vs v2:** v3 e **CSS proprio, NAO Tailwind**, e **NAO usa `.dark`** — o eixo de tema mora inteiro em `data-theme`. O acento e **fixo no CSS** (`#2C5282`); nao ha preferencia de acento.

## CONTRATO DE MARKUP v3 (CSS e JS DEVEM casar exatamente)

O `learn.css` e o `learn.js` so reconhecem estes atributos/classes. Mudar nomes quebra o estado e o layout. Tudo abaixo bate com o que esta nos assets reais.

### Identidade e manifesto (em TODA pagina)
- `<meta name="inema-course" content="demo3">` no `<head>` — courseId estavel.
- `<script type="application/json" data-inema-manifest>{course, tracks[].modules[]{id,title,topics,href}}</script>` — estrutura COMPLETA do curso, no `<head>` de **toda** pagina. O progresso cross-pagina ("N de M" do curso/trilha, "minha jornada") agrega o read-map sobre o `total` do manifesto; `topics` deve bater com os `data-inema-topic` reais de cada modulo.

### Layout: coluna de leitura + trilho de margem
- Coluna de leitura central **`.reading`** (62-70ch) + trilho de margem a direita **`.margin-rail`**. A largura restrita da coluna **cria** a margem; a margem **vira** a camada de profundidade.
- No **mobile**, a margem **colapsa para baixo do paragrafo** (responsividade no CSS, sem JS).

### Secao = uma ideia (ancoras estaveis)
Cada secao:
```html
<section id="topico-N"
         data-inema-topic="modulo-1-1#topico-N"
         data-inema-module="1-1"
         data-inema-track="1"> … </section>
```
`data-inema-topic` e o id estavel de progresso/notas — mudar o layout visual NAO pode quebrar o estado.

### Sidenotes de AUTOR (estaticas, CSS-only, na margem)
Profundidade editorial escrita por quem fez a aula, sem JS:
```html
<p>…trecho<a class="sidenote-ref">1</a>…</p>
<aside class="sidenote" data-kind="definicao">…</aside>
```
- `data-kind="definicao|fonte|fundo"` (tres generos visuais).
- Ancoradas via numero/marcador inline `<a class="sidenote-ref">`.
- No desktop ficam na margem (mesma altura); no mobile colapsam inline abaixo do paragrafo (CSS).

### Painel do ALUNO por secao (dinamico, montado pelo learn.js)
Cada secao tem, no trilho, um ponto de montagem:
```html
<aside data-inema-rail="modulo-1-1#topico-N"></aside>
```
O `learn.js` renderiza ali:
- botao **"marcar como lida"** — `data-inema-read-toggle` (com `aria-pressed`);
- botao **"tenho uma duvida"** — `data-inema-doubt-toggle`;
- a **lista de grifos/notas do aluno** daquela secao.

### Bloco anotavel + grifo do aluno
- Bloco que aceita grifo/nota: `data-inema-block="…"`.
- Grifo cria `<mark class="hl" data-hl="…">`; a selecao dispara um **popover minimo** (`data-inema-selpop`) OU acao na margem. O `quote` e sempre gravado (re-ancora ao reabrir).

### Progresso — silencioso (mata as 3 barras)
- **NAO** ha 3 barras lado a lado, nem anel, nem percentual gritante.
- Um marcador discreto **"N de M"** + uma barra fina:
```html
<span data-inema-meter="curso"></span>
<div class="progress-line" data-inema-meter="trilha:1"></div>
<div class="progress-line" data-inema-meter="modulo:1-1"></div>
```
Escopos aceitos: `curso`, `trilha:N`, `modulo:X-Y`. **Um** marcador discreto por tela.

### "Minha jornada" (painel consolidado)
- Gatilho `data-inema-journey-open`; abre painel acessivel (role=dialog) consolidando lidos / duvidas / notas. So leitura do estado.

### Divulgacao progressiva
- `<details class="go-deeper"><summary>Indo mais fundo (opcional)</summary>…</details>` para edge cases, prova, derivacao, referencia densa. Nativo, sem JS. Maximo 1-2 niveis.

### Temas e preferencias (no `<html>`)
- Tema via `data-theme`: **papel** (default), **sepia**, **escuro** (escuro NAO e a base; nunca volta ao dark ambar/ciano).
- Prefs: `data-font` (**serif** | **sans** | **hyperlegible** [Atkinson Hyperlegible]), `data-line-width`, `data-leading`, `data-fontscale`.
- **Acento fixo `#2C5282`** (azul-ardosia) — acento UNICO e funcional (figura/codigo, estado "duvida", link foco), **nunca decorativo**.

## REGRAS CRITICAS v3

| # | Regra | Correto | Errado |
|---|-------|---------|--------|
| 1 | **Leitura-primeiro** | Pagina abre como reader-mode: coluna unica, papel quente, serif, controles minimos | "Dashboard de curso"; pagina abre como painel de controles |
| 2 | **Papel nunca `#fff`/`#000`** | Papel quente tingido (OKLCH) em papel/sepia/escuro; tinta quase-preta quente | `#fff` de fundo ou `#000` de texto; off-white frio puro |
| 3 | **Serif no corpo** | Corpo em Source Serif 4; titulo em Spectral; mono so em codigo/rotulo | Inter (ou qualquer sans) no corpo |
| 4 | **1 acento** | Um unico acento `#2C5282`, reservado a estado/figura | Banho de cor, 6 neons de trilha, ambar+ciano, cor decorativa |
| 5 | **Sidenotes na margem** | Detalhe/glosa/fonte na `.margin-rail` (desktop) / inline expansivel (mobile) | Footnote, popover, drawer ou modal para a nota |
| 6 | **UMA ideia / UMA figura por secao** | Cada secao isola 1 conceito + no maximo 1 figura; sequencia visual->intuicao->formal | Varias ideias e figuras empilhadas; muro de texto |
| 7 | **Progressive disclosure** | Caminho-feliz no corpo; o resto em camada sob demanda (sidenote / `<details>` / def inline) | Tudo na dobra; essencial escondido atras de clique |
| 8 | **NUNCA dashboard / 3-barras / cards-na-licao / gamificacao** | "N de M" + barra fina unica; cards so em catalogo/indice; recall por "pare e preveja" + knowledge check | 3 barras lado a lado, aneis, chips de stat; cards coloridos dentro da licao; streak/XP/badge/leaderboard/confete |
| 9 | **Manifesto em TODA pagina** | `<script data-inema-manifest>` + `<meta name="inema-course">` no `<head>` de cada pagina | Manifesto so em algumas paginas; `topics` divergindo do DOM |

## EVITAR (anexo do V3-DESIGN.md — anti-padrao "curso online")

Dashboard de XP / streak / ranking · mascote / confete / badges · cards coloridos **dentro da licao** (cards = so catalogo/indice) · sidebar fixa roubando largura na leitura · hero 3D isometrico de estudante · mockup de produto flutuante · contador de alunos · selos de garantia · carrossel de depoimentos com estrelinhas · gradiente roxo/ambar · CTA com countdown · "voce vai aprender" com 12 checks · FAQ que e objecao de venda · **paleta dark premium ambar+ciano (= o v2, ja virou slop)** · display ultra-bold em todo heading · headline de promessa ("domine X em 30 dias" PROIBIDO) — prefira diagnostico preciso da dor.

## Fluxo de trabalho

1. **Ler `/home/nmaldaner/projetos/formato-curso-inema/V3-DESIGN.md`** (sempre, antes de tudo).
2. **Entender o que sera criado:** landing/index, index de trilha (cards = catalogo, OK), ou pagina de aula (reading-mode, sem cards na licao). Identificar trilha (define so o **hue** do acento, croma baixo — nao banha a pagina) e quantas secoes.
3. **Montar o esqueleto** com os snippets em ordem: anti-FOUC -> fontes -> `learn.css` -> conteudo -> `learn.js` -> `INEMA.init()`. Incluir `<meta name="inema-course">` + `data-inema-manifest` no `<head>`.
4. **Escrever o conteudo** seguindo o contrato: coluna `.reading` (62-70ch) + `.margin-rail`; cada `<section>` com os `data-inema-topic/-module/-track`; uma ideia + no maximo uma figura por secao (sequencia fenomeno -> intuicao -> formal, o formal descendo para sidenote/`<details>`); cada secao com `<aside data-inema-rail>`; sidenotes de autor onde couber; `<details class="go-deeper">` para o aprofundamento.
5. **Progresso e jornada:** marcador "N de M" + `.progress-line` (sem 3 barras); gatilho `data-inema-journey-open`.
6. **Verificar contra o checklist de aceitacao do V3-DESIGN.md** (sec. 6) e as REGRAS CRITICAS acima — em especial: papel nunca `#fff`/`#000`, serif no corpo, 1 acento, sidenotes na margem, profundidade sempre em camada, zero gamificacao, le perfeita com JS desligado, 1 `.html` que abre em `file://`.

## Estrutura de arquivos

```
[curso]/
├── index.html                 # Landing (hero tipografico, curriculo como indice; cards = catalogo OK)
├── assets/
│   ├── learn.css              # camada v3 (inline-ou-referenciado)
│   └── learn.js
└── curso/
    └── trilha1/
        ├── index.html         # index da trilha (cards de modulos + "N de M" silencioso)
        ├── modulo-1-1.html    # pagina de aula: reading-mode, sidenotes, painel do aluno na margem
        └── …
```

Toda pagina precisa, no `<head>`: anti-FOUC PRIMEIRO, depois fontes, depois `learn.css`; `<meta name="inema-course">` + `data-inema-manifest`. No fim: `learn.js` + `INEMA.init()`.
