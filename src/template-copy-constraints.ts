/**
 * TEMPLATE COPY CONSTRAINTS
 *
 * Adicionar em content-schema.ts ou em um arquivo separado referenciado pela skill.
 *
 * O gerador de copy (vivavr-static-campaign) deve ler o campo `template`
 * do content-feed.json e aplicar as constraints abaixo antes de gerar.
 *
 * Isso resolve o problema de headlines longas quebrando o visual cinematic
 * ou body copy extenso sendo cortado pelo -webkit-line-clamp do light-arc.
 */

export const TEMPLATE_COPY_CONSTRAINTS = {
  'split': {
    headline: { maxWords: 8, maxLines: 2 },
    body:     { maxWords: 18, maxLines: 2 },
    hook:     { maxWords: 10 },
    cta:      { maxWords: 4 },
    notes:    'Template equilibrado. Aceita headlines médias e body com contexto.'
  },

  'overlay': {
    headline: { maxWords: 7, maxLines: 2 },
    body:     { maxWords: 14, maxLines: 2 },
    hook:     { maxWords: 8, note: 'Apenas primeira frase — split por pontuação' },
    cta:      { maxWords: 4 },
    notes:    'Hook aparece como speech bubble. Curto e direto.'
  },

  'frame': {
    headline: { maxWords: 7, maxLines: 2 },
    body:     { maxWords: 16, maxLines: 2 },
    hook:     { maxWords: 8 },
    cta:      { maxWords: 4 },
    notes:    'Moldura centralizada. Composição simétrica favorece textos curtos.'
  },

  'phone-float': {
    headline: { maxWords: 6, maxLines: 2 },
    body:     { maxWords: 14, maxLines: 2 },
    hook:     { maxWords: 6 },
    cta:      { maxWords: 3 },
    notes:    'Celular centralizado com cards flutuando. Espaço de texto reduzido.'
  },

  'phone-tilt': {
    headline: { maxWords: 6, maxLines: 2 },
    body:     { maxWords: 12, maxLines: 2 },
    hook:     { maxWords: 6 },
    cta:      { maxWords: 3 },
    notes:    'Layout assimétrico. Copy na esquerda, celular inclinado na direita.'
  },

  'light-arc': {
    headline: { maxWords: 5, maxLines: 2, note: 'CRÍTICO: mais de 5 palavras quebra o painel' },
    body:     { maxWords: 12, maxLines: 2, note: 'Clamp a 2 linhas — copy longo é cortado' },
    hook:     { maxWords: 6, note: 'Aparece como pill sobre a imagem' },
    cta:      { maxWords: 3 },
    accentWord: { preference: 'verbo de ação ou resultado', examples: ['prepara', 'transforma', 'liberta'] },
    notes:    'Estética clean/premium. Imagem faz o trabalho. Texto é suporte, não protagonista.'
  },

  'cinematic': {
    headline: { maxWords: 4, maxLines: 2, note: 'CRÍTICO: 46px — 5+ palavras sai do frame' },
    body:     { omit: true, note: 'Body não é renderizado nesse template — não gerar' },
    hook:     { maxWords: 6, note: 'Uppercase. Estilo legenda de filme. Tom provocativo.' },
    cta:      { maxWords: 3, examples: ['Começa agora', 'Pratica hoje', 'Entra aqui'] },
    accentWord: { preference: 'substantivo ou adjetivo com peso emocional', examples: ['reunião', 'real', 'confiança'] },
    notes:    'Headline é o visual. Imagem + 1 palavra = o ad. Menos é mais.'
  },

  'story': {
    headline: { maxWords: 6, maxLines: 3 },
    body:     { maxWords: 16, maxLines: 2 },
    hook:     { maxWords: 8 },
    cta:      { maxWords: 4 },
    notes:    'Formato vertical 540×960. Mais espaço vertical disponível. Safe zones: top 120px, bottom 180px.'
  },

  'quote': {
    headline: { maxWords: 8, maxLines: 2, note: 'Testemunial — tom de aprovação, emoção positiva' },
    body:     { omit: true, note: 'Body não renderizado — layout focado em quote' },
    hook:     { maxWords: 6, note: 'Nome/descrição de quem testificou' },
    cta:      { maxWords: 4, examples: ['Junta-se', 'Começa agora', 'Experimenta'] },
    accentWord: { preference: 'adjetivo ou resultado', examples: ['confiança', 'fluência', 'mudança'] },
    notes:    'Prova social. Imagem circular pequena no rodapé. Estrelas e badge "100k".'
  },

  'bold-text': {
    headline: { maxWords: 6, maxLines: 2, note: 'Headline gigante (72px) — curta e impactante' },
    body:     { maxWords: 12, maxLines: 2, note: 'Suporte mínimo — foco é headlines' },
    hook:     { maxWords: 4, note: 'Uppercase, context tag no topo' },
    cta:      { maxWords: 3, examples: ['Comece', 'Pratica', 'Entra'] },
    accentWord: { preference: 'verbo de ação', examples: ['fale', 'pratique', 'viva'] },
    notes:    'Type-first design (zero imagem). Fundo gradiente de marca. Máxima ousadia.'
  },

  'split-reverse': {
    headline: { maxWords: 7, maxLines: 2 },
    body:     { maxWords: 14, maxLines: 2 },
    hook:     { maxWords: 6 },
    cta:      { maxWords: 4 },
    notes:    'Layout horizontal: imagem esquerda (240px), texto direita (300px). Editorial style.'
  },

  'immersive': {
    headline: { maxWords: 6, maxLines: 2, note: 'Centralizado verticalmente, grande impacto' },
    body:     { maxWords: 12, maxLines: 2 },
    hook:     { maxWords: 6, note: 'Pill frosted glass no topo esquerdo' },
    cta:      { maxWords: 4, examples: ['Entra agora', 'Comece aqui', 'Vem praticar'] },
    accentWord: { preference: 'substantivo emocional', examples: ['real', 'imersão', 'cena'] },
    notes:    'Full-bleed com vinheta radial. Texto flutua sobre imagem. Foco em profundidade.'
  }
} as const

export type TemplateHint = keyof typeof TEMPLATE_COPY_CONSTRAINTS

/**
 * Instrução para o gerador de copy (adicionar na skill vivavr-static-campaign):
 *
 * Antes de gerar as variantes, leia o campo `template` do content-feed.json
 * e consulte TEMPLATE_COPY_CONSTRAINTS[template].
 *
 * Para cada variante:
 * - headline: respeite maxWords e maxLines
 * - body: se omit === true, não gere body (ex: cinematic)
 * - hook: use o maxWords e o `note` de tom como guia
 * - accentWord: prefira o tipo de palavra indicado em `preference`
 *
 * Exemplo de instrução embutida no prompt do gerador:
 *
 * "O template selecionado é `cinematic`. Constraints obrigatórios:
 *  - headline: máx 4 palavras, 2 linhas, 46px — palavras longas quebram o layout
 *  - body: OMITIR — não renderizado
 *  - hook: máx 6 palavras, uppercase, tom de legenda de filme
 *  - accentWord: substantivo com peso emocional (reunião, real, confiança)
 *  - cta: máx 3 palavras"
 */