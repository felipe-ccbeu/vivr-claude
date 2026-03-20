export interface CampaignBrief {
  id: string
  audience: string
  pain: string
  angle: string
  copy: {
    hook: string
    headline: string
    accentWord: string
    body: string
    cta: string
  }
  visual: {
    whiskPrompt: string
    scene: string
    mood: string
  }
}