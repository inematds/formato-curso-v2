# Proposta visual — formato-curso INEMA

Diretor de design chefe. Decisão sobre a próxima identidade da página de módulo, com base nos 4 mockups (`mockups/*.html`) e nas 3 bancas de jurados.

---

## 1. Diagnóstico: por que o visual atual falha

O visual atual (codificado em `formato-curso-v2/assets/learn.css`) é **dark premium âmbar**: base `#111827`, superfícies `#1f2937`/`#374151`, texto `#e6e6e6`, primário âmbar `#FACC15` como cor de marca, acento ciano `#38bdf8`, corpo em **Inter**. Em cima disso: chips de estatística, três medidores de progresso (barra, anel, "N de M") e uma camada de aprendizagem (grifo, dúvida, jornada) que vive escondida em popovers, drawers e modais. É engenharia sólida e acessível (a `GANHOS-ANALISE.md` confirma 45/45 testes), mas como **experiência de leitura e estudo** falha nos quatro eixos:

**Visual.** Dark-âmbar + Inter + cards arredondados com sombra suave é exatamente o template que qualquer IA gera por padrão. Não tem assinatura. O âmbar saturado não pode virar texto em claro (1.53:1, o próprio CSS admite com `--primary-ink`), então a "cor de marca" só aparece como preenchimento e borda decorativos. O resultado é genérico e frio para uma coisa que pede horas de leitura: a cor é de painel de admin, não de material de curso.

**Facilidade de uso.** A camada que mais importa para aprender (grifar, marcar dúvida, revisar) está atrás de seleção de texto, popover flutuante, drawer lateral e modal. O aluno tem de *descobrir* que ela existe e *abrir* algo para usá-la. Há **três** representações de progresso competindo (`.inema-bar`, `.inema-ring`, `.inema-meter-label`) sem hierarquia clara de qual olhar. Onboarding e retomada ("continuar de onde parei") existem no código mas estão soterrados dentro do drawer de jornada, fora do fluxo de leitura.

**Aderência ao conteúdo.** A estética não diz nada sobre "isto é um curso, um caderno de estudo". Dark premium é linguagem de produto SaaS, não de página de leitura longa. Inter a 16px em fundo escuro com `line-height` confortável ainda é tela de dashboard, não página de livro. A forma briga com a função: o conteúdo é texto para estudar, o cromo é de aplicativo para operar.

**Engajamento.** Sem assinatura visual, sem momento de chegada, sem gancho. Os medidores são barras genéricas — o mesmo feedback de um instalador de software. A "celebração contida" a 100% é trocar a cor da barra. Nada convida a voltar, nada marca onde você parou de um jeito que dê vontade de continuar. O engajamento foi *codado* (eventos, badges, toast) mas não *projetado*: nenhum elemento tem peso emocional.

---

## 2. As 4 direções (1 parágrafo cada)

**editorial-textbook** (`mockups/editorial-textbook.html`) — Spectral + Source Serif 4 + IBM Plex Mono, paper quente `#f4efe4` (nunca branco), tinta quase-preta quente `#26211b`, um acento azul-tinta e oxblood reservado só para "tenho dúvida". Layout de **livro-texto encadernado**: coluna de leitura (60-75ch) + rail de margem de 300px onde TODAS as anotações vivem, como num livro rabiscado à mão — sem popover, sem modal. Progresso é uma fita-lombada com sete ticks. **Resolve aderência e craft**: a estética é a própria didática. **Para** quem vai ler de verdade, sessões longas, conteúdo substancial.

**calmo-notebook** (`mockups/calmo-notebook.html`) — Fraunces + Hanken Grotesk, off-white `#f5f1e8`, tinta verde-grafite, acento sage/teal apagado, terracota pontual. Coluna única generosa, trilha SVG serpenteante na margem, "pedras" em "Minha jornada", "continuar de onde parei" acolhedor no topo, copy sem placar ("sem pressa"). **Resolve usabilidade e carga cognitiva**: o menor atrito de retomada e ansiedade. **Para** o aluno casual/recorrente, onboarding gentil. Risco: é o que mais beira o template "wellness/Notion".

**editorial-bold** (`mockups/editorial-bold.html`) — Archivo Black + Spectral, ameixa profundo `#2a0f24` + creme + um vermelhão `#ff5a36`. Números de seção colossais como wayfinding, número-fantasma sangrando no header, TOC de tinta cheia, grifo = sublinhado triplo-grosso, botões com hard-shadow. **Resolve impacto e distintividade**: cara de capa de revista, foge 100% do genérico. **Para** index/landing de trilha, não para a aula. Risco: Archivo Black em tudo grita e cansa numa leitura contínua.

**terminal-blueprint** (`mockups/terminal-blueprint.html`) — JetBrains Mono + IBM Plex Sans, escuro quente `#16140f`, acento âmbar dessaturado `#d9a441`, rail-pipeline de build (`curso.compile() 21%`), grifo como `// NOTE`, atalhos `[r]`/`[t]`. Conceito coeso de "log que compila". **Para** público dev. **Descartar como direção**: é exatamente o dark-âmbar que o brief pede para abandonar, mono em prosa cansa, e jargão de compilador aliena não-devs.

---

## 3. Scores consolidados (3 jurados)

Médias das três bancas. Total = soma das médias dos cinco eixos (máx. 50).

| Direção | Visual | Usabilidade | Aderência | Engajamento | Distintividade | **Total (méd.)** |
|---|---|---|---|---|---|---|
| **editorial-textbook** | 9.0 | 8.0 | 10.0 | 7.3 | 9.0 | **43.7** |
| **calmo-notebook** | 8.3 | 9.0 | 8.3 | 8.0 | 6.3 | **40.0** |
| **editorial-bold** | 8.7 | 6.7 | 6.3 | 9.0 | 9.3 | **40.0** |
| **terminal-blueprint** | 7.3 | 6.0 | 5.0 | 7.0 | 4.0 | **29.3** |

Totais brutos por jurado (para referência): J1 textbook 44 / bold 40 / calmo 39 / terminal 29; J2 calmo 43 / textbook 43 / bold 40 / terminal 31; J3 textbook 44 / bold 40 / calmo 38 / terminal 28.

**Leitura.** editorial-textbook vence em 2 de 3 bancas e lidera a média consolidada, puxado por **aderência (10)**, **distintividade (9)** e **visual (9)**. Seu único ponto fraco real é **engajamento (7.3)** — sóbrio, sem recompensa imediata. calmo-notebook é o oposto exato: melhor **usabilidade (9)**, pior **distintividade (6.3)**. editorial-bold tem a maior **distintividade/engajamento** mas a pior **aderência** para leitura longa. Os três jurados convergem em descartar terminal-blueprint e em recomendar um **híbrido com base no textbook**.

---

## 4. Recomendação: editorial-textbook como base, com enxertos cirúrgicos

**Adotar editorial-textbook como base**, enxertando a camada de acolhimento do calmo-notebook e um único toque de presença do editorial-bold. Não é "fazer os quatro": é uma direção (caderno editorial impresso) com três correções pontuais. Os três jurados chegaram independentemente a essa mesma síntese.

Ligando aos quatro eixos:

- **Aderência (a razão principal).** O textbook tem a maior aderência possível (10) porque a metáfora *é* a didática: rail de margem faz anotação, dúvida e progresso viverem **onde se lê**, sem modal. Paper quente + serif de leitura (Source Serif 4 a ~18px) é a ergonomia certa para sessões longas — o oposto do dark-âmbar de dashboard.
- **Visual / distintividade.** Paper `#f4efe4` (nunca branco), tinta quente, **um** acento azul-tinta + oxblood reservado, Spectral/Source Serif/IBM Plex Mono. Assinatura forte e longe do genérico (9 e 9). Importar do bold **apenas** o numeral-fantasma gigante de módulo e o realce do item ATUAL do TOC (1 toque de cor) dá a presença no header que o textbook não tem — sem trazer Archivo Black para lugar nenhum.
- **Usabilidade.** Curar a fraqueza de onboarding importando do calmo o card **"continuar de onde parei"** no topo do fluxo de leitura e a copy acolhedora/sem-placar. E adotar o **plano de colapso mobile** do calmo (a nota de margem vira bloco inline estático abaixo de 1080px) — isso resolve o **maior risco** do textbook, que é o rail sumir no mobile.
- **Engajamento.** Curar a sobriedade do textbook com o calor da retomada do calmo e com a ideia (e só a ideia) do terminal de que "cada seção lida avança um marcador" — aplicada aos sete ticks da lombada, em **ink-quiet, sem animação pulsante**. O vermelhão do bold entra no máximo como acento pontual de "ação agora", nunca como sistema.

**Questão de marca: partir do INEMA atual ou evoluir mantendo identidade?**

Recomendação: **partir do dark-âmbar como sistema da página de leitura, mas evoluir mantendo a identidade da marca onde ela vive.** O dark premium âmbar é a linguagem do **portal/landing** (inema.club) e dos vídeos — ali ele funciona como marca e deve permanecer. A página de **módulo/aula** é um contexto diferente (leitura longa, estudo ativo) e merece um sistema próprio, editorial e claro. Não é abandonar o INEMA: é reconhecer que **landing e sala de aula são superfícies distintas**. O fio de continuidade com a marca:

- O **âmbar `#FACC15` segue presente** como cor de marca no chrome de navegação (logo, "INEMA.CLUB"), não como base da página de leitura.
- A **arquitetura de cor em 3 níveis** do `learn.css` (primitivos → tema → semânticos) já suporta isso: o tema escuro vira **mais um tema** (Layer 1), e o caderno editorial entra como o **default da página de aula**. Nenhuma reescrita de mecanismo, só novos valores de token.
- O par tipográfico (Spectral/Source Serif/IBM Plex Mono) e o paper quente passam a ser a **assinatura do material de curso** — distinta o bastante para ser memorável, alinhada o bastante para não brigar com o portal.

---

## 5. Plano de execução por fases

Concreto, sobre o que já existe. A arquitetura do `learn.css` (3 níveis, dois layers, componentes por `data-inema-*`) **não muda de mecanismo** — muda de valores e ganha um layout de página.

**Fase 0 — Decisão de tokens (sem código novo).** Travar a paleta editorial como o **tema default da página de aula**, mantendo o dark-âmbar como tema alternativo. Definir os semânticos: `--bg`=`#f4efe4` (paper), `--surface`=`#ece5d6`, `--text`=`#26211b`, `--text-muted`=`#5b5347`, `--accent`=azul-tinta, `--accent-2`/estado-dúvida=oxblood. Definir o âmbar como cor de chrome de marca, não de página.

**Fase 1 — Tokens e cor (`learn.css` §1-§2).** Trocar os primitivos e o bloco de tema base: paper warm no lugar do branco; tinta quente no lugar de `#1a1a1a`/`#e6e6e6`; azul-tinta como `--accent`; oxblood como cor reservada de dúvida (substitui o laranja `--c-doubt-*`). Manter sepia/contraste/foco como Layer 2 (já existem, só reafinar valores para casar com o paper). **Regra dura:** um único acento + oxblood secundário; vermelhão do bold só como `--accent-action` pontual.

**Fase 2 — Tipografia (`learn.css` §4).** Substituir Inter por **Source Serif 4** no corpo (`--font-body`), **Spectral** em display/títulos/drop-cap/notas de margem (`--serif-disp`), **IBM Plex Mono** só em metadados e marcas de impressor. Manter `--measure`/`--lh-body`/`data-line-width` (60/68/75ch) como estão. Trocar `Atkinson Hyperlegible` como fonte de acessibilidade do `data-font="leitura"` (mantém a opção a11y).

**Fase 3 — Layout do módulo (novo, o coração).** Trocar a coluna-única-com-TOC-sticky por **folha assimétrica de duas colunas**: leitura 60-75ch + **rail de margem ~300px** com regra vertical fina. Migrar a camada de aprendizagem para fora de popover/modal: grifo com nota-âncora **na margem**, dúvida **na margem**, glosa do tutor **na margem** ligada à palavra grifada por conector fino. Header com **numeral-fantasma** de módulo (enxerto do bold). Progresso = **fita-lombada com 7 ticks** (substitui as 3 barras/anel atuais; manter um único medidor textual "N de M" como rótulo acessível).

**Fase 4 — Controles de aprendizado.** Manter os mecanismos (`data-inema-read-toggle`, `data-inema-doubt-toggle`, grifo via `<mark>`, jornada) — só **re-skin**: "marcar lido" desenha um check na caixa da margem; dúvida acende a nota em oxblood; sete ticks da lombada avançam ao ler (ink-quiet, sem pulse). Atalhos `[r]`/`[t]` do terminal como única importação dele. "Minha jornada" fecha a página como um livro-razão (seção/trilha/curso), não como drawer flutuante.

**Fase 5 — Onboarding e retomada (enxerto do calmo).** Card **"continuar de onde parei"** no topo do fluxo de leitura (hoje preso no drawer). Copy acolhedora, sem placar. Feedback discreto "guardado no seu caderno" ao acionar um controle.

**Fase 6 — Colapso mobile (cura o maior risco) + QA.** Abaixo de 1080px o rail desmonta: nota/dúvida/glosa viram **blocos inline estáticos** ancorados ao parágrafo (plano do calmo). Reusar o `contract.cjs` (`getComputedStyle`) para travar que o re-skin não quebrou contraste por tema nem o ancoramento nota↔grifo — a `GANHOS-ANALISE.md` já avisa que drift JS↔CSS "não é teórico, já aconteceu".

---

## 6. Riscos e o que NÃO fazer

- **NÃO trazer o Archivo Black do bold para corpo, títulos ou botões.** Só o numeral-fantasma de módulo e o realce do item atual do TOC. Archivo Black em prosa cansa e grita (jurados unânimes).
- **NÃO adotar terminal-blueprint, nem "só um pouco".** É o dark-âmbar que se quer abandonar; mono em prosa baixa legibilidade; jargão de compilador aliena não-devs. Aproveitar **só** atalhos `[r]`/`[t]` e a ideia de "marcador que avança ao ler" — em ink-quiet, sem scanline/pulse/blink.
- **Risco #1 — rail no mobile.** O rail é a alma do design e colapsa abaixo de 1080px. Mitigação na Fase 6 é **obrigatória**, não opcional. Sem plano de colapso real, o design quebra para metade dos alunos.
- **Risco #2 — densidade de tinta.** Serif a ~18px/1.7 em paper é bonito mas pode intimidar o leitor casual e ficar "vazio" com texto curto. Mitigar com o card de retomada do calmo, copy gentil, e exigência de conteúdo real por seção (1 ideia/seção, como já prevê a `GANHOS-ANALISE.md`).
- **NÃO** deixar o vermelhão do bold virar sistema. Um acento azul-tinta + oxblood reservado é a paleta. Vermelhão só "ação agora", pontual.
- **NÃO** criar uma quarta representação de progresso. Aposentar barra+anel+chip; a lombada de 7 ticks + um rótulo "N de M" acessível é o suficiente.
- **NÃO** reescrever a engenharia. A arquitetura de 3 níveis, os dois layers e os componentes `data-inema-*` ficam — isto é re-skin + um layout novo, não um produto novo. Manter `contract.cjs` no pipeline.
- **Marca:** não jogar fora o dark-âmbar. Ele continua sendo a marca do portal/landing/vídeos; vira tema alternativo na aula. O caderno editorial é a assinatura da **sala de aula**, não a substituição da marca.

---

## Resumo executivo

Adotar **editorial-textbook** como base da página de aula: caderno editorial impresso em paper quente (`#f4efe4`, nunca branco), tinta quente, Spectral + Source Serif 4 + IBM Plex Mono, um acento azul-tinta com oxblood reservado para "tenho dúvida", e layout de duas colunas com **rail de margem** onde anotação, dúvida e progresso vivem ONDE se lê — sem popover, sem modal. Vence por aderência (10), distintividade (9) e visual (9) consolidados; é a única direção cuja estética é a própria didática. Curar sua única fraqueza (engajamento sóbrio) com dois enxertos cirúrgicos: do **calmo-notebook**, o card "continuar de onde parei" e o plano de colapso mobile (que resolve o maior risco do textbook, o rail sumir abaixo de 1080px); do **editorial-bold**, só o numeral-fantasma de módulo e o realce do item atual no header. **Descartar terminal-blueprint** por inteiro — é o dark-âmbar que o brief pede para abandonar. O dark premium âmbar não morre: permanece como marca do portal e vira tema alternativo na aula, reaproveitando a arquitetura de cor em 3 níveis já existente no `learn.css`. Execução em 6 fases de re-skin + layout, sem reescrever a engenharia, com `contract.cjs` travando contraste e ancoramento. Arquivo escrito em `/home/nmaldaner/projetos/formato-curso-inema/PROPOSTA-VISUAL.md`.
