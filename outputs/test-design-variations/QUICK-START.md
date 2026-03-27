# Quick Start — Renderizar os 6 Estilos

**Tempo estimado:** 5 minutos
**Pré-requisito:** Node.js + TypeScript

---

## ⚡ Step 1: Renderizar Todos os 6 Estilos

Abra o terminal no diretório raiz do projeto:

```bash
# Dark Bold
npx ts-node src/run-render.ts outputs/test-design-variations/content-dark-bold.json

# Minimal Clean
npx ts-node src/run-render.ts outputs/test-design-variations/content-minimal-clean.json

# Editorial
npx ts-node src/run-render.ts outputs/test-design-variations/content-editorial.json

# Futuristic
npx ts-node src/run-render.ts outputs/test-design-variations/content-futuristic.json

# High Contrast
npx ts-node src/run-render.ts outputs/test-design-variations/content-high-contrast.json

# Dark White
npx ts-node src/run-render.ts outputs/test-design-variations/content-dark-white.json
```

Ou em loop (mais rápido):

```bash
for file in outputs/test-design-variations/content-*.json; do
  npx ts-node src/run-render.ts "$file"
done
```

---

## ✅ Step 2: Verificar os Outputs

Após renderizar, você terá 6 pares de arquivos:

```bash
outputs/test-design-variations/
├── post-copy-1-dark-bold.html       ← HTML (pode abrir no browser)
├── post-copy-1-dark-bold.png        ← PNG (pronto para social)
├── post-copy-1-minimal-clean.html
├── post-copy-1-minimal-clean.png
├── post-copy-1-editorial.html
├── post-copy-1-editorial.png
├── post-copy-1-futuristic.html
├── post-copy-1-futuristic.png
├── post-copy-1-high-contrast.html
├── post-copy-1-high-contrast.png
├── post-copy-1-dark-white.html
└── post-copy-1-dark-white.png
```

---

## 📸 Step 3: Visualizar em Browser

Abra os HTMLs no navegador:

```bash
# macOS
open outputs/test-design-variations/post-copy-1-dark-bold.html
open outputs/test-design-variations/post-copy-1-minimal-clean.html
open outputs/test-design-variations/post-copy-1-editorial.html
open outputs/test-design-variations/post-copy-1-futuristic.html
open outputs/test-design-variations/post-copy-1-high-contrast.html
open outputs/test-design-variations/post-copy-1-dark-white.html

# Windows (PowerShell)
start outputs/test-design-variations/post-copy-1-dark-bold.html
# ... repeat for each file

# Linux
firefox outputs/test-design-variations/post-copy-1-dark-bold.html
# ... or your preferred browser
```

---

## 🎨 Step 4: Abrir o Showcase Visual

Veja todos os 6 estilos lado-a-lado:

```bash
# macOS
open outputs/test-design-variations/showcase.html

# Windows
start outputs/test-design-variations/showcase.html

# Linux
firefox outputs/test-design-variations/showcase.html
```

O showcase mostra:
- 🎨 Cards de cada estilo com cores e specs
- 📊 Tabela de comparação
- 📍 Copy utilizada
- 🎯 Casos de uso por segmento

---

## 📖 Step 5: Ler a Documentação

Documentação completa para entender o sistema:

```bash
# 1. Quick Overview (este arquivo)
cat outputs/test-design-variations/QUICK-START.md

# 2. How to Use & Render
cat outputs/test-design-variations/README.md

# 3. Detailed Style Comparison
cat outputs/test-design-variations/STYLES-COMPARISON.md

# 4. Executive Summary
cat outputs/test-design-variations/EXECUTIVE-SUMMARY.md

# 5. Full PRD
cat outputs/PRD-design-variations-system.md

# 6. Implementation Details
cat outputs/DESIGN-VARIATIONS-IMPLEMENTATION.md
```

---

## 🚀 Step 6: Próximos Passos

### Imediato (Hoje)
- [ ] Renderizar os 6 PNGs ✅
- [ ] Validar safe zones (no cutoff em mobile)
- [ ] Conferir cores e tipografia

### Curto Prazo (Esta Semana)
- [ ] Setup A/B teste em plataforma
- [ ] Upload dos 6 PNGs para campanha
- [ ] Começar rastreamento de métricas

### Médio Prazo (Próximas 2 Semanas)
- [ ] Analisar dados de CTR por estilo
- [ ] Identificar estilo com melhor conversão
- [ ] Refinar based on learnings

---

## 📊 O Que Você Está Vendo

Cada um dos 6 estilos renderizados é um exemplo de:

### 1. **Dark Bold** ⭐
- Vivr gradient (6 cores)
- OLED black background
- Multi-layer glow effects
- **Quando usar:** Default, product launches, high-energy

### 2. **Minimal Clean**
- White background
- Cyan accent
- Zero gradients/glows
- **Quando usar:** Design-conscious, professionals, B2B

### 3. **Editorial**
- Warm off-white
- Serif typography
- Magenta accent
- **Quando usar:** Thought leadership, brand positioning

### 4. **Futuristic**
- Deep navy background
- Neon cyan + magenta
- Dual-layer glow
- **Quando usar:** Tech users, early adopters, innovation

### 5. **High Contrast** ♿
- Pure black + white
- Golden yellow accent
- 21:1 contrast ratio
- **Quando usar:** Accessibility, 45+, compliance-driven

### 6. **Dark White**
- Pure black + white
- Monochromatic design
- Elegant, minimal
- **Quando usar:** Premium, luxury, sophisticated branding

---

## 💡 Entendendo o Sistema

### Mesma Copy, 6 Designs

A copy usada em todos os 6 estilos:
```
Hook:       Sistema de Design
Headline:   Um único conteúdo, [infinitas] possibilidades visuais
Body:       [Customizado per style]
CTA:        Explorar Variações
```

**O que muda:**
- Background color
- Text color
- Typography size/weight
- Visual effects (glow, borders, etc.)
- Safe zones

**O que NÃO muda:**
- Copy/messaging
- Template layout
- Image placement
- Headline structure

---

## 🔧 Troubleshooting

**P: "Command not found: npx"**
```bash
# Install Node.js from https://nodejs.org/
# Or use Homebrew (macOS):
brew install node
```

**P: "Module not found: ..."**
```bash
# Install dependencies
npm install

# Then retry the render command
npx ts-node src/run-render.ts outputs/test-design-variations/content-dark-bold.json
```

**P: "PNG is blank"**
```bash
# Check if the HTML rendered correctly first
# Open the .html file in browser
# If HTML is also blank, check the image path
cat outputs/test-design-variations/content-dark-bold.json
# Ensure "imagePath": "scene.webp" exists in the directory
```

**P: "Quiero renderizar solo un estilo"**
```bash
# Pick one JSON file and render just that
npx ts-node src/run-render.ts outputs/test-design-variations/content-minimal-clean.json
```

---

## 📈 Metrics to Track

Após subir os 6 PNGs para teste, rastreie:

| Métrica | Ferramenta | Target |
|---------|-----------|--------|
| **CTR** | Google Analytics / Facebook Ads | Variance ±25% é normal |
| **Impressões** | Ad Platform | Distribuição igual nos 6 |
| **Conversão** | Conversion Tracker | Dark Bold = baseline |
| **Engagement** | Social Platform | Monitor por estilo |

---

## 🎯 Success Criteria

Após renderizar, você terá sucesso se:

- ✅ 6 HTML files gerados sem erros
- ✅ 6 PNG files criados corretamente
- ✅ Showcase HTML abre no browser
- ✅ Cores correspondem ao design spec
- ✅ Tipografia é renderizada corretamente
- ✅ Safe zones não têm cutoff
- ✅ Documentação é clara e completa

---

## 📚 Quick Reference

| Arquivo | Purpose | Ler quando... |
|---------|---------|---|
| QUICK-START.md | Este arquivo | Começar agora |
| README.md | Como usar o sistema | Entender contexto |
| STYLES-COMPARISON.md | Detalhe de cada estilo | Comparar designs |
| EXECUTIVE-SUMMARY.md | Para stakeholders | Apresentar projeto |
| showcase.html | Visual demo | Ver os 6 juntos |
| PRD.md | Especificação completa | Dúvidas técnicas |

---

## ✨ Resultado Final

Após seguir estes passos, você terá:

```
✅ 6 designs diferentes renderizados
✅ Mesma copy, visual completamente diferente
✅ Ready para A/B teste
✅ Compreensão completa do sistema
✅ Documentação para referência futura
```

---

## 🚀 Agora É Com Você!

1. Renderize os 6 estilos
2. Abra no browser
3. Compare os 6 designs
4. Leia a documentação
5. Comece o A/B teste

**Tempo total:** ~15 minutos

**Impacto:** 10x faster design iteration + audience-specific visuals = better conversion

---

**Design Variation System v1.0 — Ready to Use**
**Vivr Marketing Platform**
