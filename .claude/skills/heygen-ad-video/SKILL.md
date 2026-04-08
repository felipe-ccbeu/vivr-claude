---
name: heygen-ad-video
description: >
  Pipeline completo para gerar vídeos de ad para o Vivr app via HeyGen MCP.
  Use esta skill SEMPRE que o usuário quiser gerar, criar, disparar ou atualizar vídeos de ad —
  incluindo: "gera o vídeo do restaurante", "cria um ad para o aeroporto", "dispara o pipeline",
  "gera variação A/B do hook", "atualiza o registry", "checa status dos vídeos".
  A skill lê um brief JSON, gera o roteiro estruturado (Hook→Dor→Demo→Prova→CTA),
  valida constraints de duração, seleciona o avatar pelo registry, chama create_avatar_video
  via HeyGen MCP, e registra o resultado no video-registry.json.
---

# HeyGen Ad Video Pipeline — Vivr

Pipeline de geração de vídeos de ad para o Vivr app. Fluxo: brief JSON → roteiro → HeyGen → registry.

## Leia antes de qualquer ação

1. Leia `outputs/heygen/avatar-registry.json` para entender os avatares disponíveis
2. Leia `outputs/heygen/video-registry.json` → histórico de vídeos já gerados
3. Leia o brief em `briefs/<scene>.json` para contexto da cena

---

## FLUXO COMPLETO (execute nesta ordem)

### FASE 1 — Carregar contexto

```
1. Ler outputs/heygen/avatar-registry.json  → lista de avatarLookIds disponíveis
2. Ler outputs/heygen/video-registry.json   → histórico de vídeos já gerados
3. Ler briefs/<scene>.json                  → brief da cena atual
```

Se `video-registry.json` não existir, crie com estrutura vazia:
```json
{ "version": "1.0", "videos": [] }
```

### FASE 2 — Selecionar avatar

Regras de seleção (em ordem de prioridade):
1. Se o brief especifica `character` → use o `avatarLookId` correspondente no avatar-registry
2. Se o brief especifica `gender` → filtre por gender no registry
3. Se não especificado → prefira `black-woman` ou `woman-red-head` para ads de app
4. **NUNCA repita o mesmo avatarLookId para a mesma cena** → cheque video-registry antes de selecionar

### FASE 3 — Gerar roteiro

Monte o script seguindo a estrutura de 5 slots. **Respeite rigorosamente os limites de palavras**:

```
[HOOK]    0–3s    ≤ 20 palavras   — pergunta específica que para o scroll
[DOR]     4–8s    ≤ 35 palavras   — amplifica a frustração, situação real
[DEMO]    9–17s   ≤ 60 palavras   — descreve o que o app faz
[PROVA]   18–22s  ≤ 25 palavras   — número real ou benefício tangível
[CTA]     23–27s  ≤ 15 palavras   — urgência + ação
```

**Total: ~155 palavras = ~27 segundos de fala a 130 wpm**

⚠️ O HeyGen determina a duração pelo script — não pelo parâmetro `durationSec`.
Calibre SEMPRE pelo contador de palavras, não pelo feeling.

**Tom obrigatório (brand voice Vivr):**
- Empático, não condescendente
- Situações reais e específicas (não genéricas)
- Energia positiva, nunca ansiedade
- PT-BR coloquial, não formal
- Imperativo afirmativo: "Pratique", "Entre", "Comece" — NUNCA "Pratica", "Entra", "Começa"

**Exemplo de hook RUIM:** "Você tem dificuldade com inglês?"
**Exemplo de hook BOM:** "Você pediu 'medium rare' e veio bem passado?"

### FASE 4 — Validar antes de disparar

Checklist obrigatório antes de chamar a API:

- [ ] avatarLookId existe no avatar-registry.json?
- [ ] Este avatarLookId NÃO foi usado para esta cena no video-registry?
- [ ] Total de palavras do script ≤ 160?
- [ ] Hook ≤ 20 palavras?
- [ ] Há pelo menos 1 número ou dado concreto no slot PROVA?
- [ ] CTA tem verbo de ação + urgência?

Se qualquer item falhar → corrija antes de prosseguir.

### FASE 5 — Chamar HeyGen MCP

Use `create_avatar_video` (NÃO `create_video_agent`):

```typescript
{
  avatarId: "<avatarLookId do registry>",
  script: "<roteiro completo dos 5 slots>",
  voiceId: "<voiceId do brief ou padrão PT-BR>",
  aspectRatio: "9:16",
  resolution: "1080p",
  removeBackground: true,
  expressiveness: "high",
  motionPrompt: "natural and engaging, talking directly to camera",
  title: "vivr-<scene>-<character>-<hookVariant>",
  background: {
    type: "color",
    value: "#0d0d1a"
  }
}
```

### FASE 6 — Registrar no video-registry

Imediatamente após receber o `videoId`, adicione ao `outputs/heygen/video-registry.json`:

```json
{
  "videoId": "<id retornado>",
  "title": "vivr-<scene>-<character>-<variant>",
  "character": "<character do registry>",
  "avatarLookId": "<id usado>",
  "scene": "<scene do brief>",
  "sceneLabel": "<label legível>",
  "hookVariant": "<A|B|C>",
  "hook": "<texto exato do hook>",
  "script": "<script completo>",
  "wordCount": 0,
  "estimatedDurationSec": 0,
  "status": "processing",
  "createdAt": "<ISO 8601>",
  "updatedAt": "<ISO 8601>",
  "heygenPageUrl": "https://app.heygen.com/videos/<videoId>",
  "url": null,
  "downloadUrl": null,
  "notes": ""
}
```

### FASE 7 — Confirmar e reportar

Após registrar, informe ao usuário:
```
✅ Vídeo disparado
   ID: <videoId>
   Título: <title>
   Avatar: <character> (<avatarLookId>)
   Script: <wordCount> palavras (~<estimatedDuration>s)
   Status: processing

   Para checar: "checa status do vídeo <videoId>"
   Para ver todos: "mostra o video-registry"
```

---

## POLLING DE STATUS

Quando o usuário pedir para checar status:

1. Chame `get_video` com o videoId
2. Se `status === "completed"`:
   - Atualize `video-registry.json`: status → "completed", url, downloadUrl, updatedAt
   - Informe o link
3. Se `status === "processing"`:
   - Informe tempo estimado restante (~10-15min)
4. Se `status === "failed"`:
   - Atualize registry com status → "failed" + error message
   - Sugira re-disparar

**Para checar todos os vídeos em processing:**
Leia o video-registry, filtre por `status === "processing"`, chame `get_video` para cada um.

---

## GERAÇÃO DE VARIAÇÕES A/B

Para cada cena, gere **mínimo 2 variações** de hook com **mesmo avatar**:

| Variante | Tipo de hook | Exemplo |
|----------|-------------|---------|
| A | Pergunta de situação | "Você travou na hora de pedir no restaurante?" |
| B | Consequência embaraçosa | "Você pediu medium rare e veio bem passado?" |
| C | Resultado desejado | "Imagina pedir qualquer coisa em inglês sem travar." |

Registre `hookVariant` no video-registry para análise futura de CTR.

---

## PERSONAGENS DISPONÍVEIS

Ver `outputs/heygen/avatar-registry.json` — chaves: `old-man`, `white-bald`, `white-hair`, `black-woman`, `black-man`, `woman-red-head`.

---

## ERROS COMUNS — evite

| Erro | Causa | Fix |
|------|-------|-----|
| Vídeo muito curto (<15s) | Script com < 100 palavras | Conte as palavras antes de disparar |
| Avatar repetido na cena | Não checar video-registry | Sempre consultar antes de selecionar |
| Hook genérico | Copiar template sem adaptar | Hook deve mencionar situação específica da cena |
| `create_video_agent` em vez de `create_avatar_video` | Confusão de tool | Use SEMPRE `create_avatar_video` — dá controle de avatar e script |
| Vídeo não registrado | Esqueceu FASE 6 | Registrar IMEDIATAMENTE após receber videoId |