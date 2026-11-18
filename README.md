# Personal site

Astro + Markdown. Write in Obsidian, push to GitHub, it deploys itself.

```
src/
  site.config.ts        ← your name, links, GoatCounter + giscus settings
  content/blog/         ← ALL POSTS live here (open this folder in Obsidian)
    my-post.md            → ignazhar.github.io/blog/my-post/
    images/               ← pasted photos land here
    _templates/post.md    ← Obsidian template (title, date, tags, draft)
  pages/about.md        ← About page (plain Markdown)
  styles/global.css     ← all the styling, one file
```

## Run it locally

```bash
npm install
npm run dev        # http://localhost:4321 — live reloads as you write
npm run build      # production build into dist/
```

## Writing a post

1. Open `src/content/blog` in **Obsidian** ("Open folder as vault"). The vault is
   already configured so pasted images go into `images/` with normal Markdown links.
2. New note → `Ctrl+P` → **Templates: Insert template** → `post`.
3. Write. Paste photos with `Ctrl+V`. They're automatically resized and converted to WebP on build.
4. When ready, set `draft: false`. (Drafts are visible in `npm run dev` but not on the live site.)
5. Commit and push. The site rebuilds in about 1 minute.

Frontmatter fields:

| field         | required | notes                                         |
| ------------- | -------- | --------------------------------------------- |
| `title`       | yes      |                                               |
| `date`        | yes      | `2026-11-18`                                  |
| `description` | no       | used for previews / RSS                       |
| `cover`       | no       | `./images/photo.jpg` — big image at the top   |
| `tags`        | no       | `[travel, photos]`                            |
| `draft`       | no       | `true` hides it from the live site            |

The file name is the URL, so use `kebab-case.md` names.

## Hosting — GitHub Pages (free)

Live at **https://ignazhar.github.io**. Every push to `master` runs
`.github/workflows/deploy.yml`, which builds the site and publishes it (about 1–2 minutes;
watch it in the repo's **Actions** tab).

One-time setup (already done if the site is live):

1. The repo must be named `ignazhar.github.io` so the site is served at the root.
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Custom domain later: Settings → Pages → Custom domain, then update `SITE.url` in
`src/site.config.ts`.

## View stats — GoatCounter

1. Sign up at goatcounter.com (free for personal sites) and pick a code.
2. Put the code in `GOATCOUNTER.code` in `src/site.config.ts`.
3. In GoatCounter → Settings, enable **"Allow adding visitor counts on your website"**.

Your private dashboard (views per post, referrers, countries) is at
`https://<code>.goatcounter.com`. Posts show a public "N views" line and the home page shows
total visits. Set `showPublicCounts: false` to keep the numbers private.

## Comments — giscus

1. Make the repo **public** and enable **Discussions** (repo Settings → Features).
2. Install the giscus GitHub app: github.com/apps/giscus.
3. On giscus.app, enter your repo, choose category **Announcements**, and copy
   `data-repo`, `data-repo-id`, `data-category`, `data-category-id` into `GISCUS` in
   `src/site.config.ts`.

Commenters sign in with GitHub. You moderate from the repo's Discussions tab.

## Optional later

- **Browser editing** (write from your phone): add Keystatic or Pages CMS. Both commit to the same Markdown files.
- **Photo gallery page**: add `src/pages/photos.astro` that globs `src/content/blog/images/*`.
