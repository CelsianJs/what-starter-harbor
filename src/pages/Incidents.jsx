import { owners, severityOrder, statusOptions } from '../data/ops.js';
import { applySavedFilter, filters, saveCurrentFilter, savedFilterLabel, savedFilters, setFilter, visibleIncidents } from '../state/ops.js';
import { IncidentTable } from '../components/IncidentTable.jsx';

export default function Incidents() {
  return (
    <section class="page-enter">
      <div class="page-heading split">
        <div>
          <p class="system-label">Incident queue</p>
          <h1>Filter, save, and route into triage.</h1>
          <p>All incidents are synthetic. Workflow changes save locally and update the activity log.</p>
        </div>
        <button class="button primary" onClick={() => saveCurrentFilter()}>Save current filter</button>
      </div>
      <div class="filter-bar">
        <label><span>Severity</span><select value={() => filters().severity} onChange={(e) => setFilter('severity', e.target.value)}>
          <option value="all">All</option>
          {severityOrder.map((severity) => <option value={severity}>{severity}</option>)}
        </select></label>
        <label><span>Status</span><select value={() => filters().status} onChange={(e) => setFilter('status', e.target.value)}>
          <option value="open">Open</option>
          <option value="all">All</option>
          {statusOptions.map((status) => <option value={status}>{status}</option>)}
        </select></label>
        <label><span>Owner</span><select value={() => filters().owner} onChange={(e) => setFilter('owner', e.target.value)}>
          <option value="all">All</option>
          {owners.map((owner) => <option value={owner}>{owner}</option>)}
        </select></label>
        <div>
          <span>Saved filters</span>
          <div class="saved-filters">
            {savedFilters().length === 0 ? <em>None yet</em> : savedFilters().map((item) => <button onClick={() => applySavedFilter(item.id)}>{savedFilterLabel(item.filters)}</button>)}
          </div>
        </div>
      </div>
      <IncidentTable incidents={visibleIncidents()} />
    </section>
  );
}
