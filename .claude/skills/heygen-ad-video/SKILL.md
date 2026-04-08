# Skill: heygen-ad-video

Gera vídeos de anúncio HeyGen para o Vivr com avatar, roteiro e layout de marca.

## Quando usar

Use esta skill quando o usuário pedir para gerar um vídeo HeyGen para o Vivr com um personagem específico ou em lote.

## Antes de gerar

1. Ler `outputs/heygen/avatar-registry.json` → lista de personagens e looks disponíveis
2. Ler `outputs/heygen/video-registry.json` → histórico de vídeos já gerados (evitar duplicatas)
3. Ler o brief da cena em `briefs/<brief-id>.json` se existir
4. Aplicar as regras de copy de `.claude/skills/heygen-ad-video/copy-constraints.ts`

## Estrutura do roteiro (10 segundos)

```
Hook   (3s) — pergunta ou afirmação de identificação. Máx 10 palavras.
Body   (5s) — benefício concreto ligando produto à dor. Máx 15 palavras.
CTA    (2s) — imperativo afirmativo. Máx 4 palavras.
```

**Total narrado: máx 30 palavras.**

## Regras obrigatórias de copy

- Imperativo afirmativo: "Pratique", "Entre", "Comece" — NUNCA "Pratica", "Entra", "Começa"
- Preposição correta: "Pratique NO aeroporto" — não "Pratique O aeroporto"
- Sem adjetivos genéricos: "melhor app", "aprenda rápido", "de forma fácil"
- Conectar sempre à situação real da cena do avatar

## Prompt HeyGen — estrutura obrigatória

```
Create a <N>-second portrait video for the Vivr language learning app.

AVATAR: Use avatar look ID: <avatarLookId> (<characterLabel> — <sceneLabel>). Keep the original avatar background.

SCENE: <sceneMood>.

SCRIPT (narration in Brazilian Portuguese, imperative form):
"<hook> <body> <cta>."

LAYOUT — 3 fixed zones:
- Zone A (0–15%): vivr logo watermark top-left
- Zone B (15–65%): avatar/scene, subtitles/captions ONLY here — NEVER below this zone
- Zone C (65–100%): dark overlay + headline "<headline>" + CTA button "<cta>"

BRAND GRADIENT (all 6 colors must be visible, do NOT simplify):
linear-gradient(135deg, #f7c948 0%, #f97040 20%, #e94899 45%, #9b5de5 65%, #26c6da 83%, #80e27e 100%)
Colors: yellow-gold, orange, hot pink, purple, cyan, mint green — ALL 6 must appear.

STYLE: Dark background #1A1030, white text, pill-shaped CTA button (border-radius: 100px), Nunito font.
IMPORTANT: Subtitles in Zone B only. CTA always visible, never covered.
```

## Após gerar

1. Salvar entrada no `outputs/heygen/video-registry.json` com:
   - `videoId`, `character`, `scene`, `avatarLookId`, `brief`, `script`, `headline`, `cta`
   - `status: "processing"`, `createdAt`, `heygenPageUrl`
2. Para checar status depois: `npx ts-node scripts/poll-videos.ts`
3. Para gerar relatório: `npx ts-node scripts/export-report.ts`

## Campos do video-registry.json

```json
{
  "videoId": "...",
  "character": "white-bald",
  "characterLabel": "Vivr - White Bald",
  "scene": "interview",
  "sceneLabel": "Em uma entrevista de emprego",
  "avatarLookId": "...",
  "brief": "job-interview-prep",
  "script": "Entrevista em inglês chegando? Pratique respostas reais com o Vivr e entre preparado. Comece de graça.",
  "headline": "Entre preparado",
  "cta": "Comece de graça",
  "orientation": "portrait",
  "durationSec": null,
  "status": "processing",
  "createdAt": "2026-04-08T00:00:00.000Z",
  "heygenPageUrl": "https://app.heygen.com/videos/..."
}
```

## Personagens disponíveis

Ver `outputs/heygen/avatar-registry.json` — chaves: `old-man`, `white-bald`, `white-hair`, `black-woman`, `black-man`, `woman-red-head`.

## Problema comum: vídeo curto demais

Se o vídeo sair com menos de 8s, o roteiro estava curto. Adicionar mais contexto no body:
- ❌ "Pratique inglês. Baixe grátis." (muito curto)
- ✅ "Você já travou na hora de pedir no restaurante? Com o Vivr, pratique situações reais e fale inglês com confiança. Baixe grátis." (~10s)
