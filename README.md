# vivr-claude

Sistema de geração automática de posts de Instagram para o [Vivr](https://vivr.app) — app de inglês com cenas 3D imersivas.

Combina geração de imagens com IA (Google Whisk), renderização HTML e captura de tela para produzir criativos prontos para publicação em ~5 minutos.

---

## Pipeline

```
/vivavr-static-campaign   →   Brief completo (copy + direção visual)
        ↓
/vivavr-whisk-hero        →   Prompts para geração de imagem no Whisk
        ↓
   [Whisk — manual]       →   Imagem 3D cartoon gerada
        ↓
src/generate.ts           →   Post finalizado (540×675px PNG)
```

---

## Estrutura

```
src/
├── types.ts          # Interface CampaignBrief
├── whisk-client.ts   # Wrapper da API do Whisk (geração de imagem)
├── renderer.ts       # Monta o HTML do post com template aprovado
├── screenshot.ts     # Exporta PNG via Playwright/Chromium headless
├── generate.ts       # Orquestrador — roda o pipeline completo
├── batch.ts          # Processa múltiplas campanhas sequencialmente
├── index.ts          # Exemplo funcional pronto para rodar
└── batch-runner.ts   # Entry point para rodar em batch

.claude/skills/
├── vivavr-static-campaign/   # Gera brief completo de campanha
├── vivavr-whisk-hero/        # Gera prompts para o Whisk
└── vivavr-canva-assembly/    # Monta o design no Canva via MCP
```

---

## Output por campanha

Cada campanha gera 4 arquivos em `outputs/campaigns/{id}/`:

| Arquivo | Conteúdo |
|---|---|
| `brief.json` | Brief completo da campanha |
| `scene.webp` | Imagem de cena gerada pelo Whisk |
| `post.html` | Template HTML renderizado |
| `post.png` | Post final 540×675px pronto para publicar |

---

## Setup

**1. Instale as dependências:**
```bash
npm install
npx playwright install chromium
```

**2. Configure o `.env`:**
```bash
cp .env.example .env
# Edite o .env e cole seu cookie do Google/Whisk
```

**Como obter o cookie do Whisk:**
1. Acesse [labs.google/fx/tools/whisk](https://labs.google/fx/tools/whisk) logado na sua conta Google
2. Instale a extensão [Cookie Editor](https://github.com/Moustachauve/cookie-editor)
3. Clique em Export → Header String
4. Cole o valor no `.env` como `COOKIE=...`

---

## Como usar

**Gerar uma campanha:**
```bash
npm run generate
```

**Rodar em batch (múltiplas campanhas):**
```bash
npm run generate:batch
```

---

## Exemplo de brief

```typescript
const brief: CampaignBrief = {
  id: '001-restaurant',
  audience: 'Adultos 22-35 que travam ao falar inglês',
  pain: 'Fiz mil lições mas trava na hora H',
  angle: 'O problema não é você, é que nunca praticou em situação real',
  copy: {
    hook: 'Você já fez tanta lição e ainda trava na hora H?',
    headline: 'Inglês que funciona fora do app.',
    accentWord: 'funciona',
    body: 'No Vivr, você pratica dentro de cenas reais — café, viagem, trabalho.',
    cta: 'Entra no Vivr',
  },
  visual: {
    whiskPrompt: 'A confident adult 3D cartoon character...',
    scene: 'modern café interior, warm lighting',
    mood: 'confident, light, immersive',
  },
}
```

---

## Skills Claude Code

Este projeto inclui skills para o [Claude Code](https://claude.ai/code) que automatizam a criação de campanhas dentro do VS Code:

| Skill | Função |
|---|---|
| `/vivavr-static-campaign` | Gera brief completo com copy, direção visual e prompts |
| `/vivavr-whisk-hero` | Transforma o brief em prompts prontos para o Whisk |
| `/vivavr-canva-assembly` | Monta o design no Canva via MCP com 3 variações |

---

## Tech stack

- **TypeScript + Node.js** — pipeline principal
- **@rohitaryal/whisk-api** — geração de imagem via Google Whisk
- **Playwright** — captura de tela headless
- **Claude Code + MCP Canva** — automação de design
- **Google Fonts (Nunito)** — tipografia do template