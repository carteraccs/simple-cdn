# Simple CDN

Simple CDN is a lightweight, self-hostable image CDN built with Next.js. Folders define browsable pages, and images are served at predictable URLs without a database.

## Features

- Filesystem-based routes with nested folder navigation.
- Image previews and direct links to original files.
- PNG, JPEG, SVG, GIF, and WebP support without conversion.
- Optional page titles and descriptions through manifests.
- Automatic asset synchronization before builds and production startup.
- Tailwind CSS styling and configurable site branding.

## Requirements

- Bun 1.3 or later.
- Node.js 20.9 or later for Next.js tooling; use a supported Node.js LTS version on Vercel.
- Redistribution rights for any assets you deploy.

## Installation

```bash
bun install
cp .env.example .env.local
bun run sync
bun run dev
```

Visit http://localhost:3000. Run `bun run sync` again after changing images during development.

## Environment configuration

Set `NEXT_PUBLIC_SITE_NAME=Simple` in `.env.local` to display **Simple CDN**. The application appends `CDN` to this value. The default is `Simple`. Configure the tagline in `lib/config.ts`.

Variables prefixed with `NEXT_PUBLIC_` are public. Never put credentials in them or commit private environment files. Existing local `.env` values can override the default branding; update them if needed.

## Filesystem-based routing

| Source | Page |
| --- | --- |
| `app/page.tsx` | `/` |
| `content/brand/` | `/brand` |
| `content/brand/example/` | `/brand/example` |

Every folder under `content/` becomes a page, including parent and empty folders. Parent pages list immediate child folders. Unknown paths return 404. Commit a `.gitkeep` to retain an empty folder in Git.

## Adding assets

Place images in a content folder and synchronize them:

```bash
mkdir -p content/brand/example
# Copy your images into this folder.
bun run sync
```

`content/brand/example/logo.png` is served at `/brand/example/logo.png`. Files retain their original bytes and format. Commit source assets in `content/`; generated copies in `public/` are ignored.

SVG, PNG, JPG, and JPEG responses use cross-origin headers and a one-year immutable cache policy. Use a new filename when replacing a cached asset. GIF and WebP use the platform's default caching behavior.

## Optional manifest.json

Add `manifest.json` inside any content folder:

```json
{
  "title": "Example Brand",
  "description": "Approved brand assets."
}
```

Without a valid manifest, the page uses the folder name with title casing. A manifest is never required to create a route.

## Automatic asset synchronization

`bun run sync` copies supported images from `content/` into matching paths under `public/`, skips unchanged files, and removes obsolete images in visited output folders. Keep authoritative assets in `content/`; do not manually maintain generated images in `public/`. If an entire source folder is removed, clear its generated output or rebuild from a clean checkout.

`bun run build` invokes synchronization through `prebuild`. `bun run start` synchronizes before starting the production server. Development synchronization is manual.

```bash
bun run build
bun run start
bunx tsc --noEmit
```

## Vercel deployment

1. Import the GitHub repository into Vercel and select the Next.js framework preset.
2. Use a supported Node.js LTS runtime. The committed `bun.lock` and `packageManager` field identify Bun as the package manager.
3. Set the install command to `bun install --frozen-lockfile` and the build command to `bun run build`. Leave the output directory at its Next.js default.
4. Set `NEXT_PUBLIC_SITE_NAME=Simple` in the deployment environment if desired.
5. Deploy. Commit asset changes and redeploy to update the hosted content.

Assets are copied during the build; no runtime filesystem writes or Cloudflare Workers configuration are required. Vercel handles production serving rather than running the local `start` command.

## Technology stack

Next.js App Router, React, TypeScript, Tailwind CSS, Lucide icons, and Bun. Content and manifests use the local filesystem.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup and validation requirements. Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).

## License

Original project code, documentation, and generic example SVGs are available under the [MIT license](LICENSE). Dependencies retain their respective licenses; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Only publish assets you have permission to redistribute.

## Dependency security status

The full audit currently reports one unresolved high-severity advisory in the build-only `braces` dependency. There is no published patch and no identified request-time production exposure in this application. `bun audit` exits nonzero. See [SECURITY.md](SECURITY.md) for the affected dependency path and limitations.
