import { generateCampaign } from './generate'
import { CampaignBrief } from './types'

const brief: CampaignBrief = {
  id: '001-restaurant',
  audience: 'Adultos 22-35 que travam ao falar inglês',
  pain: 'Fiz mil lições mas trava na hora H',
  angle: 'O problema não é você, é que nunca praticou em situação real',
  copy: {
    hook: 'Você já fez tanta lição e ainda trava na hora H?',
    headline: 'Inglês que funciona fora do app.',
    accentWord: 'funciona',
    body: 'No Vivr, você pratica dentro de cenas reais — café, viagem, trabalho. Situações que você vai viver de verdade.',
    cta: 'Entra no Vivr',
  },
  visual: {
    whiskPrompt:
      'A confident adult 3D cartoon character (Pixar/Disney style, female, brown skin, casual urban outfit) standing inside a glowing rounded arch portal, holding a coffee cup, mid-dialogue. The arch portal opens into a cozy modern café with warm lights, wooden counter, blurred background depth. 3D rounded cartoon, Pixar/Disney quality, vibrant but soft. White speech bubble with English text. Bright, airy, premium feel.',
    scene: 'modern café interior, warm lighting, brick walls',
    mood: 'confident, light, immersive',
  },
}

generateCampaign(brief).catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})