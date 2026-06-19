(function () {
  "use strict";
  // Kai = a surprise shapeshifting companion with moods, reactions and a big
  // pool of randomised lines. Hidden most of the time; pops in, reacts to what
  // you're looking at, emotes, and poofs away. Desktop only (hidden on mobile).
  let CONTENT = { funFacts: [], quote: "" };
  let clickCount = 0, resetTimer = null;
  let wrap, svg, formEl, faceEl, bodyEl, visitTimer, hideTimer, pinned = false, alive = true;
  let form = "cat", mood = "happy";
  let blinkTimer = null, idleTimer = null, lastSection = "";
  const SIZE = 64;

  const FORMS = {
    cat: '<path id="tail" d="M80 78 Q96 76 92 56" stroke="#7A5CFF" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M28 84 Q26 58 52 58 Q78 58 76 84 Z" fill="#7A5CFF"/><circle cx="52" cy="44" r="22" fill="#7A5CFF"/><path d="M34 30 L30 12 Q42 20 48 28 Z" fill="#7A5CFF"/><path d="M70 30 L74 12 Q62 20 56 28 Z" fill="#7A5CFF"/><path d="M35 24 L33 16 L40 22 Z" fill="#FF6A2B"/><path d="M69 24 L71 16 L64 22 Z" fill="#FF6A2B"/>',
    slime: '<path d="M22 64 Q18 38 52 36 Q86 38 82 64 Q86 88 52 90 Q18 88 22 64 Z" fill="#5FAE7E"/><ellipse cx="52" cy="46" rx="16" ry="6" fill="#fff" opacity="0.2"/>',
    ghost: '<path d="M28 56 Q28 28 52 28 Q76 28 76 56 L76 84 Q72 78 68 84 Q64 90 60 84 Q56 78 52 84 Q48 90 44 84 Q40 78 36 84 L28 84 Z" fill="#7A5C8E"/>',
    star: '<path d="M52 22 L61 46 L86 46 L66 61 L73 86 L52 70 L31 86 L38 61 L18 46 L43 46 Z" fill="#E8B24C"/>',
    bird: '<ellipse cx="52" cy="56" rx="24" ry="22" fill="#FF6A2B"/><path d="M52 38 Q56 28 62 30 Q58 36 56 40 Z" fill="#7A5CFF"/><path d="M28 56 Q14 50 20 64 Q28 62 34 62 Z" fill="#E8B24C"/><path d="M50 60 L42 64 L50 66 Z" fill="#241B14"/>'
  };
  const FACE_Y = { cat: 46, slime: 58, ghost: 52, star: 52, bird: 54 };

  // Moods control eye size, sparkle and mouth shape. More expressions now.
  const MOODS = {
    happy:   { eye: 1.0,  mouth: "M-6 4 Q0 9 6 4",  sparkle: false },
    curious: { eye: 1.15, mouth: "M-4 5 Q0 2 4 5",  sparkle: false, brow: true },
    sleepy:  { eye: 0.18, mouth: "M-4 5 Q0 7 4 5",  sparkle: false },
    yawn:    { eye: 0.25, mouth: "ELLIPSE",          sparkle: false },
    love:    { eye: 1.0,  mouth: "M-6 4 Q0 10 6 4", sparkle: false, hearts: true },
    wow:     { eye: 1.25, mouth: "M-3 4 Q0 9 3 4",  sparkle: true },
    star:    { eye: 1.1,  mouth: "M-5 4 Q0 8 5 4",  sparkle: true, bigstar: true }, // bright pleasing eyes
    proud:   { eye: 1.05, mouth: "M-6 5 Q0 8 6 5",  sparkle: false, brow: true },
    shy:     { eye: 0.8,  mouth: "M-3 5 Q0 7 3 5",  sparkle: false, blush: true }
  };
  const FORM_LIST = ["cat","slime","ghost","star","bird"];

  // ---- no-repeat random "bag" so lines/forms don't feel patterned ----
  function makeBag(items){ let pool=[]; return function(){ if(!pool.length) pool=shuffle(items.slice()); return pool.pop(); }; }
  function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
  function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
  function chance(p){ return Math.random() < p; }

  // Big, varied dialogue pools — general + per-section. Drawn via no-repeat bags.
  const LINES = {
    general: ["meow!","purr~","hi there 🐾","just vibing","oh, hello!","*stretches*","boop","hehe","✨","what're we building?","peekaboo","mrrp?","i like it here","*flops over*","zoomies incoming","tail wag","🐾","*blinks slowly*"],
    work:    ["220 models? show-off 😼","ooh, shipping things","this one's solid","product brain go brrr","0 to 1, nice","measured outcomes 👀","i'd hire him","*nods approvingly*","big builder energy"],
    decks:   ["slides! my favorite","*adjusts tiny glasses*","clean deck 📊","storytelling, huh","next slide please","ooh pretty charts","*pretends to take notes*"],
    thoughts:["*curls up to read*","mmm, good thinking","*yawns* …cozy reads","deep thoughts 🐾","i'm listening…","*nods along*","wise words","*reads over your shoulder*","tell me more"],
    github:  ["look at those squares!","green grass 🌱","commit streak 💪","proud of this one","busy little builder","*counts the dots*"],
    contact: ["say hi to him! 💌","he replies fast, promise","go on, reach out ✨","good vibes only 💜","*hopeful eyes*","this is the part where you click","slide into that inbox 📨"],
    hero:    ["welcome! 🐾","scroll on, friend","glad you're here ✨","let's explore"]
  };
  const bag = {};
  Object.keys(LINES).forEach(k => bag[k] = makeBag(LINES[k]));
  const formBag = makeBag(FORM_LIST);
  function line(section){ const k = LINES[section] ? section : "general"; return bag[k](); }

  function build() {
    wrap = document.createElement("div");
    wrap.id = "kai"; wrap.setAttribute("aria-hidden", "true");
    wrap.style.cssText = "position:fixed;left:16px;top:50%;width:" + SIZE + "px;height:" + SIZE + "px;z-index:55;pointer-events:auto;cursor:pointer;opacity:0;transform:scale(.3);transition:opacity .35s var(--ease),transform .4s var(--ease);will-change:transform,opacity;display:none;";
    wrap.innerHTML = '<div id="kai-bubble"></div><div id="kai-body"><svg width="' + SIZE + '" height="' + SIZE + '" viewBox="0 0 104 104" id="kai-svg"><ellipse cx="52" cy="94" rx="18" ry="3.5" fill="#241B14" opacity="0.12"/><g id="kai-form"></g><g id="kai-face"></g></svg></div>';
    document.body.appendChild(wrap);
    svg = document.getElementById("kai-svg"); bodyEl = document.getElementById("kai-body");
    formEl = document.getElementById("kai-form"); faceEl = document.getElementById("kai-face");

    const tog = document.createElement("button");
    tog.id = "kai-toggle"; tog.setAttribute("aria-label", "Summon Kai"); tog.title = "psst… summon Kai";
    tog.innerHTML = '<svg width="24" height="24" viewBox="0 0 104 104"><circle cx="52" cy="50" r="22" fill="#7A5CFF"/><path d="M36 34 L32 20 Q42 28 47 33 Z" fill="#7A5CFF"/><path d="M68 34 L72 20 Q62 28 57 33 Z" fill="#7A5CFF"/><circle cx="45" cy="48" r="3" fill="#fff"/><circle cx="59" cy="48" r="3" fill="#fff"/></svg>';
    tog.style.cssText = "position:fixed;bottom:22px;right:22px;z-index:56;width:46px;height:46px;border-radius:50%;border:2px solid var(--ink);background:var(--surface);cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:3px 3px 0 var(--line-strong);transition:transform .2s var(--ease);";
    document.body.appendChild(tog);
    return tog;
  }

  function setForm(f) { form = f; formEl.innerHTML = FORMS[f]; drawFace(); }
  function drawFace() {
    const m = MOODS[mood] || MOODS.happy; const cy = FACE_Y[form];
    const er = 4.5 * m.eye; const ry = m.eye < 0.4 ? 1.4 : er;
    const lx = 44, rx = 60;
    let h = "";
    // brow (curious/proud) — little angled lines above eyes
    if (m.brow) h += '<path d="M'+(lx-5)+' '+(cy-8)+' L'+(lx+4)+' '+(cy-6)+'" stroke="#1a1430" stroke-width="1.6" stroke-linecap="round"/><path d="M'+(rx+5)+' '+(cy-8)+' L'+(rx-4)+' '+(cy-6)+'" stroke="#1a1430" stroke-width="1.6" stroke-linecap="round"/>';
    if (m.bigstar) {
      // bright star-shaped sparkle eyes (pleasing, twinkly)
      h += starEye(lx, cy) + starEye(rx, cy);
    } else if (m.eye < 0.4) {
      // closed/sleepy eyes = gentle arcs
      h += '<path d="M'+(lx-5)+' '+cy+' Q'+lx+' '+(cy+3)+' '+(lx+5)+' '+cy+'" stroke="#1a1430" stroke-width="2" fill="none" stroke-linecap="round"/>';
      h += '<path d="M'+(rx-5)+' '+cy+' Q'+rx+' '+(cy+3)+' '+(rx+5)+' '+cy+'" stroke="#1a1430" stroke-width="2" fill="none" stroke-linecap="round"/>';
    } else {
      h += '<ellipse cx="'+lx+'" cy="'+cy+'" rx="5" ry="'+(ry+1)+'" fill="#fff"/>';
      h += '<ellipse cx="'+rx+'" cy="'+cy+'" rx="5" ry="'+(ry+1)+'" fill="#fff"/>';
      h += '<circle class="kp" cx="'+lx+'" cy="'+cy+'" r="'+er+'" fill="#1a1430"/>';
      h += '<circle class="kp" cx="'+rx+'" cy="'+cy+'" r="'+er+'" fill="#1a1430"/>';
      h += '<circle cx="'+(lx+1.5)+'" cy="'+(cy-1.5)+'" r="1.3" fill="#fff"/><circle cx="'+(rx+1.5)+'" cy="'+(cy-1.5)+'" r="1.3" fill="#fff"/>';
      if (m.sparkle) h += '<circle cx="'+(lx-2)+'" cy="'+(cy+1.5)+'" r="0.9" fill="#fff"/><circle cx="'+(rx-2)+'" cy="'+(cy+1.5)+'" r="0.9" fill="#fff"/>';
    }
    // blush (love/shy)
    if (m.hearts || m.blush) h += '<circle cx="'+(lx-7)+'" cy="'+(cy+6)+'" r="3.4" fill="#FF6A2B" opacity="0.45"/><circle cx="'+(rx+7)+'" cy="'+(cy+6)+'" r="3.4" fill="#FF6A2B" opacity="0.45"/>';
    else h += '<circle cx="'+(lx-7)+'" cy="'+(cy+6)+'" r="3" fill="#FF6A2B" opacity="0.35"/><circle cx="'+(rx+7)+'" cy="'+(cy+6)+'" r="3" fill="#FF6A2B" opacity="0.35"/>';
    // floating hearts for love
    if (m.hearts) h += '<path d="M'+(rx+9)+' '+(cy-10)+' q2 -3 4 0 q2 -3 4 0 q0 4 -4 6 q-4 -2 -4 -6 z" fill="#FF6A2B" opacity="0.85"/>';
    // mouth
    if (m.mouth === "ELLIPSE") {
      h += '<ellipse cx="52" cy="'+(cy+11)+'" rx="3.5" ry="5" fill="#1a1430"/>'; // yawn O
    } else {
      const mp = m.mouth.replace(/(-?\d+(\.\d+)?)/g, n => parseFloat(n));
      h += '<path d="M52 '+(cy+9)+' m'+mp+'" stroke="#1a1430" stroke-width="2" fill="none" stroke-linecap="round"/>';
    }
    faceEl.innerHTML = h;
  }
  function starEye(cx, cy){
    const r=5.2, ri=2.2; let p="";
    for(let i=0;i<10;i++){ const ang=-Math.PI/2 + i*Math.PI/5; const rad=i%2?ri:r; p+=(i?"L":"M")+(cx+Math.cos(ang)*rad).toFixed(1)+" "+(cy+Math.sin(ang)*rad).toFixed(1); }
    return '<path d="'+p+'Z" fill="#E8B24C"/>';
  }
  function setMood(mm){ if(MOODS[mm]){ mood=mm; drawFace(); } }

  // periodic blink while visible
  function startBlink(){
    stopBlink();
    blinkTimer = setInterval(() => {
      if (!wrap || wrap.style.display === "none" || mood === "sleepy" || mood === "yawn") return;
      const prev = mood; setMood("sleepy");
      setTimeout(() => { if (mood === "sleepy") setMood(prev); }, 130);
    }, 2600 + Math.random()*2200);
  }
  function stopBlink(){ if(blinkTimer){ clearInterval(blinkTimer); blinkTimer=null; } }

  function say(msg, ms){ const b=document.getElementById("kai-bubble"); if(!b||!msg)return; b.textContent=msg; b.classList.add("show"); clearTimeout(b._t); b._t=setTimeout(()=>b.classList.remove("show"), ms||3200); }

  function poofAt(){ if(!wrap)return; const r=wrap.getBoundingClientRect(); const cx=r.left+r.width/2, cy=r.top+r.height/2; const cols=["#FF6A2B","#5FAE7E","#E8B24C","#7A5C8E","#7A5CFF","#fff"]; for(let i=0;i<16;i++){ const s=document.createElement("span"); s.className="kai-particle"; const a=(Math.PI*2*i)/16, d=28+Math.random()*34; s.style.cssText="position:fixed;left:"+cx+"px;top:"+cy+"px;width:9px;height:9px;border-radius:50%;background:"+cols[i%cols.length]+";z-index:57;pointer-events:none;"; s.style.setProperty("--dx",Math.cos(a)*d+"px"); s.style.setProperty("--dy",Math.sin(a)*d+"px"); document.body.appendChild(s); setTimeout(()=>s.remove(),760);} }

  function randomTop(){ const vh=window.innerHeight; return Math.max(90, Math.min(vh-SIZE-90, vh*(0.3+Math.random()*0.4))); }

  // Full-body animations — expanded set
  function bodyAnim(kind){
    if(!bodyEl || !bodyEl.animate) return;
    const E = "cubic-bezier(.34,1.56,.64,1)";
    if(kind==="bounce") bodyEl.animate([{transform:"translateY(0)"},{transform:"translateY(-14px)"},{transform:"translateY(0)"},{transform:"translateY(-7px)"},{transform:"translateY(0)"}],{duration:900,easing:"ease"});
    else if(kind==="wiggle") bodyEl.animate([{transform:"rotate(0)"},{transform:"rotate(-10deg)"},{transform:"rotate(10deg)"},{transform:"rotate(-6deg)"},{transform:"rotate(0)"}],{duration:800,easing:"ease"});
    else if(kind==="spin") bodyEl.animate([{transform:"rotate(0) scale(1)"},{transform:"rotate(360deg) scale(1.1)"},{transform:"rotate(360deg) scale(1)"}],{duration:900,easing:"ease"});
    else if(kind==="squish") bodyEl.animate([{transform:"scale(1,1)"},{transform:"scale(1.2,.8)"},{transform:"scale(.9,1.1)"},{transform:"scale(1,1)"}],{duration:700,easing:"ease"});
    else if(kind==="nod") bodyEl.animate([{transform:"rotate(0)"},{transform:"rotate(0) translateY(3px)"},{transform:"rotate(0)"},{transform:"translateY(3px)"},{transform:"translateY(0)"}],{duration:850,easing:"ease"});
    else if(kind==="tilt") bodyEl.animate([{transform:"rotate(0)"},{transform:"rotate(-16deg)"},{transform:"rotate(-16deg)"},{transform:"rotate(0)"}],{duration:1100,easing:"ease"});
    else if(kind==="stretch") bodyEl.animate([{transform:"scale(1,1)"},{transform:"scale(1.08,.92) translateY(2px)"},{transform:"scale(.96,1.08) translateY(-4px)"},{transform:"scale(1,1)"}],{duration:1200,easing:"ease"});
    else if(kind==="hop") bodyEl.animate([{transform:"translate(0,0)"},{transform:"translate(8px,-12px)"},{transform:"translate(0,0)"},{transform:"translate(-6px,-8px)"},{transform:"translate(0,0)"}],{duration:1000,easing:E});
    else if(kind==="float") bodyEl.animate([{transform:"translateY(0)"},{transform:"translateY(-6px)"},{transform:"translateY(0)"}],{duration:1600,easing:"ease-in-out"});
  }

  // A "visit": pop in (random form + spot), do a RANDOM little routine, leave.
  function visit(forcedMood, forcedLine){
    if(!alive || pinned || document.visibilityState!=="visible") return;
    setForm(formBag());
    setMood(forcedMood || "happy");
    wrap.style.display="block";
    wrap.style.top = randomTop()+"px";
    requestAnimationFrame(()=>{ wrap.style.opacity="1"; wrap.style.transform="scale(1)"; poofAt(); });
    startBlink();

    // Pick ONE of several random "personalities" for this visit
    const routines = [
      // playful
      () => { seq([["bounce","happy"],["wiggle","curious"],["spin","wow"]]); maybeSay(0.6, "general"); },
      // sleepy / yawn
      () => { setMood("sleepy"); setTimeout(()=>{ bodyAnim("stretch"); setMood("yawn"); }, 500); setTimeout(()=>setMood("sleepy"), 1500); maybeSay(0.5, "general", ["*yawn*","so cozy…","five more minutes…","zzz…"]); },
      // curious tilt + look around
      () => { bodyAnim("tilt"); setMood("curious"); setTimeout(()=>{ bodyAnim("nod"); setMood("happy"); }, 1200); maybeSay(0.6, "general"); },
      // happy float
      () => { bodyAnim("float"); setTimeout(()=>bodyAnim("float"),1600); setMood("happy"); maybeSay(0.5, "general"); },
      // excited
      () => { seq([["hop","wow"],["bounce","star"],["wiggle","happy"]]); maybeSay(0.7, "general"); }
    ];
    pick(routines)();

    clearTimeout(hideTimer);
    hideTimer=setTimeout(()=>{ if(!pinned) leave(); }, 4200+Math.random()*2600);
  }
  function seq(steps){ steps.forEach((s,i)=> setTimeout(()=>{ if(!alive)return; bodyAnim(s[0]); setMood(s[1]); }, 400 + i*1100)); }
  function maybeSay(p, section, custom){ if(chance(p)) setTimeout(()=>say(custom?pick(custom):line(section), 2200), 600+Math.random()*400); }

  function leave(){ stopBlink(); poofAt(); wrap.style.opacity="0"; wrap.style.transform="scale(.3)"; setTimeout(()=>{ if(!pinned) wrap.style.display="none"; },380); }

  function scheduleVisit(){ clearTimeout(visitTimer); visitTimer=setTimeout(()=>{ visit(); scheduleVisit(); }, 13000+Math.random()*14000); }

  function celebrate(){
    pinned=true; clearTimeout(hideTimer); wrap.style.display="block";
    requestAnimationFrame(()=>{ wrap.style.opacity="1"; wrap.style.transform="scale(1)"; });
    setMood("love"); bodyAnim("spin"); poofAt(); startBlink();
    const pool=(CONTENT.funFacts||[]).slice(); if(CONTENT.quote) pool.push("“"+CONTENT.quote+"”");
    say(pool.length?pick(pool):"meow! 🎉", 5500);
    setTimeout(()=>{ pinned=false; leave(); }, 5600);
  }

  // Clicking Kai: react with random mood + line, shapeshift, NOT a fixed sequence
  function onPoke(){
    pinned=true; clearTimeout(hideTimer);
    clickCount++; clearTimeout(resetTimer); resetTimer=setTimeout(()=>clickCount=0,2500);
    const reactMoods = ["love","happy","wow","curious","star","shy"];
    setMood(pick(reactMoods));
    bodyAnim(pick(["bounce","wiggle","squish","hop","spin"]));
    if(chance(0.4)) setForm(formBag()); // sometimes shapeshift, not always
    startBlink();
    if(clickCount>=6){ clickCount=0; celebrate(); return; }
    // randomised reactions; occasional special "easter" line
    const pokeLines = ["meow!","purr~","hehe","that tickles!","boop back atcha","again? 🐾","mrrp!","✨","ok ok i'm awake","*giggles*"];
    if(chance(0.12)) say(pick(["pet me more 💜","you found me 👀","secret: try the arrow keys ↑↑↓↓","i live in the margins"]), 1900);
    else say(pick(pokeLines), 1400);
    clearTimeout(hideTimer); hideTimer=setTimeout(()=>{ pinned=false; leave(); }, 3600);
  }

  // ---- React to what section the pointer is over (desktop) ----
  // Each section has a mood + animation; fires at RANDOM (not every hover) so
  // it stays surprising. Throttled so it doesn't spam.
  let reactCooldown = 0;
  const SECTION_REACT = {
    contact: { moods:["star","love"], anim:["bounce","float"], p:0.85 },   // bright pleasing eyes
    thoughts:{ moods:["sleepy","yawn","curious"], anim:["nod","stretch","tilt"], p:0.6 }, // nods / yawns
    projects:{ moods:["wow","proud","curious"], anim:["wiggle","hop","nod"], p:0.55 },
    decks:   { moods:["curious","happy"], anim:["tilt","nod"], p:0.5 },
    github:  { moods:["proud","wow"], anim:["bounce","spin"], p:0.6 },
    home:    { moods:["happy"], anim:["float"], p:0.3 }
  };
  function reactToSection(id){
    const cfg = SECTION_REACT[id]; if(!cfg) return;
    const now = Date.now();
    if (now - reactCooldown < 3500) return;      // throttle
    if (!chance(cfg.p)) { reactCooldown = now; return; } // sometimes ignore = stays random
    reactCooldown = now;
    if (pinned) return;
    // show Kai if hidden, then react
    const present = wrap && wrap.style.display !== "none" && wrap.style.opacity === "1";
    if (!present) { visit(pick(cfg.moods)); }
    else { setMood(pick(cfg.moods)); }
    bodyAnim(pick(cfg.anim));
    if (chance(0.55)) setTimeout(()=>say(line(id), 2400), 500);
    // linger a touch longer while you're in a section
    clearTimeout(hideTimer); hideTimer=setTimeout(()=>{ if(!pinned) leave(); }, 4800+Math.random()*2000);
  }

  function wireSectionReactions(){
    const ids = ["projects","decks","thoughts","github","contact"];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("mouseenter", () => {
        if (lastSection === id) return; lastSection = id;
        reactToSection(id);
      });
    });
    // reset lastSection when leaving so re-entry can react again
    document.addEventListener("mouseleave", () => { lastSection = ""; });
  }

  function konami(){ const seq=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"]; let i=0; document.addEventListener("keydown",(e)=>{ const k=e.key.length===1?e.key.toLowerCase():e.key; i=k===seq[i]?i+1:(k===seq[0]?1:0); if(i===seq.length){ i=0; celebrate(); } }); }

  function init(content){
    if(content && content.meta){ CONTENT.funFacts=content.meta.funFacts||[]; CONTENT.quote=content.meta.quote||""; }
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tog=build(); setForm("cat"); setMood("happy");
    wrap.addEventListener("click",(e)=>{ e.stopPropagation(); onPoke(); });
    tog.addEventListener("click",()=>{ visit(pick(["happy","star","love"])); say(pick(["hi! 🐾","you rang?","missed me?","here! ✨"]),2200); });
    if(!reduced){
      setTimeout(()=>{ visit("happy", "hero"); scheduleVisit(); }, 4000);
      wireSectionReactions();
      konami();
    }
  }

  // ---- Self-contained skill popup (works on ALL screens, incl. mobile) ----
  var popEl = null, popTimer = null, popOutside = null;
  function closePop() {
    if (!popEl) return;
    popEl.classList.remove("show");
    var el = popEl; popEl = null;
    clearTimeout(popTimer);
    if (popOutside) { document.removeEventListener("pointerdown", popOutside, true); window.removeEventListener("scroll", popOutside, true); popOutside = null; }
    setTimeout(function(){ if (el && el.parentNode) el.parentNode.removeChild(el); }, 280);
  }
  function escMsg(m){ return String(m||"").replace(/[&<>]/g, function(c){ return ({ "&":"&amp;", "<":"&lt;", ">":"&gt;" })[c]; }); }
  var KAI_MINI = '<svg width="46" height="46" viewBox="0 0 104 104"><path d="M28 84 Q26 58 52 58 Q78 58 76 84 Z" fill="#7A5CFF"/><circle cx="52" cy="44" r="22" fill="#7A5CFF"/><path d="M34 30 L30 12 Q42 20 48 28 Z" fill="#7A5CFF"/><path d="M70 30 L74 12 Q62 20 56 28 Z" fill="#7A5CFF"/><path d="M35 24 L33 16 L40 22 Z" fill="#FF6A2B"/><path d="M69 24 L71 16 L64 22 Z" fill="#FF6A2B"/><circle cx="44" cy="44" r="6" fill="#fff"/><circle cx="60" cy="44" r="6" fill="#fff"/><circle cx="45" cy="45" r="3" fill="#1a1430"/><circle cx="61" cy="45" r="3" fill="#1a1430"/><path d="M46 53 Q52 58 58 53" stroke="#1a1430" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="37" cy="50" r="3" fill="#FF6A2B" opacity="0.45"/><circle cx="67" cy="50" r="3" fill="#FF6A2B" opacity="0.45"/></svg>';

  function sayAt(targetEl, msg) {
    closePop();
    var isMobile = window.innerWidth <= 720;
    popEl = document.createElement("div");
    popEl.id = "kai-pop";
    popEl.setAttribute("role", "status");
    popEl.innerHTML = '<span class="kai-pop__cat">' + KAI_MINI + '</span><span class="kai-pop__msg">' + escMsg(msg) + '</span>';
    document.body.appendChild(popEl);
    if (isMobile) {
      popEl.classList.add("kai-pop--sheet");
    } else {
      var r = targetEl.getBoundingClientRect();
      var pw = 320, ph = 96;
      var left = Math.min(window.innerWidth - pw - 16, Math.max(16, r.left));
      var top = r.bottom + 12;
      if (top + ph > window.innerHeight) top = r.top - ph - 12;
      popEl.style.left = left + "px";
      popEl.style.top = Math.max(16, top) + "px";
    }
    requestAnimationFrame(function(){ if (popEl) popEl.classList.add("show"); });
    popTimer = setTimeout(closePop, 6000);
    popOutside = function (e) { if (popEl && !popEl.contains(e.target) && e.target !== targetEl) closePop(); };
    setTimeout(function(){ document.addEventListener("pointerdown", popOutside, true); window.addEventListener("scroll", popOutside, true); }, 50);
  }

  window.KaiCompanion = { init: init, sayAt: sayAt };
})();
