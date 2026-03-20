import * as path from 'path'
import * as fs from 'fs-extra'
import { WhiskRefs } from './whisk-client'

const REFS_DIR = path.resolve('assets/refs')

function refPath(filename: string): string | undefined {
  const full = path.join(REFS_DIR, filename)
  return fs.pathExistsSync(full) ? full : undefined
}

/**
 * Referências fixas usadas em todas as campanhas estáticas.
 * Se o arquivo não existir, o campo é omitido (Whisk gera sem aquela referência).
 */
export const DEFAULT_REFS: WhiskRefs = {
  subject: refPath('subject.png'),
  scene:   refPath('scene.webp'),
  style:   refPath('style.webp'),
}