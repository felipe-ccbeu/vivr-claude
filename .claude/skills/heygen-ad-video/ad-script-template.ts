/**
 * ad-script-template.ts
 *
 * Estrutura canônica Hook → Problema → Solução → Prova → CTA
 * para vídeos HeyGen Vivr de 10 segundos.
 *
 * Em 10s o formato comprimido é: Hook → Solução → CTA
 * Para 15-20s é possível incluir Problema e Prova.
 */

import { VIDEO_COPY_CONSTRAINTS, COPY_RULES, SCENE_ANGLES, DURATION_GUIDE } from './copy-constraints'

export interface AdScript {
  hook: string      // 3s — pergunta ou afirmação de identificação
  body: string      // 5s — benefício concreto (liga produto à dor)
  cta: string       // 2s — imperativo afirmativo
  headline: string  // Zone C overlay — impacto visual
  accentWord?: string
}

/**
 * Valida um script contra as constraints.
 * Retorna lista de violações (vazia = OK).
 */
export function validateScript(script: AdScript): string[] {
  const violations: string[] = []

  const hookWords = script.hook.trim().split(/\s+/).length
  const bodyWords = script.body.trim().split(/\s+/).length
  const ctaWords  = script.cta.trim().split(/\s+/).length

  if (hookWords > VIDEO_COPY_CONSTRAINTS.hook.maxWords)
    violations.push(`hook: ${hookWords} palavras (máx ${VIDEO_COPY_CONSTRAINTS.hook.maxWords})`)

  if (bodyWords > VIDEO_COPY_CONSTRAINTS.body.maxWords)
    violations.push(`body: ${bodyWords} palavras (máx ${VIDEO_COPY_CONSTRAINTS.body.maxWords})`)

  if (ctaWords > VIDEO_COPY_CONSTRAINTS.cta.maxWords)
    violations.push(`cta: ${ctaWords} palavras (máx ${VIDEO_COPY_CONSTRAINTS.cta.maxWords})`)

  // Imperativo incorreto
  const wrongImperatives = ['pratica', 'entra', 'começa', 'baixa', 'experimenta', 'usa']
  const fullText = `${script.hook} ${script.body} ${script.cta}`.toLowerCase()
  for (const wrong of wrongImperatives) {
    if (fullText.includes(` ${wrong} `) || fullText.startsWith(`${wrong} `))
      violations.push(`imperativo incorreto detectado: "${wrong}" — use a forma formal`)
  }

  return violations
}

/**
 * Gera o texto de prompt completo para o HeyGen Video Agent.
 */
export function buildVideoPrompt(params: {
  script: AdScript
  avatarLookId: string
  characterLabel: string
  sceneLabel: string
  sceneMood: string
  orientation?: 'portrait' | 'landscape'
  durationSec?: number
}): string {
  const {
    script,
    avatarLookId,
    characterLabel,
    sceneLabel,
    sceneMood,
    orientation = 'portrait',
    durationSec = DURATION_GUIDE.targetTotal,
  } = params

  const narration = `${script.hook} ${script.body} ${script.cta}.`

  return `Create a ${durationSec}-second ${orientation} video for the Vivr language learning app.

AVATAR: Use avatar look ID: ${avatarLookId} (${characterLabel} — ${sceneLabel}). Keep the original avatar background.

SCENE: ${sceneMood}.

SCRIPT (narration in Brazilian Portuguese, imperative form):
"${narration}"

LAYOUT — 3 fixed zones:
- Zone A (0–15%): vivr logo watermark top-left
- Zone B (15–65%): avatar/scene, subtitles/captions ONLY here — NEVER below this zone
- Zone C (65–100%): dark overlay + headline "${script.headline}" + CTA button "${script.cta}"

BRAND GRADIENT (use for CTA button and accent elements — all 6 colors must be visible, do NOT simplify):
linear-gradient(135deg, #f7c948 0%, #f97040 20%, #e94899 45%, #9b5de5 65%, #26c6da 83%, #80e27e 100%)
Colors: yellow-gold (#f7c948), orange (#f97040), hot pink (#e94899), purple (#9b5de5), cyan (#26c6da), mint green (#80e27e) — ALL 6 must appear. Do NOT simplify to fewer colors.

STYLE: Dark background #1A1030, white text, pill-shaped CTA button (border-radius: 100px), Nunito font, premium feel.
IMPORTANT: Subtitles/captions must appear in Zone B only, never over Zone C. CTA button must always be fully visible and never covered by subtitles.`
}

// ---------------------------------------------------------------------------
// Reference examples (use as calibration)
// ---------------------------------------------------------------------------

export const SCRIPT_EXAMPLES: Array<{ scene: string; script: AdScript }> = [
  {
    scene: 'airport',
    script: {
      hook: 'Antes de embarcar, pratique inglês no aeroporto com o Vivr.',
      body: 'Chegue ao seu destino sem travar.',
      cta: 'Baixe agora',
      headline: 'Não trave no aeroporto',
      accentWord: 'trave',
    },
  },
  {
    scene: 'restaurant',
    script: {
      hook: 'Você já travou na hora de pedir no restaurante?',
      body: 'Com o Vivr, pratique situações reais e fale inglês com confiança.',
      cta: 'Baixe grátis',
      headline: 'Fale inglês de verdade',
      accentWord: 'verdade',
    },
  },
  {
    scene: 'interview',
    script: {
      hook: 'Entrevista em inglês chegando?',
      body: 'Pratique respostas reais com o Vivr e entre preparado.',
      cta: 'Comece de graça',
      headline: 'Entre preparado',
      accentWord: 'preparado',
    },
  },
]

export { VIDEO_COPY_CONSTRAINTS, COPY_RULES, SCENE_ANGLES, DURATION_GUIDE }
