# Deployment Guide

This repo has three apps. Each goes to a different free host:

| App | Host | URL pattern |
| --- | --- | --- |
| `recipe-api` (NestJS) | Render.com | `https://recipe-api-xxxx.onrender.com` |
| `recipe-portal` (Angular admin) | GitHub Pages | `https://thachthanhthien.github.io/recipe/` |
| `recipe-site` (Next.js public) | Vercel | `https://recipe-site-xxxx.vercel.app` |

Do the steps in order — the API URL is needed by the other two.

---

## 1. Deploy the API to Render

The repo already contains `render.yaml`. Render reads it automatically.

1. Sign up at <https://render.com> with your GitHub account.
2. Dashboard → **New +** → **Blueprint**.
3. Connect this repo (`ThachThanhThien/recipe`). Render detects `render.yaml` and proposes `recipe-api` as a web service.
4. Click **Apply**. First deploy takes ~5 minutes.
5. After it's live, note the URL (looks like `https://recipe-api-xxxx.onrender.com`).
6. Open the service → **Environment** → set:
   - `CORS_ORIGINS` = `https://thachthanhthien.github.io,https://recipe-site-xxxx.vercel.app`
     (use the actual Vercel URL once step 3 is done; you can come back and edit this)
7. Verify: open `https://recipe-api-xxxx.onrender.com/health` — should return JSON with `"status":"ok"`.
8. Browse Swagger at `https://recipe-api-xxxx.onrender.com/api`.

> **Free-tier caveats:**
> - The service **sleeps after ~15 min** of no traffic. First request after sleep takes ~30 s.
> - The filesystem is **ephemeral** — uploaded images and DB writes are lost on redeploy or restart. Committed `recipe.db` / `cooking.db` act as the starter dataset.
> - For real persistence, add a $1/mo Render disk and point `recipe.db` + `uploads/` at it.

---

## 2. Deploy the Angular admin to GitHub Pages

The workflow at `.github/workflows/deploy-portal.yml` is ready. You need to:

1. In the GitHub repo → **Settings** → **Pages** → set **Source** to **GitHub Actions**.
2. **Settings** → **Secrets and variables** → **Actions** → **Variables** tab → **New repository variable**:
   - Name: `API_BASE_URL`
   - Value: the Render URL from step 1 (e.g. `https://recipe-api-xxxx.onrender.com`)
3. Trigger a deploy:
   - Either push any change under `recipe-portal/` to `main`, or
   - Go to **Actions** → "Deploy Angular Portal to GitHub Pages" → **Run workflow**.
4. After it succeeds, the admin is live at `https://thachthanhthien.github.io/recipe/`.

> If you ever rename the repo, also update the `--base-href "/recipe/"` flag in the workflow.

---

## 3. Deploy the Next.js site to Vercel

1. Sign up at <https://vercel.com> with your GitHub account.
2. **Add New** → **Project** → import `ThachThanhThien/recipe`.
3. In the import screen:
   - **Root Directory** → click **Edit** → select `recipe-site`.
   - **Framework Preset** → Next.js (auto-detected).
   - **Build & Output Settings** → leave defaults.
4. Expand **Environment Variables** and add (see `recipe-site/.env.example`):
   - `NEXT_PUBLIC_API_BASE_URL` = Render URL from step 1
   - `NEXT_PUBLIC_SITE_URL` = leave blank for now, fill after first deploy
   - `NEXT_PUBLIC_DEFAULT_LANG` = `en`
5. Click **Deploy**. First build takes ~3 minutes.
6. Note the Vercel URL (e.g. `https://recipe-site-xxxx.vercel.app`).
7. Go back to Vercel project → **Settings** → **Environment Variables** → set `NEXT_PUBLIC_SITE_URL` to that URL → **Redeploy**.
8. Go back to **Render** → `recipe-api` → **Environment** → update `CORS_ORIGINS` to include the Vercel URL → save (auto-redeploys).

---

## 4. Verify end-to-end

- `https://thachthanhthien.github.io/recipe/` loads, ingredient/recipe lists fetch from the API.
- `https://recipe-site-xxxx.vercel.app` loads, recipes display, images render.
- `https://recipe-api-xxxx.onrender.com/health` returns `{"status":"ok"}`.

If the admin shows CORS errors in the browser console, double-check `CORS_ORIGINS` on Render contains the exact Pages URL **without trailing slash**.

---

## Updating after deploy

| Change | Effect |
| --- | --- |
| Push to `main` touching `recipe-portal/**` | Pages auto-rebuilds and redeploys |
| Push to `main` touching `recipe-site/**` | Vercel auto-rebuilds and redeploys |
| Push to `main` touching `recipe-api/**` | Render auto-rebuilds and redeploys (DB resets) |
| Change `API_BASE_URL` variable on GitHub | Re-run the Pages workflow manually |
| Change env vars on Vercel / Render | Trigger a redeploy from their dashboards |
