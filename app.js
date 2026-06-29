(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  let CONTENT = null;

  async function loadContent() {
    const inline = document.getElementById("cw-content");
    if (inline && inline.textContent.trim()) {
      try { return JSON.parse(inline.textContent); } catch (e) { console.warn("inline parse failed", e); }
    }
    try {
      const res = await fetch("content.json", { cache: "no-store" });
      if (!res.ok) throw new Error("content.json not found");
      return await res.json();
    } catch (e) { console.error(e); return null; }
  }

  const ICON = { "ti-school":"i-school","ti-code":"i-code","ti-target-arrow":"i-target","ti-bulb":"i-bulb","ti-flask":"i-flask","ti-rocket":"i-rocket","ti-cpu":"i-cpu","ti-movie":"i-movie","ti-ball-basketball":"i-ball","ti-presentation":"i-deck","ti-pencil":"i-pen","ti-trending-up":"i-trend","ti-folder":"i-stack" };
  const svgico = (tiName, cls) => '<svg class="ico ' + (cls||"") + '"><use href="#' + (ICON[tiName]||"i-stack") + '"/></svg>';

  const slugify = (s) => String(s == null ? "" : s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "item";
  const fmtNum = (n) => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "") + "k" : String(n);

  // ===== Engagement: views / likes / shares (GLOBAL counts) =====
  // Static site (GitHub Pages) — no backend of our own, so the shared counts live on the
  // keyless counterapi.dev service (one counter per item per metric). Counts are REAL: every
  // counter starts at zero and only moves on genuine activity. A card renders 0, then fetches
  // the live global total when it scrolls into view. A view counts once per browser session;
  // a "like" is one per browser (tracked locally) and toggles the global counter up/down.
  const ENGAGE = (function () {
    const NS = "https://api.counterapi.dev/v1/aruntejakamisetti-portfolio/";
    const CV = "r1"; // counter-key version — bump to start every card counter fresh from zero
    const preview = !!window.__cwPreview;
    const SS_VIEW = "cw:viewed:v1", LS_LIKE = "cw:liked:v1";
    let viewed = {}, likedMap = {}, shareMeta = {}, cur = {};
    try { viewed = JSON.parse(sessionStorage.getItem(SS_VIEW) || "{}") || {}; } catch (e) {}
    try { likedMap = JSON.parse(localStorage.getItem(LS_LIKE) || "{}") || {}; } catch (e) {}
    const saveViewed = () => { if (preview) return; try { sessionStorage.setItem(SS_VIEW, JSON.stringify(viewed)); } catch (e) {} };
    const saveLiked = () => { if (preview) return; try { localStorage.setItem(LS_LIKE, JSON.stringify(likedMap)); } catch (e) {} };
    function hash(str) { let h = 2166136261; str = String(str); for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
    function ckey(key, metric) { return "c" + hash(key + ":" + metric + ":" + CV).toString(36) + metric; } // short, URL-safe per-counter key
    // local snapshot — starts at zero, filled in from the live global counters as they load
    function entry(key) {
      if (!cur[key]) cur[key] = { v: 0, l: 0, s: 0 };
      cur[key].liked = !!likedMap[key];
      return cur[key];
    }
    // hit the global counter; resolves to the authoritative count (or null on failure / preview)
    function call(key, metric, op) {
      if (preview) return Promise.resolve(null);
      return fetch(NS + ckey(key, metric) + "/" + (op || ""), { cache: "no-store" })
        .then((r) => { if (!r.ok) throw new Error("counter " + r.status); return r.json(); })
        .then((d) => (d && typeof d.count === "number") ? d.count : null);
    }
    return {
      entry: entry, call: call,
      isViewed: (k) => !!viewed[k], markViewed: (k) => { viewed[k] = 1; saveViewed(); },
      isLiked: (k) => !!likedMap[k], setLiked: (k, v) => { if (v) likedMap[k] = 1; else delete likedMap[k]; saveLiked(); },
      setMeta: (k, m) => { shareMeta[k] = m; }, meta: (k) => shareMeta[k] || { url: location.href, title: document.title }
    };
  })();

  const AWARD = { v: { label: "Most viewed", icon: "i-eye" }, l: { label: "Most liked", icon: "i-heart-fill" }, s: { label: "Most shared", icon: "i-share" } };
  const SECTION_ITEMS = {}; // section -> [ids], so badges can recompute after counts change
  const DIRTY = new Set();  // "key:metric" the user has changed — a late sync read must not clobber it

  const cssAttr = (v) => String(v).replace(/(["\\])/g, "\\$1");
  const barFor = (key) => document.querySelector('.engage[data-key="' + cssAttr(key) + '"]');
  const setNum = (root, prop, val) => { const el = root.querySelector('.engage__n[data-n="' + prop + '"]'); if (el) el.textContent = fmtNum(val); };
  const setNumKey = (key, prop, val) => { const bar = barFor(key); if (bar) setNum(bar, prop, val); };

  // Which item in a section is the *clear* leader for each metric -> { key: ["v","l"...] }.
  // Requires a strict, unique leader with a non-zero count, so nothing is awarded on a tie
  // (e.g. everything at 0, or several items tied at 1) — only on genuine standout activity.
  function computeBadges(section) {
    const ids = SECTION_ITEMS[section] || [];
    if (ids.length < 2) return {};
    const keys = ids.map((id) => section + ":" + id);
    const stats = keys.map((k) => ENGAGE.entry(k));
    const map = {};
    ["v", "l", "s"].forEach((prop) => {
      let max = -1, bi = -1, tie = false;
      stats.forEach((s, i) => { const val = s[prop] || 0; if (val > max) { max = val; bi = i; tie = false; } else if (val === max) { tie = true; } });
      if (bi >= 0 && max > 0 && !tie) (map[keys[bi]] = map[keys[bi]] || []).push(prop);
    });
    return map;
  }
  const awardsHtml = (list) => (list || []).map((p) => '<span class="award award--' + p + '" data-label="' + AWARD[p].label + '" title="' + AWARD[p].label + '" aria-label="' + AWARD[p].label + '"><svg class="ico"><use href="#' + AWARD[p].icon + '"/></svg></span>').join("");

  // Engagement bar for one card — rendered with the instant seed value (synced later).
  function engageBar(section, id) {
    const key = section + ":" + id;
    const e = ENGAGE.entry(key);
    return '<div class="engage" data-key="' + esc(key) + '">' +
        '<span class="engage__stat" title="Views"><svg class="ico"><use href="#i-eye"/></svg><span class="engage__n" data-n="v">' + fmtNum(e.v) + '</span></span>' +
        '<button type="button" class="engage__btn engage__like' + (e.liked ? " is-on" : "") + '" aria-pressed="' + (e.liked ? "true" : "false") + '" aria-label="Like"><svg class="ico"><use href="#' + (e.liked ? "i-heart-fill" : "i-heart") + '"/></svg><span class="engage__n" data-n="l">' + fmtNum(e.l) + '</span></button>' +
        '<button type="button" class="engage__btn engage__share" aria-label="Share"><svg class="ico"><use href="#i-share"/></svg><span class="engage__n" data-n="s">' + fmtNum(e.s) + '</span></button>' +
      '</div>';
  }

  // Repaint numbers + heart state for one key from its current snapshot.
  function paintKey(key) {
    const bar = barFor(key); if (!bar) return;
    const e = ENGAGE.entry(key);
    setNum(bar, "v", e.v); setNum(bar, "l", e.l); setNum(bar, "s", e.s);
    const likeBtn = bar.querySelector(".engage__like");
    if (likeBtn) {
      likeBtn.classList.toggle("is-on", e.liked);
      likeBtn.setAttribute("aria-pressed", e.liked ? "true" : "false");
      const use = likeBtn.querySelector("use");
      if (use) use.setAttribute("href", e.liked ? "#i-heart-fill" : "#i-heart");
    }
  }

  // Recompute + repaint the corner award medallions for the whole section a key belongs to.
  function refreshBadges(section) {
    const map = computeBadges(section);
    (SECTION_ITEMS[section] || []).forEach((id) => {
      const k = section + ":" + id;
      const box = document.querySelector('.card__awards[data-badges="' + cssAttr(k) + '"]');
      if (box) box.innerHTML = awardsHtml(map[k]);
    });
  }

  // Pull the real global counts for one card (and count a view, once per session).
  function syncCard(section, id) {
    const key = section + ":" + id;
    const e = ENGAGE.entry(key);
    let viewOp = "";
    if (!ENGAGE.isViewed(key)) { ENGAGE.markViewed(key); viewOp = "up"; }
    ENGAGE.call(key, "v", viewOp).then((n) => { if (n != null && !DIRTY.has(key + ":v")) { e.v = n; setNumKey(key, "v", n); refreshBadges(section); } }).catch(() => {});
    ENGAGE.call(key, "l", "").then((n) => { if (n != null && !DIRTY.has(key + ":l")) { e.l = n; setNumKey(key, "l", n); refreshBadges(section); } }).catch(() => {});
    ENGAGE.call(key, "s", "").then((n) => { if (n != null && !DIRTY.has(key + ":s")) { e.s = n; setNumKey(key, "s", n); refreshBadges(section); } }).catch(() => {});
  }

  // Lazily sync each card's global counts the first time it scrolls into view.
  let _engageIO = null;
  function observeEngagement() {
    const bars = document.querySelectorAll(".engage[data-key]");
    const run = (bar) => {
      const key = bar.getAttribute("data-key");
      if (!key || bar.hasAttribute("data-synced")) return;
      bar.setAttribute("data-synced", "1");
      const i = key.indexOf(":");
      syncCard(key.slice(0, i), key.slice(i + 1));
    };
    if (!("IntersectionObserver" in window)) { bars.forEach(run); return; }
    if (_engageIO) _engageIO.disconnect();
    _engageIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { _engageIO.unobserve(en.target); run(en.target); } });
    }, { rootMargin: "150px" });
    bars.forEach((b) => _engageIO.observe(b));
  }

  function wireEngagement() {
    document.addEventListener("click", (ev) => {
      const likeBtn = ev.target.closest(".engage__like");
      const shareBtn = ev.target.closest(".engage__share");
      if (!likeBtn && !shareBtn) return;
      const bar = (likeBtn || shareBtn).closest(".engage");
      if (!bar) return;
      const key = bar.getAttribute("data-key");
      const section = key.slice(0, key.indexOf(":"));
      if (likeBtn) {
        const e = ENGAGE.entry(key);
        const willLike = !ENGAGE.isLiked(key);
        DIRTY.add(key + ":l");
        ENGAGE.setLiked(key, willLike);
        e.liked = willLike;
        e.l = Math.max(0, e.l + (willLike ? 1 : -1)); // optimistic
        paintKey(key);
        if (willLike) { likeBtn.classList.remove("pop"); void likeBtn.offsetWidth; likeBtn.classList.add("pop"); }
        refreshBadges(section);
        ENGAGE.call(key, "l", willLike ? "up" : "down").then((n) => { if (n != null) { e.l = n; setNumKey(key, "l", n); refreshBadges(section); } }).catch(() => {});
      } else if (shareBtn) {
        doShare(key, bar, shareBtn);
      }
    });
  }

  function doShare(key, bar, btn) {
    const m = ENGAGE.meta(key), e = ENGAGE.entry(key), section = key.slice(0, key.indexOf(":"));
    const count = () => {
      DIRTY.add(key + ":s");
      e.s += 1; setNum(bar, "s", e.s); refreshBadges(section); // optimistic
      ENGAGE.call(key, "s", "up").then((n) => { if (n != null) { e.s = n; setNum(bar, "s", n); refreshBadges(section); } }).catch(() => {});
    };
    const flash = () => { btn.classList.remove("is-shared"); void btn.offsetWidth; btn.classList.add("is-shared"); setTimeout(() => btn.classList.remove("is-shared"), 1600); };
    if (navigator.share) {
      navigator.share({ title: m.title, url: m.url }).then(count).catch(() => {});
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(m.url).then(() => { count(); flash(); }).catch(() => { fallbackCopy(m.url); count(); flash(); });
    } else { fallbackCopy(m.url); count(); flash(); }
  }

  // Register ids + share targets for a section. Returns the per-key award map (empty at first,
  // since counts start at zero); real counts + awards fill in as cards sync into view.
  function prepareEngagement(section, items) {
    SECTION_ITEMS[section] = items.map((it) => it.id);
    const origin = (location.origin && location.origin !== "null") ? location.origin : "";
    const base = origin ? (origin + location.pathname.replace(/[^/]*$/, "")) : "";
    items.forEach((it) => {
      const key = section + ":" + it.id;
      let url = it.url || "";
      if (!url) url = base + "#" + it.anchor;          // no dedicated link -> deep-link to the section
      else if (!/^https?:/i.test(url)) url = base + url; // make on-site relative links absolute to share
      ENGAGE.setMeta(key, { title: it.title, url: url });
      ENGAGE.entry(key); // ensure present so computeBadges has an entry
    });
    return computeBadges(section);
  }

  let _quoteTimer = null;
  function startQuoteRotator(quotes) {
    const el = $("hero-sub-hi");
    if (!el) return;
    if (!quotes || !quotes.length) { el.textContent = ""; return; }
    clearInterval(_quoteTimer);
    let i = 0;
    const show = () => { el.style.opacity = "0"; setTimeout(() => { el.textContent = quotes[i % quotes.length]; el.style.opacity = "1"; i++; }, 300); };
    el.style.transition = "opacity .3s ease";
    show();
    if (quotes.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      _quoteTimer = setInterval(show, 3500);
    }
  }

  function renderMeta(m) {
    if (!m) return;
    $("nav-brand").textContent = m.name;
    $("footer-name").textContent = "© " + new Date().getFullYear() + " " + m.name;
    $("hero-sub").innerHTML = '<span class="lead-dot"></span>' + esc(m.subtagline || "");
    startQuoteRotator(m.aiQuotes || []);
    if ($("hero-hi")) $("hero-hi").innerHTML = '<b>AI PRODUCT MANAGER</b> — building products people trust.';
    if (m.resumeUrl) $("resume-btn").setAttribute("href", m.resumeUrl);
    document.title = m.name + " — Aspiring AI Product Manager";
  }

  function renderAbout(a, skills) {
    if (a) {
      if (a.heading) $("about-title").innerHTML = '<span class="title-ic"><svg width="28" height="28"><use href="#i-user"/></svg></span>' + esc(a.heading);
      var ic = function(name, cls){ return '<span class="inline-ic ' + (cls||"") + '" aria-hidden="true">' + svgico(name) + '</span>'; };
      $("about-body").innerHTML = esc(a.body || "")
        .replace(/(AI Product Manager|declined a pre-placement offer|outcomes|frontier lab)/g, "<strong>$1</strong>")
        .replace(/software engineer/i, "software engineer " + ic("ti-code","sage"))
        .replace(/\banime\b/i, "anime " + ic("ti-movie","plum"))
        .replace(/basketball/i, "basketball " + ic("ti-ball-basketball","gold"));
      $("about-highlights").innerHTML = (a.highlights || [])
        .map((h) => '<li><span class="hi-ic">' + svgico(h.icon) + '</span><span><span class="lbl">' + esc(h.label) + '</span><span class="val">' + esc(h.value) + '</span></span></li>').join("");
    }
    renderSkills(skills || []);
  }

  function renderSkills(skills) {
    const t1 = $("skills"), t2 = $("skills2");
    if (!t1) return;
    // normalize: accept strings or {name, where}
    const norm = (skills || []).map((s) => (typeof s === "string") ? { name: s, where: "" } : s);
    if (!norm.length) { t1.innerHTML = ""; if (t2) t2.innerHTML = ""; return; }
    const mid = Math.ceil(norm.length / 2);
    const rowA = norm.slice(0, mid), rowB = norm.slice(mid);
    const chip = (s) => '<button type="button" class="skill-chip" data-where="' + esc(s.where || "") + '" data-name="' + esc(s.name) + '">' + esc(s.name) + '</button>';
    t1.innerHTML = (rowA.concat(rowA)).map(chip).join("");
    if (t2) t2.innerHTML = (rowB.concat(rowB)).map(chip).join("");
    // click a skill -> Kai pops up and says where it was demonstrated
    document.querySelectorAll(".skill-chip").forEach((el) => {
      el.addEventListener("click", () => {
        const where = el.getAttribute("data-where"), name = el.getAttribute("data-name");
        if (window.KaiCompanion && window.KaiCompanion.sayAt) {
          window.KaiCompanion.sayAt(el, where ? (name + " — " + where) : (name + ": I'm building this one."));
        }
        // blur so no focus ring lingers on the chip as the marquee scrolls
        if (el.blur) el.blur();
      });
    });
  }

  function renderJourney(steps) {
    const el = $("journey");
    if (!steps || !steps.length) { el.style.display = "none"; return; }
    el.innerHTML = steps.map((s, i) =>
      '<span class="journey__step"><span class="n">' + (i + 1) + '</span>' + esc(s) + '</span>' +
      (i < steps.length - 1 ? '<span class="journey__arrow"><svg class="ico" width="14" height="14"><use href="#i-arrow"/></svg></span>' : "")
    ).join("");
  }

  function renderProjects(projects) {
    const grid = $("projects-grid");
    if (!projects || !projects.length) { grid.innerHTML = empty("No projects yet."); return; }
    const meta = projects.map((p) => {
      const slug = (p.mdFile || "").replace(/\.md$/i, "").replace(/[^a-zA-Z0-9\-_]/g, "");
      const link = p.link && p.link !== "#" ? p.link : "";
      const shareUrl = slug ? ("post.html?p=" + encodeURIComponent(slug)) : (/^https?:/.test(link) ? link : "");
      return { id: p.id || slugify(p.title), title: p.title, url: shareUrl, anchor: "projects", slug: slug, link: link };
    });
    const badges = prepareEngagement("work", meta);
    grid.innerHTML = projects.map((p, i) => {
      // Priority: on-site .md case study > external link (GitHub etc.) > no button
      const slug = meta[i].slug, link = meta[i].link, key = "work:" + meta[i].id;
      let linkHtml = "";
      if (slug) {
        linkHtml = '<a class="card__link" href="post.html?p=' + encodeURIComponent(slug) + '">Read case study <svg class="ico" width="15" height="15"><use href="#i-arrow"/></svg></a>';
      } else if (link) {
        const linkLabel = /github\.com/.test(link) ? "View on GitHub" : (p.type === "deck" ? "View deck" : "View project");
        linkHtml = '<a class="card__link" href="' + esc(link) + '" ' + (/^https?:/.test(link) ? 'target="_blank" rel="noopener"' : "") + '>' + linkLabel + ' <svg class="ico" width="15" height="15"><use href="#i-arrow"/></svg></a>';
      }
      return '<article class="card card-surface reveal" data-anim="' + (i % 2 ? "right" : "left") + '" data-delay="' + (i % 3) + '">' +
        '<div class="card__awards" data-badges="' + esc(key) + '">' + awardsHtml(badges[key]) + '</div>' +
        '<span class="card__num">0' + (i + 1) + '</span>' +
        '<div class="card__icon">' + svgico(p.icon) + '</div>' +
        '<span class="card__cat">' + esc(p.category || "Project") + '</span>' +
        '<h3 class="card__title">' + esc(p.title) + '</h3>' +
        '<p class="card__summary">' + esc(p.summary || "") + '</p>' +
        (p.metric ? '<span class="card__metric">' + svgico('ti-trending-up') + ' ' + esc(p.metric) + '</span>' : "") +
        ((p.tags && p.tags.length) ? '<div class="card__tags">' + p.tags.map((t) => '<span>' + esc(t) + '</span>').join("") + '</div>' : "") +
        linkHtml +
        engageBar("work", meta[i].id) +
      '</article>';
    }).join("");
  }

  function renderDecks(decks) {
    const grid = $("decks-grid");
    if (!decks || !decks.length) { grid.innerHTML = empty("No decks yet."); return; }
    const meta = decks.map((d) => {
      const src = d.embedUrl || d.file || "";
      return { id: d.id || slugify(d.title), title: d.title, url: /^https?:/.test(src) ? src : "", anchor: "decks" };
    });
    const badges = prepareEngagement("decks", meta);
    grid.innerHTML = decks.map((d, i) => {
      const src = d.embedUrl || d.file || "";
      const isEmbed = /^https?:.*(docs\.google|youtube|drive\.google)/.test(src);
      const isFile = src && !isEmbed;
      const key = "decks:" + meta[i].id;
      const frame = isEmbed
        ? '<iframe src="' + esc(src) + '" loading="lazy" title="' + esc(d.title) + '" allowfullscreen></iframe>'
        : '<span class="deck__play"><svg width="24" height="24"><use href="#i-play"/></svg></span><svg width="40" height="40" style="opacity:.4"><use href="#i-deck"/></svg>';
      const tags = (d.tags && d.tags.length) ? '<div class="card__tags">' + d.tags.map((t) => '<span>' + esc(t) + '</span>').join("") + '</div>' : "";
      const openLink = isFile ? '<a class="card__link" href="' + esc(src) + '" target="_blank" rel="noopener">Open deck <svg class="ico" width="15" height="15"><use href="#i-arrow"/></svg></a>' : "";
      return '<article class="deck card-surface reveal" data-anim="' + (i % 2 ? "right" : "left") + '">' +
        '<div class="card__awards" data-badges="' + esc(key) + '">' + awardsHtml(badges[key]) + '</div>' +
        '<div class="deck__frame">' + frame + '</div>' +
        '<div class="deck__body">' +
          '<h3>' + esc(d.title) + '</h3><p>' + esc(d.description || "") + '</p>' + tags + openLink +
          engageBar("decks", meta[i].id) +
        '</div>' +
      '</article>';
    }).join("");
  }

  function renderThoughts(thoughts) {
    const grid = $("thoughts-grid");
    if (!thoughts || !thoughts.length) { grid.innerHTML = empty("No posts yet."); return; }
    const meta = thoughts.map((t) => {
      const slug = (t.mdFile || "").replace(/\.md$/i, "").replace(/[^a-zA-Z0-9\-_]/g, "");
      const shareUrl = slug ? ("post.html?p=" + encodeURIComponent(slug)) : ((t.url && /^https?:/.test(t.url)) ? t.url : "");
      return { id: t.id || slug || slugify(t.title), title: t.title, url: shareUrl, anchor: "thoughts", slug: slug };
    });
    const badges = prepareEngagement("thoughts", meta);
    grid.innerHTML = thoughts.map((t, i) => {
      const date = t.date ? new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
      const slug = meta[i].slug, key = "thoughts:" + meta[i].id;
      let linkHtml = "";
      if (slug) {
        linkHtml = '<a class="card__link" href="post.html?p=' + encodeURIComponent(slug) + '">Read <svg class="ico" width="15" height="15"><use href="#i-arrow"/></svg></a>';
      } else if (t.url && t.url !== "#") {
        linkHtml = '<a class="card__link" href="' + esc(t.url) + '" ' + (/^https?:/.test(t.url) ? 'target="_blank" rel="noopener"' : "") + '>Read <svg class="ico" width="15" height="15"><use href="#i-arrow"/></svg></a>';
      }
      return '<article class="thought card-surface reveal" data-anim="zoom" data-delay="' + (i % 3) + '">' +
        '<div class="card__awards" data-badges="' + esc(key) + '">' + awardsHtml(badges[key]) + '</div>' +
        '<span class="thought__tag"><svg width="17" height="17" style="color:#fff"><use href="#i-pen"/></svg></span>' +
        '<div class="thought__meta">' + (date ? '<span>' + esc(date) + '</span>' : "") + (t.readTime ? '<span>' + esc(t.readTime) + '</span>' : "") + '</div>' +
        '<h3>' + esc(t.title) + '</h3><p>' + esc(t.excerpt || "") + '</p>' +
        linkHtml +
        engageBar("thoughts", meta[i].id) +
      '</article>';
    }).join("");
  }

  function renderContact(c, m) {
    if (c) {
      if (c.heading) $("contact-title").textContent = c.heading;
      $("contact-body").textContent = c.body || "";
      const cta = $("contact-cta");
      if (cta) cta.innerHTML = '<svg class="ico" width="18" height="18"><use href="#i-mail"/></svg> ' + esc(c.ctaLabel || "Email me");
    }
    const email = (m && m.email) || "";
    const subject = encodeURIComponent("Reaching out — AI PM opportunity / chat");
    const cta = $("contact-cta");
    if (cta && email) {
      // Default mailto: opens the visitor's own mail app (Gmail, Outlook, Apple Mail, whatever
      // they use), pre-addressed to Arun's email so the reply lands in his inbox.
      cta.setAttribute("href", "mailto:" + email + "?subject=" + subject);
      cta.removeAttribute("target");
      cta.removeAttribute("rel");
    }
    // show the address as plain text so recruiters can read/copy it directly
    const emailText = $("contact-email-text");
    if (emailText && email) emailText.textContent = email;
    // Copy-email button
    const copyBtn = $("contact-copy"), copyLabel = $("contact-copy-label");
    if (copyBtn && email) {
      copyBtn.addEventListener("click", () => {
        const done = () => {
          copyBtn.classList.add("is-copied");
          copyBtn.innerHTML = '<svg class="ico" width="18" height="18"><use href="#i-check"/></svg> Copied!';
          setTimeout(() => { copyBtn.classList.remove("is-copied"); copyBtn.innerHTML = '<svg class="ico" width="18" height="18"><use href="#i-copy"/></svg> Copy email'; }, 1800);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(email).then(done).catch(() => { fallbackCopy(email); done(); });
        } else { fallbackCopy(email); done(); }
      });
    }
    // Résumé quick-button
    const resumeBtn = $("contact-resume");
    if (resumeBtn) {
      if (m && m.resumeUrl) resumeBtn.setAttribute("href", m.resumeUrl);
      else resumeBtn.style.display = "none";
    }
    const s = (m && m.social) || {};
    const links = [];
    if (s.github) links.push('<a href="' + esc(s.github) + '" target="_blank" rel="noopener" aria-label="GitHub"><svg width="21" height="21"><use href="#i-git"/></svg></a>');
    if (s.linkedin) links.push('<a href="' + esc(s.linkedin) + '" target="_blank" rel="noopener" aria-label="LinkedIn"><svg width="21" height="21"><use href="#i-linkedin"/></svg></a>');
    if (s.twitter) links.push('<a href="' + esc(s.twitter) + '" target="_blank" rel="noopener" aria-label="X"><svg width="21" height="21"><use href="#i-ext"/></svg></a>');
    if (email) links.push('<a href="mailto:' + esc(email) + '" aria-label="Email"><svg width="21" height="21"><use href="#i-mail"/></svg></a>');
    $("contact-social").innerHTML = links.join("");
    if (s.github) $("gh-link").setAttribute("href", s.github);
  }

  function fallbackCopy(text) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
    } catch (e) {}
  }

  const empty = (msg) => '<p style="color:var(--ink-faint); font-size:15px; grid-column:1/-1;">' + esc(msg) + '</p>';

  // Site-wide visitor counter. Static hosting has no backend, so this uses the keyless
  // counterapi.dev service. Each browser increments once (localStorage flag) so the number
  // approximates unique people; returning visitors just read the live total.
  async function renderVisitorCount() {
    const el = $("visitor-count"), wrap = $("visitors");
    if (!el) return;
    if (window.__cwPreview) { if (wrap) wrap.style.display = "none"; return; }
    const BASE = "https://api.counterapi.dev/v1/aruntejakamisetti-portfolio/home-visits";
    const FLAG = "cw:visited:v1";
    let counted = false;
    try { counted = !!localStorage.getItem(FLAG); } catch (e) {}
    try {
      const res = await fetch(BASE + (counted ? "/" : "/up"), { cache: "no-store" });
      if (!res.ok) throw new Error("counter " + res.status);
      const data = await res.json();
      const n = data && typeof data.count === "number" ? data.count : null;
      if (n == null) throw new Error("no count");
      if (!counted) { try { localStorage.setItem(FLAG, "1"); } catch (e) {} }
      animateCount(el, n);
    } catch (e) {
      if (wrap) wrap.style.display = "none"; // service unreachable — hide rather than show a broken count
    }
  }

  function animateCount(el, target) {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = target.toLocaleString(); return; }
    let cur = 0; const inc = Math.max(1, Math.round(target / 30));
    const tick = () => { cur = Math.min(target, cur + inc); el.textContent = cur.toLocaleString(); if (cur < target) requestAnimationFrame(() => setTimeout(tick, 24)); };
    tick();
  }

  async function renderGitHub(username) {
    const grid = $("gh-grid"), legend = $("gh-legend");
    // High-contrast peach ramp that pops on light AND dark backgrounds
    const shades = ["var(--cell-empty,#e6dac8)", "#FFC9A8", "#FF9D5C", "#FF6A2B", "#C9461A"];
    legend.innerHTML = shades.map((c) => '<span class="cell" style="background:' + c + '"></span>').join("");
    if (!username) return;
    // In the admin live-preview, skip the network call (it's sandboxed) and show a neutral placeholder
    if (window.__cwPreview) {
      let ph = ""; for (let i = 0; i < 53 * 7; i++) ph += '<span class="cell" style="grid-column:' + (Math.floor(i/7)+1) + ';grid-row:' + ((i%7)+1) + '"></span>';
      grid.innerHTML = ph;
      $("gh-total").textContent = "GitHub graph shows on the live site";
      return;
    }
    try {
      const res = await fetch("https://github-contributions-api.deno.dev/" + encodeURIComponent(username) + ".json");
      if (!res.ok) throw new Error("gh api");
      const data = await res.json();
      let weeks = data.contributions || [];
      if (!weeks.length) throw new Error("empty");
      // show the FULL year so the count matches GitHub and the grid fills the card
      const max = Math.max(1, ...weeks.flat().map((d) => d.contributionCount || 0));
      let html = "";
      weeks.forEach((week, col) => {
        week.forEach((d) => {
          const cnt = d.contributionCount || 0;
          const dow = new Date(d.date + "T00:00:00").getDay();
          let lvl = 0; if (cnt > 0) lvl = Math.min(4, Math.ceil((cnt / max) * 4));
          html += '<span class="cell" style="grid-column:' + (col + 1) + ';grid-row:' + (dow + 1) + ';background:' + shades[lvl] + '" title="' + d.date + ': ' + cnt + ' contributions"></span>';
        });
      });
      grid.innerHTML = html;
      const total = (typeof data.totalContributions === "number") ? data.totalContributions : weeks.flat().reduce((s, d) => s + (d.contributionCount||0), 0);
      $("gh-total").textContent = total.toLocaleString() + " contributions in the last year";
      return;
    } catch (e) { /* placeholder */ }
    let html = "";
    for (let i = 0; i < 53 * 7; i++) { html += '<span class="cell" style="grid-column:' + (Math.floor(i/7)+1) + ';grid-row:' + ((i%7)+1) + '"></span>'; }
    grid.innerHTML = html;
    $("gh-total").textContent = "Live contribution graph loads when hosted";
  }

  // Gentle auto-scroll for the card rows. Pauses on hover/touch/manual scroll, loops seamlessly.
  function wireAutoScroll() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    ["projects-grid", "decks-grid", "thoughts-grid"].forEach((id) => {
      const row = document.getElementById(id);
      if (!row || row.scrollWidth <= row.clientWidth + 10) return; // nothing to scroll
      let paused = false, resumeTimer = null, dir = 1;
      const SPEED = 0.35; // px per frame — slow, classy
      row.addEventListener("mouseenter", () => paused = true);
      row.addEventListener("mouseleave", () => paused = false);
      row.addEventListener("touchstart", () => { paused = true; }, { passive: true });
      row.addEventListener("touchend", () => { clearTimeout(resumeTimer); resumeTimer = setTimeout(() => paused = false, 2500); });
      // manual wheel/drag pauses briefly then resumes
      row.addEventListener("scroll", () => {
        if (!paused) return;
      }, { passive: true });
      row.addEventListener("wheel", () => { paused = true; clearTimeout(resumeTimer); resumeTimer = setTimeout(() => paused = false, 2500); }, { passive: true });
      function tick() {
        if (!paused) {
          const max = row.scrollWidth - row.clientWidth;
          row.scrollLeft += SPEED * dir;
          if (row.scrollLeft >= max - 1) dir = -1;      // bounce back at the end
          else if (row.scrollLeft <= 0) dir = 1;
        }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  function wireTheme() {
    const root = document.documentElement, btn = $("theme-toggle");
    let stored = null; try { stored = localStorage.getItem("theme"); } catch (e) {}
    const sysDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    apply(stored || (sysDark ? "dark" : "light"));
    btn.addEventListener("click", () => { const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark"; apply(next); try { localStorage.setItem("theme", next); } catch (e) {} });
    function apply(t) { root.setAttribute("data-theme", t); btn.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme"); }
  }

  function wireNav() {
    const toggle = $("nav-toggle"), links = $("nav-links");
    toggle.addEventListener("click", () => { const open = links.classList.toggle("open"); toggle.setAttribute("aria-expanded", String(open)); });
    links.addEventListener("click", (e) => { if (e.target.closest("a")) links.classList.remove("open"); });
  }

  function wireReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("visible")); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); } }), { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
  }

  function wireCountUp() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target; io.unobserve(el);
        const full = el.getAttribute("data-full") || el.textContent;
        const m = full.match(/[\d,]+/); if (!m) return;
        const target = parseInt(m[0].replace(/,/g, ""), 10);
        const prefix = full.slice(0, m.index), suffix = full.slice(m.index + m[0].length);
        let cur = 0; const inc = Math.max(1, Math.round(target / 28));
        const tick = () => { cur = Math.min(target, cur + inc); el.innerHTML = '<svg class="ico" width="15" height="15"><use href="#i-trend"/></svg> ' + prefix + cur.toLocaleString() + suffix; if (cur < target) requestAnimationFrame(() => setTimeout(tick, 22)); };
        tick();
      });
    }, { threshold: 0.5 });
    document.querySelectorAll(".card__metric").forEach((el) => { el.setAttribute("data-full", el.textContent.trim()); io.observe(el); });
  }

  async function init() {
    document.documentElement.classList.add("js-on");
    wireTheme(); wireNav();
    const c = await loadContent(); CONTENT = c;
    if (c) {
      renderMeta(c.meta); renderAbout(c.about, c.skills);
      renderProjects(c.projects); renderDecks(c.decks); renderThoughts(c.thoughts);
      renderContact(c.contact, c.meta);
      renderGitHub(((c.meta && c.meta.social && c.meta.social.github) || "").replace(/.*github\.com\//, "").replace(/\/$/, "") || "ArunTejaKamisetti");
    }
    wireReveal(); wireCountUp(); wireEngagement(); observeEngagement();
    renderVisitorCount();
    setTimeout(wireAutoScroll, 800);
    if (window.KaiCompanion) window.KaiCompanion.init(c || {});
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
