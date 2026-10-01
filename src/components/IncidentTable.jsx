import { Link } from 'what-framework/router';
import { serviceName } from '../data/ops.js';

export function IncidentTable({ incidents }) {
  if (incidents.length === 0) {
    return (
      <div class="empty-panel">
        <h2>No incidents match this view.</h2>
        <p>Try widening status, severity, or owner filters.</p>
      </div>
    );
  }
  return (
    <div class="incident-list">
      {incidents.map((incident) => (
        <article class={`incident-row severity-${incident.severity}`}>
          <div>
            <p class="row-kicker">{incident.id} · {serviceName(incident.serviceId)}</p>
            <h2><Link href={`/incidents/${incident.id}`}>{incident.title}</Link></h2>
          </div>
          <span class="pill">{incident.severity}</span>
          <span class="pill muted">{incident.status}</span>
          <span>{incident.owner}</span>
          <span>{incident.opened}</span>
        </article>
      ))}
    </div>
  );
}
