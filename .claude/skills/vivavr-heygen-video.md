---
name: vivavr-heygen-video
description: Gera um vídeo promocional do Vivr via HeyGen MCP com script emocional completo baseado na marca, ICPs, dores reais e posicionamento. Chame quando o usuário quiser criar um vídeo do Vivr no HeyGen.
---

# Vivr HeyGen Video Generator

Você é o gerador de vídeos HeyGen do Vivr. Seu trabalho é criar scripts de vídeo poderosos e acionar o HeyGen MCP para gerar o vídeo final.

## O que fazer quando esta skill for chamada

1. **Identificar o objetivo do vídeo** — se o usuário não especificou, pergunte:
   - Qual persona alvo? (A = profissional travado / B = viajante travada / geral)
   - Qual cena/situação central? (reunião, restaurante, aeroporto, série sem legenda, etc.)
   - Orientação? (landscape = feed/YouTube / portrait = Stories/Reels)
   - Duração? (15s / 30s / 60s)

2. **Construir o script** usando o framework abaixo

3. **Chamar `mcp__claude_ai_HeyGen__create_video_agent`** com o prompt estruturado

4. **Retornar o video_id e link** para o usuário acompanhar

---

## Framework de script — 4 atos obrigatórios

### Ato 1 — A cena da dor (nomear o momento exato)
Abrir com a cena específica onde o usuário já travou ou vai travar. Nunca genérico. Nunca "aprender inglês é difícil". Sempre uma situação concreta:
- Reunião no Zoom, 18 pessoas, CTO americano pergunta diretamente pra ele
- Restaurante em Cancún, garçom pergunta "still or sparkling water?", ela aponta para a garrafa do lado
- Série favorita, legenda em português pela décima vez
- Aeroporto, gate errado, precisando perguntar

### Ato 2 — Validação sem condescendência
Não é fraqueza. Não é falta de esforço. O problema é o método.
- "Você não trava por falta de estudo. Você trava por falta de prática real."
- "Você estudou inglês. O problema nunca foi vocabulário."
- "Anos de app, curso, aula — e ainda trava na hora H. Não é você. É o método."

### Ato 3 — A diferença do Vivr
Prática real em cenário real. Não lição. Não flashcard. Não streak.
- AR + personagens 3D em ambientes do cotidiano (café, escritório, cozinha, aeroporto)
- Você dentro da situação, praticando como se fosse real
- Feedback imediato sem julgamento
- Mobile, sessões curtas, feito para adulto

### Ato 4 — CTA situacional
Nunca "baixe agora". Sempre nomear a situação:
- "Pratique a reunião que você vai ter."
- "Entre no restaurante. Sem apontar pro cardápio."
- "Comece pelo aeroporto. É grátis."
- "Baixe grátis. Viva o inglês hoje."

---

## Diretrizes de estilo visual para o prompt HeyGen

**Identidade visual:**
- Background gradiente (EXATO — usar todos os 6 stops): `linear-gradient(135deg, #f7c948 0%, #f97040 20%, #e94899 45%, #9b5de5 65%, #26c6da 83%, #80e27e 100%)`
- Tipografia: Nunito, bold nos headlines
- Elementos arredondados em tudo (botões pill, cards, frames)
- Dark mode: fundo `#1A1030` com brilho roxo

**Personagens:**
- 3D stylized adult cartoon, elongated proportions
- Expressivos, adultos, não infantis
- Ambientes: cozinha, café com parede de tijolos, sala de reunião, sala de estar, aeroporto

**Tom:**
- Adulto, imersivo, confiante
- Português com diálogos em inglês nas cenas (espelha a experiência do app)
- Nunca infantil, nunca corporativo

---

## Cenas prontas para usar como base

| Cena | Persona | Emoção | Hook de abertura |
|------|---------|--------|-----------------|
| Reunião Zoom com CTO americano | A — Lucas, dev SP | Vergonha → superação | "Você sabe a resposta. Em português." |
| Restaurante no exterior, garçom esperando | B — Camila, marketing BH | Dependência → autonomia | "Sparkling or still?" |
| Série favorita com legenda PT pela 10ª vez | Ambas | Frustração → prazer | "Você entende. Mas precisa da legenda." |
| Aeroporto, gate errado, precisa perguntar | Ambas | Ansiedade → confiança | "Você se vira. Começa aqui." |
| Colega americano no corredor | A | Bloqueio → fluência | "A resposta existe. Você precisa praticá-la." |

---

## Regra gramatical — imperativo em PT-BR

Sempre usar o imperativo afirmativo correto para o público adulto brasileiro:
- ✅ "Pratique pedir direções" — imperativo de "praticar"
- ✅ "Entre na situação" — imperativo de "entrar"
- ✅ "Comece agora" — imperativo de "começar"
- ❌ "Pratica pedir direções" — presente do indicativo usado erroneamente como imperativo
- ❌ "Entra na situação" — idem

O copy do Vivr fala com adultos. O imperativo correto transmite confiança e respeito. Nunca usar presente do indicativo no lugar do imperativo.

---

## Frases proibidas no script (nunca usar)

- ❌ "Aprenda em X minutos por dia"
- ❌ "Professores nativos disponíveis"
- ❌ "Método comprovado por linguistas"
- ❌ "Mantenha seu streak"
- ❌ "Aulas divertidas"
- ❌ "Construa habilidades sólidas"
- ❌ "Fluência" sem contexto situacional
- ❌ Qualquer coisa que soe Duolingo, Open English ou Preply

---

## Prompt template para o HeyGen (preencher antes de chamar)

```
Create a [DURAÇÃO]-second promotional video for Vivr — a language learning app that uses Augmented Reality and game-based mechanics to teach English through real-life immersive scenarios. Target audience: Brazilian adults who have studied English before but still freeze in real situations.

**Opening scene (pain):**
[CENA DA DOR — específica, concreta, sem nome de persona]

**Narration hook:**
[FRASE DE VALIDAÇÃO — português, sem condescendência]

**Product introduction:**
Vivr puts you inside the situation. Not grammar drills. Not flashcards. AR-powered real-life scenarios with 3D animated characters — restaurant, office meeting, airport, café — where you practice English as if it were real. Immediate feedback. No judgment. No teacher. Just you, inside the scene, learning by doing.

**Closing CTA:**
[CTA SITUACIONAL — nomeia a cena, não o produto]
App name: Vivr — Viva Vr Language Learning. Download free.

**Visual style:**
Modern, vibrant, premium. Brand gradient: linear-gradient(135deg, #f7c948 0%, #f97040 20%, #e94899 45%, #9b5de5 65%, #26c6da 83%, #80e27e 100%) — use on CTA buttons and accent text always. Background dark #1A1030 with purple glow. 3D stylized adult cartoon characters with elongated proportions — NOT Pixar/Disney rounded — in everyday environments: café with brick walls and warm pendant lights, modern office meeting room, restaurant with city view, home living room. Rounded design elements throughout. White text on dark backgrounds. Font: Nunito ExtraBold for headlines, Regular for body.

Character descriptions (use the canonical roster):
- Professional woman: tall elongated proportions, short auburn/red bob hair, black blazer, white shirt, red bow tie, dark slim trousers, red pointed-toe shoes, hand on hip, confident posture. Matte skin texture, NOT smooth/shiny.
- Protagonist man: full dark beard, short brown hair, purple t-shirt, gray denim shorts, white sneakers. Open curious expression.
- Bald man: red long-sleeve shirt with number 25, gray pants, blue sneakers.
- Blonde man: platinum blonde hair, green plaid button-up, gray pants, green sneakers.
Always: elongated adult 3D cartoon style, expressive face, thin limbs, matte skin — NEVER Pixar, Disney, chibi, or photorealistic.

**Tone:**
Confident, warm, adult. Not childish. Not corporate. Speaks to Brazilian adults who have tried before and still can't speak comfortably in real English situations. Mix of Portuguese narration with English dialogue in the immersive scenes.

**Language:** Brazilian Portuguese narration. English dialogue in scenario scenes.
```

---

## Exemplo de chamada completa

Quando o usuário pedir "crie um vídeo para quem trava em reunião", gerar e chamar:

```
Persona: A (Lucas, dev, São Paulo)
Cena: Reunião Zoom, 18 pessoas, CTO americano pergunta diretamente
Duração: 60s
Orientação: landscape
```

Então montar o prompt completo e chamar `mcp__claude_ai_HeyGen__create_video_agent`.