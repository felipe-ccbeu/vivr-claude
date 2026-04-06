---
name: vivavr-whisk-avatar
description: Gera uma imagem de personagem do Vivr usando o Whisk para uso como avatar no HeyGen. Executa o pipeline Whisk com os descritores canônicos da marca e exibe a imagem gerada. Use quando o usuário quiser gerar a imagem de um personagem para criar um avatar no HeyGen manualmente.
---

# Vivr Whisk Avatar Generator

Gera a imagem do personagem no Whisk com os descritores canônicos da marca Vivr.
O resultado é uma imagem PNG pronta para upload no HeyGen como avatar.

## O que fazer quando esta skill for chamada

1. **Identificar o personagem** — se não especificado, perguntar qual:
   - `protagonist` — homem, barba escura, camiseta roxa (padrão)
   - `woman` — mulher profissional, blazer preto, bob ruivo
   - `bald` — homem careca, camiseta vermelha nº25
   - `blonde` — jovem loiro, camisa xadrez verde

2. **Executar o script** com o personagem escolhido

3. **Ler e exibir a imagem gerada** para o usuário ver o resultado

4. **Informar o caminho do arquivo** para uso no HeyGen

---

## Como executar

```bash
# Protagonista (padrão)
PATH="/c/Users/felipe.fadel/tools/node/node-v24.14.0-win-x64:$PATH" npx ts-node src/create-heygen-avatar.ts --name "Protagonista Vivr" --character protagonist --skip-upload

# Mulher profissional
PATH="/c/Users/felipe.fadel/tools/node/node-v24.14.0-win-x64:$PATH" npx ts-node src/create-heygen-avatar.ts --name "Personagem Profissional" --character woman --skip-upload

# Homem careca
PATH="/c/Users/felipe.fadel/tools/node/node-v24.14.0-win-x64:$PATH" npx ts-node src/create-heygen-avatar.ts --name "Personagem Suporte" --character bald --skip-upload

# Jovem loiro
PATH="/c/Users/felipe.fadel/tools/node/node-v24.14.0-win-x64:$PATH" npx ts-node src/create-heygen-avatar.ts --name "Personagem Loiro" --character blonde --skip-upload
```

## Após gerar a imagem

1. Exibir a imagem gerada com o Read tool
2. Informar o caminho exato do arquivo PNG
3. Instruir o usuário:
   - Acesse [app.heygen.com](https://app.heygen.com)
   - Crie o avatar com a imagem gerada
   - Me mande o `avatar_id` para gerar vídeos com `/vivavr-heygen-video`

## Personagens canônicos — prompts usados

Todos usam esta base:
```
3D stylized adult cartoon character, elongated proportions, expressive face,
slightly prominent nose, large but non-infantile eyes, lean body, thin limbs,
skin texture with subtle bump not smooth or shiny, high-fidelity 3D render,
cinematic warm lighting, soft shadows, subtle rim light,
white background, character centered, full body visible
```

Nunca: Pixar, Disney, chibi, smooth skin, fotorrealista.