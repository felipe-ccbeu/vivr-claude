export const templateGroups: Record<string, string[]> = {
  'phone-screen': ['phone-float', 'phone-tilt'],
  'overlay':      ['overlay'],
  'split':        ['split'],
  'frame':        ['frame'],
  'story':        ['story'],
  'light-arc':    ['light-arc'],
  'cinematic':    ['cinematic'],
  'quote':        ['quote'],
  'bold-text':    ['bold-text'],
  'split-reverse':['split-reverse-gradient'],
  'immersive':    ['immersive'],
  'all':          ['split', 'overlay', 'frame', 'phone-float', 'phone-tilt', 'story', 'light-arc', 'cinematic', 'quote', 'bold-text', 'split-reverse-gradient', 'immersive'],
}

export function resolveTemplates(flags: string[]): string[] {
  if (flags.length === 0) return templateGroups['split']
  const ids = new Set<string>()
  for (const flag of flags) {
    const key = flag.replace(/^--/, '')
    const group = templateGroups[key]
    if (!group) throw new Error(`Flag desconhecida: ${flag}`)
    group.forEach(id => ids.add(id))
  }
  return [...ids]
}
