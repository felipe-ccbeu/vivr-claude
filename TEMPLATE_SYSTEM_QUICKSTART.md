# Template System v2 — Quick Start Guide

## ⚡ TL;DR

3 Fases implementadas:
- ✅ **Phase 1**: CSS reutilizável → light-arc.ts e cinematic.ts refatorados
- ✅ **Phase 2**: Batch render CLI → 1 comando para múltiplos templates
- ✅ **Phase 3**: Metadata + Dashboard → `index.html` visual

---

## 🚀 Como Usar (Developer)

### 1️⃣ Gerar múltiplos templates em 1 comando

```bash
npx ts-node src/batch-render.ts \
  --campaign outputs/campaigns/010-reuniao-confianca/content-feed.json \
  --templates light-arc,cinematic \
  --out outputs/campaigns/010-reuniao-confianca
```

**Output:**
```
outputs/campaigns/010-reuniao-confianca/
├── light-arc/        (3 variantes: P1, P2, P3)
├── cinematic/        (3 variantes: P1, P2, P3)
└── index.html        ← Abra no browser!
```

### 2️⃣ Abrir dashboard visual

```bash
# Mac/Linux
open outputs/campaigns/010-reuniao-confianca/index.html

# Windows
start outputs/campaigns/010-reuniao-confianca/index.html
```

Vê todos os 6 PNGs em grid, agrupado por template.

### 3️⃣ Mudar espaçamento/cores globais

```bash
# Edit shared.ts — uma mudança, todos templates atualizam
vim src/templates/shared.ts

# Rerender
npx ts-node src/batch-render.ts --campaign ... --templates ...
```

---

## 📊 Fluxo Detalhado

### Antes (Phase 0 — Manual)

```
Step 1: Create content-feed-light-arc.json
Step 2: npx ts-node src/run-render.ts content-feed-light-arc.json
Step 3: Create content-feed-cinematic.json
Step 4: npx ts-node src/run-render.ts content-feed-cinematic.json
Step 5: mv post-copy-*.png somewhere/
Step 6: Visually compare PNGs in file manager
```

**Tempo**: ~5 minutos, muita bagunça.

### Depois (Phase 1-3 — Automated)

```
Step 1: npx ts-node src/batch-render.ts --campaign ... --templates light-arc,cinematic
Step 2: open index.html
Step 3: Done!
```

**Tempo**: ~30 segundos, tudo organizado.

---

## 🔍 Auditar Metadata

Cada HTML gerado tem metadata:

```html
<!-- VIVR_META: {"campaignId":"010-reuniao-confianca","template":"light-arc","designVariation":"dark-bold","variantIndex":1,"generatedAt":"2026-03-27T17:21:23.041Z"} -->
```

**Programmatically:**
```javascript
// No browser console:
const meta = document.querySelector('meta[name="vivr-campaign"]').content;
console.log(JSON.parse(meta));
// {
//   campaignId: "010-reuniao-confianca",
//   template: "light-arc",
//   designVariation: "dark-bold",
//   variantIndex: 1,
//   generatedAt: "2026-03-27T17:21:23.041Z"
// }
```

---

## 🎯 Casos de Uso

### Caso 1: Gerar nova campanha

```bash
# 1. Create content-feed.json manually
# 2. Run batch
npx ts-node src/batch-render.ts \
  --campaign outputs/campaigns/011-novo/content-feed.json \
  --templates light-arc,cinematic,split \
  --out outputs/campaigns/011-novo

# 3. Open dashboard
open outputs/campaigns/011-novo/index.html
```

### Caso 2: Testar light-soft variation

```bash
npx ts-node src/batch-render.ts \
  --campaign outputs/campaigns/010/content-feed.json \
  --templates light-arc,cinematic \
  --variation light-soft \
  --out outputs/campaigns/010/light-soft-test
```

### Caso 3: A/B test com múltiplas variantes

```bash
# Gerar dark-bold
npx ts-node src/batch-render.ts \
  --campaign ... --templates light-arc,cinematic --variation dark-bold \
  --out test-dark-bold

# Gerar light-soft
npx ts-node src/batch-render.ts \
  --campaign ... --templates light-arc,cinematic --variation light-soft \
  --out test-light-soft

# Compare visually na pasta pai
open test-dark-bold/index.html  # e
open test-light-soft/index.html # lado a lado
```

---

## 📝 Refactor Checklist (para adicionar novo template)

Se você quer criar um novo template `my-template.ts`:

- [ ] Create `src/templates/my-template.ts`
- [ ] Import builders: `buildBaseCSS`, `buildAccentCSS`, etc.
- [ ] Use builders no template:
  ```typescript
  <style>
    ${buildBaseCSS(540, 675, '#my-bg')}
    ${buildAccentCSS(styleConfig.colors.accentWord)}
    ${buildCTABtnCSS(styleConfig, '12px 20px')}
    /* + custom CSS */
  </style>
  ```
- [ ] Register em `renderer.ts`:
  ```typescript
  import { buildMyTemplate } from './templates/my-template'

  // Add to TEMPLATE_SIZE
  'my-template': { width: 540, height: 675 }

  // Add to switch
  case 'my-template': return buildMyTemplate(variant, imageSrc, styleConfig)
  ```
- [ ] Add ao type `TemplateName` em `content-schema.ts`
- [ ] Add constraints em `template-copy-constraints.ts`
- [ ] Test: `npx tsc --noEmit`
- [ ] Test render: `npx ts-node src/batch-render.ts --templates my-template ...`

---

## 🔧 Architecture Files

| File | What | Changed |
|------|------|---------|
| `src/templates/shared.ts` | CSS builders | ✏️ +6 functions |
| `src/templates/light-arc.ts` | Template | ✏️ -37% lines |
| `src/templates/cinematic.ts` | Template | ✏️ -39% lines |
| `src/renderer.ts` | Render engine | ✏️ +metadata injection |
| `src/batch-render.ts` | **New CLI** | 🆕 +185 lines |

---

## ⚙️ CLI Reference

```bash
npx ts-node src/batch-render.ts [options]

Options:
  --campaign <path>         JSON file com variants e campaign ID (obrigatório)
  --templates <t1,t2,...>   Comma-separated template names (obrigatório)
  --variation <name>        Design variation: dark-bold, light-soft, etc. (opcional)
  --out <dir>              Output directory (opcional, default: same as campaign dir)

Templates disponíveis:
  light-arc, cinematic, split, overlay, frame, phone-float, phone-tilt

Design Variations:
  dark-bold (padrão), light-soft, minimal-clean, editorial, futuristic, high-contrast, dark-white

Exemplo:
  npx ts-node src/batch-render.ts \
    --campaign outputs/campaigns/010/content-feed.json \
    --templates light-arc,cinematic \
    --variation dark-bold \
    --out outputs/campaigns/010
```

---

## 🎉 What You Get

```
✅ 1 command para múltiplos templates
✅ Sem colisão de nomes (subdiretórios)
✅ Metadata em cada HTML (auditoria)
✅ index.html visual (dashboard)
✅ -37% a -39% código duplicado
✅ 100% backward compatible
```

---

## 📚 Full Docs

Para detalhes completos → leia `TEMPLATE_SYSTEM_v2.md`

