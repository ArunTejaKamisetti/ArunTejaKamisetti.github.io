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

  function renderMeta(m) {
    if (!m) return;
    $("nav-brand").textContent = m.name;
    $("footer-name").textContent = "© " + new Date().getFullYear() + " " + m.name;
    $("hero-sub").innerHTML = '<span class="lead-dot"></span>' + esc(m.subtagline || "");
    if ($("hero-sub-hi")) $("hero-sub-hi").textContent = m.subtaglineHi || "";
    if ($("hero-hi")) $("hero-hi").innerHTML = 'भारतीय <b>AI PRODUCT MANAGER</b> — building products people trust.';
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
    $("skills").innerHTML = (skills || []).map((s) => '<span>' + esc(s) + '</span>').join("");
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
    grid.innerHTML = projects.map((p, i) => {
      const link = p.link && p.link !== "#" ? p.link : "";
      const linkLabel = p.type === "deck" ? "View deck" : "Read case study";
      return '<article class="card card-surface reveal" data-anim="' + (i % 2 ? "right" : "left") + '" data-delay="' + (i % 3) + '">' +
        '<span class="card__num">0' + (i + 1) + '</span>' +
        '<div class="card__icon">' + svgico(p.icon) + '</div>' +
        '<span class="card__cat">' + esc(p.category || "Project") + '</span>' +
        '<h3 class="card__title">' + esc(p.title) + '</h3>' +
        '<p class="card__summary">' + esc(p.summary || "") + '</p>' +
        (p.metric ? '<span class="card__metric">' + svgico('ti-trending-up') + ' ' + esc(p.metric) + '</span>' : "") +
        ((p.tags && p.tags.length) ? '<div class="card__tags">' + p.tags.map((t) => '<span>' + esc(t) + '</span>').join("") + '</div>' : "") +
        (link ? '<a class="card__link" href="' + esc(link) + '" ' + (/^https?:/.test(link) ? 'target="_blank" rel="noopener"' : "") + '>' + linkLabel + ' <svg class="ico" width="15" height="15"><use href="#i-arrow"/></svg></a>' : "") +
      '</article>';
    }).join("");
  }

  function renderDecks(decks) {
    const grid = $("decks-grid");
    if (!decks || !decks.length) { grid.innerHTML = empty("No decks yet."); return; }
    grid.innerHTML = decks.map((d, i) =>
      '<article class="deck card-surface reveal" data-anim="' + (i % 2 ? "right" : "left") + '">' +
        '<div class="deck__frame">' + (d.embedUrl ? '<iframe src="' + esc(d.embedUrl) + '" loading="lazy" title="' + esc(d.title) + '" allowfullscreen></iframe>' : '<span class="deck__play"><svg width="24" height="24"><use href="#i-play"/></svg></span><svg width="40" height="40" style="opacity:.4"><use href="#i-deck"/></svg>') + '</div>' +
        '<div class="deck__body"><h3>' + esc(d.title) + '</h3><p>' + esc(d.description || "") + '</p></div>' +
      '</article>').join("");
  }

  function renderThoughts(thoughts) {
    const grid = $("thoughts-grid");
    if (!thoughts || !thoughts.length) { grid.innerHTML = empty("No posts yet."); return; }
    grid.innerHTML = thoughts.map((t, i) => {
      const link = t.url && t.url !== "#" ? t.url : "";
      const date = t.date ? new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
      return '<article class="thought card-surface reveal" data-anim="zoom" data-delay="' + (i % 3) + '">' +
        '<span class="thought__tag"><svg width="17" height="17" style="color:#fff"><use href="#i-pen"/></svg></span>' +
        '<div class="thought__meta">' + (date ? '<span>' + esc(date) + '</span>' : "") + (t.readTime ? '<span>' + esc(t.readTime) + '</span>' : "") + '</div>' +
        '<h3>' + esc(t.title) + '</h3><p>' + esc(t.excerpt || "") + '</p>' +
        (link ? '<a class="card__link" href="' + esc(link) + '" ' + (/^https?:/.test(link) ? 'target="_blank" rel="noopener"' : "") + '>Read <svg class="ico" width="15" height="15"><use href="#i-arrow"/></svg></a>' : "") +
      '</article>';
    }).join("");
  }

  function renderContact(c, m) {
    if (c) {
      if (c.heading) $("contact-title").textContent = c.heading;
      $("contact-body").textContent = c.body || "";
      $("contact-cta").innerHTML = '<svg class="ico" width="18" height="18"><use href="#i-mail"/></svg> ' + esc(c.ctaLabel || "Email me");
    }
    if (m && m.email) $("contact-cta").setAttribute("href", "mailto:" + m.email);
    const s = (m && m.social) || {};
    const links = [];
    if (s.github) links.push('<a href="' + esc(s.github) + '" target="_blank" rel="noopener" aria-label="GitHub"><svg width="21" height="21"><use href="#i-git"/></svg></a>');
    if (s.linkedin) links.push('<a href="' + esc(s.linkedin) + '" target="_blank" rel="noopener" aria-label="LinkedIn"><svg width="21" height="21"><use href="#i-linkedin"/></svg></a>');
    if (s.twitter) links.push('<a href="' + esc(s.twitter) + '" target="_blank" rel="noopener" aria-label="X"><svg width="21" height="21"><use href="#i-ext"/></svg></a>');
    if (m && m.email) links.push('<a href="mailto:' + esc(m.email) + '" aria-label="Email"><svg width="21" height="21"><use href="#i-mail"/></svg></a>');
    $("contact-social").innerHTML = links.join("");
    if (s.github) $("gh-link").setAttribute("href", s.github);
  }

  const empty = (msg) => '<p style="color:var(--ink-faint); font-size:15px; grid-column:1/-1;">' + esc(msg) + '</p>';

  async function renderGitHub(username) {
    const grid = $("gh-grid"), legend = $("gh-legend");
    // High-contrast peach ramp that pops on light AND dark backgrounds
    const shades = ["var(--cell-empty,#e6dac8)", "#FFC9A8", "#FF9D5C", "#FF6A2B", "#C9461A"];
    legend.innerHTML = shades.map((c) => '<span class="cell" style="background:' + c + '"></span>').join("");
    if (!username) return;
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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return; const el = en.target; io.unobserve(el);
        const full = el.getAttribute("data-full"); const m = full.match(/\d[\d,]*/); if (!m) return;
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
      renderMeta(c.meta); renderAbout(c.about, c.skills); renderJourney(c.journey);
      renderProjects(c.projects); renderDecks(c.decks); renderThoughts(c.thoughts);
      renderContact(c.contact, c.meta);
      renderGitHub(((c.meta && c.meta.social && c.meta.social.github) || "").replace(/.*github\.com\//, "").replace(/\/$/, "") || "ArunTejaKamisetti");
    }
    wireReveal(); wireCountUp();
    if (window.KaiCompanion) window.KaiCompanion.init(c || {});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
