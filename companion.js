(function () {
  "use strict";
  // Kai = a surprise shapeshifting companion. Hidden most of the time.
  // Every so often it POPS in at the left margin in a random form, does a
  // full-body animation + emotion, lingers briefly, then poofs away.
  let CONTENT = { funFacts: [], quote: "" };
  let clickCount = 0, resetTimer = null;
  let wrap, svg, formEl, faceEl, bodyEl, visitTimer, hideTimer, pinned = false, alive = true;
  let form = "cat", mood = "happy";
  const SIZE = 64;

  // Multiple cute forms (cat, slime, ghost, star, bird). Each is a body group; face added separately.
  const FORMS = {
    cat: '<path id="tail" d="M80 78 Q96 76 92 56" stroke="#7A5CFF" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M28 84 Q26 58 52 58 Q78 58 76 84 Z" fill="#7A5CFF"/><circle cx="52" cy="44" r="22" fill="#7A5CFF"/><path d="M34 30 L30 12 Q42 20 48 28 Z" fill="#7A5CFF"/><path d="M70 30 L74 12 Q62 20 56 28 Z" fill="#7A5CFF"/><path d="M35 24 L33 16 L40 22 Z" fill="#FF6A2B"/><path d="M69 24 L71 16 L64 22 Z" fill="#FF6A2B"/>',
    slime: '<path d="M22 64 Q18 38 52 36 Q86 38 82 64 Q86 88 52 90 Q18 88 22 64 Z" fill="#5FAE7E"/><ellipse cx="52" cy="46" rx="16" ry="6" fill="#fff" opacity="0.2"/>',
    ghost: '<path d="M28 56 Q28 28 52 28 Q76 28 76 56 L76 84 Q72 78 68 84 Q64 90 60 84 Q56 78 52 84 Q48 90 44 84 Q40 78 36 84 L28 84 Z" fill="#7A5C8E"/>',
    star: '<path d="M52 22 L61 46 L86 46 L66 61 L73 86 L52 70 L31 86 L38 61 L18 46 L43 46 Z" fill="#E8B24C"/>',
    bird: '<ellipse cx="52" cy="56" rx="24" ry="22" fill="#FF6A2B"/><path d="M52 38 Q56 28 62 30 Q58 36 56 40 Z" fill="#7A5CFF"/><path d="M28 56 Q14 50 20 64 Q28 62 34 62 Z" fill="#E8B24C"/><path d="M50 60 L42 64 L50 66 Z" fill="#241B14"/>'
  };
  const FACE_Y = { cat: 46, slime: 58, ghost: 52, star: 52, bird: 54 };
  const MOODS = {
    happy:{eye:1, mouth:"M-6 4 Q0 9 6 4"}, curious:{eye:1.15, mouth:"M-4 5 Q0 2 4 5"},
    sleepy:{eye:0.2, mouth:"M-4 5 Q0 7 4 5"}, love:{eye:1, mouth:"M-6 4 Q0 10 6 4"}, wow:{eye:1.2, mouth:"M-3 4 Q0 9 3 4"}
  };
  const FORM_LIST = ["cat","slime","ghost","star","bird"];

  function build() {
    wrap = document.createElement("div");
    wrap.id = "kai"; wrap.setAttribute("aria-hidden", "true");
    wrap.style.cssText = "position:fixed;left:16px;top:50%;width:" + SIZE + "px;height:" + SIZE + "px;z-index:55;pointer-events:auto;cursor:pointer;opacity:0;transform:scale(.3);transition:opacity .35s var(--ease),transform .4s var(--ease);will-change:transform,opacity;display:none;";
    wrap.innerHTML = '<div id="kai-bubble"></div><div id="kai-body"><svg width="' + SIZE + '" height="' + SIZE + '" viewBox="0 0 104 104" id="kai-svg"><ellipse cx="52" cy="94" rx="18" ry="3.5" fill="#241B14" opacity="0.12"/><g id="kai-form"></g><g id="kai-face"></g></svg></div>';
    document.body.appendChild(wrap);
    svg = document.getElementById("kai-svg"); bodyEl = document.getElementById("kai-body");
    formEl = document.getElementById("kai-form"); faceEl = document.getElementById("kai-face");

    const tog = document.createElement("button");
    tog.id = "kai-toggle"; tog.setAttribute("aria-label", "Summon Kai"); tog.title = "Summon Kai";
    tog.innerHTML = '<svg width="24" height="24" viewBox="0 0 104 104"><circle cx="52" cy="50" r="22" fill="#7A5CFF"/><path d="M36 34 L32 20 Q42 28 47 33 Z" fill="#7A5CFF"/><path d="M68 34 L72 20 Q62 28 57 33 Z" fill="#7A5CFF"/><circle cx="45" cy="48" r="3" fill="#fff"/><circle cx="59" cy="48" r="3" fill="#fff"/></svg>';
    tog.style.cssText = "position:fixed;bottom:22px;right:22px;z-index:56;width:46px;height:46px;border-radius:50%;border:2px solid var(--ink);background:var(--surface);cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:3px 3px 0 var(--line-strong);transition:transform .2s var(--ease);";
    document.body.appendChild(tog);
    return tog;
  }

  function setForm(f) { form = f; formEl.innerHTML = FORMS[f]; drawFace(); }
  function drawFace() {
    const m = MOODS[mood]; const cy = FACE_Y[form]; const er = 4.5 * m.eye; const ry = m.eye < 0.4 ? 1.4 : er;
    const lx = 44, rx = 60;
    const mp = m.mouth.replace(/(-?\d+(\.\d+)?)/g, n => parseFloat(n));
    let h = "";
    h += '<ellipse cx="'+lx+'" cy="'+cy+'" rx="5" ry="'+(ry+1)+'" fill="#fff"/>';
    h += '<ellipse cx="'+rx+'" cy="'+cy+'" rx="5" ry="'+(ry+1)+'" fill="#fff"/>';
    h += '<circle class="kp" cx="'+lx+'" cy="'+cy+'" r="'+er+'" fill="#1a1430"/>';
    h += '<circle class="kp" cx="'+rx+'" cy="'+cy+'" r="'+er+'" fill="#1a1430"/>';
    if (m.eye >= 0.4) h += '<circle cx="'+(lx+1.5)+'" cy="'+(cy-1.5)+'" r="1.2" fill="#fff"/><circle cx="'+(rx+1.5)+'" cy="'+(cy-1.5)+'" r="1.2" fill="#fff"/>';
    h += '<circle cx="'+(lx-7)+'" cy="'+(cy+6)+'" r="3" fill="#FF6A2B" opacity="0.4"/><circle cx="'+(rx+7)+'" cy="'+(cy+6)+'" r="3" fill="#FF6A2B" opacity="0.4"/>';
    h += '<path d="M52 '+(cy+9)+' m'+mp+'" stroke="#1a1430" stroke-width="2" fill="none" stroke-linecap="round"/>';
    faceEl.innerHTML = h;
  }
  function setMood(mm){ if(MOODS[mm]){ mood=mm; drawFace(); } }

  function say(msg, ms){ const b=document.getElementById("kai-bubble"); if(!b||!msg)return; b.textContent=msg; b.classList.add("show"); clearTimeout(b._t); b._t=setTimeout(()=>b.classList.remove("show"), ms||3200); }

  function poofAt(){ if(!wrap)return; const r=wrap.getBoundingClientRect(); const cx=r.left+r.width/2, cy=r.top+r.height/2; const cols=["#FF6A2B","#5FAE7E","#E8B24C","#7A5C8E","#7A5CFF","#fff"]; for(let i=0;i<16;i++){ const s=document.createElement("span"); s.className="kai-particle"; const a=(Math.PI*2*i)/16, d=28+Math.random()*34; s.style.cssText="position:fixed;left:"+cx+"px;top:"+cy+"px;width:9px;height:9px;border-radius:50%;background:"+cols[i%cols.length]+";z-index:57;pointer-events:none;"; s.style.setProperty("--dx",Math.cos(a)*d+"px"); s.style.setProperty("--dy",Math.sin(a)*d+"px"); document.body.appendChild(s); setTimeout(()=>s.remove(),760);} }

  function randomTop(){ const vh=window.innerHeight; return Math.max(90, Math.min(vh-SIZE-90, vh*(0.3+Math.random()*0.4))); }

  // Full-body animations
  function bodyAnim(kind){
    if(!bodyEl.animate)return;
    if(kind==="bounce") bodyEl.animate([{transform:"translateY(0)"},{transform:"translateY(-14px)"},{transform:"translateY(0)"},{transform:"translateY(-7px)"},{transform:"translateY(0)"}],{duration:900,easing:"ease"});
    else if(kind==="wiggle") bodyEl.animate([{transform:"rotate(0)"},{transform:"rotate(-10deg)"},{transform:"rotate(10deg)"},{transform:"rotate(-6deg)"},{transform:"rotate(0)"}],{duration:800,easing:"ease"});
    else if(kind==="spin") bodyEl.animate([{transform:"rotate(0) scale(1)"},{transform:"rotate(360deg) scale(1.1)"},{transform:"rotate(360deg) scale(1)"}],{duration:900,easing:"ease"});
    else if(kind==="squish") bodyEl.animate([{transform:"scale(1,1)"},{transform:"scale(1.2,.8)"},{transform:"scale(.9,1.1)"},{transform:"scale(1,1)"}],{duration:700,easing:"ease"});
  }

  // A "visit": pop in (random form + spot), animate, emote, linger, leave
  function visit(){
    if(!alive || pinned || document.visibilityState!=="visible") return;
    setForm(FORM_LIST[Math.floor(Math.random()*FORM_LIST.length)]);
    setMood("happy");
    wrap.style.display="block";
    wrap.style.top = randomTop()+"px";
    requestAnimationFrame(()=>{ wrap.style.opacity="1"; wrap.style.transform="scale(1)"; poofAt(); });
    // sequence of body animations + emotions
    const kinds=["bounce","wiggle","spin","squish"];
    let step=0;
    const act=()=>{ if(!alive)return; bodyAnim(kinds[step%kinds.length]); setMood(["happy","curious","love","wow"][step%4]); step++; };
    setTimeout(act,400); setTimeout(act,1500); setTimeout(act,2700);
    if(Math.random()<0.5) setTimeout(()=>say(["meow!","hi!","peekaboo","✨"][Math.floor(Math.random()*4)],2200),700);
    // leave after a few seconds
    clearTimeout(hideTimer);
    hideTimer=setTimeout(()=>{ if(!pinned) leave(); }, 4200+Math.random()*1800);
  }
  function leave(){ poofAt(); wrap.style.opacity="0"; wrap.style.transform="scale(.3)"; setTimeout(()=>{ if(!pinned) wrap.style.display="none"; },380); }

  function scheduleVisit(){ clearTimeout(visitTimer); visitTimer=setTimeout(()=>{ visit(); scheduleVisit(); }, 14000+Math.random()*12000); }

  function celebrate(){
    pinned=true; clearTimeout(hideTimer); wrap.style.display="block";
    requestAnimationFrame(()=>{ wrap.style.opacity="1"; wrap.style.transform="scale(1)"; });
    setMood("love"); bodyAnim("spin"); poofAt();
    const pool=(CONTENT.funFacts||[]).slice(); if(CONTENT.quote) pool.push("“"+CONTENT.quote+"”");
    say(pool.length?pool[Math.floor(Math.random()*pool.length)]:"meow! 🎉", 5500);
    setTimeout(()=>{ pinned=false; leave(); }, 5600);
  }

  function onPoke(){
    pinned=true; clearTimeout(hideTimer);
    clickCount++; clearTimeout(resetTimer); resetTimer=setTimeout(()=>clickCount=0,2500);
    setMood("love"); bodyAnim("bounce");
    // shapeshift on each poke
    setForm(FORM_LIST[(FORM_LIST.indexOf(form)+1)%FORM_LIST.length]);
    if(clickCount>=5){ clickCount=0; celebrate(); return; }
    say(["meow!","purr~","hehe","one more!"][Math.min(clickCount-1,3)],1400);
    clearTimeout(hideTimer); hideTimer=setTimeout(()=>{ pinned=false; leave(); }, 3500);
  }

  function konami(){ const seq=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"]; let i=0; document.addEventListener("keydown",(e)=>{ const k=e.key.length===1?e.key.toLowerCase():e.key; i=k===seq[i]?i+1:(k===seq[0]?1:0); if(i===seq.length){ i=0; celebrate(); } }); }

  function wireBlobCursor(){ const blob=document.createElement("div"); blob.id="blob-cursor"; document.body.appendChild(blob); document.addEventListener("mousemove",(e)=>{ blob.style.left=e.clientX+"px"; blob.style.top=e.clientY+"px"; }); function bind(){ document.querySelectorAll("#projects .card, #thoughts .thought").forEach((el)=>{ if(el._blob)return; el._blob=true; el.classList.add("cursor-zone"); el.addEventListener("mouseenter",()=>{ blob.classList.add("on"); blob.textContent=el.closest("#thoughts")?"read":"view"; }); el.addEventListener("mouseleave",()=>{ blob.classList.remove("on"); blob.textContent=""; }); }); } bind(); setTimeout(bind,1000); }

  function init(content){
    if(content && content.meta){ CONTENT.funFacts=content.meta.funFacts||[]; CONTENT.quote=content.meta.quote||""; }
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tog=build(); setForm("cat"); setMood("happy");
    wrap.addEventListener("click",(e)=>{ e.stopPropagation(); onPoke(); });
    tog.addEventListener("click",()=>{ visit(); say("hi! 🐾",2200); });
    wireBlobCursor();
    if(!reduced){
      // first surprise visit after a short delay, then on a long random cadence
      setTimeout(()=>{ visit(); scheduleVisit(); }, 4000);
      konami();
    }
  }
  window.KaiCompanion = { init };
})();
