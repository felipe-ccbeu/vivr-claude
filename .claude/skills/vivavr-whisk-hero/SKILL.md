---
name: vivavr-whisk-hero
description: Gera prompts estruturados para criação de hero images no Whisk (whisk.google.com) a partir do brief visual da campanha VivaVr
---

Read `.agents/vivavr-context.md` before starting.

## O que é o Whisk

Whisk (whisk.google.com) é uma ferramenta do Google que gera imagens a partir de:
- **Subject image(s):** foto(s) de referência do sujeito principal
- **Scene image(s):** foto(s) de referência do ambiente/cenário
- **Style image(s):** foto(s) de referência da estética visual
- **Text prompt:** descrição textual que complementa as referências

Whisk não tem API — o usuário usa a interface web. Sua função é gerar instruções detalhadas para que o usuário execute no Whisk e traga de volta a imagem gerada.

## Seu trabalho

Receba o **Whisk Brief** gerado pelo `/vivavr-static-campaign` (ou uma direção visual do usuário) e retorne instruções completas e 3 variações de prompt para o usuário testar no Whisk.

---

## Output structure

### INSTRUÇÕES DE USO NO WHISK

Explique ao usuário como usar:
1. Acesse whisk.google.com
2. Em **Subject**: [o que buscar ou usar como referência de imagem]
3. Em **Scene**: [o que buscar ou usar como referência de ambiente]
4. Em **Style**: [o que buscar ou usar como referência de estética]
5. Em **Prompt**: cole o texto da variação escolhida
6. Gere 4+ imagens e escolhe a melhor
7. Faça download e traga a URL ou o arquivo para `/vivavr-canva-assembly`

---

### REFERÊNCIAS SUGERIDAS

**Subject refs** (descreva imagens para buscar ou usar):
- [descrição da imagem de referência do personagem/sujeito]
- [alternativa]

**Scene refs** (ambiente/cenário):
- [descrição da cena de referência]
- [alternativa]

**Style refs** (estética visual):
- [descreva a estética — ex: Pixar 3D render, warm lighting, gradient background]
- Nota: o estilo VivaVr é sempre 3D rounded cartoon, friendly adult characters, brand gradient (#26b6cd → #80cb5e → #8378b6 → #fd8c61)

---

### VARIAÇÃO 1 — Principal

```
[Prompt completo em inglês para colar no Whisk.
Inclua: sujeito, ambiente, ação, iluminação, estética, elementos de marca.
Seja específico. Whisk performa melhor com prompts descritivos e visuais.]
```

---

### VARIAÇÃO 2 — Emocional

```
[Variação com foco no momento emocional — expressão do personagem,
conexão humana, sensação de conquista ou confiança]
```

---

### VARIAÇÃO 3 — Provocativa / Dinâmica

```
[Variação mais energética, ângulo diferente, composição mais ousada
ou elemento de surpresa visual]
```

---

## Padrão de prompt Whisk para VivaVr

Todo prompt deve incluir:
- `3D animated cartoon character, Pixar/Disney style, rounded friendly features`
- `adult, diverse` (nunca childish ou infantil)
- Ambiente real: `café`, `kitchen`, `living room`, `hotel lobby`, `airport`
- `brand gradient background: cyan #26b6cd to green #80cb5e to purple #8378b6 to orange #fd8c61`
- `speech bubble with English dialogue`
- `clean, airy layout, white rounded frame`
- `game-like energy, premium, immersive`
- Evitar: `stock photo`, `flat design`, `pixel art`, `childish`, `generic`

## Após a geração

Quando o usuário trouxer a imagem escolhida, passe para `/vivavr-canva-assembly` com:
- URL ou asset da hero image
- Headline (P1, P2, P3)
- Support copy
- CTA