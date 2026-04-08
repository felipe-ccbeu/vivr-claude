# Vivr Marketing System

Sistema de geração de assets de marketing para o [Vivr](https://viva-vr.com) — app de aprendizado de inglês via AR + game-based mechanics.

Combina geração de imagens com IA (Google Whisk), renderização HTML com 15 templates, vídeos HeyGen com avatares por personagem e cena, e pesquisa de mercado para produzir criativos prontos para veiculação.

---

## Estrutura do projeto

```
vivavr-claude/
│
├── .agents/
│   └── vivavr-context.md           ← fonte de verdade: produto, paleta, personagens
│
├── .claude/
│   └── skills/                     ← skills invocáveis pelo Claude
│       ├── heygen-ad-video/        ← geração de vídeo HeyGen (SKILL.md + templates)
│       ├── vivavr-static-campaign/ ← pipeline completo de campanha estática
│       ├── vivavr-whisk-hero/      ← geração de hero image via Whisk
│       └── ...
│
├── assets/
│   └── refs/                       ← imagens de referência (subject, style, scene)
│
├── briefs/                         ← briefs de campanha (JSON estruturado)
│   ├── restaurant-confidence.json
│   ├── airport-checkin.json
│   ├── brief-input.json            ← brief ativo para pipeline estático
│   └── content-feed.json           ← feed V2 multi-template (pipeline estático)
│
├── outputs/
│   ├── campaigns/
│   │   ├── static/                 ← campanhas estáticas geradas (011- a 016-)
│   │   └── avatar-images/          ← imagens Whisk de avatar por personagem/cena
│   ├── heygen/
│   │   ├── avatar-registry.json    ← todos os personagens e avatarLookIds
│   │   └── video-registry.json     ← histórico completo de vídeos gerados
│   ├── reports/                    ← relatórios de batch (YYYY-MM-DD-batch.md)
│   ├── research/                   ← pesquisa de mercado e concorrentes
│   └── context/                    ← contexto de campanha e ICP
│
├── scripts/
│   ├── generate-video.ts           ← orquestra geração HeyGen a partir de brief
│   ├── poll-videos.ts              ← atualiza status dos vídeos no registry
│   ├── export-report.ts            ← gera relatório MD dos vídeos prontos
│   ├── screenshot-local-html.js    ← screenshot de HTML local via Puppeteer
│   ├── meta-ad-scraper.mjs         ← scraper Meta Ad Library
│   └── google-ad-scraper.mjs       ← scraper Google Ads Transparency
│
└── src/                            ← pipeline de campanhas estáticas
    ├── run.ts                      ← entry point (lê briefs/brief-input.json)
    ├── run-render.ts               ← renderiza a partir de content-feed.json
    ├── generate.ts                 ← orquestra Whisk + render
    ├── whisk-client.ts             ← cliente Whisk API
    ├── renderer.ts                 ← renderizador HTML → PNG
    ├── screenshot.ts               ← captura via Puppeteer
    ├── batch-render.ts             ← batch de variantes
    ├── templates/                  ← templates de post (split, overlay, frame, etc.)
    ├── styles/                     ← estilos visuais (dark-bold, editorial, etc.)
    └── template-copy-constraints.ts← limites de copy por slot
```

---

## Pipelines disponíveis

### 1. Campanha estática (Whisk → HTML → PNG)

```bash
# Renderizar a partir de content-feed.json
PATH="/c/Users/felipe.fadel/tools/node/node-v24.14.0-win-x64:$PATH" \
  npx ts-node src/run-render.ts outputs/campaigns/static/{id}/content-feed.json

# Screenshot de um post
node scripts/screenshot-local-html.js outputs/campaigns/static/{id}/feed/post-p1-split.html
```

### 2. Vídeo HeyGen

```bash
# Gerar vídeo a partir de um brief
npx ts-node scripts/generate-video.ts --brief airport-checkin --character black-woman

# Gerar para todos os personagens do brief
npx ts-node scripts/generate-video.ts --brief restaurant-confidence --all-characters

# Checar status dos vídeos processando
npx ts-node scripts/poll-videos.ts

# Gerar relatório do dia
npx ts-node scripts/export-report.ts
```

---

## Personagens HeyGen registrados

| ID | Label | Cenas disponíveis |
|---|---|---|
| `old-man` | Vivr - Old Man | restaurant, cafe, meeting, airport, tourist-map, bar... |
| `white-bald` | Vivr - White Bald | airport, interview, cafe, meeting, restaurant, bar... |
| `white-hair` | Vivr - White Hair | cafe, meeting, interview, restaurant, airport, tourist-map... |
| `black-woman` | Vivr - Black Woman | airport, cafe, meeting, restaurant, bar, interview... |
| `black-man` | Vivr - Black Man | tourist-map, tourist-pointing, bar, airport, cafe, interview, meeting |
| `woman-red-head` | Vivr - Woman Red Head | airport, tourist-map, restaurant, meeting, cafe, interview... |

Ver lista completa em [outputs/heygen/avatar-registry.json](outputs/heygen/avatar-registry.json).

---

## Briefs de cena

| Arquivo | Cena | Personagens alvo |
|---|---|---|
| `restaurant-confidence.json` | Pedindo no restaurante | old-man, white-hair, woman-red-head |
| `airport-checkin.json` | Navegando no aeroporto | black-woman, white-bald, woman-red-head |

---

## Fontes de verdade

| Arquivo | Conteúdo |
|---|---|
| `.agents/vivavr-context.md` | Produto, paleta, personagens canônicos, regras de design |
| `outputs/context/vivr-campaign-context.md` | ICP, dores reais, território livre, tom proibido |
| `outputs/heygen/avatar-registry.json` | Todos os avatarLookIds por personagem e cena |
| `outputs/heygen/video-registry.json` | Histórico completo de vídeos gerados |
