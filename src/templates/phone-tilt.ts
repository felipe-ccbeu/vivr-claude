import { CopyVariant } from '../content-schema'
import { StyleConfig } from '../styles'
import { FONT_LINK, highlightAccentWord } from './shared'

/**
 * PHONE-TILT — celular inclinado à direita com copy em destaque à esquerda.
 * Layout assimétrico: texto bold no lado esquerdo, phone rotacionado no direito.
 * Cards menores de reforço (XP, streak) flutuam próximos ao celular.
 * Supports all design variations via StyleConfig parameter.
 */
export function buildPhoneTilt(variant: CopyVariant, imageSrc: string, styleConfig: StyleConfig): string {
  const headlineHtml = highlightAccentWord(variant.headline, variant.accentWord)

  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
${FONT_LINK}
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{width:540px;height:675px;overflow:hidden;font-family:'Nunito',sans-serif;}
.post{width:540px;height:675px;position:relative;overflow:hidden;}

.bg{position:absolute;inset:0;background:radial-gradient(ellipse at 30% 20%,#3a0f72 0%,#110830 40%,#050212 70%,#021318 100%);}
.bg-accent{position:absolute;inset:0;background:radial-gradient(ellipse at 75% 85%,rgba(38,182,205,0.28) 0%,transparent 50%);}
.bg-accent2{position:absolute;inset:0;background:radial-gradient(ellipse at 10% 75%,rgba(233,72,153,0.18) 0%,transparent 45%);}
.noise{position:absolute;inset:0;opacity:.03;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}

.top-line{position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#f7c948,#f97040,#e94899,#9b5de5,#26c6da,#80e27e);z-index:30;}

/* LEFT COPY BLOCK */
.copy-block{position:absolute;top:0;left:0;width:262px;height:100%;display:flex;flex-direction:column;justify-content:center;padding:48px 0 48px 36px;z-index:10;}
.tag{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:100px;padding:5px 12px;margin-bottom:18px;width:fit-content;}
.tag-dot{width:6px;height:6px;border-radius:50%;background:linear-gradient(135deg,#f97040,#e94899);}
.tag-text{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,0.6);}
h1{font-size:32px;font-weight:900;color:#fff;line-height:1.05;letter-spacing:-.02em;margin-bottom:16px;}
.accent{background:linear-gradient(90deg,#f97040,#e94899,#9b5de5,#26c6da,#80e27e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.hook-box{background:rgba(255,255,255,0.05);border-left:3px solid #e94899;border-radius:0 8px 8px 0;padding:10px 12px;margin-bottom:20px;}
.hook-text{font-size:12px;font-weight:600;color:rgba(255,255,255,0.7);line-height:1.4;font-style:italic;}
.cta-btn{display:inline-block;background:linear-gradient(135deg,#f97040,#e94899 45%,#9b5de5 75%,#26c6da);border-radius:100px;padding:12px 22px;font-size:13px;font-weight:800;color:#fff;margin-bottom:10px;}
.cta-free{font-size:11px;font-weight:600;color:rgba(255,255,255,.3);}

/* PHONE */
.phone-wrap{position:absolute;top:50px;right:-18px;width:200px;height:390px;transform:rotate(10deg);z-index:15;}
.phone{position:absolute;inset:0;border-radius:34px;background:linear-gradient(160deg,#2a2a3a 0%,#111118 40%,#0a0a10 100%);box-shadow:0 0 0 1.5px rgba(255,255,255,0.12),0 0 0 3px rgba(0,0,0,0.8),0 30px 80px rgba(0,0,0,0.7),0 0 50px rgba(131,120,182,0.3);}
.phone::before{content:'';position:absolute;right:-4px;top:80px;width:4px;height:32px;border-radius:0 3px 3px 0;background:linear-gradient(to bottom,#333,#222);}
.phone::after{content:'';position:absolute;left:-4px;top:65px;width:4px;height:24px;border-radius:3px 0 0 3px;background:linear-gradient(to bottom,#333,#222);box-shadow:0 32px 0 #222;}
.screen{position:absolute;top:10px;left:7px;right:7px;bottom:10px;border-radius:26px;overflow:hidden;background:#050508;}
.screen-img{position:absolute;inset:0;background-image:url('${imageSrc}');background-size:cover;background-position:center top;opacity:0.9;}
.screen-img::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.05),rgba(0,0,0,0) 35%,rgba(0,0,0,0.55) 100%);}
.notch{position:absolute;top:11px;left:50%;transform:translateX(-50%);width:64px;height:20px;background:#000;border-radius:10px;z-index:10;}

/* UI ELEMENTS ON SCREEN */
.screen-ui{position:absolute;bottom:18px;left:10px;right:10px;z-index:5;}
.screen-msg{background:rgba(233,72,153,0.9);border-radius:12px 12px 3px 12px;padding:7px 10px;font-size:9px;font-weight:700;color:#fff;line-height:1.3;max-width:80%;margin-left:auto;margin-bottom:6px;}
.screen-reply{background:rgba(255,255,255,0.12);border-radius:3px 12px 12px 12px;padding:7px 10px;font-size:9px;font-weight:600;color:rgba(255,255,255,0.8);line-height:1.3;max-width:75%;}

/* FLOATING CARDS */
.card-xp{position:absolute;top:30px;left:-90px;width:100px;background:linear-gradient(135deg,rgba(38,182,205,0.2),rgba(131,120,182,0.25));backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.15);border-radius:12px;padding:9px 11px;box-shadow:0 8px 28px rgba(0,0,0,0.4);transform:rotate(-5deg);z-index:20;}
.card-xp-label{font-size:8px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,0.5);margin-bottom:4px;}
.card-xp-bar-bg{height:5px;background:rgba(255,255,255,0.12);border-radius:3px;overflow:hidden;margin-bottom:4px;}
.card-xp-bar-fill{height:100%;width:68%;background:linear-gradient(90deg,#26c6da,#80e27e);border-radius:3px;}
.card-xp-val{font-size:11px;font-weight:800;color:#fff;}

.card-streak{position:absolute;bottom:80px;left:-80px;width:94px;background:linear-gradient(135deg,rgba(249,112,64,0.25),rgba(233,72,153,0.2));backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.12);border-radius:12px;padding:9px 11px;box-shadow:0 8px 28px rgba(0,0,0,0.4);transform:rotate(4deg);z-index:20;}
.card-streak-emoji{font-size:16px;line-height:1;margin-bottom:3px;}
.card-streak-label{font-size:8px;font-weight:700;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:.07em;}
.card-streak-val{font-size:13px;font-weight:900;color:#fff;}

/* DIVIDER LINE */
.divider{position:absolute;top:60px;bottom:60px;left:250px;width:1px;background:linear-gradient(to bottom,transparent,rgba(255,255,255,0.08) 30%,rgba(255,255,255,0.08) 70%,transparent);z-index:5;}
</style></head><body>
<div class="post">
  <div class="bg"></div>
  <div class="bg-accent"></div>
  <div class="bg-accent2"></div>
  <div class="noise"></div>
  <div class="top-line"></div>
  <div class="divider"></div>

  <div class="copy-block">
    <div class="tag"><span class="tag-dot"></span><span class="tag-text">VivaVr</span></div>
    <h1 data-slot="headline">${headlineHtml}</h1>
    <div class="hook-box">
      <div class="hook-text" data-slot="hook">${variant.hook}</div>
    </div>
    <div class="cta-btn" data-slot="cta">${variant.cta}</div>
    <div class="cta-free">É grátis · Sem cartão</div>
  </div>

  <div class="phone-wrap">
    <div class="phone">
      <div class="screen">
        <div class="screen-img"></div>
        <div class="notch"></div>
        <div class="screen-ui">
          <div class="screen-msg">Good morning! ☀️</div>
          <div class="screen-reply">Bom dia! Posso te ajudar?</div>
        </div>
      </div>
    </div>

    <div class="card-xp">
      <div class="card-xp-label">Progresso</div>
      <div class="card-xp-bar-bg"><div class="card-xp-bar-fill"></div></div>
      <div class="card-xp-val">+68 XP</div>
    </div>

    <div class="card-streak">
      <div class="card-streak-emoji">🔥</div>
      <div class="card-streak-label">Sequência</div>
      <div class="card-streak-val">7 dias</div>
    </div>
  </div>
</div>
</body></html>`
}