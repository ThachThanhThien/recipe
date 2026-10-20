# Deployment Guide

There is no server to run. Recipes live as JSON files in this repo, and everything is served as static files from free hosts:

| Piece | Where | What it does |
| --- | --- | --- |
| `recipe-site/data/*.json` | this GitHub repo | The recipes, ingredients and ingredient types. Every edit is a commit, so you get history and undo for free. |
| `recipe-site` (Next.js public site) | Vercel | Pre-renders every page (both languages) to static HTML at build time. Rebuilds on every push to `main`. |
| `recipe-portal` (Angular admin) | GitHub Pages | Reads and commits the JSON files through the GitHub API, using a token you paste in once per browser. |
| Recipe photos | `recipe-site/public/uploads/` | The portal shrinks each photo in the browser and commits it; the site serves it as `/uploads/<file>`. |

Saving in the portal takes ~1 second; the public site shows the change after Vercel's rebuild (~1 minute).

> `recipe-api/` (NestJS + SQLite) and `render.yaml` are no longer used. `recipe-site/data/` was exported from `recipe-api/recipe.db`.

---

## 1. Deploy the site to Vercel

1. Sign up at <https://vercel.com> with your GitHub account.
2. **Add New** → **Project** → import `ThachThanhThien/recipe`.
3. **Root Directory** → `recipe-site`. Framework preset: Next.js (auto-detected).
4. **Environment Variables**:
   - `NEXT_PUBLIC_SITE_URL` = the site's URL (fill in after the first deploy, then redeploy). Used for the sitemap and share previews.
   - `NEXT_PUBLIC_DEFAULT_LANG` = `en`
   - `NEXT_PUBLIC_API_BASE_URL` is no longer used and can be deleted.
5. **Deploy**.

Language: URLs stay clean (`/recipes/12`). `next.config.ts` serves the Vietnamese or English version based on the `lang` cookie set by the language switcher; `/vi/...` and `/en/...` also work directly.

## 2. Deploy the admin portal to GitHub Pages

1. Repo → **Settings** → **Pages** → **Source** = **GitHub Actions**.
2. Push any change under `recipe-portal/` to `main`, or **Actions** → "Deploy Angular Portal to GitHub Pages" → **Run workflow**.
3. It's live at `https://thachthanhthien.github.io/recipe/`.

The repo it edits is set in `recipe-portal/src/environments/environment*.ts` (`owner`, `repo`, `branch`). The old `API_BASE_URL` repository variable is no longer needed.

> If you ever rename the repo, update those files and the `--base-href "/recipe/"` flag in the workflow.

## 3. Connect the portal to GitHub (once per browser)

1. Create a **fine-grained personal access token**: <https://github.com/settings/personal-access-tokens/new>
   - Repository access → **Only select repositories** → `recipe`
   - Repository permissions → **Contents: Read and write** (nothing else)
   - Pick an expiry you're comfortable with; when it expires the portal asks for a new one.
2. Open the portal → **Settings → GitHub connection** → paste the token → **Connect**.

The token is stored only in that browser's `localStorage`. Without a token the portal shows only the connect page and can't change anything (the recipe data itself is public, like the repo and the site). Use **Disconnect this browser** on shared computers.

---

## Updating after deploy

| Change | Effect |
| --- | --- |
| Save in the portal | Commits to `main` → Vercel rebuilds the site (~1 min) |
| Edit `recipe-site/data/*.json` directly (GitHub web editor or locally) | Same as above — the portal picks it up on next load |
| Push to `main` touching `recipe-portal/**` | Pages rebuilds the portal |
| Push to `main` touching `recipe-site/**` | Vercel rebuilds the site |

## Running locally

```bash
npm --prefix recipe-site run dev     # http://localhost:3002, reads recipe-site/data/*.json
npm --prefix recipe-portal start     # http://localhost:4200, edits the GitHub repo (needs a token)
```

The local portal commits to the real repo on GitHub. Run `git pull` to see those edits in your local site.
