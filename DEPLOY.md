# Deployment Guide

There is no server to run. Recipes live as JSON files in this repo, and everything is served as static files from free hosts:

| Piece | Where | What it does |
| --- | --- | --- |
| `recipe-site/data/*.json` | this GitHub repo | The recipes, ingredients and ingredient types. Every edit is a commit, so you get history and undo for free. |
| `recipe-site` (Next.js public site) | Vercel | Pre-renders every page (both languages) to static HTML at build time. Rebuilds on every push to `main`. |
| `recipe-portal` (Angular admin) | GitHub Pages | Reads and commits the JSON files through the GitHub API, using a token you paste in once per browser. |
| Recipe photos | Your Google Drive | The portal shrinks each photo in the browser, uploads it to a Drive folder and shares it as "Anyone with the link"; the site shows it straight from Google. Until Drive is set up (section 4), photos are committed to `recipe-site/public/uploads/` instead. |

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

## 4. Store recipe photos in Google Drive (once)

The portal signs in to Google in the browser (no server, no secret) with the `drive.file` permission: it can only see the files it uploads, never the rest of your Drive.

1. Open <https://console.cloud.google.com/> and create a project (e.g. "TastyFresh portal").
2. **APIs & Services → Library** → search **Google Drive API** → **Enable**.
3. **Google Auth Platform** (formerly "OAuth consent screen") → **Get started**: app name, your email, audience **External**. Under **Audience → Test users**, add the Google account(s) that will upload photos. (`drive.file` is a non-sensitive scope, so you can also **Publish app** without Google's verification.)
4. **Clients → Create client** → type **Web application** → **Authorized JavaScript origins**:
   - `https://thachthanhthien.github.io`
   - `http://localhost:4200` (for running the portal locally)

   No redirect URIs are needed. Copy the **Client ID** (`…apps.googleusercontent.com`).
5. Paste it as `googleDrive.clientId` in **both** `recipe-portal/src/environments/environment.ts` and `environment.prod.ts`, then commit to `main` — Pages redeploys the portal. The client ID is public by design; it is not a secret.
6. In the portal: **Settings → GitHub connection → Sign in with Google** (or just pick a photo in a recipe — it asks then). Google keeps the portal signed in for an hour at a time.

What happens on upload: the photo goes into the folder **TastyFresh recipe photos** in your My Drive (created on first upload; rename it via `googleDrive.folderName`), is shared as *Anyone with the link → Viewer*, and the recipe stores its Drive link (`https://drive.google.com/file/d/<id>/view`). The site turns that link into Google's direct image URL (`https://lh3.googleusercontent.com/d/<id>=w1600`).

**Already have photos in Drive?** In Drive: **Share → General access → Anyone with the link → Copy link**, then paste it into the recipe's "paste a Google Drive share link" box. Any other `https://` image link works too.

Keep in mind:

- Don't delete, move to trash or un-share the photos (or the folder) — the site would fall back to its placeholder.
- Some Google Workspace (work/school) accounts forbid "Anyone with the link" sharing; use a personal Gmail account if uploads fail with a sharing error.
- Google doesn't officially document the direct image URL. If it ever stops working, change it in one place — `resolveImageUrl` in `recipe-site/src/lib/image.ts` (and `driveImageUrl` in the portal's `google-drive.service.ts` for previews). The links stored in the recipes stay as they are.

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
