---
name: vivavr-whisk-avatar
description: Gera uma imagem de personagem do Vivr usando o Whisk e salva em outputs/avatar-images/. Use quando o usuário quiser gerar uma imagem de personagem para criar um avatar no HeyGen.
---

# Vivr Whisk Avatar Generator

Gera a imagem do personagem no Whisk e salva em `outputs/avatar-images/`.
Funciona igual ao pipeline das campanhas estáticas — executa direto, sem interação manual.

## O que fazer quando esta skill for chamada

1. **Identificar o personagem** — se não especificado, perguntar qual:
   - `protagonist` — homem, barba escura, camiseta roxa, fundo branco (padrão)
   - `woman` — mulher profissional, blazer preto, bob ruivo, fundo branco
   - `bald` — homem careca, camiseta vermelha nº25, fundo branco
   - `blonde` — jovem loiro, camisa xadrez verde, fundo branco
   - `woman-meeting` — mulher profissional em reunião online, home office
   - `protagonist-airport` — protagonista no aeroporto

2. **Executar o script** com o personagem escolhido

3. **Ler e exibir a imagem gerada** com o Read tool

4. **Informar o caminho** e próximos passos para o HeyGen

---

## Como executar

```bash
# Protagonista (fundo branco, corpo inteiro)
PATH="/c/Users/felipe.fadel/tools/node/node-v24.14.0-win-x64:$PATH" npx ts-node src/generate-avatar-image.ts --character protagonist

# Mulher profissional (fundo branco, corpo inteiro)
PATH="/c/Users/felipe.fadel/tools/node/node-v24.14.0-win-x64:$PATH" npx ts-node src/generate-avatar-image.ts --character woman

# Mulher em reunião online
PATH="/c/Users/felipe.fadel/tools/node/node-v24.14.0-win-x64:$PATH" npx ts-node src/generate-avatar-image.ts --character woman-meeting

# Protagonista no aeroporto
PATH="/c/Users/felipe.fadel/tools/node/node-v24.14.0-win-x64:$PATH" npx ts-node src/generate-avatar-image.ts --character protagonist-airport

# Prompt customizado
PATH="/c/Users/felipe.fadel/tools/node/node-v24.14.0-win-x64:$PATH" npx ts-node src/generate-avatar-image.ts --character woman --prompt "seu prompt aqui"
```

---

## Após gerar

1. Ler e exibir a imagem com o Read tool
2. Informar o caminho exato: `outputs/avatar-images/{character}-{timestamp}.png`
3. Instruir o usuário:
   - Acesse app.heygen.com e crie o avatar com esta imagem
   - Me mande o `avatar_id` para usar em `/vivavr-heygen-video`

---

## Personagens disponíveis

| Character | Descrição |
|-----------|-----------|
| `protagonist` | Homem, barba escura, camiseta roxa, shorts cinza, fundo branco |
| `woman` | Mulher, blazer preto, bob ruivo, gravata vermelha, fundo branco |
| `bald` | Homem careca, camiseta vermelha nº25, fundo branco |
| `blonde` | Jovem loiro, camisa xadrez verde, fundo branco |
| `woman-meeting` | Mulher em home office, reunião online, laptop, iluminação cinemática |
| `protagonist-airport` | Protagonista no aeroporto, mala, sinalização de gate |

Regras visuais — nunca violar:
- ❌ Nunca Pixar, Disney, chibi, smooth skin
- ✅ Sempre elongated adult proportions, matte skin texture
- ✅ Fundo branco para avatares simples (protagonist, woman, bald, blonde)
- ✅ Cena ambiente para variantes situacionais (meeting, airport)