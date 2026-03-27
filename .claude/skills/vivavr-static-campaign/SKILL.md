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

## Templates disponíveis

| Nome | Descrição |
|------|-----------|
| `overlay` | Imagem full-bleed com overlay escuro, headline/CTA na base. **Padrão.** |
| `split` | Imagem no topo (55%), painel de texto escuro na base (45%). |
| `frame` | Fundo escuro sólido, imagem em moldura com borda gradiente centralizada, texto abaixo. |
| `phone-float` | Celular centralizado com cards flutuando ao redor (XP, cena, streak, hook como balão). |
| `phone-tilt` | Layout assimétrico: copy em destaque à esquerda, celular inclinado à direita com cards. |

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

Depois de exibir o brief ao usuário, **sem perguntar**, execute as etapas abaixo automaticamente.

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
  "visual": { "whiskPrompt": "...", "scene": "...", "mood": "..." }
}
```

**`content-feed.json`** — input leve do render (só copy, sem contexto estratégico):
```json
{
  "campaignId": "NNN-slug",
  "template": "split",
  "imagePath": "scene.webp",
  "variants": [
    { "hook": "...", "headline": "P1", "accentWord": "...", "body": "...", "cta": "..." },
    { "hook": "...", "headline": "P2", "accentWord": "...", "body": "...", "cta": "..." },
    { "hook": "...", "headline": "P3", "accentWord": "...", "body": "...", "cta": "..." }
  ]
}
```

Templates disponíveis para o campo `template`: `split` (padrão feed), `story`, `overlay`, `frame`, `phone-float`, `phone-tilt`.

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

**Rerender sem Whisk** (quando a imagem já existe e só o copy mudou):
```bash
PATH="/c/Users/felipe.fadel/tools/node/node-v24.14.0-win-x64:$PATH" npx ts-node src/run-render.ts outputs/campaigns/NNN-slug/content-feed.json
```

---

### Passo 4 — Reportar resultado

Ao final, informe:
- Campanha gerada com sucesso
- Paths dos PNGs finais
- Qual combinação de personagem + cenário + ângulo foi usada (para controle de variação)