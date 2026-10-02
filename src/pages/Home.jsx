import { Link } from 'what-framework/router';
import { consoleSummary, deployRollups, ownerLoad, serviceRollups, visibleIncidents } from '../state/ops.js';
import { IncidentTable } from '../components/IncidentTable.jsx';

export default function Home() {
  return (
    <section class="page-enter">
      <div class="hero-panel">
        <div>
          <p class="system-label">No live systems connected</p>
          <h1>Operations console patterns without a backend.</h1>
          <p>Harbor keeps incident triage, saved filters, service health, deploy watch, and activity history in one local console.</p>
          <div class="actions">
            <Link class="button primary" href="/incidents">Triage incidents</Link>
            <Link class="button" href="/build">Read build notes</Link>
          </div>
        </div>
        <div class="radar" aria-hidden="true"><span></span><span></span><span></span></div>
      </div>
      <div class="kpi-grid">
        <article><span>Open incidents</span><strong>{consoleSummary().open}</strong></article>
        <article><span>Critical</span><strong>{consoleSummary().critical}</strong></article>
        <article><span>Degraded services</span><strong>{consoleSummary().degradedServices}</strong></article>
        <article><span>Avg deploy risk</span><strong>{consoleSummary().deployRisk}</strong></article>
      </div>
      <div class="dashboard-grid">
        <section class="panel wide">
          <div class="panel-head"><h2>Active queue</h2><Link href="/incidents">All incidents</Link></div>
          <IncidentTable incidents={visibleIncidents().slice(0, 3)} />
        </section>
        <section class="panel">
          <h2>Owner load</h2>
          {ownerLoad().map((row) => (
            <p class="metric-line owner-meter" style={`--owner:${row.share * 100}%`}>
              <span>{row.owner}</span>
              <i></i>
              <strong>{row.count}</strong>
            </p>
          ))}
        </section>
        <section class="panel">
          <h2>Services</h2>
          {serviceRollups().slice(0, 3).map((service) => <p class={`metric-line status-metric ${service.tone}`}><span>{service.name}</span><strong>{service.status}</strong></p>)}
        </section>
        <section class="panel">
          <h2>Deploy watch</h2>
          {deployRollups().slice(0, 3).map((deploy) => (
            <p class={`metric-line risk-line ${deploy.tone}`} style={deploy.meterStyle}>
              <span>{deploy.id}</span>
              <i></i>
              <strong>{deploy.risk}</strong>
            </p>
          ))}
        </section>
      </div>
    </section>
  );
}
