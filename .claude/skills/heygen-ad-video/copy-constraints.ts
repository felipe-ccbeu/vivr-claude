/**
 * copy-constraints.ts
 *
 * Limites e regras de copy para vídeos HeyGen Vivr.
 * Espelhado em template-copy-constraints.ts do pipeline de estáticos.
 */

export interface SlotConstraints {
  maxWords: number
  maxChars: number
  notes: string
}

export const VIDEO_COPY_CONSTRAINTS: Record<string, SlotConstraints> = {
  hook: {
    maxWords: 10,
    maxChars: 60,
    notes: 'Pergunta ou afirmação que gera identificação imediata. Sem ponto final — pausa natural.',
  },
  body: {
    maxWords: 15,
    maxChars: 90,
    notes: 'Benefício concreto. Sem adjetivos genéricos. Liga o produto à dor do hook.',
  },
  cta: {
    maxWords: 4,
    maxChars: 25,
    notes: 'Imperativo afirmativo PT-BR. Ex: "Baixe grátis", "Comece agora", "Pratique grátis".',
  },
  headline: {
    maxWords: 5,
    maxChars: 35,
    notes: 'Aparece na Zone C (overlay). Sentença impactante, não slogan genérico.',
  },
}

/** Duração alvo por slot (segundos) — guia para calibrar o script */
export const DURATION_GUIDE = {
  targetTotal: 10,
  hookSec: 3,
  bodySec: 5,
  ctaSec: 2,
}

/** Regras de copy que não podem ser violadas */
export const COPY_RULES = [
  'Imperativo afirmativo: "Pratique", "Entre", "Comece" — NUNCA "Pratica", "Entra", "Começa"',
  'Preposição correta: "Pratique NO aeroporto" — não "Pratique O aeroporto"',
  'Sem adjetivos genéricos: "melhor app", "aprenda rápido", "de forma fácil"',
  'Sem promessas vagas de fluência: "fique fluente em X dias"',
  'Sempre conectar à situação real do personagem na cena',
  'CTA deve refletir o estágio: "Baixe" (novo usuário), "Comece" (indeciso), "Pratique" (reconhecimento)',
]

/** Ângulos permitidos por cena */
export const SCENE_ANGLES: Record<string, string[]> = {
  restaurant:       ['travar no cardápio', 'pedir sem constranger', 'chamar o garçom'],
  airport:          ['anúncio em inglês', 'check-in', 'gate errado', 'pedir informação'],
  interview:        ['entrevista em inglês', 'responder under pressure', 'apresentar-se'],
  cafe:             ['pedir café', 'conversa casual', 'situação do dia a dia'],
  'tourist-map':    ['pedir direções', 'se virar na cidade', 'mapa e celular'],
  'tourist-pointing': ['dar informações', 'falar com turistas', 'apontar direções'],
  meeting:          ['reunião online', 'apresentação', 'perguntas e respostas'],
  bar:              ['pedir bebida', 'conversa informal', 'socializar em inglês'],
}
