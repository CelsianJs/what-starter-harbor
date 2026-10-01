# Harbor

Harbor is a What Framework starter for a synthetic operations console. It shows a realistic B2B app shape without pretending to monitor live infrastructure: incidents, service health, deploys, saved filters, workflow mutations, local persistence, and an activity trail.

## Prerequisites

- Node.js 22.x
- npm 10+ (bundled with current Node 22 releases)
- Vura Platform credentials for deployment

## Run it

```bash
npm ci
npm run dev
```

Try these flows:

- Save a filter for `critical` incidents.
- Open an incident route and change status, severity, and owner.
- Visit Services and Deploys to see computed summaries.
- Check Activity to see the audit trail.
- Open `/build` for implementation notes.

## Build and test

```bash
npm run test
npm run build
npm run test:browser
```

`npm run verify` runs all gates. Browser screenshots are written to `test-results/screenshots`.

## Reset local state

Harbor stores filters and workflow edits in:

```js
localStorage.removeItem('what-starter-harbor-v1')
```

The Activity page also includes a reset action.

## Deploy on Vura

Deployment requires Vura credentials configured in your environment. The starter is prepared for:

```bash
npm ci
npx vura-platform login
npx vura-platform projects
npm run deploy:vura
```

Use `npm run deploy:vura:prod` for a production upload. The deploy scripts call the pinned local `vura-platform` package installed by `npm ci`.

Planned public repo: `CelsianJs/what-starter-harbor`.

## Source map for agents

- `src/state/ops.js` — global signals, computed health and filters, local persistence effect.
- `src/data/ops.js` — synthetic services, incidents, and deploys.
- `src/routes.js` — explicit router table and fallback.
- `src/pages/Build.jsx` — public implementation notes.
- `scripts/static-aliases.mjs` — Vura-friendly route aliases, 404 artifact, and manifest.

See [BUILD.md](./BUILD.md) and `/build` for the full pattern guide.
