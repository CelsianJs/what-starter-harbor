export default function Build() {
  return (
    <article class="build-notes page-enter">
      <p class="system-label">Agent reference</p>
      <h1>How Harbor is built.</h1>
      <section>
        <h2>Reactive incident detail</h2>
        <p>Components run once, so a captured record does not follow signal updates. Capture the route ID, read the merged record through an accessor, and bind selects/classes to that accessor. Browser regressions require the displayed quick-action result to match persisted state.</p>
        <pre>{"const incidentId = route.params.id;\nconst incident = () => mergedIncidents().find((entry) => entry.id === incidentId);"}</pre>
        <p>Saved views restored from localStorage are not trusted objects. Restoration keeps at most five valid unique IDs/filter combinations, ignores null or malformed entries, and regenerates labels from recognized severity/status/owner values. Valid legacy IDs survive; applying or naming a view validates its shape again. Browser tests mix malformed entries with a valid legacy view and require a usable queue with no runtime errors.</p>
      </section>
      <section class="panel">
        <h2>Signals</h2>
        <p><code>src/state/ops.js</code> stores filters, saved views, incident overrides, activity events, and save state as What signals.</p>
      </section>
      <section class="panel">
        <h2>Computed values</h2>
        <p><code>visibleIncidents</code>, <code>consoleSummary</code>, <code>serviceRollups</code>, and <code>deployRollups</code> derive the console from synthetic fixtures plus user workflow changes.</p>
      </section>
      <section class="panel">
        <h2>Effects and persistence</h2>
        <p>An <code>effect</code> persists filters, saved views, overrides, and the activity log in localStorage. Bad or denied storage falls back to seed state plus safe session-only edits.</p>
      </section>
      <section class="panel">
        <h2>Routing</h2>
        <p><code>what-framework/router</code> powers the overview, queue, routeable <code>/incidents/:id</code> detail, services, deploys, activity, build, and catch-all routes. Static aliases include every bundled incident detail path.</p>
      </section>
      <section class="panel">
        <h2>Vura static packaging</h2>
        <p>Harbor is packaged as a static What app. <code>scripts/static-aliases.mjs</code> emits concrete HTML files and <code>404.html</code>; Vura synthesizes the static manifest. The config avoids unsupported <code>rewrites</code>, uses <code>(.*)</code> catch-alls, and no longer carries the unused Vura server runtime dependency.</p>
      </section>
      <section class="panel">
        <h2>Boundaries</h2>
        <p>Harbor deliberately says synthetic wherever needed. It is a starter template, not an uptime product or integration with real production systems.</p>
      </section>
      <section class="panel">
        <h2>Problem → fix → proof</h2>
        <p><strong>Upload size:</strong> a manual manifest made the static app look like a server bundle. Removing it keeps Harbor on Vura's static archive path, about 22.1 KiB in the local pack check.</p>
        <p><strong>Schema:</strong> Vura's shared parser rejects unknown top-level keys and star globs, so the shipped config uses only supported fields and matcher syntax.</p>
        <p><strong>Design review:</strong> the overview used to duplicate KPI values and show deploy risks as bare numbers. The current pass keeps storage state in the top strip, renders owner/service/deploy rollups with fixture-driven bars and tones, and pads the incident detail severity rail so it reads like an ops console instead of a stretched template.</p>
      </section>
    </article>
  );
}
