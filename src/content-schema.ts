export type TemplateName = 'overlay' | 'split' | 'frame' | 'phone-float' | 'phone-tilt' | 'story'

export interface CopyVariant {
  hook: string
  headline: string
  accentWord?: string
  body: string
  cta: string
}

/**
 * Thin content file — the only input needed for render + screenshot.
 * Claude generates this; TypeScript handles the rest.
 */
export interface ContentJSON {
  campaignId: string
  template: TemplateName
  imagePath: string   // relative from campaign dir (e.g. "scene.webp")
  variants: CopyVariant[]
  designVariation?: 'dark-bold' | 'minimal-clean' | 'editorial' | 'futuristic' | 'high-contrast' | 'dark-white'
  // Optional design variation. Defaults to 'dark-bold' if omitted. Backward compatible with existing files.
}
