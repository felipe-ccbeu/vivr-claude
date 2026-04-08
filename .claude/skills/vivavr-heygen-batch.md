---
name: vivavr-heygen-batch
description: Gera múltiplos vídeos HeyGen em sequência usando os avatares registrados em avatar-registry.json. Cada vídeo recebe um roteiro personalizado para o cenário do avatar. Use quando o usuário quiser gerar vídeos em batch para os avatares do Vivr.
---

# Vivr HeyGen Batch Video Generator

Lê o registry de avatares e gera vídeos em sequência via MCP, cada um com roteiro personalizado para o cenário.

## O que fazer quando esta skill for chamada

1. Ler `outputs/heygen/avatar-registry.json`
2. Perguntar se quer gerar todos ou filtrar por personagem/cena
3. Para cada avatar, montar o roteiro certo para o cenário
4. Chamar `mcp__claude_ai_HeyGen__create_video_agent` para cada um
5. Salvar os `video_id`s gerados em `outputs/heygen/batch-results.json`

---

## Roteiros por cenário

Cada roteiro segue o framework da marca:
- **Ato 1:** nomeia a cena da dor
- **Ato 2:** valida sem condescendência
- **Ato 3:** apresenta o Vivr como solução
- **Ato 4:** CTA situacional

Imperativo correto em PT-BR: "Pratique", "Entre", "Comece" — nunca "Pratica", "Entra".

### airport
```
Narração PT-BR: "Você já travou em um aeroporto tentando falar inglês? Essa sensação de não conseguir se comunicar quando mais precisa — é frustrante. Com o Vivr, você pratica situações reais como essa antes de precisar. Baixe grátis e entre no aeroporto com confiança."
Script avatar (EN): "Have you ever frozen at an airport, not knowing what to say? I used to feel that way too. But with Vivr, I practiced real situations before I needed them. Now I can handle any airport conversation. Download Vivr for free and travel with confidence."
```

### cafe
```
Narração PT-BR: "Pedir um café em inglês parece simples — até o momento em que o barista te faz uma pergunta que você não esperava. Com o Vivr, você pratica conversas reais de café antes de estar nessa situação. Comece grátis."
Script avatar (EN): "Ordering coffee in English seemed easy until the barista asked something unexpected. With Vivr, I practiced real café conversations before I needed them. Now it feels natural. Start for free today."
```

### meeting
```
Narração PT-BR: "Você sabe a resposta — em português. Mas na reunião com o time internacional, as palavras simplesmente não saem. Com o Vivr, você pratica reuniões reais em inglês antes de entrar em uma. Comece agora, é grátis."
Script avatar (EN): "I knew the answer — just not in English. Every meeting with international colleagues felt like a test I hadn't studied for. Vivr changed that. I practiced real meeting conversations and now I speak up with confidence. Try it free."
```

### restaurant
```
Narração PT-BR: "Pedir comida num restaurante em inglês — parece fácil até você estar lá, olhando pro cardápio sem entender metade. Com o Vivr, você pratica essa situação antes de viver ela. Baixe grátis."
Script avatar (EN): "Ordering at a restaurant in English used to make me nervous. I'd point at the menu hoping for the best. With Vivr, I practiced real restaurant situations. Now I order with confidence. Download it free."
```

### bar
```
Narração PT-BR: "Conversar com alguém num bar em inglês parece impossível quando as palavras travam na garganta. Com o Vivr, você pratica conversas reais antes de precisar delas. Comece agora."
Script avatar (EN): "Making small talk at a bar in English used to terrify me. Words just wouldn't come. Vivr helped me practice real conversations in a safe environment. Now I actually enjoy it. Start free today."
```

### tourist-info / tourist-pointing / tourist-map
```
Narração PT-BR: "Pedir informações na rua, entender uma direção, se virar como turista — tudo fica mais fácil quando você pratica antes. Com o Vivr, você entra em situações reais de inglês sem o risco de passar vergonha. Baixe grátis."
Script avatar (EN): "Being a tourist and not speaking the language used to be stressful. Asking for directions, reading maps, getting around — I practiced all of it with Vivr before my trip. And it made all the difference. Download free."
```

---

## Como executar

Para cada avatar no registry, chamar:

```
mcp__claude_ai_HeyGen__create_video_agent(
  prompt: <prompt completo com roteiro + identidade visual>,
  avatarId: <avatarLookId do registry>,
  orientation: "portrait",
  durationSec: 30
)
```

### Prompt template para cada vídeo

```
Create a 30-second vertical promotional video (portrait 9:16) for Vivr — a language learning AR app for Brazilian adults.

AVATAR: Use avatar ID {avatarLookId}. Keep the avatar's original background. Do not replace it.

SCRIPT (avatar speaks in English):
{script_en}

NARRATION (voice over in Brazilian Portuguese):
{narration_pt}

BRAND GRADIENT — ALL 6 COLORS MANDATORY:
linear-gradient(135deg, #f7c948 0%, #f97040 20%, #e94899 45%, #9b5de5 65%, #26c6da 83%, #80e27e 100%)
Show ALL 6 colors visibly — yellow, orange, pink, purple, cyan, green. NEVER simplify to 2-3 colors.

LAYOUT ZONES — no overlap:
- Zone A (0-15%): "vivr" logo watermark, top-left, Nunito ExtraBold white
- Zone B (15-65%): avatar speaks, no text overlay here, subtitles only in this zone
- Zone C (65-100%): dark overlay #1A1030 at 85% opacity
  Inside Zone C: headline → supporting copy → CTA button
  CTA button: pill shape border-radius 100px, brand gradient background, white Nunito ExtraBold text
  NEVER cover CTA with subtitles or captions

HEADLINE: "{headline}"
SUPPORTING COPY: "{supporting_copy}"  
CTA: "{cta}"

TYPOGRAPHY: Nunito ExtraBold (800) headlines, Nunito Regular (400) body. No other fonts.
TONE: Confident, warm, adult Brazilian Portuguese. NOT childish. NOT corporate.
```

---

## Salvar resultados

Após gerar cada vídeo, salvar em `outputs/heygen/batch-results.json`:

```json
{
  "generatedAt": "2026-04-08T...",
  "videos": [
    {
      "avatarLookId": "...",
      "character": "old-man",
      "scene": "airport",
      "videoId": "...",
      "pageUrl": "https://app.heygen.com/videos/..."
    }
  ]
}
```