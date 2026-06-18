# Arun Teja Kamisetti — Portfolio

A fast, secure, static portfolio site. All content is driven by `content.json`, which you edit through a no-login admin panel. Hosted free on GitHub Pages.

---

## Files

| File | What it is |
|---|---|
| `index.html` | The site. You rarely touch this. |
| `content.json` | **Every word + project on the site.** This is what you edit. |
| `admin.html` | The editor. Open it in a browser to change content without touching code. |
| `styles.css` / `app.js` | Design system + rendering logic. |
| `companion.js` / `companion.css` | Kai, your animated companion + click effects. |
| `robots.txt` / `sitemap.xml` | SEO + GEO (helps Google and AI engines find/cite you). |
| `assets/templates/` | Your branded PowerPoint deck template (`Arun_Deck_Template.pptx`). |
| `projects/` | Drop project folders here (see below). |

---

## How to edit your content (the easy way)

1. Double-click `admin.html` to open it in your browser.
2. Edit anything — profile, about, projects, decks, thoughts, Kai's fun facts.
3. Click **Download content.json**.
4. Replace the old `content.json` in this folder with the downloaded one.
5. If using GitHub: commit + push. Your live site updates in ~1 minute.

> Nothing in the admin is public or online — it runs entirely in your browser, so it's secure. There's no login because there's nothing for anyone else to log into.

---

## How to deploy to GitHub Pages (one-time setup)

1. Create a GitHub repo named **`ArunTejaKamisetti.github.io`** (use your exact username).
2. Upload all files from this folder to the repo (drag-and-drop in GitHub's web UI works, or `git push`).
3. In the repo: **Settings → Pages → Source → Deploy from branch → `main` / root → Save**.
4. Wait ~1 minute. Your site is live at `https://ArunTejaKamisetti.github.io`.

To add a custom domain later (e.g. `arunkamisetti.com`): Settings → Pages → Custom domain.

---

## Adding a project

Two ways:

**Quick (recommended):** open `admin.html` → Projects → **+ Add project** → fill in → download `content.json`.

**With a project folder:** create `projects/my-project/` and put your assets there (deck PDF, images). Then link to it from the project's "Link" field in the admin (e.g. `projects/my-project/deck.pdf`).

---

## Embedding a deck on the site

1. Build your deck from `assets/templates/Arun_Deck_Template.pptx`.
2. Upload it to Google Slides (File → Import) **or** keep it as a PDF in `projects/`.
3. For Google Slides: File → Share → **Publish to web → Embed** → copy the `src` URL.
4. In `admin.html` → Decks → paste that URL into **Embed URL**.

---

## Your deck template

`assets/templates/Arun_Deck_Template.pptx` matches the site exactly — same indigo palette, Sora headers, Inter body, and a little Kai on the title + closing slides. It includes 7 reusable layouts: title, section divider, content + callout, big-stat, before/after, case study, and closing.

Open it, **Save As** a new file for each deck, and replace the placeholder text. To regenerate it after edits, run `node assets/templates/build_deck_template.js` (needs `npm install pptxgenjs` and the `kai.png` in that folder).

---

## What's built in

- **Dynamic content** — one JSON file controls the whole site.
- **Live GitHub grid** — pulls your real contributions automatically.
- **SEO + GEO** — semantic HTML, Open Graph, JSON-LD structured data, sitemap. AI crawlers (ChatGPT, Perplexity, Claude) are explicitly welcomed so they can cite you.
- **Security** — static site (no server to hack), Content-Security-Policy, no exposed secrets, admin is local-only.
- **Personality** — Kai the companion (idle/blink/wave/click effects), reveal-on-scroll, count-up metrics, an easter egg (click Kai 5× or enter the Konami code), and a fun-mode toggle.
- **Accessible** — keyboard nav, skip link, reduced-motion support, dark mode.

---

## To-do for you

- [ ] Add your résumé PDF at `assets/Arun_Teja_Kamisetti_Resume.pdf`.
- [ ] Replace the `[Edit in /admin]` project details with your real write-ups.
- [ ] Add real links to your decks and blog posts.
- [ ] (Optional) Add an `assets/og-image.png` (1200×630) for nice link previews.
