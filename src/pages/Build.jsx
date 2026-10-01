export default function Build() {
  return (
    <article class="build-notes page-enter">
      <p class="system-label">Agent reference</p>
      <h1>How Harbor is built.</h1>
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
      </section>
    </article>
  );
}
