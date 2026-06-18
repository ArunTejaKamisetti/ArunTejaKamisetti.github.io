# Publish your portfolio (one-time setup, ~10 min)

Goal: a GitHub repo where **every push auto-updates your live website**. No watchers, no servers.

## 1. Create the repo
1. Go to https://github.com/new
2. Repository name: **`ArunTejaKamisetti.github.io`** (exactly — your username + `.github.io`)
3. Public. Don't add a README. Click **Create repository**.

## 2. Connect this folder & push (one time)
Open a terminal **in this folder** (`D:\Arun\My_Portfolio_PM\Personal_Portfolio`) and run:

```bat
git init
git add -A
git commit -m "initial portfolio"
git branch -M main
git remote add origin https://github.com/ArunTejaKamisetti/ArunTejaKamisetti.github.io.git
git push -u origin main
```

## 3. Turn on GitHub Pages
In the repo: **Settings → Pages → Source: Deploy from a branch → Branch: `main` / root → Save.**
Wait ~1 minute. Your site is live at **https://ArunTejaKamisetti.github.io**

---

## Daily use — how "push → site updates" works
GitHub Pages rebuilds automatically on every push. So your workflow is:

1. Add/edit files (drop a deck PDF into `assets/decks/`, edit content via `admin.html`, etc.)
2. Double-click **`deploy.bat`** → type a short message → done.
3. ~1 minute later, the live site shows your changes.

That's the whole loop. `deploy.bat` runs `git add` + `commit` + `push` for you.

## Uploading files (decks, résumé, images)
- Put the file anywhere into **`assets/`** (subfolders fine: `assets/decks/`, `assets/projects/`).
  - Made a PPT elsewhere? Export it to PDF and drop the PDF in `assets/decks/`.
- Point to it: résumé → the **Résumé file path** field in admin; deck/project → the item's **link** field.
- Run `deploy.bat`. The file ships with your repo and appears on the live site.
- For Google Slides decks, you don't need to upload — use **Publish to web → Embed** and paste the URL into the deck's **Embed URL** in admin.

## Editing content
1. Open **`admin.html`**, edit in the boxes, add/remove items.
2. Click **Save & sync** → it downloads `content.json` **and** `index.html`.
3. Replace both in this folder, then run `deploy.bat`.

> Why both files? So your site works when you double-click `index.html` locally (browsers block data-loading from `file://`). Once hosted, either file alone would do — but syncing both keeps local + live identical.

## GitHub contribution graph
The graph reads your public contributions live. If June isn't showing locally, that's the `file://` limitation — it loads correctly once the site is hosted on GitHub Pages. Make sure your contributions are **public** (GitHub → Settings → Profile → "Contributions" / activity is public).
