export interface CopyBlock {
  hook: string
  headline: string
  accentWord?: string   // opcional — auto-detectado se omitido
  body: string
  cta: string
}

export interface CampaignBrief {
  id: string
  audience: string
  pain: string
  angle: string
  copy: CopyBlock
  copyVariants?: CopyBlock[]
  visual: {
    whiskPrompt: string
    scene: string
    mood: string
    /** Aspect ratio para geração de imagem no Whisk. Default: 'SQUARE' */
    aspectRatio?: 'SQUARE' | 'PORTRAIT' | 'LANDSCAPE'
    /** Se true, gera também scene-story.png em PORTRAIT além de scene.png em SQUARE */
    generateStoryImage?: boolean
    /** Se true, gera também scene-landscape.png em LANDSCAPE além de scene.png em SQUARE */
    generateLandscapeImage?: boolean
    /** Formatos a gerar. Default: ['feed']. Ex: ['feed', 'story'] */
    formats?: ('feed' | 'story')[]
    /** Template override por formato. Se omitido, feed=split, story=story */
    template?: 'overlay' | 'split' | 'frame' | 'phone-float' | 'phone-tilt' | 'story'
    refs?: {
      subject?: string
      scene?: string
      style?: string
    }
  }
}