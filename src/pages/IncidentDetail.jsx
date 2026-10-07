import { Link, route } from 'what-framework/router';
import { owners, statusOptions } from '../data/ops.js';
import { mergedIncidents, updateIncident } from '../state/ops.js';
import { serviceName } from '../data/ops.js';

export default function IncidentDetail() {
  const incidentId = route.params.id;
  const incident = () => mergedIncidents().find((entry) => entry.id === incidentId);
  if (!incident()) {
    return (
      <section class="empty-panel page-enter">
        <p class="system-label">Unknown incident</p>
        <h1>Incident not found.</h1>
        <p>No synthetic incident exists for <code>{route.params.id}</code>.</p>
        <Link class="button" href="/incidents">Back to incidents</Link>
      </section>
    );
  }
  return (
    <article class={`incident-detail page-enter severity-${incident().severity}`}>
      <Link class="text-link" href="/incidents">← Back to queue</Link>
      <header>
        <p class="system-label">{incident().id} · {serviceName(incident().serviceId)}</p>
        <h1>{incident().title}</h1>
        <p>{incident().summary}</p>
      </header>
      <div class="detail-grid">
        <section class="panel">
          <h2>Workflow</h2>
          <label><span>Status</span><select value={incident().status} onChange={(e) => updateIncident(incident().id, { status: e.target.value })}>
            {statusOptions.map((status) => <option value={status}>{status}</option>)}
          </select></label>
          <label><span>Severity</span><select value={incident().severity} onChange={(e) => updateIncident(incident().id, { severity: e.target.value })}>
            <option value="critical">critical</option>
            <option value="major">major</option>
            <option value="minor">minor</option>
          </select></label>
          <label><span>Owner</span><select value={incident().owner} onChange={(e) => updateIncident(incident().id, { owner: e.target.value })}>
            {owners.map((owner) => <option value={owner}>{owner}</option>)}
          </select></label>
          <div class="quick-actions" aria-label="Quick workflow actions">
            <button class="button" disabled={incident().status === 'resolved'} onClick={() => updateIncident(incident().id, { status: 'resolved' })}>Mark resolved</button>
            <button class="button" disabled={incident().owner === 'Theo'} onClick={() => updateIncident(incident().id, { owner: 'Theo' })}>Assign Theo</button>
          </div>
        </section>
        <section class="panel">
          <h2>Runbook notes</h2>
          <ul class="note-list">{incident().notes.map((note) => <li>{note}</li>)}</ul>
          <button class="button primary" disabled={incident().status === 'monitoring'} onClick={() => updateIncident(incident().id, { status: 'monitoring' })}>Move to monitoring</button>
        </section>
      </div>
    </article>
  );
}
