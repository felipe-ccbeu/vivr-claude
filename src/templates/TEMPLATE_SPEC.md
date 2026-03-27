# TEMPLATE_SPEC — Contrato de Criação de Templates

Este documento define o contrato que todos os templates do Vivr devem seguir para garantir consistência, renderização correta e integração com o pipeline de geração de criativos.

---

## Canvas Fixo

**Dimensões obrigatórias:**
- Largura: 540px (padrão Instagram Feed 4:5)
- Altura: 675px (proporção feed padrão)
- Overflow: hidden
- Font family: 'Nunito', sans-serif (via FONT_LINK)

Nenhum template pode usar dimensões diferentes sem aprovação arquitetural.

---

## Função — Assinatura TypeScript

```typescript
export function buildXXX(
  variant: CopyVariant,
  imageSrc: string,
  styleConfig: StyleConfig
): string
```

Todos os templates devem:
- Receber `variant` (hook, headline, accentWord, body, cta)
- Receber `imageSrc` (caminho da imagem)
- Receber `styleConfig` (cores, shadows, borders da variação de design)
- Retornar HTML válido como string

**Nenhum dado hardcodado além de:**
- Dimensões do canvas (540×675)
- Posicionamentos semânticos (flex, grid, absolute)
- Valores de object-fit (cover, contain)
- Valores de text-shadow, filters, shadows derivados de styleConfig

---

## Cores via StyleConfig

Cores **nunca** são hexadecimais no template. Sempre vêm de `styleConfig.colors`:

```typescript
background: ${styleConfig.colors.background}
color: ${styleConfig.colors.textPrimary}
border: 1px solid ${styleConfig.colors.primary}
```

**Campos disponíveis em StyleConfig:**
- `primary` — cor principal/gradiente da marca (orange-pink-purple)
- `secondary` — cor secundária/destaque
- `background` — fundo claro ou escuro conforme a variação
- `textPrimary` — texto principal
- `textSecondary` — texto de suporte
- `accent` — highlight/border sutil
- `accentWord` — gradiente específico para accent word
- `ctaBg` — fundo do botão CTA
- `ctaText` — texto do botão CTA
- `shadow` — sombra padrão ou objeto com offsets

---

## Data Slots Obrigatórios

Cada template **deve** ter elementos com `data-slot` para auditoria e validação:

```html
<div class="headline" data-slot="headline">${headlineHtml}</div>
<div class="hook-text" data-slot="hook">${variant.hook}</div>
<div class="body-copy" data-slot="body">${variant.body}</div>
<div class="cta-btn" data-slot="cta">${variant.cta}</div>
```

Se um slot não é renderizado (ex: body em cinematic), o elemento não deve existir.

---

## Imports Obrigatórios

Todo template deve importar:

```typescript
import { CopyVariant } from '../content-schema'
import { StyleConfig } from '../styles'
import { FONT_LINK, highlightAccentWord } from './shared'
```

- **FONT_LINK:** tag `<link>` com Nunito do Google Fonts (já gerenciado em shared.ts)
- **highlightAccentWord:** função que envolve `accentWord` com `<span class="accent">` para aplicar gradiente

---

## Uso de highlightAccentWord

```typescript
const headlineHtml = highlightAccentWord(variant.headline, variant.accentWord)

// Resultado:
// "Sabe inglês mas <span class="accent">trava</span>"
// se accentWord="trava"
```

Depois, usar no HTML:

```html
<div class="headline" data-slot="headline">${headlineHtml}</div>
```

E aplicar o gradiente via CSS:

```css
.accent {
  background: ${styleConfig.colors.accentWord};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## Structura de Arquivo Padrão

```typescript
import { CopyVariant } from '../content-schema'
import { StyleConfig } from '../styles'
import { FONT_LINK, highlightAccentWord } from './shared'

/**
 * [NOME DO TEMPLATE] — formato [WIDTHxHEIGHT ou aspecto]
 * [Descrição visual breve — o que diferencia este template]
 * [Frase sobre design variations support]
 */
export function buildXXX(variant: CopyVariant, imageSrc: string, styleConfig: StyleConfig): string {
  const headlineHtml = highlightAccentWord(variant.headline, variant.accentWord)

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
${FONT_LINK}
<style>
  /* CSS aqui — todas as cores via styleConfig */
</style>
</head>
<body>
<!-- HTML aqui — data-slots obrigatórios -->
</body>
</html>`
}
```

---

## Processo de Registro

Ao criar um novo template, seguir estes 4 passos:

### 1. Arquivo TypeScript (src/templates/novo-template.ts)
Criar conforme estrutura acima.

### 2. Registrar no Renderer (src/renderer.ts)

**2a.** Import:
```typescript
import { buildNovoTemplate } from './templates/novo-template'
```

**2b.** Add ao TEMPLATE_SIZES:
```typescript
const TEMPLATE_SIZES: Record<TemplateName, { width: number; height: number }> = {
  // ... outros
  'novo-template': { width: 540, height: 675 },
}
```

**2c.** Add ao switch no renderer:
```typescript
case 'novo-template':
  return buildNovoTemplate(variant, imageSrc, styleConfig)
```

### 3. Atualizar content-schema.ts

Add ao tipo `TemplateName`:
```typescript
export type TemplateName =
  | 'overlay'
  | 'split'
  | 'frame'
  | 'phone-float'
  | 'phone-tilt'
  | 'story'
  | 'novo-template'  // ← aqui
```

### 4. Adicionar Copy Constraints (src/template-copy-constraints.ts)

```typescript
'novo-template': {
  hook: { maxWords: 6, omit: false, tone: 'frase de contexto' },
  headline: { maxWords: 5, omit: false, tone: 'ação principal' },
  body: { maxWords: 12, omit: false, tone: 'suporte' },
  cta: { maxWords: 3, omit: false, tone: 'ação direta' },
}
```

---

## Tabela de Templates Existentes

| Template | Canvas | Descrição | Status |
|---|---|---|---|
| `overlay` | 540×675 | Imagem full-bleed + overlay escuro + text na base | ✅ Ativo |
| `split` | 540×675 | Imagem topo (55%) + painel escuro (45%) | ✅ Ativo |
| `frame` | 540×675 | Fundo escuro + imagem em moldura + text abaixo | ✅ Ativo |
| `phone-float` | 540×675 | Phone centralizado + cards flutuando | ✅ Ativo |
| `phone-tilt` | 540×675 | Phone inclinado à direita + copy à esquerda | ✅ Ativo |
| `story` | 540×960 | Story format (imagem 620px + text 340px) | ✅ Ativo |
| `light-arc` | 540×675 | Painel claro com arco SVG + imagem topo | ✅ Ativo |
| `cinematic` | 540×675 | Letterbox + headline mínimo + impacto máximo | ✅ Ativo |

---

## Validação Antes de Commit

```bash
# TypeScript compilation
npx tsc --noEmit

# Renderização teste
npx ts-node src/run-render.ts outputs/campaigns/[CAMPAIGN]/content-feed.json

# Verificar data-slots
grep -r "data-slot=" src/templates/novo-template.ts
```

Se algum passo falhar, o template não está pronto.

---

## Notas Arquiteturais

- **Design Variations:** Todos os templates respeitam `styleConfig` — suportam light, dark, colorful, etc.
- **Escalabilidade:** Adicionar novo template = 1 arquivo + 4 registros, sem modificar lógica central
- **Reusabilidade:** highlightAccentWord + FONT_LINK centralizados em shared.ts
- **Maintainability:** Comentários descritivos em cada template ajudam futuros updates
