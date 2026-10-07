# Build notes for agents

## Reactive detail and recognizable views

Restored saved views are validated before entering signals: only bounded nonempty IDs and recognized severity/status/owner combinations are retained, with at most five unique IDs/views. Null entries, array-shaped filters and unknown values are discarded. Valid legacy IDs survive, while names are derived again from their actual filters. `applySavedFilter()` and `savedFilterLabel()` validate defensively too, so malformed state cannot enter the queue through an action or label.

Incident detail captures its route ID once, then reads the current merged record through an accessor. Quick actions now update the visible selects and severity rail; actions already applied are disabled. Saved views use their severity/status/owner combination as the visible name, including legacy saved views, and saving the same combination updates one view rather than duplicating it. Mobile hides the decorative radar and keeps health tiles two-up so operational state appears sooner.

The relevant source pattern is:

```js
const incidentId = route.params.id;
const incident = () => mergedIncidents().find((entry) => entry.id === incidentId);
```

The browser suite checks resolved status, Theo ownership, live severity tone, duplicate view saves, distinct labels, route transitions, and denied storage.

Keep the product anonymous and local/synthetic. These workflow improvements do not add authentication, collaboration, payments, ingestion, or durable server storage.


Harbor is a compact operational SaaS reference for incident response, deploy review, and team handoff flows. It has no live monitoring backend. Every metric, incident, deploy, and activity item is synthetic local data so the starter can focus on What Framework state, routing, persistence, and static deployment patterns.

## Source map

- `src/routes.js` declares overview, incident list, incident detail, services, activity, build notes, and fallback routes.
- `src/state/ops.js` owns filters, incident overrides, saved filter views, activity events, and save status.
- `src/data/ops.js` provides the bundled services, incidents, deploys, teams, and activity log.
- `scripts/static-aliases.mjs` emits Vura static aliases for known routes and every bundled incident detail route.
- `test/browser/harbor.spec.js` covers filters, saved views, detail edits, direct routes, storage failure, and mobile readability.

## State and rendering flow

Harbor keeps the original data immutable. User workflow changes live in small signals, and computed values build the screens.

```js
export const incidentOverrides = signal({});
export const filters = signal({
  severity: 'all',
  owner: 'all',
  status: 'active',
  query: '',
});
export const savedFilters = signal([]);
export const activityLog = signal(seedActivity);
```

The detail, list, and summary views all read from the same merged incident model:

```js
export const mergedIncidents = computed(() => (
  seedIncidents.map((incident) => ({
    ...incident,
    ...(incidentOverrides()[incident.id] || {}),
  }))
));
```

Filters stay declarative. The UI does not manually hide rows; it renders the computed list.

```js
export const visibleIncidents = computed(() => {
  const current = filters();
  return mergedIncidents().filter((incident) => {
    const matchesStatus = current.status === 'all' || incident.status === current.status;
    const matchesSeverity = current.severity === 'all' || incident.severity === current.severity;
    const matchesOwner = current.owner === 'all' || incident.owner === current.owner;
    const matchesQuery = !current.query || incident.title.toLowerCase().includes(current.query.toLowerCase());
    return matchesStatus && matchesSeverity && matchesOwner && matchesQuery;
  });
});
```

That structure is the main pattern to copy for dashboards: source data, user edits, computed read models, then route components.

## Persistence boundary

Harbor persists workflow state when `localStorage` works. It also stays usable when storage is denied.

```js
function persistSnapshot() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot()));
    saveState.set({ mode: 'saved', message: 'Saved locally' });
  } catch {
    saveState.set({
      mode: 'session',
      message: 'Session-only changes',
    });
  }
}

effect(() => {
  incidentOverrides();
  filters();
  savedFilters();
  activityLog();
  persistSnapshot();
});
```

The effect depends on the signals it persists. That keeps the save indicator honest: a denied write becomes a visible session-only state instead of a hidden console error.

## Real issue: route aliases and unknown incidents

Operational apps need deep links. The first route pass handled `/incidents`, but direct incident pages needed two safeguards:

- bundled incident IDs should be emitted as static aliases so Vura can serve them directly;
- unknown IDs should render a useful not-found panel instead of crashing on missing data.

The browser suite now visits every bundled incident detail route and also checks an unknown route. That made routing regressions more useful than a single happy-path smoke test.

## Real issue: Vura config shape and upload size

Harbor is a pure Vite/What client app. It should upload like a static site, not like a server bundle.

The first deploy attempt exposed three platform contract issues:

- top-level `rewrites` is not part of the Vura config schema in `vura-platform/packages/shared/src/config/vura-config.ts`;
- routing globs such as `*` are rejected by the shared matcher in `routing-rules.ts`, while `(.*)` is the supported catch-all form;
- writing a manual `dist/manifest.json` for a static client app made the Vura CLI treat the build like a richer server/hot manifest, so `createDistArchive()` in the CLI included project context and dependencies.

The fix was to remove the unsupported rewrite config, keep only valid header matchers, stop writing a manual manifest, and remove the unused `@celsian/vura-core` dependency/config from this static starter. Vura can synthesize a static manifest from the emitted HTML aliases and `404.html`. A local archive check now packs Harbor at about 22.1 KiB instead of the failed multi-megabyte upload path.

## Real issue: storage-denied edits

Dashboard demos often assume local storage always works. Safari private modes, enterprise browsers, and embedded previews can disagree.

The fix was to make persistence a boundary, not a dependency. Harbor can still filter, save a named view for the current session, mutate incident state, and append activity events when storage throws. `saveState` communicates the downgrade in the UI.

## What worked smoothly

- Computed `consoleSummary`, `ownerLoad`, `serviceRollups`, and `deployRollups` made summary cards cheap to render.
- Keeping edits as `incidentOverrides` avoided mutating bundled data and made reset/debug behavior clear.
- Static route aliases kept the hosted Vura demo fast while preserving routeable incident detail URLs.

## Iteration note: make rollups visual and compact

The first overview repeated the same open/critical/degraded numbers in both the status strip and KPI grid, while deploy risks were plain integers. The shell now keeps the strip for storage/demo state only, and the dashboard owns operational metrics.

Fixture helpers in `src/data/ops.js` turn raw values into view metadata:

```js
export function deployRiskTone(risk) {
  if (risk >= 70) return 'risk-high';
  if (risk >= 35) return 'risk-medium';
  return 'risk-low';
}
```

`ownerLoadRows()` computes owner bars from current incidents, `serviceStatusTone()` maps health labels to status color, and `riskMeterStyle()` keeps deploy risk in the 0-100 meter range. The detail route also caps incident titles and pads the severity rail so status color supports the content instead of colliding with it.

## Demo boundaries

Harbor does not watch live systems, poll metrics, or send alerts. Treat it as a UI and state-management starter. Replace `src/data/ops.js` and the local persistence layer when connecting a real backend.

## Verification

Expected gates:

```bash
npm ci
npm run test
npm run build
npm run test:browser
```

The browser suite verifies filters, saved filters, every direct incident route, detail mutations, activity logging, storage-denied fallback, 404 behavior, focusability, and mobile rendering.
