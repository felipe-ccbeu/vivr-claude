# vivavr-claude

Sistema de geração automática de criativos de Instagram para o [Vivr](https://vivr.app) — app de inglês com cenas 3D imersivas.

Combina geração de imagens com IA (Google Whisk), renderização HTML com 12 templates, e pesquisa de mercado para produzir até 36 criativos prontos por campanha em ~5 minutos.

---

## Pipeline completo

```
/vivavr-static-campaign --all (skill)
  ↓ gera brief estratégico + brief-input.json + content-feed.json (V2)
  ↓
npx ts-node src/run.ts
  ↓ chama Whisk API → scene.png em outputs/campaigns/{id}/
  ↓ renderiza 3 variantes V1 (split padrão)
  ↓
npx ts-node src/run-render.ts outputs/campaigns/{id}/content-feed-v2.json
  ↓ renderiza N itens (3 copies × N templates = até 36 PNGs)
  ↓ exporta PNGs via Playwright (viewport correto por template)
```

---

## Comandos do dia a dia

```bash
# Pipeline completo (Whisk + 3 variantes V1)
PATH="/c/Users/felipe.fadel/tools/node/node-v24.14.0-win-x64:$PATH" npx ts-node src/run.ts

# Re-render multi-template sem gerar imagem novamente
PATH="/c/Users/felipe.fadel/tools/node/node-v24.14.0-win-x64:$PATH" npx ts-node src/run-render.ts outputs/campaigns/{id}/content-feed-v2.json

# Screenshot de um HTML local editado
npm run shot -- outputs/campaigns/{id}/post-p1-split.html

# Watch: re-screenshot automático ao salvar .html
npm run watch:shots
```

---

## Flags de templates

```bash
/vivavr-static-campaign --all            # todos os 12 templates × 3 copies = 36 PNGs
/vivavr-static-campaign --split          # apenas split (padrão)
/vivavr-static-campaign --phone-screen   # phone-float + phone-tilt
/vivavr-static-campaign --split --frame  # cumulativo
```

| Flag | Templates incluídos |
|---|---|
| `--split` | `split` |
| `--overlay` | `overlay` |
| `--frame` | `frame` |
| `--phone-screen` | `phone-float`, `phone-tilt` |
| `--story` | `story` |
| `--light-arc` | `light-arc` |
| `--cinematic` | `cinematic` |
| `--quote` | `quote` |
| `--bold-text` | `bold-text` |
| `--split-reverse` | `split-reverse` |
| `--immersive` | `immersive` |
| `--all` | todos os 12 |

---

## Scripts npm

| Comando | O que faz |
|---|---|
| `npm run generate:run` | Roda o pipeline completo a partir do `brief-input.json` |
| `npm run shot -- <arquivo.html>` | Tira screenshot de um HTML local → salva `.png` no mesmo lugar |
| `npm run watch:shots` | Monitora `outputs/**/*.html` e re-renderiza automaticamente ao salvar |

---

## Estrutura de arquivos

```
outputs/
├── campaigns/               ← uma pasta por campanha
│   └── 013-aeroporto-ouvido/
│       ├── brief.json              ← brief estratégico (V1 pipeline)
│       ├── brief-input.json        ← brief completo com Whisk prompt
│       ├── scene.png               ← imagem gerada pelo Whisk
│       ├── content-feed-v2.json    ← feed multi-template (36 itens)
│       ├── post-copy-1/2/3.png     ← variantes V1 (split padrão)
│       ├── post-p1-split.html/png  ← variantes V2 por template
│       ├── post-p2-overlay.html/png
│       └── ...                     ← até 36 PNGs
├── context/
│   └── vivr-campaign-context.md    ← contexto consolidado para briefs
└── research/
    ├── analise-voz-concorrentes.md
    ├── icp-persona-vivr.md
    ├── reviews-concorrentes.md
    └── duolingo-br-ads.json

src/
├── content-schema.ts         # Tipos ContentJSON (V1), ContentFeedV2, ContentFeedItem
├── templateGroups.ts         # Mapa de flags → lista de templateIds
├── generate.ts               # Orquestrador V1 (Whisk + render 3 copies)
├── run.ts                    # Entry point (lê brief-input.json)
├── run-render.ts             # Re-render V1 e V2 sem chamar Whisk
├── renderer.ts               # renderFromContent (V1) + renderFromContentV2 (V2)
├── screenshot.ts             # exportPNG via Playwright (viewport = tamanho do template)
├── whisk-client.ts           # Wrapper da API do Whisk
├── styles.ts                 # StyleConfig, getStyleConfig, variações dark/light
└── templates/
    ├── shared.ts             # BRAND_GRADIENT, BADGE_GRADIENT, FONT_LINK, helpers
    ├── split.ts              # Imagem topo (370px) + painel escuro (305px) ← padrão
    ├── split-reverse.ts      # Layout horizontal: imagem esquerda (240px), texto direita
    ├── overlay.ts            # Imagem full-bleed + overlay gradiente
    ├── frame.ts              # Fundo escuro + imagem em moldura com borda gradiente
    ├── phone-float.ts        # Celular centralizado com cards flutuando
    ├── phone-tilt.ts         # Copy esquerda, celular inclinado direita
    ├── story.ts              # 540×960px, safe zones 120px topo / 180px base
    ├── light-arc.ts          # Fundo branco, arco SVG, estética clean/premium
    ├── cinematic.ts          # Full-bleed, overlay ultra-suave, letterbox
    ├── quote.ts              # Fundo escuro, testimonial, imagem circular
    ├── bold-text.ts          # Zero imagem, headline oversized, fundo badge gradient
    └── immersive.ts          # Full-bleed, vinheta radial, texto centralizado

scripts/
├── screenshot-local-html.js  # Usado pelo npm run shot
├── meta-ad-scraper.mjs       # Scraper Meta Ad Library
└── google-ad-scraper.mjs     # Scraper Google Ads Transparency
```

---

## Design System

Todas as regras estão em `.agents/vivavr-context.md` (fonte de verdade).

| Elemento | Valor |
|---|---|
| Background dark | `#1A1030` (NUNCA preto puro) |
| Background light | `#ffffff` |
| Brand gradient (CTA/accent) | `linear-gradient(135deg, #f7c948 0%, #f97040 20%, #e94899 45%, #9b5de5 65%, #26c6da 83%, #80e27e 100%)` |
| Botão CTA | `border-radius: 100px`, `font-weight: 800`, `padding: 13px 28px` mínimo |
| Overlay start | A partir de 55–60% da altura do frame |
| Story safe zones | 120px topo, 180px base |
| Fonte | Nunito 400/600/700/800/900 |

**Personagens canônicos (3D cartoon adulto, proporções alongadas — NOT Pixar):**
- Protagonista: homem adulto, barba escura, camiseta roxa, shorts jeans cinza, tênis brancos
- Suporte: careca + camiseta vermelha nº25 / profissional ruiva + blazer preto / jovem loiro platinado + camisa xadrez verde / loira com óculos

---

## Formato de conteúdo V2 (multi-template)

```json
{
  "campaignId": "013-aeroporto-ouvido",
  "sceneImage": "scene.png",
  "items": [
    {
      "outputName": "post-p1-split",
      "templateId": "split",
      "copy": { "hook": "...", "headline": "...", "accentWord": "...", "body": "...", "cta": "..." }
    }
  ]
}
```

Convenção de `outputName`: `post-{p1|p2|p3}-{templateId}`

---

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env   # cole o cookie do Whisk
```

**Cookie do Whisk** (expira periodicamente):
1. Acesse [labs.google/fx/tools/whisk](https://labs.google/fx/tools/whisk) logado com Google
2. DevTools → Application → Cookies → `labs.google`
3. Copie os três cookies (`csrf-token`, `callback-url`, `session-token`) e cole no `.env`

---

## Skills disponíveis

| Skill | Função |
|---|---|
| `/vivavr-static-campaign [--flags]` | Gera brief + executa pipeline (Whisk → HTML → PNG) |
| `/vivavr-whisk-hero` | Gera prompts estruturados para o Whisk |
| `/vivavr-canva-assembly` | Monta design no Canva via MCP |
| `/vivavr-heygen-video` | Gera vídeo promocional do Vivr via HeyGen MCP com script emocional completo |
| `/vivavr-heygen-avatar` | Cria avatar no HeyGen a partir de imagem gerada pelo Whisk (Whisk → asset upload → Photo Avatar) |
| `/brand-voice-extractor` | Analisa voz dos concorrentes |
| `/icp-persona-builder` | Constrói ICPs detalhados |
| `/review-scraper` | Raspa reviews negativos (Trustpilot) |

---

## HeyGen — geração de vídeo

A API do HeyGen está conectada via MCP e via API REST direta (chave em `.env`).

### Via MCP (Claude Code)
```bash
/vivavr-heygen-video   # gera vídeo com script da marca, escolhe persona/cena/duração
/vivavr-heygen-avatar  # cria avatar: Whisk → upload → Photo Avatar
```

### Via API REST direta
```bash
# Criar avatar a partir de imagem Whisk
PATH="/c/Users/felipe.fadel/tools/node/node-v24.14.0-win-x64:$PATH" npx ts-node src/create-heygen-avatar.ts \
  --name "Protagonista Vivr" \
  --prompt "3D stylized adult cartoon..." \
  --aspect PORTRAIT
```

### Regras de vídeo HeyGen (críticas)
| Elemento | Valor |
|---|---|
| Brand gradient (6 cores obrigatórias) | `#f7c948 → #f97040 → #e94899 → #9b5de5 → #26c6da → #80e27e` |
| Avatar customizado | ID `4acfe2a00a2f417d806c357f46f59e5a` (cabelo branco, aeroporto) |
| Layout | 3 zonas fixas: logo (0–15%), avatar (15–65%), texto+CTA (65–100%) |
| Legendas | Apenas na zona do avatar — nunca sobre CTA |
| Imperativo PT-BR | "Pratique", "Entre", "Comece" — nunca "Pratica", "Entra" |

---

## Estrutura de arquivos (adições recentes)

```
src/
└── create-heygen-avatar.ts   # Pipeline Whisk → HeyGen asset upload → Photo Avatar

outputs/
└── heygen-avatars/           # JSONs com IDs dos avatares criados
```

---

## Tech stack

- **TypeScript + Node.js** — pipeline principal
- **@rohitaryal/whisk-api** — geração de imagem via Google Whisk
- **HeyGen API** — geração de vídeo e criação de avatares
- **HeyGen MCP** — integração Claude Code ↔ HeyGen
- **Playwright** — captura de tela headless (viewport dinâmico por template)
- **chokidar** — watch de arquivos HTML para re-render automático
- **Claude Code skills** — automação de brief, intel, vídeo e design
