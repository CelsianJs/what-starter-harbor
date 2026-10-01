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
        <h2>Boundaries</h2>
        <p>Harbor deliberately says synthetic wherever needed. It is a starter template, not an uptime product or integration with real production systems.</p>
      </section>
    </article>
  );
}
