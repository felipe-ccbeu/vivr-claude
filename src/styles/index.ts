/**
 * Style Index — Export all design variations and provide lookup functions
 */

import { StyleConfig, DesignVariation } from './types'
import { darkBold } from './dark-bold'
import { minimalClean } from './minimal-clean'
import { editorial } from './editorial'
import { futuristic } from './futuristic'
import { highContrast } from './high-contrast'
import { darkWhite } from './dark-white'

// Export all style configs
export { darkBold, minimalClean, editorial, futuristic, highContrast, darkWhite }

// Export types
export { StyleConfig, DesignVariation }

// Style map for easy lookup
const STYLE_MAP: Record<DesignVariation, StyleConfig> = {
  'dark-bold': darkBold,
  'minimal-clean': minimalClean,
  editorial,
  futuristic,
  'high-contrast': highContrast,
  'dark-white': darkWhite,
}

/**
 * Get a style config by name.
 * Defaults to 'dark-bold' if not provided.
 * @param name Design variation name or undefined
 * @returns StyleConfig object
 */
export function getStyleConfig(name?: string): StyleConfig {
  if (!name || name === '') {
    return STYLE_MAP['dark-bold']
  }

  const variation = name as DesignVariation
  if (variation in STYLE_MAP) {
    return STYLE_MAP[variation]
  }

  // Unknown style: log warning and return default
  console.warn(`[styles] Unknown design variation "${name}". Falling back to "dark-bold".`)
  return STYLE_MAP['dark-bold']
}

/**
 * Get all available style slugs
 */
export function getAvailableStyles(): DesignVariation[] {
  return Object.keys(STYLE_MAP) as DesignVariation[]
}

/**
 * Check if a style name is valid
 */
export function isValidStyle(name: string): name is DesignVariation {
  return name in STYLE_MAP
}
