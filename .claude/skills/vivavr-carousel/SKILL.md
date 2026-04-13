---
name: vivavr-carousel
description: Cria um carrossel educativo de 5 slides para o Vivr. Fluxo: propõe copies → aguarda aprovação → gera carousel.json (com visual.whiskPrompt) → roda pipeline (Whisk + render) → entrega 5 PNGs em outputs/campaigns/carousel/{id}/carousel/
---

Read `.agents/vivavr-context.md` before starting.

Você é um estrategista de conteúdo e diretor criativo do Vivr.

Seu trabalho é criar um **carrossel educativo de 5 slides** para Instagram que:
1. Ensina algo útil em inglês (situação real do app)
2. Convence o usuário de que o Vivr é o melhor jeito de aprender

---

## Estrutura fixa dos 5 slides

| Slide | Papel | Objetivo |
|---|---|---|
| 1 | **Hook** | Parar o scroll com uma pergunta de dor ou situação real |
| 2 | **Diálogo** | Mostrar um diálogo real do app com tradução — o produto em ação |
| 3 | **Vocabulário** | 4 frases-chave da cena com exemplo de uso |
| 4 | **Prova** | Dark slide — stat + 3 diferenciais do Vivr |
| 5 | **CTA** | Headline de fechamento + botão |

---

## Cenas disponíveis (escolha uma por carrossel)

| Cena | Situações típicas |
|---|---|
| Restaurante | pedir conta, recomendar prato, sentar |
| Aeroporto | check-in, perder voo, pedir informação de portão |
| Hotel | fazer check-in, pedir quarto extra, reclamar de problema |
| Café | pedir bebida, perguntar ingredientes, pagar |
| Trabalho | reunião, apresentação, feedback |
| Loja | pedir tamanho, devolver produto, perguntar preço |

---

## Paleta de cores para vocab dots (slide 3)

Usar exatamente nesta sequência nos 4 cards:
- Item 1: `#89c7fe` (azul)
- Item 2: `#ae90fb` (roxo)
- Item 3: `#f599b5` (rosa)
- Item 4: `#fdd38a` (âmbar)

E para os 3 bullets do slide 4:
- Bullet 1: `#8bfbd1` (verde-teal)
- Bullet 2: `#ae90fb` (roxo)
- Bullet 3: `#f599b5` (rosa)

---

## FASE 1 — Proposta de copy (executa automaticamente)

Ao receber o comando `/vivavr-carousel`, escolha uma cena e proponha o copy completo dos 5 slides no formato abaixo.

### Formato de proposta

```
## Carrossel proposto · [CENA]

### SLIDE 1 — HOOK
**tag:** [pill de contexto, ex: "🌎 Situação real"]
**headline:** [pergunta de dor — máx 6 palavras, impacta visualmente em 50px]
**accentWord:** [palavra que recebe gradiente da marca]
**sub:** [1 frase de suporte — máx 15 palavras]
**cardLabel:** [ex: "Praticado no app"]
**cardValue:** [ex: "+40 cenas do cotidiano"]

---

### SLIDE 2 — DIÁLOGO
**contextLabel:** [ex: "Cena do app · Restaurante"]
**title:** [pergunta sobre a situação — máx 8 palavras]
**accentWord:** [palavra de destaque]
**userLine:** [frase do usuário em inglês com aspas tipográficas]
**userTranslation:** [tradução PT-BR — sem aspas]
**replyLine:** [resposta do personagem — palavra em destaque em <span class="hl">palavra</span>]
**replyTranslation:** [tradução da resposta]
**note:** [1–2 frases sobre como o Vivr pratica essa cena — máx 20 palavras]

---

### SLIDE 3 — VOCABULÁRIO
**sectionLabel:** [ex: "Frases essenciais · Restaurante"]
**title:** [headline do slide — ex: "4 frases que você usa toda viagem"]
**accentWord:** [palavra de destaque]
**item1.english:** ["frase em inglês"]
**item1.portuguese:** [tradução PT-BR]
**item1.example:** ["exemplo de uso em inglês"]
[repetir para item2, item3, item4]
**progressLabel:** [ex: "Cena 1 de 4"]
**progressPct:** [0-100 — sugere 60 para criar expectativa de mais]

---

### SLIDE 4 — PROVA
**eyebrow:** [ex: "Por que funciona"]
**stat:** [ex: "3×" — número impactante em 88px]
**statLabel:** [2 linhas, ex: "mais retenção que\naulas tradicionais"]
**body:** [2–3 frases explicando a stat — máx 25 palavras]
**bullet1.text:** [benefício concreto — máx 7 palavras]
**bullet2.text:** [benefício concreto — máx 7 palavras]
**bullet3.text:** [benefício concreto — máx 7 palavras]

---

### SLIDE 5 — CTA
**eyebrow:** [ex: "Começa hoje"]
**headline:** [2 linhas, ex: "Para de travar.\nComeça a falar."]
**accentWord:** [palavra de destaque na linha 2]
**body:** [1–2 frases concretas sobre o Vivr — máx 18 palavras]
**cta:** [texto do botão — imperativo, máx 5 palavras]
**freeTag:** [ex: "Grátis para começar · Sem cartão"]
```

### Checklist de qualidade antes de mostrar

- [ ] Headline do slide 1 tem no máximo 6 palavras (aparece em 50px)
- [ ] Diálogo do slide 2 é uma cena real e específica — não genérica
- [ ] 4 frases do slide 3 são situações reais de uso — não definições de dicionário
- [ ] Stat do slide 4 é específica e defensável — não inventada
- [ ] CTA do slide 5 está no imperativo PT-BR
- [ ] Nenhuma frase poderia ser do Duolingo ou Open English

---

## ⚠️ OBRIGATÓRIO: após exibir a proposta, PARE completamente.

Exiba ao usuário:

> **Proposta de copy pronta.** Responda com:
> - **"aprovado"** ou **"ok"** → pipeline executa com o copy acima
> - **Edições diretas** → ajuste e reexiba antes de executar
> - **"refaz slide 3"** → regenera apenas aquele slide

**NÃO execute nenhum Bash ou Write até receber aprovação explícita.**

---

## FASE 2 — Pipeline (só executa após aprovação)

### Passo 1 — Gerar carousel.json

Use o `campaignId` existente se o usuário especificou uma campanha, ou gere um novo no formato `NNN-slug`.

Monte o arquivo `carousel.json` com base no copy aprovado:

```json
{
  "campaignId": "NNN-slug",
  "sceneImage": "scene.png",
  "scene": "Restaurante",

  "visual": {
    "whiskPrompt": "3D stylized adult cartoon character with elongated proportions, expressive exaggerated features, slightly prominent nose, large but non-infantile eyes, lean body, thin limbs, small hands, skin texture with subtle bump. [DESCRIÇÃO DO PERSONAGEM E CENA em inglês]. Cinematic warm lighting with soft shadows and subtle rim light. High-fidelity 3D render. No text, no speech bubbles, no written words.",
    "refs": {}
  },

  "slide1": {
    "tag": "🌎 Situação real",
    "headline": "Você trava na hora de falar?",
    "accentWord": "falar",
    "sub": "Você sabe as palavras — mas na hora H, o silêncio chega primeiro.",
    "cardLabel": "Praticado no app",
    "cardValue": "+40 cenas do cotidiano"
  },

  "slide2": {
    "contextLabel": "Cena do app · Restaurante",
    "title": "Como você pede a conta em inglês?",
    "accentWord": "inglês",
    "userLine": "\"Could I get the check, please?\"",
    "userTranslation": "A conta, por favor",
    "replyLine": "<span class=\"hl\">Of course!</span> I'll bring it right away.",
    "replyTranslation": "Claro! Já trago.",
    "note": "No Vivr você pratica esse diálogo antes de precisar — personagens que respondem de verdade."
  },

  "slide3": {
    "sectionLabel": "Frases essenciais · Restaurante",
    "title": "4 frases que você usa toda viagem",
    "accentWord": "usa",
    "items": [
      { "color": "#89c7fe", "english": "\"Could I get the check?\"", "portuguese": "Posso pegar a conta?", "example": "\"Could I get the check, please? We're in a hurry.\"" },
      { "color": "#ae90fb", "english": "\"Is this seat taken?\"",    "portuguese": "Este lugar está ocupado?", "example": "\"Excuse me, is this seat taken?\"" },
      { "color": "#f599b5", "english": "\"I'd like to order...\"",   "portuguese": "Eu gostaria de pedir...", "example": "\"I'd like to order the salmon, please.\"" },
      { "color": "#fdd38a", "english": "\"Could you recommend...?\"","portuguese": "Você recomenda...?",      "example": "\"Could you recommend something vegetarian?\"" }
    ],
    "progressLabel": "Cena 1 de 4",
    "progressPct": 60
  },

  "slide4": {
    "eyebrow": "Por que funciona",
    "stat": "3×",
    "statLabel": "mais retenção que\naulas tradicionais",
    "body": "Você aprende praticando situações reais — não decorando listas. Cada cena simula o que você vai encontrar na vida.",
    "bullets": [
      { "color": "#8bfbd1", "text": "Personagens com respostas imprevisíveis" },
      { "color": "#ae90fb", "text": "Cenários reais: viagem, trabalho, social" },
      { "color": "#f599b5", "text": "Sem julgamento — erra, aprende, repete" }
    ]
  },

  "slide5": {
    "eyebrow": "Começa hoje",
    "headline": "Para de travar.\nComeça a falar.",
    "accentWord": "falar",
    "body": "Pratica inglês em situações reais — restaurante, aeroporto, trabalho — sem medo de errar.",
    "cta": "Baixa grátis agora",
    "freeTag": "Grátis para começar · Sem cartão"
  }
}
```

### Passo 2 — Salvar carousel.json

Use Write para salvar em:
- `outputs/campaigns/carousel/{campaignId}/carousel.json`

Se a pasta não existir, crie. O pipeline vai gerar `scene.png` automaticamente via Whisk usando o campo `visual.whiskPrompt`.

### Passo 3 — Rodar o pipeline

```bash
PATH="/c/Users/felipe.fadel/tools/node/node-v24.14.0-win-x64:$PATH" npx ts-node src/run-carousel.ts outputs/campaigns/carousel/{campaignId}/carousel.json
```

O pipeline faz em sequência:
1. Se `scene.png` não existir → gera via Whisk usando `visual.whiskPrompt`
2. Renderiza os 5 slides em HTML
3. Exporta cada slide como PNG

### Passo 4 — Reportar resultado

Ao final, informe:
- Campanha e cena
- Path do `scene.png` gerado pelo Whisk
- Paths dos 5 PNGs gerados em `outputs/campaigns/carousel/{id}/carousel/`
- Quais slides foram gerados

---

## Regras de copy para carrossel

- Headline do slide 1: **máx 6 palavras** — aparece em 50px, precisa caber em 3 linhas
- Diálogos: frases reais, específicas — não "How are you?" ou "Nice to meet you"
- Frases do vocabulário: situações concretas — o que a pessoa usaria numa viagem real
- Stat: use "3×" ou "2×" apenas se defensável; alternativas: "78% dos usuários..." ou número de cenas
- CTA: sempre no imperativo PT-BR — "Baixa", "Começa", "Experimenta", "Pratica"
