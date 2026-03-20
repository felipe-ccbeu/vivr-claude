---
name: vivavr-canva-assembly
description: Monta um design estático no Canva com hero image + copy do brief, criando 1 arquivo com 3 páginas (Principal, Emocional, Provocativa)
---

Read `.agents/vivavr-context.md` before starting.

## O que este skill faz

Recebe uma hero image já gerada (do Whisk ou outra fonte) + copy do brief da campanha e monta um design completo no Canva via MCP.

Output: 1 arquivo Canva com 3 páginas, cada uma com uma variação tonal do copy sobre a mesma hero image.

---

## Inputs esperados

O usuário deve fornecer:
- **Hero image:** URL pública da imagem gerada (ImgBB, Google Drive público, etc.) ou asset_id Canva já existente
- **Headline P1 (Principal):** versão direta
- **Headline P2 (Emocional):** versão emocional
- **Headline P3 (Provocativa):** versão provocativa
- **Support copy:** 1–2 frases de apoio (mesmas nas 3 páginas)
- **CTA:** chamada para ação (mesma nas 3 páginas)

Se algum desses não for fornecido, pergunte antes de continuar.

---

## Workflow de execução no Canva (via MCP)

**Padrão: sempre criar um design novo via `generate-design`.** Não editar templates existentes, salvo instrução explícita do usuário.

### Passo 1 — Upload da hero image (se URL externa)
Use `upload-asset-from-url` com a URL fornecida para transformar em asset Canva.
- Faça o upload das 3 variações em paralelo se houver múltiplas imagens.
- Guarde os asset_ids retornados.

### Passo 2 — Gerar as 3 páginas com `generate-design`

Gere **3 designs separados**, um por variação de copy (P1, P2, P3), usando `generate-design` com:
- `brand_kit_id: kAHEUEC405c`
- `asset_ids: [asset_id da hero image da variação]`
- `design_type: instagram_post` (ou o formato especificado)
- Prompt detalhado seguindo o **Padrão de prompt Canva** abaixo

Mostre os candidatos gerados ao usuário para cada variação.

### Passo 3 — Criar os designs a partir dos candidatos

Para cada variação aprovada, use `create-design-from-candidate` com o `candidate_id` escolhido.

### Passo 4 — Preview e confirmação

Mostre thumbnails de cada design criado. Peça aprovação antes de continuar.

### Passo 5 — (Opcional) Refinamento via edição

Se o usuário quiser ajustar texto ou elementos após a geração:
- Use `start-editing-transaction` + `perform-editing-operations`
- Confirme com `commit-editing-transaction`

### Passo 6 — Retornar links

Retorne o link de edição de cada design gerado.

---

## Regras de design

- Brand kit ID: `kAHEUEC405c` — sempre passar no `generate-design`
- Font: **Nunito** — bold para headlines, regular para support copy
- Gradiente de marca: `#26b6cd → #80cb5e → #8378b6 → #fd8c61` (135deg diagonal)
  - Tons pastel/dessaturados são permitidos quando o layout pede leveza
- Contraste principal: **branco (#FFFFFF) sobre fundo gradiente**
- Fundo alternativo: branco com texto em gradiente (usar sparingly)
- CTA: pill branca, texto em roxo `#8378b6` ou ciano `#26b6cd`
- Layout limpo, espaçamento generoso, sem poluição visual
- Hierarquia clara: headline grande → support copy menor → CTA

## Padrão de prompt Canva para `generate-design`

Use este template ao montar o prompt de cada variação:

```
[Headline da variação] — [Support copy]

DESIGN DIRECTION:
- Background: diagonal gradient from #26b6cd (cyan) to #80cb5e (green) to #8378b6 (purple) to #fd8c61 (orange coral). Can use pastel/desaturated version for softness.
- Typography: Nunito font. Headline bold, large, white (#FFFFFF). Support copy regular, smaller, white.
- Hero image: [descrição da imagem ou referência ao asset]
- Layout: hero image occupies [left half / bottom / center], headline text on [right / top] with high contrast
- CTA button: white pill shape, text in #8378b6, bottom of design
- Style: clean, airy, premium. Rounded corners everywhere. No visual clutter.
- Do NOT use: stock photo backgrounds, flat design, pixel art, serif fonts
```

---

## Mapeamento de páginas

| Página | Tom | Headline |
|--------|-----|---------|
| 1 | Principal | Direto, claro, funcional |
| 2 | Emocional | Apelo emocional, conexão humana |
| 3 | Provocativa | Desafio, contraste, urgência |

---

## Após finalizar

Retorne:
- Link direto para edição no Canva
- Resumo do que foi montado (3 páginas, copy aplicado, imagem usada)
- Sugestões de próximos passos (ex: exportar para Meta Ads, testar variações de copy)