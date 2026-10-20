# Contributing

Install Bun and a compatible Node.js runtime, then run:

```bash
bun install
cp .env.example .env.local
bun run sync
bun run dev
```

Keep changes focused and preserve existing routes, styling, and direct asset URLs. Store image sources under `content/`, not generated output under `public/`. Use new filenames when replacing immutable cached assets.

Before submitting a pull request, run:

```bash
bun run sync
bun run build
bunx tsc --noEmit
```

Describe the behavior changed and how it was verified. Include screenshots for visual changes. Never commit secrets, private environment files, generated build output, or assets you cannot redistribute. Identify the origin, license, and required attribution of third-party contributions.

Contributions to original project code and examples are provided under the MIT license. Include third-party material only when its license permits redistribution, and preserve its notices.
