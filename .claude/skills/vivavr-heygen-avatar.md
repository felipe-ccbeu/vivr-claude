---
name: vivavr-heygen-avatar
description: Cria um avatar no HeyGen a partir de uma imagem gerada pelo Whisk. Pipeline completo: Whisk gera a imagem → upload para HeyGen Assets → criação do Photo Avatar → treinamento. Use quando o usuário quiser criar um novo avatar do Vivr no HeyGen.
---

# Vivr HeyGen Avatar Creator

Pipeline completo: **Whisk → imagem local → HeyGen Asset → Photo Avatar → treinamento**

## O que fazer quando esta skill for chamada

1. **Coletar informações** — se não foram passadas, perguntar:
   - Nome do avatar (ex: "Personagem Café", "Protagonista Reunião")
   - Descrição visual do personagem (ou usar o prompt padrão da marca)
   - Qual personagem do roster canônico? (ver abaixo)
   - Orientação da imagem: PORTRAIT (padrão) / SQUARE / LANDSCAPE
   - Treinar automaticamente? (padrão: sim)

2. **Montar o prompt Whisk** com os descritores canônicos da marca

3. **Executar o script** via Bash

4. **Retornar o `photo_avatar_id`** para o usuário usar em vídeos

---

## Roster canônico de personagens Vivr

Usar exatamente estes descritores no prompt — nunca Pixar, Disney, chibi ou fotorrealista.

**Base obrigatória para todos os personagens:**
```
3D stylized adult cartoon character, elongated proportions, expressive face,
slightly prominent nose, large but non-infantile eyes, lean body, thin limbs,
skin texture with subtle bump not smooth or shiny, high-fidelity 3D render,
cinematic warm lighting, soft shadows, subtle rim light,
white background, character centered, full body visible
```

**Protagonista (padrão):**
```
adult man, full dark beard, short brown hair, purple t-shirt,
gray denim shorts, white sneakers, open curious expression
```

**Mulher profissional:**
```
adult professional woman, short auburn red bob hair cut above shoulders,
black blazer, white dress shirt, red bow tie, dark slim trousers,
red pointed-toe shoes, hand on hip, confident upright posture
```

**Homem careca:**
```
bald adult man, red long-sleeve shirt with number 25,
gray pants, blue sneakers, neutral friendly expression
```

**Homem loiro:**
```
young adult man, platinum blonde hair, green plaid button-up shirt,
gray pants, green sneakers, relaxed posture
```

---

## Como executar

```bash
# Personagem padrão (protagonista)
PATH="/c/Users/felipe.fadel/tools/node/node-v24.14.0-win-x64:$PATH" npx ts-node src/create-heygen-avatar.ts \
  --name "Protagonista Vivr" \
  --prompt "3D stylized adult cartoon character, elongated proportions, expressive face, slightly prominent nose, large but non-infantile eyes, lean body, thin limbs, skin texture with subtle bump not smooth or shiny, high-fidelity 3D render, cinematic warm lighting, soft shadows, subtle rim light, white background, character centered, full body visible, adult man, full dark beard, short brown hair, purple t-shirt, gray denim shorts, white sneakers, open curious expression" \
  --aspect PORTRAIT

# Mulher profissional
PATH="/c/Users/felipe.fadel/tools/node/node-v24.14.0-win-x64:$PATH" npx ts-node src/create-heygen-avatar.ts \
  --name "Personagem Profissional" \
  --prompt "3D stylized adult cartoon character, elongated proportions, expressive face, slightly prominent nose, large but non-infantile eyes, lean body, thin limbs, skin texture with subtle bump not smooth or shiny, high-fidelity 3D render, cinematic warm lighting, soft shadows, subtle rim light, white background, character centered, full body visible, adult professional woman, short auburn red bob hair cut above shoulders, black blazer, white dress shirt, red bow tie, dark slim trousers, red pointed-toe shoes, hand on hip, confident upright posture" \
  --aspect PORTRAIT

# Sem treinar (só cria, não treina ainda)
PATH="/c/Users/felipe.fadel/tools/node/node-v24.14.0-win-x64:$PATH" npx ts-node src/create-heygen-avatar.ts \
  --name "Nome" --prompt "..." --no-train
```

---

## Flags disponíveis

| Flag | Padrão | Descrição |
|------|--------|-----------|
| `--name` | "Vivr Avatar" | Nome do avatar no HeyGen |
| `--prompt` | prompt padrão da marca | Descrição visual completa |
| `--aspect` | PORTRAIT | PORTRAIT / SQUARE / LANDSCAPE |
| `--no-train` | false | Pula o treinamento automático |

---

## Output

Após execução bem-sucedida:
- Imagem salva em `outputs/heygen/`
- JSON com IDs salvo em `outputs/heygen/{photo_avatar_id}.json`
- Avatar disponível em https://app.heygen.com/photo-avatar após treinamento (~5-10 min)

O `photo_avatar_id` retornado pode ser usado diretamente no parâmetro `avatarId` da skill `vivavr-heygen-video`.

---

## Regras de estilo — nunca violar

- ❌ Nunca descrever como "Pixar style", "Disney style", "chibi", "smooth skin", "friendly rounded"
- ❌ Nunca usar fundo colorido na imagem — sempre fundo branco ou neutro para o avatar
- ✅ Sempre "elongated adult proportions"
- ✅ Sempre "matte skin texture with subtle bump"
- ✅ Sempre "high-fidelity 3D render, cinematic lighting"