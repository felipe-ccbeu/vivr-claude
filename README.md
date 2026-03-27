# vivavr-claude

Sistema de geração automática de criativos de Instagram para o [Vivr](https://vivr.app) — app de inglês com cenas 3D imersivas.

Combina geração de imagens com IA (Google Whisk), renderização HTML com múltiplos templates, re-render do Replit e pesquisa de mercado para produzir criativos prontos em ~5 minutos.

---

## Pipeline completo

```
/vivavr-static-campaign (skill)
  ↓ gera brief estratégico + monta brief-input.json + content-feed.json
  ↓
[Manual 1] Gerar imagem Whisk
  $ npx ts-node src/run.ts
  ↓ chama Whisk API → scene.webp em outputs/campaigns/{id}/
  ↓
[Manual 2] Renderizar e exportar
  $ npx ts-node src/run-render.ts content-feed.json
  ↓ renderiza 3 copies HTML (split/overlay/frame/phone)
  ↓ exporta post-copy-1/2/3.png via Playwright
  ↓
[Opcional] Editar HTML no VS Code
  ↓ salva post-copy-1.html
  ↓
[Manual 3] Re-render após edição
  $ npm run shot -- outputs/campaigns/{id}/post-copy-1.html
```

---

## Comandos do dia a dia

```bash
# 1. Gerar imagem via Whisk (precisa de .env com API key)
PATH="/c/Users/felipe.fadel/tools/node/node-v24.14.0-win-x64:$PATH" npx ts-node src/run.ts

# 2. Re-renderizar HTMLs e screenshots (usa scene.webp existente)
PATH="/c/Users/felipe.fadel/tools/node/node-v24.14.0-win-x64:$PATH" npx ts-node src/run-render.ts content-feed.json

# Screenshot de um HTML local editado no VS Code
npm run shot -- outputs/campaigns/009-cafe-pedir-info/post-copy-1.html

# Watch: re-screenshot automático sempre que salvar um .html
npm run watch:shots
```

---

## Scripts npm

| Comando | O que faz |
|---|---|
| `npm run generate:run` | Roda o pipeline completo a partir do `brief-input.json` |
| `npm run generate:batch` | Processa múltiplas campanhas em sequência |
| `npm run shot -- <arquivo.html>` | Tira screenshot de um HTML local → salva `.png` no mesmo lugar |
| `npm run watch:shots` | Monitora `outputs/**/*.html` e re-renderiza automaticamente ao salvar |

---

## Estrutura de arquivos

```
outputs/
├── campaigns/               ← uma pasta por campanha
│   └── 007-metodo-vs-situacao/
│       ├── brief.json           ← brief estruturado da campanha
│       ├── scene.png            ← imagem gerada pelo Whisk
│       ├── post-copy-1.html/png ← variante P1 (headline principal)
│       ├── post-copy-2.html/png ← variante P2 (emocional)
│       ├── post-copy-3.html/png ← variante P3 (provocativa)
│       └── post-edited-copy-*.html/png ← versões após edição no Replit
├── context/
│   ├── vivr-campaign-context.md          ← contexto consolidado para briefs
│   └── vivr-campaign-context-TEMPLATE.md ← template para atualização
└── research/
    ├── analise-voz-concorrentes.md  ← brand voice: Duolingo, Open English, Preply
    ├── icp-persona-vivr.md          ← ICPs: Lucas (profissional) e Camila (viajante)
    ├── reviews-concorrentes.md      ← reviews negativos Trustpilot (dores reais)
    └── duolingo-br-ads.json         ← ads scrapeados do Meta Ad Library

src/
├── types.ts                  # Interface CampaignBrief
├── generate.ts               # Orquestrador principal do pipeline
├── run.ts                    # Entry point (lê brief-input.json)
├── whisk-client.ts           # Wrapper da API do Whisk
├── renderer.ts               # Monta HTML usando template do brief
├── screenshot.ts             # Exporta PNG via Playwright headless
├── replit-sync.ts            # Upload/download do editor visual Replit
├── rerender-from-edited.ts   # Re-render a partir do HTML editado no Replit
├── batch-runner.ts           # Processa múltiplos briefs em sequência
└── templates/
    ├── shared.ts             # BRAND_GRADIENT, FONT_LINK, highlightAccentWord
    ├── split.ts              # Imagem topo (370px) + painel texto (305px) ← padrão atual
    ├── overlay.ts            # Imagem full-bleed com overlay escuro
    ├── frame.ts              # Fundo escuro + imagem em moldura centralizada
    ├── phone-float.ts        # Celular centralizado com cards flutuando
    └── phone-tilt.ts         # Layout assimétrico: copy esquerda, celular inclinado

scripts/
├── screenshot-local-html.js  # Usado pelo npm run shot
├── meta-ad-scraper.mjs       # Scraper Meta Ad Library
└── google-ad-scraper.mjs     # Scraper Google Ads Transparency
```

---

## HTML do post — onde editar

Cada `post-copy-N.html` tem a seguinte anatomia:

```
540×675px
├── .img-section (370px)
│   ├── <img>  ← imagem base64 embutida
│   │          → object-position: center 65%  (ajusta o enquadramento do personagem)
│   ├── .img-vignette  ← gradiente de transição imagem→painel
│   ├── .hook-tag      ← data-slot="hook"  (tag no topo esquerdo)
│   └── .badge-free    ← badge "Grátis" no topo direito
└── .text-section (305px)
    ├── .headline  ← data-slot="headline"  (texto principal)
    │   └── .accent  ← palavra em gradiente de marca
    ├── .body-copy ← data-slot="body"
    └── .cta-btn   ← data-slot="cta"
```

**Para ajustar posição do personagem** — mude `object-position` em `.img-section img`:
- `center top` → ancora no topo, corta o rodapé
- `center 65%` → mostra mais do centro/baixo ← padrão atual
- `center bottom` → ancora no rodapé, corta o topo

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

## Skills de intel de mercado

Rode antes de criar uma nova campanha para manter o contexto atualizado:

| Skill | Função | Output |
|---|---|---|
| `/brand-voice-extractor` | Analisa voz dos concorrentes | `outputs/research/analise-voz-concorrentes.md` |
| `/icp-persona-builder` | Constrói ICPs detalhados | `outputs/research/icp-persona-vivr.md` |
| `/review-scraper` | Raspa reviews negativos (Trustpilot) | `outputs/research/reviews-concorrentes.md` |
| `/meta-ad-scraper` | Scrapa ads do Meta Ad Library | `outputs/research/duolingo-br-ads.json` |

Após rodar as três primeiras, consolide com:
> *"Com base nos três arquivos de research, atualize `outputs/context/vivr-campaign-context.md` seguindo o template"*

---

## Skills de criação

| Skill | Função |
|---|---|
| `/vivavr-static-campaign` | Gera brief completo + executa pipeline (Whisk → HTML → PNG) |
| `/vivavr-whisk-hero` | Gera prompts estruturados para o Whisk |
| `/vivavr-canva-assembly` | Monta design no Canva via MCP com 3 variações |
| `/ui-ux-pro-max` | Design system, paletas, tipografia — melhora templates HTML |

---

## Paleta e identidade visual

| Elemento | Valor |
|---|---|
| Logo gradient | `#FF6B35 → #E8334A → #7B4FBF → #4CAF50` |
| Brand gradient (CSS) | `linear-gradient(135deg, #f7c948, #f97040, #e94899, #9b5de5, #26c6da, #80e27e)` |
| App UI gradient | `#9C6FE4 → #E87BB0` |
| Fundo OLED | `#0d0d0d` |
| Fonte | Nunito 400/600/700/800/900 |

**Personagem canônico:** homem adulto, barba escura, camiseta roxa, shorts jeans cinza, tênis brancos — estilo 3D cartoon adulto de proporções alongadas (NOT Pixar rounded).

---

## Tech stack

- **TypeScript + Node.js** — pipeline principal
- **@rohitaryal/whisk-api** — geração de imagem via Google Whisk
- **Playwright** — captura de tela headless (540×675px)
- **chokidar** — watch de arquivos HTML para re-render automático
- **Claude Code skills** — automação de brief, intel e design