export type TemplateName = 'overlay' | 'split' | 'frame' | 'phone-float' | 'phone-float-gradient' | 'phone-float-light' | 'phone-tilt' | 'phone-tilt-light' | 'story' | 'light-arc' | 'cinematic' | 'quote' | 'bold-text' | 'split-reverse-gradient' | 'immersive' | 'overlay-story' | 'split-story' | 'frame-story' | 'phone-float-story' | 'phone-float-gradient-story' | 'phone-float-light-story' | 'phone-tilt-story' | 'phone-tilt-light-story' | 'story-story' | 'light-arc-story' | 'cinematic-story' | 'quote-story' | 'bold-text-story' | 'split-reverse-gradient-story' | 'immersive-story'
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

export interface ContentFeedItem {
  outputName: string       // e.g. "post-p1-phone-float"
  templateId: TemplateName
  copy: CopyVariant
  sceneImage?: string      // override da imagem para este item (ex: "scene-story.png" para story)
}

export interface ContentFeedV2 {
  campaignId: string
  sceneImage: string       // absolute or relative path to scene image
  items: ContentFeedItem[]
}

/** Detect which format a content file uses */
export function isV2(content: ContentJSON | ContentFeedV2): content is ContentFeedV2 {
  return 'items' in content
}
