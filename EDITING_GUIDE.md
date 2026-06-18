# Editing your portfolio — the simple guide

Everything on the site is editable from one place: **`admin.html`**. No code needed.

---

## The basic loop (memorize this)

1. **Open** `admin.html` (double-click it).
2. Click **Connect folder** (top right) → pick your `Personal_Portfolio` folder. *(One time per session. Chrome or Edge on desktop.)*
3. **Edit** in the forms on the left — the live preview on the right updates as you type.
4. Click **Publish ↑** → it saves `content.json` + `index.html` into your folder.
5. Double-click **`deploy.bat`** → type a short message → Enter.
6. ~1 minute later, your live site is updated.

That's it. Edit → Publish → deploy.

> If your browser can't connect the folder, the buttons fall back to **downloading** `content.json` + `index.html` — just drop both into the project folder (replacing the old ones), then run `deploy.bat`.

---

## Adding / editing / removing content

Every section has **+ Add** to create an item and a **×** on each item to remove it. Edits show in the live preview instantly.

### Profile, About, Journey, Skills, Kai facts
Plain text fields and "one per line" boxes. Edit and Publish.

### Work (your GitHub projects)
1. In admin → **Work** → **+ Add work**.
2. Fill in: title, category, summary, metric, tags, and the **GitHub repo link** (e.g. `https://github.com/ArunTejaKamisetti/my-project`).
3. The card shows a **"View on GitHub"** button → so put a good **README** in that repo; that's what visitors read.
4. (Optional) related files can live in `assets/work/`.

### Decks
1. Put the deck file (PDF or PPT) into **`assets/decks/`**. *(Export PPT → PDF for best browser support.)*
2. In admin → **Decks** → **+ Add deck**.
3. Fill in: title, description, tags, and the **file path** `assets/decks/yourfile.pdf`
   - OR a **Google Slides embed URL** (Slides → File → Share → Publish to web → Embed) — this shows the deck inline, no upload needed.
4. The admin lists the files it finds in `assets/decks/` so you can see what's there.
5. To remove a deck: click **×** on its entry (and delete the file from the folder if you want).

### Thoughts
Same as decks: optional file in `assets/thoughts/`, or just a link. Add title, date, read time, excerpt, link.

---

## Folder map

```
Personal_Portfolio/
├── index.html          ← the site (auto-updated by Publish)
├── content.json        ← all your content (auto-updated by Publish)
├── admin.html          ← the editor (local only, hidden from web)
├── deploy.bat          ← one-click commit + push
└── assets/
    ├── decks/          ← deck PDFs/PPTs go here
    ├── work/           ← optional files for work projects
    ├── thoughts/       ← optional files for blog posts
    └── Arun_Resume.pdf ← put your résumé here (then set the path in admin → Profile)
```

---

## How to write a blog post (Thoughts)

You have **two ways** to publish a thought. Pick per post.

### Option A — a full post that opens *on your site* (recommended)

1. **Write the post** as a plain-text Markdown file. Save it in `assets/thoughts/` with a simple lowercase name and no spaces, e.g. `lessons-from-model-eval.md`.
2. At the very top, add this little header (called *frontmatter*) — it sets the title, date, and read time:

   ```
   ---
   title: Lessons from evaluating 220 models
   date: 2026-06-15
   readTime: 5 min read
   ---

   Your first paragraph starts here…
   ```
3. Below the header, just write. Markdown basics:

   - `## Heading` and `### Smaller heading`
   - `**bold**`, `*italic*`
   - `> a quote` for a highlighted callout
   - `- item` for bullet lists, `1. item` for numbered
   - `[link text](https://example.com)` for links
   - blank line = new paragraph

4. In **admin → Thoughts**, add/open the post and put the **filename** in the **"Post file"** field (e.g. `lessons-from-model-eval.md`). Leave *External link* blank.
5. **Publish**, then run **deploy.bat**. Clicking **Read** on that card now opens the post inside your site, in your theme.

### Option B — link to an external post

If you published on Medium / LinkedIn / Substack instead, leave **Post file** blank and paste the URL into the **External link** field. **Read** opens it in a new tab.

> Rule of thumb: a Post file always wins over an External link. Leave both blank and the card simply shows no Read button.

**Work case studies** work the same way: the **Case-study file** field (optional `.md` in `assets/thoughts/`) takes priority over the GitHub link.

---

## Tips
- **Résumé:** drop the PDF in `assets/`, then admin → Profile → **Résumé path** → `assets/Arun_Resume.pdf` → Publish.
- **Always Publish before deploy** — Publish writes the files; deploy.bat pushes them.
- **Hard-refresh** the live site after deploying if you don't see changes (Ctrl + Shift + R).
- The admin is never public (blocked in robots.txt + gitignored). Even if someone opened it, they can't change your site — only their own download.
