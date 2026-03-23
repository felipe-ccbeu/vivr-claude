---
name: vivavr-whisk-hero
description: Gera prompts estruturados para criação de hero images no Whisk (whisk.google.com) a partir do brief visual da campanha Vivr
---

Read `.agents/vivavr-context.md` before starting.

## O que é o Whisk

Whisk (whisk.google.com) é uma ferramenta do Google que gera imagens a partir de:
- **Subject image(s):** foto(s) de referência do sujeito principal
- **Scene image(s):** foto(s) de referência do ambiente/cenário
- **Style image(s):** foto(s) de referência da estética visual
- **Text prompt:** descrição textual que complementa as referências

Whisk não tem API — o usuário usa a interface web. Sua função é gerar instruções detalhadas para que o usuário execute no Whisk e traga de volta a imagem gerada.

---

## Identidade visual canônica — leia antes de gerar qualquer prompt

### Estilo de personagem do Vivr
O estilo visual do Vivr é **3D cartoon adulto de proporções alongadas** — NÃO é Pixar/Disney arredondado.

Características obrigatórias nos prompts:
- Corpos esguios, membros finos
- Faces expressivas com traços levemente exagerados (nariz proeminente, olhos grandes mas não infantis)
- Textura de pele com leve bump — não lisa e brilhante
- Iluminação cinemática com sombras suaves e rim light colorido

**Proibido nos prompts:**
- `Pixar style` — gera personagens arredondados/infantis (errado)
- `Disney style` — idem
- `rounded friendly features` — errado
- `smooth skin` — errado
- `chibi` — errado
- Qualquer termo que remeta a infantilização

**Fórmula de estilo correta:**
```
3D stylized adult cartoon, elongated proportions, expressive exaggerated features,
high-fidelity render, cinematic warm lighting, soft shadows, subtle rim light,
depth of field. Style: adult animated series. NOT Pixar, NOT Disney rounded.
```

### Personagens canônicos (usar sempre um destes)

**Protagonista principal:**
> Bearded adult man, full dark beard, short brown hair, purple t-shirt, gray denim shorts, white sneakers. Open curious expression.

**Elenco de suporte:**
> Bald adult man, red long-sleeve shirt with number 25, gray pants, blue sneakers.
> Professional woman, short auburn/red bob hair, black blazer, red bow tie, red shoes. Confident posture.
> Young man, platinum blonde hair, green plaid button-up shirt, gray pants, green sneakers.
> Blonde woman with glasses, medium-length hair, casual outfit.

### Ambientes canônicos (usar sempre um destes)
- **Sala de estar:** modern living room, wooden coffee table, sofa, natural window light, warm tones
- **Cozinha:** kitchen with checkerboard tile floor, wooden counter, appliances, warm overhead light
- **Restaurante/café:** brick wall restaurant, round wooden tables, pendant lights, warm evening atmosphere, city window in background
- **Escritório:** open plan office, desk with laptop, natural light, neutral tones
- **Aeroporto:** departure hall, gate signage, travelers in background, cool blue-white lighting

### Paleta de cores da marca
- **Logo gradient:** laranja `#FF6B35` → vermelho `#E8334A` → roxo `#7B4FBF` → verde `#4CAF50`
- **UI gradient (fundo das telas do app):** roxo `#9C6FE4` → rosa `#E87BB0`
- **Acentos:** amarelo dourado `#F5C842`, menta `#7FDDBB`
- ❌ **NÃO usar:** `blue #89c7fe to mint #8bfbd1 to lavender #ae90fb` — paleta errada

---

## Seu trabalho

Receba o **Whisk Brief** gerado pelo `/vivavr-static-campaign` (ou uma direção visual do usuário) e retorne:
1. Instruções de uso no Whisk com as referências certas a usar
2. 3 variações de prompt para testar

---

## Output structure

### INSTRUÇÕES DE USO NO WHISK

1. Acesse whisk.google.com
2. Em **Subject**: [qual personagem canônico usar + onde encontrar a imagem de referência]
3. Em **Scene**: [qual ambiente canônico usar + referência sugerida]
4. Em **Style**: [referência de estética — use screenshots do app do Vivr ou a imagem do restaurante como style ref]
5. Em **Prompt**: cole o texto da variação escolhida
6. Gere 4+ imagens, escolha a melhor
7. Faça download e traga para `/vivavr-canva-assembly`

---

### REFERÊNCIAS RECOMENDADAS

**Subject refs:**
- [personagem canônico escolhido — descrição física exata para o usuário buscar referência]
- Use `Personagens.png` do repositório como referência de sujeito sempre que disponível

**Scene refs:**
- [ambiente canônico escolhido]
- Screenshots das telas do app (`scene.webp`, `230x498bb_1.webp`, `230x498bb_2.webp`) funcionam bem como scene ref

**Style refs:**
- `WhiskImagemExemploQueGostei.png` do repositório é a referência de estilo ideal — iluminação cinemática, qualidade de render, grupo de personagens interagindo
- Alternativamente: qualquer screenshot do app Vivr

---

### VARIAÇÃO 1 — Principal

```
[Prompt completo em inglês.
Usar a fórmula de estilo correta acima.
Especificar: personagem canônico (com descrição física exata) + ação + ambiente canônico + iluminação.
Ser visual e descritivo. Nenhum texto, balão ou legenda na imagem.]
```

---

### VARIAÇÃO 2 — Emocional

```
[Mesma estrutura, foco no estado emocional do personagem.
Especificar a expressão facial e postura corporal que transmitem o sentimento da campanha.
Ex: "eyebrows raised in pleasant surprise, slight smile, relaxed shoulders"]
```

---

### VARIAÇÃO 3 — Ângulo/Composição diferente

```
[Mesma estrutura, câmera ou composição distinta das variações 1 e 2.
Opções: close-up no rosto / plano aberto mostrando o ambiente / POV shot /
over-the-shoulder / low angle looking up / bird's eye]
```

---

## Template de prompt Whisk para Vivr

Use este template, substituindo os campos em MAIÚSCULAS:

```
3D stylized adult cartoon character, elongated proportions, expressive exaggerated features,
high-fidelity 3D render. PERSONAGEM_DESCRIÇÃO_FÍSICA. AÇÃO_ESPECÍFICA.
AMBIENTE_CANÔNICO. Cinematic warm lighting, soft shadows, subtle colored rim light,
depth of field, background slightly blurred.
Style: adult animated series, elongated cartoon proportions.
NOT Pixar, NOT Disney rounded, NOT smooth faces, NOT childish proportions.
No speech bubbles, no dialog balloons, no text, no written words anywhere in the image.
ÂNGULO_DE_CÂMERA. ESTADO_EMOCIONAL do personagem.
```

### Exemplo preenchido (protagonista no restaurante):
```
3D stylized adult cartoon character, elongated proportions, expressive exaggerated features,
high-fidelity 3D render. Adult man with full dark beard, short brown hair, purple t-shirt,
gray denim shorts. Sitting at a round wooden table, leaning forward engaged in conversation,
mouth slightly open mid-sentence, gesturing with one hand.
Brick wall restaurant, pendant warm lights overhead, city view through large window,
evening atmosphere, other patrons blurred in background.
Cinematic warm lighting, soft shadows, subtle orange rim light, depth of field.
Style: adult animated series, elongated proportions. NOT Pixar, NOT Disney rounded.
No speech bubbles, no text anywhere. Medium shot, slightly low angle.
Expression: confident and animated, enjoying the conversation.
```

---

## Regra de variação

Cada campanha deve usar combinação única de:

| Dimensão | Opções |
|---|---|
| Personagem | Barbudo roxo / Careca vermelho / Profissional ruiva / Loiro xadrez |
| Cenário | Sala / Cozinha / Restaurante / Escritório / Aeroporto |
| Ângulo | Close / Médio / Aberto / POV / Over-shoulder / Low angle |
| Emoção | Surpresa / Confiante / Aliviado / Divertido / Focado / Orgulhoso |

Nunca repita a mesma combinação de personagem + cenário da campanha anterior.

---

## Após a geração

Quando o usuário trouxer a imagem escolhida, passe para `/vivavr-canva-assembly` com:
- URL ou asset da hero image gerada
- Headline (P1, P2, P3) do brief
- Support copy
- CTA
- Registro da combinação usada: `personagem / cenário / ângulo / emoção`