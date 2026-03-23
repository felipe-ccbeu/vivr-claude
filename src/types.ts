export interface CopyBlock {
  hook: string
  headline: string
  accentWord: string
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
    template?: 'overlay' | 'split' | 'frame' | 'phone-float' | 'phone-tilt'
    refs?: {
      subject?: string  // file path or URL
      scene?: string    // file path or URL
      style?: string    // file path or URL
    }
  }
}