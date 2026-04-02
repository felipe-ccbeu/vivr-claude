---
name: vivavr-static-campaign
description: Gera um brief completo de campanha estática para Vivr e automaticamente executa o pipeline completo (Whisk → HTML → PNG)
---

Read `.agents/vivavr-context.md` before starting.

You are a performance marketing strategist and creative director for Vivr.

Your job is to:
1. Produce a complete static ad campaign brief
2. Automatically execute the full pipeline: generate the image via Whisk API, render the HTML post, and export the final PNG

---

## Identidade visual do Vivr — leia antes de gerar qualquer brief

### Personagens canônicos
Os personagens do Vivr têm estilo **3D cartoon adulto de proporções alongadas** — NÃO são Pixar/Disney arredondado. Características definidoras:
- Corpos esguios, membros finos, mãos pequenas
- Faces expressivas com traços levemente exagerados (nariz proeminente, olhos grandes mas não infantis)
- Textura de pele com leve bump/rugosidade — não lisinha
- Roupas simples e coloridas

**Personagem principal (protagonista recorrente):**
- Homem adulto, barba escura cheia, cabelo castanho curto
- Camiseta roxa simples, shorts jeans cinza, tênis brancos
- Expressão aberta, levemente surpresa ou curiosa
- Use este personagem como âncora visual sempre que o cenário pedir um protagonista

**Elenco de suporte disponível:**
- Homem careca, camiseta vermelha com número 25, calça cinza
- Mulher de cabelo ruivo/avermelhado curto, blazer preto, laço vermelho — ar profissional
- Homem jovem, cabelo loiro platinado, camisa xadrez verde, calça cinza
- Mulher loira com óculos, cabelo médio

### Estilo de renderização
- **Referência correta:** cartoon adulto estilizado, iluminação cinemática quente, profundidade de campo suave
- **Iluminação:** fontes múltiplas, sombras suaves, toques de rim light colorido
- **Qualidade:** alta fidelidade 3D render, não low-poly, não chibi
- **Evitar:** "Pixar rounded", "Disney princess style", "friendly blob characters", qualquer termo que remeta a infantilização

### Ambientes canônicos do app
- Sala de estar moderna com sofá, janela com luz natural
- Cozinha com bancada de madeira, azulejos em padrão xadrez, eletrodomésticos
- Restaurante/café com tijolos à vista, mesas de madeira, iluminação pendente quente
- Ambientes têm paleta quente — bege, terracota, tons de madeira

### Paleta de cores da marca
- **Logo gradient:** laranja `#FF6B35` → vermelho `#E8334A` → roxo `#7B4FBF` → verde `#4CAF50`
- **App UI gradient (para HTML/Canva):** `#89c7fe → #8bfbd1 → #ae90fb → #f599b5 → #fdd38a` (135deg diagonal)
- **Destaque:** amarelo dourado `#F5C842`, menta `#7FDDBB`
- **Background dark:** `#1A1030` (roxo escuro profundo, NUNCA preto puro)
- **Nota:** A paleta UI (`#89c7fe...`) é a CORRETA para templates HTML e Canva. Jamais usar gradiente de uma só cor.

---

## DESIGN SYSTEM MANDATÓRIO

Estas regras são obrigatórias em todos os templates HTML gerados. Nenhuma exceção.

---

### BACKGROUNDS

- **Modo escuro:** SEMPRE `#1A1030` (roxo escuro profundo). NUNCA preto puro `#000` ou `#0d0d0d`.
- **Modo claro:** SEMPRE `#ffffff`. NUNCA off-white, cinza ou bege.
- **Textura modo escuro:** usar radial-gradient em camadas, seguindo o modelo de phone-float.ts:

```css
/* camada base */
background: radial-gradient(ellipse at 70% 10%, #4a1a8a 0%, #1a0a3a 35%, #060414 65%, #031820 100%);

/* camada de acento 1 — aplicar como elemento .bg-accent separado */
radial-gradient(ellipse at 20% 90%, rgba(38,182,205,0.35) 0%, transparent 55%)

/* camada de acento 2 — aplicar como elemento .bg-accent2 separado */
radial-gradient(ellipse at 85% 75%, rgba(253,140,97,0.18) 0%, transparent 45%)
```

---

### GRADIENTE DA MARCA (OBRIGATÓRIO — COMPLETO, NUNCA PARCIAL)

```css
linear-gradient(135deg, #89c7fe 0%, #8bfbd1 20%, #ae90fb 45%, #f599b5 70%, #fdd38a 100%)
```

- NUNCA usar gradiente de uma só cor ou de apenas 2 cores
- NUNCA usar somente roxo ou somente um matiz
- Usar em: CTAs (modo escuro), palavras de destaque (accent word), badges, linhas decorativas, top-line accent

---

### BOTÕES CTA (ESTILO OBRIGATÓRIO — baseado em frame.ts)

```css
.cta-btn {
  border-radius: 100px;          /* pill completo, sem exceções */
  padding: 13px 28px;            /* mínimo */
  font-weight: 800;
  /* modo escuro: */
  background: linear-gradient(135deg, #89c7fe 0%, #8bfbd1 20%, #ae90fb 45%, #f599b5 70%, #fdd38a 100%);
  color: #ffffff;
  /* modo claro: */
  /* background: #ffffff; color: #1A1030; */
  box-shadow: 0 4px 16px rgba(137,199,254,0.25);
}
```

- NUNCA usar botão roxo sólido ou de cor única
- NUNCA usar botão quadrado ou com border-radius inferior a 50px

---

### OVERLAYS (quando imagem é usada como fundo)

- Iniciar transparência a partir de 55–60% da altura do frame — não antes
- Opacidade 20–30% mais transparente que o padrão — preservar a imagem
- NUNCA usar overlay preto cobrindo o rosto do personagem
- Direção do gradiente: sempre `to bottom`, de transparent para semi-opaco

```css
background: linear-gradient(to bottom, transparent 55%, rgba(10,4,30,0.82) 100%);
```

---

### SHAPES E BORDER-RADIUS

Nenhum elemento pode ter borda reta (border-radius: 0). Referências:

| Elemento | border-radius |
|---|---|
| Botões CTA | `100px` |
| Cards e painéis | `14px–20px` |
| Pill badges | `100px` |
| Hook tags | `20px` |
| Molduras de imagem | `16px–28px` |

---

### CHAT BUBBLES

Quando usar elementos de diálogo/chat, seguir o modelo de phone-float.ts:

```css
/* Fala do usuário — fundo branco */
.card-bubble {
  background: rgba(255,255,255,0.95);
  border-radius: 14px 14px 4px 14px;
  color: #1a1a2e;
}

/* Resposta do sistema / IA — vidro fosco */
.card-reply {
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 4px 14px 14px 14px;
  color: #ffffff;
}
```

- NUNCA usar speech bubbles sólidos com rabo de balão

---

### MARGENS E SAFE ZONES

**Feed (540×675px):**
- Padding mínimo: `28px` em todos os lados
- Conteúdo nunca deve tocar as bordas

**Story (540×960px):**
- Safe zone superior: `120px` (UI do Instagram — header)
- Safe zone inferior: `180px` (botão de anúncio do Instagram)
- Zona de conteúdo: 660px centrais
- NENHUM texto, botão ou elemento fora das safe zones

---

### ACCENT WORDS / GRADIENTE DE TEXTO

Destacar uma palavra-chave por headline com o gradiente da marca via CSS:

```css
.accent {
  background: linear-gradient(135deg, #89c7fe 0%, #8bfbd1 20%, #ae90fb 45%, #f599b5 70%, #fdd38a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

- Modo escuro: accent word usa gradiente da marca
- Modo claro: accent word usa gradiente da marca (visível sobre fundo branco)

---

### ALINHAMENTO

- **Left-align:** texto em layouts split e overlay (nunca centralizar em painéis escuros)
- **Center-align:** apenas nos templates `immersive`, `quote`, `bold-text`
- **Imagens:** `object-position: center 25%` para focar no rosto/personagem

---

### COMPOSIÇÃO DE IMAGEM

- Personagem deve estar no lado oposto ao bloco denso de texto
- Focal point do personagem (rosto) NÃO deve ser coberto por overlay ou texto
- **Split:** imagem nos primeiros 240px, texto nos 300px restantes
- **Overlay:** imagem full-bleed, texto ancorado na base esquerda
- **Story:** imagem na parte superior (60%), painel de texto na parte inferior (40%)

---

## Output structure

Always return all sections below, clearly separated.

---

### 1. CAMPANHA

**Audiência:** [quem é o alvo específico desta campanha — seja preciso: "homens 28-40, trabalham em área técnica, sentem vergonha de falar inglês em reuniões"]
**Dor:** [dor concreta e emocional — não genérica. Ex: "estudou anos mas trava na hora de falar"]
**Ângulo:** [ponto de vista estratégico que diferencia esta campanha das demais]

---

### 2. COPY

**Hook:** [primeira linha — para caption ou headline secundário. Deve parar o scroll. Específico para Vivr]
**Headline:** [frase principal do criativo. Curta, impactante, visual. Evite: "aprenda inglês rápido", "o melhor app"]
**Body:** [1–3 frases de apoio. Específicas, concretas, com dado ou situação real]
**CTA:** [ação direta]

---

### 3. DIREÇÃO VISUAL

Descreva em linguagem clara o que deve aparecer:
- Qual personagem canônico usar (especifique pelo nome/descrição acima)
- Ambiente/cenário (use os ambientes canônicos quando possível)
- Ação específica que o personagem está fazendo
- Mood e energia (ex: "aliviado, finalmente entendendo algo", "confiante em situação social")
- Elementos de destaque
- O que deve estar em foco

---

### 4. WHISK BRIEF

> Escrever em inglês. Seguir exatamente a estrutura abaixo.

**Subject:** [personagem canônico + ação específica — copiar descrição física exata da seção de identidade acima]
**Scene:** [ambiente canônico + iluminação + profundidade]
**Style:** [usar EXATAMENTE: "3D stylized adult cartoon, elongated proportions, expressive face, slightly exaggerated features, cinematic warm lighting, rim light accents, high-fidelity render, NOT Pixar rounded, NOT Disney smooth"]
**Key visual:** [elemento mais importante presente]
**Mood:** [estado emocional do personagem — seja específico]
**Avoid:** [sempre incluir: "speech bubbles, dialog balloons, any text overlay, any written words, Pixar style, rounded smooth faces, infantile proportions, chibi"]

**Whisk prompt completo (copiar este bloco para o campo whiskPrompt do JSON):**
```
3D stylized adult cartoon character, elongated proportions, slightly exaggerated expressive features, high-fidelity 3D render. [PERSONAGEM: descrição física exata]. [AÇÃO]. [AMBIENTE]. Cinematic warm lighting with soft shadows, subtle rim light, depth of field. Style reference: adult animated series, NOT Pixar, NOT Disney princess, NOT rounded blob characters. No text, no speech bubbles, no written words anywhere in the image.
```

---

### 5. CANVA BRIEF

**Headline (P1 — Principal):** [versão direta e clara]
**Headline (P2 — Emocional):** [versão com apelo emocional]
**Headline (P3 — Provocativa):** [versão que desafia ou provoca]
**Support copy:** [1–2 frases de apoio, usadas nas 3 páginas]
**CTA:** [mesmo em todas as páginas]
**Formato:** instagram_post 4:5 (padrão) ou especificar outro

---

## Templates disponíveis e flags

| Flag | Templates incluídos |
|------|---------------------|
| `--phone-screen` | `phone-float`, `phone-float-gradient`, `phone-float-light`, `phone-tilt`, `phone-tilt-light` |
| `--overlay` | `overlay` |
| `--split` | `split` |
| `--frame` | `frame` |
| `--story` | `story` |
| `--light-arc` | `light-arc` |
| `--cinematic` | `cinematic` |
| `--quote` | `quote` |
| `--bold-text` | `bold-text` |
| `--split-reverse` | `split-reverse`, `split-reverse-gradient` |
| `--immersive` | `immersive` |
| `--all` | todos os 15 templates feed + 15 variantes story (30 templates, 90 PNGs com 3 copies) |

**Múltiplas flags são cumulativas:**
```
/vivavr-static-campaign --phone-screen --split
→ roda: phone-float, phone-tilt, split
```

**Default (sem flag):** `--split`

### Descrição dos templates

| Nome | Formato | Descrição |
|------|---------|-----------|
| `overlay` | feed 4:5 | Imagem full-bleed com overlay escuro, headline/CTA na base |
| `split` | feed 4:5 | Imagem no topo (55%), painel de texto escuro na base (45%) — **padrão** |
| `frame` | feed 4:5 | Fundo escuro sólido, imagem em moldura com borda gradiente |
| `phone-float` | feed 4:5 | Celular centralizado com cards flutuando ao redor (dark) |
| `phone-float-gradient` | feed 4:5 | Celular centralizado, fundo BADGE_GRADIENT vibrante |
| `phone-float-light` | feed 4:5 | Celular centralizado, fundo claro #f5f4f8 |
| `phone-tilt` | feed 4:5 | Copy à esquerda, celular inclinado à direita (dark) |
| `phone-tilt-light` | feed 4:5 | Copy à esquerda, celular inclinado à direita (claro) |
| `story` | story 9:16 | Imagem topo (60%), texto base (40%), safe zones 120px/180px |
| `light-arc` | feed 4:5 | Fundo branco, moldura arco gradiente, estética clean/premium |
| `cinematic` | feed 4:5 | Imagem full-bleed, overlay ultra-suave, headline grande |
| `quote` | feed 4:5 | Fundo branco, testimonial destaque, imagem circular |
| `bold-text` | feed 4:5 | Zero imagem, headline gigante 116px, fundo gradiente |
| `split-reverse` | feed 4:5 | Layout horizontal: imagem esquerda (240px), texto direita |
| `split-reverse-gradient` | feed 4:5 | Layout horizontal, fundo BADGE_GRADIENT, painel dark glass |
| `immersive` | feed 4:5 | Full-bleed com vinheta radial, texto centralizado |

**Story variants** (sufixo `-story`): cada template feed tem uma versão 9:16 (540×960px) com safe zones aplicadas automaticamente. Ex: `split-story`, `overlay-story`, `phone-float-story`, etc.

**`--all`** gera 30 templates (15 feed + 15 story) × 3 copies = **90 PNGs** organizados em:
- `outputs/campaigns/{id}/feed/` — 45 PNGs (15 templates × 3 copies)
- `outputs/campaigns/{id}/story/` — 45 PNGs (15 story variants × 3 copies)

**Regra de sceneImage para story items:** items com templateId terminando em `-story` ou igual a `story` devem usar `"sceneImage": "scene-story.png"` para garantir a imagem em proporção PORTRAIT. Items de feed herdam `feed.sceneImage = "scene.png"`.

```json
{ "outputName": "post-p1-split-story", "templateId": "split-story", "sceneImage": "scene-story.png", "copy": {...} }
```

---

## Princípios de execução

- **Especificidade é tudo:** copy e visual que só fazem sentido para o Vivr — se poderia ser de outro app, reescreva
- Conecte o momento de aprendizado com uma situação real de vida (reunião, viagem, restaurante, série)
- Evite: "aprenda inglês rápido", "o melhor app", "método revolucionário", linguagem EdTech genérica
- Escreva em Português Brasileiro, exceto diálogos em inglês que fazem parte da proposta criativa
- O Whisk brief deve ser escrito em inglês

### Variação obrigatória entre campanhas
Cada campanha deve ser distinta nas seguintes dimensões:

| Dimensão | Opções disponíveis |
|---|---|
| Personagem protagonista | Barbudo roxo / Careca vermelho / Profissional ruiva / Jovem loiro |
| Cenário | Restaurante / Sala / Cozinha / Escritório / Aeroporto / Bar |
| Ângulo de câmera | Close no rosto / Plano médio / Plano aberto / POV / Over-the-shoulder |
| Situação emocional | Surpresa / Confiança / Alívio / Diversão / Foco intenso |
| Tipo de audiência | Profissional / Estudante / Viajante / Pai/mãe / Introvertido |

Nunca repita a mesma combinação de personagem + cenário + ângulo da campanha anterior.

---

## ETAPA AUTOMÁTICA — após gerar o brief, execute o pipeline completo

O fluxo tem **duas fases distintas**:

1. **Fase 1 — Brief + Copy:** gerar o brief estratégico e as copies via agente content-creator → **parar e aguardar aprovação do usuário**
2. **Fase 2 — Pipeline:** só executar após aprovação explícita do usuário (qualquer mensagem de confirmação: "ok", "aprovado", "gera", etc.)

---

### FASE 1 — Brief e Copy (executa automaticamente)

#### Passo 1a — Gerar o brief estratégico
Exibe ao usuário as seções 1–5 (Campanha, Copy, Direção Visual, Whisk Brief, Canva Brief) conforme o output structure acima.

#### Passo 1b — Invocar o agente content-creator para refinar as copies

Após gerar o brief, use o agente `.agents/content-creator.md` para:

1. **Revisar e refinar** as 3 copies (P1/P2/P3) geradas no brief
2. **Garantir qualidade linguística** — concordância PT-BR, tom correto, termos proibidos ausentes
3. **Propor variações** se alguma copy não passar no checklist de qualidade

O agente content-creator deve entregar:

```
## COPIES PARA APROVAÇÃO

### P1 — Principal
**Hook:** ...
**Headline:** ...
**Body:** ...
**CTA:** ...
**accentWord:** ...

### P2 — Emocional
**Hook:** ...
**Headline:** ...
**Body:** ...
**CTA:** ...
**accentWord:** ...

### P3 — Provocativa
**Hook:** ...
**Headline:** ...
**Body:** ...
**CTA:** ...
**accentWord:** ...

---
✅ Checklist de qualidade:
- [ ] Hooks nomeiam cena específica
- [ ] Zero termos proibidos
- [ ] 3 variantes tonalmente distintas
- [ ] CTAs no imperativo PT-BR
- [ ] Nenhuma frase poderia ser do Duolingo/Open English
```

#### Passo 1c — PARAR e aguardar aprovação

**⚠️ OBRIGATÓRIO: após exibir as copies, pare completamente.**

Exiba ao usuário:

> **Copies prontas para revisão.** Responda com:
> - **"aprovado"** ou **"ok"** → pipeline executa com as copies acima
> - **Edições diretas** → ajuste e reexiba antes de executar
> - **"refaz P2"** (ou qualquer variante) → regenera apenas aquela copy

**NÃO execute nenhum Bash, Write ou pipeline até receber aprovação explícita.**

---

### FASE 2 — Pipeline (só executa após aprovação)

> **Arquitetura:** Claude gera apenas o `content.json` (copy puro, ~20 linhas). O TypeScript cuida do render e screenshot. Não gere HTML — isso é responsabilidade do pipeline.

---

### Passo 1 — Gerar content.json (tarefa Claude — só copy)

Gere um `id` único no formato `NNN-slug` (ex: `009-aeroporto-confianca`).

Use as Headlines P1, P2, P3 do Canva Brief como as 3 variantes. Cada uma tem seu próprio `hook`, `headline`, `accentWord`, `body` e `cta`.

O `accentWord` recebe o gradiente da marca — escolha a palavra mais forte do headline.

Monte **dois arquivos** separados:

**`brief-input.json`** — contexto estratégico completo (para Whisk + auditoria):
```json
{
  "id": "NNN-slug",
  "audience": "...",
  "pain": "...",
  "angle": "...",
  "copy": { "hook": "...", "headline": "P1", "accentWord": "...", "body": "...", "cta": "..." },
  "copyVariants": [
    { "hook": "...", "headline": "P2", "accentWord": "...", "body": "...", "cta": "..." },
    { "hook": "...", "headline": "P3", "accentWord": "...", "body": "...", "cta": "..." }
  ],
  "visual": {
    "whiskPrompt": "...",
    "scene": "...",
    "mood": "...",
    "generateStoryImage": true
  }
}
```

> **Regra de `generateStoryImage`:** setar como `true` quando as flags incluem `--story` ou `--all`. Quando `true`, o pipeline gera **duas imagens Whisk**:
> - `scene.png` → proporção `SQUARE` (1:1) — usada por todos os templates de feed
> - `scene-story.png` → proporção `PORTRAIT` (9:16) — usada exclusivamente pelos items de story
>
> Quando `--story` é a **única** flag, setar `"aspectRatio": "PORTRAIT"` em vez de `generateStoryImage: true` (apenas uma imagem, vertical).

```

**`content-feed.json`** — formato V2 multi-template (gerado com base nas flags da chamada):
```json
{
  "campaignId": "NNN-slug",
  "sceneImage": "scene.png",
  "items": [
    {
      "outputName": "post-p1-split",
      "templateId": "split",
      "copy": { "hook": "...", "headline": "P1", "accentWord": "...", "body": "...", "cta": "..." }
    },
    {
      "outputName": "post-p2-split",
      "templateId": "split",
      "copy": { "hook": "...", "headline": "P2", "accentWord": "...", "body": "...", "cta": "..." }
    },
    {
      "outputName": "post-p3-split",
      "templateId": "split",
      "copy": { "hook": "...", "headline": "P3", "accentWord": "...", "body": "...", "cta": "..." }
    }
  ]
}
```

**Convenção de `outputName`:** `post-{p1|p2|p3}-{templateId}`

**Expansão:** para cada uma das 3 copies × cada template das flags = N itens. Ex: `--phone-screen` com 3 copies → 6 itens.

**Regra de `sceneImage` por item:** quando as flags incluem story ou `--all`, todos os items com templateId terminando em `-story` ou igual a `"story"` devem incluir `"sceneImage": "scene-story.png"`. Os demais items não precisam do campo (herdam `feed.sceneImage = "scene.png"`).

```json
{ "outputName": "post-p1-split-story", "templateId": "split-story", "sceneImage": "scene-story.png", "copy": {...} }
```

---

### Passo 2 — Salvar os dois arquivos (código)

Use Write para salvar:
- `brief-input.json` na raiz do projeto
- `content-feed.json` na raiz do projeto (o pipeline moverá para a pasta da campanha)

---

### Passo 3 — Rodar o pipeline (código puro — sem Claude)

Execute via Bash:

```bash
PATH="/c/Users/felipe.fadel/tools/node/node-v24.14.0-win-x64:$PATH" npx ts-node src/run.ts
```

O pipeline vai:
1. Criar `outputs/campaigns/{id}/`
2. Salvar `brief.json` + `content-feed.json`
3. Chamar Whisk → salvar `scene.webp`
4. Renderizar `post-copy-1.html` (P1), `post-copy-2.html` (P2), `post-copy-3.html` (P3)
5. Screenshots → `post-copy-1.png`, `post-copy-2.png`, `post-copy-3.png`

**Rerender sem Whisk** (quando a imagem já existe e só o copy mudou — detecta automaticamente V1 e V2):
```bash
PATH="/c/Users/felipe.fadel/tools/node/node-v24.14.0-win-x64:$PATH" npx ts-node src/run-render.ts outputs/campaigns/NNN-slug/content-feed.json
```

---

### Passo 4 — Reportar resultado

Ao final, informe:
- Campanha gerada com sucesso
- Paths dos PNGs finais
- Qual combinação de personagem + cenário + ângulo foi usada (para controle de variação)