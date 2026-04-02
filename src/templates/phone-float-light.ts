import { CopyVariant } from '../content-schema'
import { StyleConfig } from '../styles'
import { FONT_LINK, BADGE_GRADIENT, highlightAccentWord, STORY_HEIGHT, STORY_SAFE_BOTTOM } from './shared'

/**
 * PHONE-FLOAT-LIGHT — celular centralizado sobre fundo claro (#f5f4f8).
 * Top-line gradiente, acentos sutis radiais nos cantos, floor-glow roxo.
 * Cards dark (fundo #1a1030) exceto card-bubble que é branco.
 * Accent no headline usa gradient colorido (background-clip:text).
 * CTA usa BADGE_GRADIENT.
 */
export function buildPhoneFloatLight(variant: CopyVariant, imageSrc: string, _styleConfig: StyleConfig, isStory = false): string {
  const headlineHtml = highlightAccentWord(variant.headline, variant.accentWord)
  const H = isStory ? STORY_HEIGHT : 675
  const copyPadBottom = isStory ? STORY_SAFE_BOTTOM : 36
  const h1Sz = isStory ? 36 : 34

  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
${FONT_LINK}
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{width:540px;height:${H}px;overflow:hidden;font-family:'Nunito',sans-serif;}
.post{width:540px;height:${H}px;position:relative;overflow:hidden;}

.bg{position:absolute;inset:0;background:#f5f4f8;}
.bg-accent{position:absolute;inset:0;background:radial-gradient(ellipse at 20% 90%, rgba(38,182,205,0.12) 0%, transparent 55%);}
.bg-accent2{position:absolute;inset:0;background:radial-gradient(ellipse at 85% 75%, rgba(249,112,64,0.08) 0%, transparent 45%);}
.floor-glow{position:absolute;bottom:155px;left:50%;transform:translateX(-50%);width:320px;height:40px;background:radial-gradient(ellipse,rgba(155,93,229,0.18) 0%,transparent 70%);filter:blur(8px);}

.phone-wrap{position:absolute;top:28px;left:50%;transform:translateX(-50%);width:210px;height:420px;}
.phone{position:absolute;inset:0;border-radius:36px;background:linear-gradient(160deg,#2a2a3a 0%,#111118 40%,#0a0a10 100%);box-shadow:0 0 0 1.5px rgba(255,255,255,0.12), 0 0 0 3px rgba(0,0,0,0.8), 0 30px 80px rgba(0,0,0,0.25), 0 0 60px rgba(131,120,182,0.15);}
.phone::before{content:'';position:absolute;right:-4px;top:90px;width:4px;height:36px;border-radius:0 3px 3px 0;background:linear-gradient(to bottom,#333,#222);}
.phone::after{content:'';position:absolute;left:-4px;top:70px;width:4px;height:26px;border-radius:3px 0 0 3px;background:linear-gradient(to bottom,#333,#222);box-shadow:0 34px 0 #222;}
.screen{position:absolute;top:10px;left:8px;right:8px;bottom:10px;border-radius:28px;overflow:hidden;background:#050508;}
.screen-img{position:absolute;inset:0;background-image:url('${imageSrc}');background-size:cover;background-position:center top;opacity:0.9;}
.screen-img::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.0) 40%,rgba(0,0,0,0.6) 100%);}
.notch{position:absolute;top:12px;left:50%;transform:translateX(-50%);width:72px;height:22px;background:#000;border-radius:12px;z-index:10;}

.card-bubble{position:absolute;top:110px;left:-108px;width:120px;background:#ffffff;border-radius:14px;padding:10px 12px;box-shadow:0 4px 20px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05);transform:rotate(-4deg);z-index:20;}
.card-bubble-tag{font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#9b5de5;margin-bottom:4px;}
.card-bubble-text{font-size:11px;font-weight:700;color:#1a1a2e;line-height:1.3;}

.card-xp{position:absolute;top:90px;right:-112px;width:118px;background:#1a1030;border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:10px 12px;box-shadow:0 4px 20px rgba(0,0,0,0.2);transform:rotate(3deg);z-index:20;}
.card-xp-label{font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:5px;}
.card-xp-bar-bg{height:6px;background:rgba(255,255,255,0.12);border-radius:3px;overflow:hidden;margin-bottom:5px;}
.card-xp-bar-fill{height:100%;width:72%;background:linear-gradient(90deg,#26c6da,#80e27e);border-radius:3px;}
.card-xp-val{font-size:11px;font-weight:800;color:#fff;}

.card-scene{position:absolute;bottom:120px;left:-96px;width:104px;background:#1a1030;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:9px 11px;box-shadow:0 4px 20px rgba(0,0,0,0.2);transform:rotate(2deg);z-index:20;}
.card-scene-dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:linear-gradient(135deg,#26c6da,#80e27e);margin-right:5px;vertical-align:middle;}
.card-scene-label{font-size:10px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.07em;margin-bottom:3px;}
.card-scene-val{font-size:11px;font-weight:800;color:#fff;}

.card-streak{position:absolute;bottom:105px;right:-106px;width:110px;background:#1a1030;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:9px 12px;box-shadow:0 4px 20px rgba(0,0,0,0.2);transform:rotate(-3deg);z-index:20;}
.card-streak-emoji{font-size:18px;line-height:1;margin-bottom:3px;}
.card-streak-label{font-size:9px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.07em;}
.card-streak-val{font-size:14px;font-weight:900;color:#fff;}

.copy{position:absolute;bottom:0;left:0;right:0;padding:0 48px ${copyPadBottom}px;text-align:center;}
h1{font-size:${h1Sz}px;font-weight:900;color:#1a1030;line-height:1.04;letter-spacing:-.025em;margin-bottom:14px;}
.accent{background:linear-gradient(90deg,#f97040,#e94899,#9b5de5,#26c6da,#80e27e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.cta-row{display:flex;align-items:center;justify-content:center;gap:14px;}
.cta-btn{background:${BADGE_GRADIENT};border-radius:100px;padding:11px 26px;font-size:14px;font-weight:800;color:#fff;}
.cta-free{font-size:12px;font-weight:600;color:rgba(0,0,0,.35);}
.top-line{position:absolute;top:0;left:0;right:0;height:3px;background:${BADGE_GRADIENT};z-index:30;}
</style></head><body>
<div class="post">
  <div class="bg"></div>
  <div class="bg-accent"></div>
  <div class="bg-accent2"></div>
  <div class="top-line"></div>
  <div class="floor-glow"></div>

  <div class="phone-wrap">
    <div class="phone">
      <div class="screen">
        <div class="screen-img"></div>
        <div class="notch"></div>
      </div>
    </div>

    <div class="card-bubble">
      <div class="card-bubble-tag">Você disse</div>
      <div class="card-bubble-text" data-slot="hook">${variant.hook}</div>
    </div>

    <div class="card-xp">
      <div class="card-xp-label">Progresso</div>
      <div class="card-xp-bar-bg"><div class="card-xp-bar-fill"></div></div>
      <div class="card-xp-val">+72 XP</div>
    </div>

    <div class="card-scene">
      <div class="card-scene-label"><span class="card-scene-dot"></span>Cena</div>
      <div class="card-scene-val">Café · A2</div>
    </div>

    <div class="card-streak">
      <div class="card-streak-emoji">🔥</div>
      <div class="card-streak-label">Sequência</div>
      <div class="card-streak-val">7 dias</div>
    </div>
  </div>

  <div class="copy">
    <h1 data-slot="headline">${headlineHtml}</h1>
    <div class="cta-row">
      <div class="cta-btn" data-slot="cta">${variant.cta}</div>
      <div class="cta-free">É grátis</div>
    </div>
  </div>
</div>
</body></html>`
}