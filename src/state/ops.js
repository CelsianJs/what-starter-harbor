import { computed, effect, signal } from 'what-framework';
import { deployRiskTone, deploys, incidents, ownerLoadRows, owners, riskMeterStyle, serviceName, serviceStatusTone, services, severityOrder, statusOptions } from '../data/ops.js';

export const STORAGE_KEY = 'what-starter-harbor-v1';

function initialLog() {
  return [
    { id: 'evt-seed-1', at: '09:22', text: 'Seeded synthetic console state.', tone: 'info' },
    { id: 'evt-seed-2', at: '09:27', text: 'Filter rail ready; no live systems connected.', tone: 'info' },
  ];
}

function normalizeFilters(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  if (!['all', ...severityOrder].includes(value.severity)
    || !['all', 'open', ...statusOptions].includes(value.status)
    || !['all', ...owners].includes(value.owner)) return null;
  return { severity: value.severity, status: value.status, owner: value.owner };
}

function restoredSavedFilters(value) {
  if (!Array.isArray(value)) return [];
  const seenIds = new Set();
  const seenViews = new Set();
  return value.slice(0, 50).flatMap((item) => {
    const view = normalizeFilters(item?.filters);
    if (!view || typeof item?.id !== 'string' || !item.id.trim() || item.id.length > 80) return [];
    const signature = JSON.stringify(view);
    if (seenIds.has(item.id) || seenViews.has(signature)) return [];
    seenIds.add(item.id);
    seenViews.add(signature);
    return [{ id: item.id, name: savedFilterLabel(view), filters: view }];
  }).slice(0, 5);
}

function safeLoad() {
  if (typeof localStorage === 'undefined') return { overrides: {}, filters: { severity: 'all', status: 'open', owner: 'all' }, saved: [], log: initialLog() };
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!parsed || typeof parsed !== 'object') throw new Error('bad state');
    return {
      overrides: parsed.overrides && typeof parsed.overrides === 'object' ? parsed.overrides : {},
      filters: normalizeFilters(parsed.filters) || { severity: 'all', status: 'open', owner: 'all' },
      saved: restoredSavedFilters(parsed.saved),
      log: Array.isArray(parsed.log) ? parsed.log : initialLog(),
    };
  } catch {
    return { overrides: {}, filters: { severity: 'all', status: 'open', owner: 'all' }, saved: [], log: initialLog() };
  }
}

const initial = safeLoad();

export const incidentOverrides = signal(initial.overrides, 'harbor.overrides');
export const filters = signal(initial.filters, 'harbor.filters');
export const savedFilters = signal(initial.saved, 'harbor.savedFilters');
export const activityLog = signal(initial.log, 'harbor.activity');
export const saveState = signal('State saves locally in this browser.', 'harbor.saveState');

export const mergedIncidents = computed(() => incidents.map((incident) => ({ ...incident, ...(incidentOverrides()[incident.id] || {}) })));

export const visibleIncidents = computed(() => {
  const f = filters();
  return mergedIncidents()
    .filter((incident) => f.severity === 'all' || incident.severity === f.severity)
    .filter((incident) => f.owner === 'all' || incident.owner === f.owner)
    .filter((incident) => {
      if (f.status === 'all') return true;
      if (f.status === 'open') return incident.status !== 'resolved';
      return incident.status === f.status;
    })
    .sort((a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity));
});

export const consoleSummary = computed(() => {
  const all = mergedIncidents();
  const open = all.filter((incident) => incident.status !== 'resolved');
  return {
    open: open.length,
    critical: open.filter((incident) => incident.severity === 'critical').length,
    degradedServices: services.filter((service) => service.status !== 'healthy').length,
    deployRisk: Math.round(deploys.reduce((sum, deploy) => sum + deploy.risk, 0) / deploys.length),
  };
});

export const ownerLoad = computed(() => {
  return ownerLoadRows(mergedIncidents());
});

export const serviceRollups = computed(() => services.map((service) => {
  const serviceIncidents = mergedIncidents().filter((incident) => incident.serviceId === service.id && incident.status !== 'resolved');
  return {
    ...service,
    incidents: serviceIncidents.length,
    worstSeverity: serviceIncidents[0]?.severity || 'none',
    tone: serviceStatusTone(service.status)
  };
}));

export const deployRollups = computed(() => deploys.map((deploy) => ({
  ...deploy,
  serviceName: serviceName(deploy.serviceId),
  linkedIncidents: mergedIncidents().filter((incident) => incident.serviceId === deploy.serviceId && incident.status !== 'resolved').length,
  tone: deployRiskTone(deploy.risk),
  meterStyle: riskMeterStyle(deploy.risk)
})));

function eventId() {
  return `evt-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36).slice(-4)}`;
}

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function setFilter(key, value) {
  filters((current) => ({ ...current, [key]: value }));
}

export function savedFilterLabel(view = {}) {
  const current = normalizeFilters(view);
  if (!current) return 'Invalid saved view';
  return `${current.severity === 'all' ? 'All severities' : current.severity} · ${current.status} · ${current.owner === 'all' ? 'All owners' : current.owner}`;
}

export function saveCurrentFilter() {
  const current = normalizeFilters(filters());
  if (!current) return;
  const label = savedFilterLabel(current);
  const sameView = (item) => ['severity', 'status', 'owner'].every((key) => item?.filters?.[key] === current[key]);
  const existing = savedFilters().find(sameView);
  savedFilters((items) => [{ id: existing?.id || eventId(), name: label, filters: current }, ...items.filter((item) => !sameView(item)).slice(0, 4)]);
  addActivity(`Saved filter “${label}”.`, 'filter');
}

export function applySavedFilter(id) {
  const item = savedFilters().find((entry) => entry?.id === id);
  const view = normalizeFilters(item?.filters);
  if (!view) return;
  filters(view);
  addActivity(`Applied saved filter “${savedFilterLabel(view)}”.`, 'filter');
}

export function updateIncident(id, patch) {
  const incident = mergedIncidents().find((entry) => entry.id === id);
  if (!incident) return;
  if (Object.entries(patch).every(([key, value]) => incident[key] === value)) return;
  incidentOverrides((overrides) => ({ ...overrides, [id]: { ...(overrides[id] || {}), ...patch } }));
  const changed = Object.entries(patch).map(([key, value]) => `${key} → ${value}`).join(', ');
  addActivity(`${id}: ${changed}.`, patch.status === 'resolved' ? 'success' : 'workflow');
}

export function addActivity(text, tone = 'info') {
  activityLog((events) => [{ id: eventId(), at: nowLabel(), text, tone }, ...events].slice(0, 30));
}

export function clearLocalState() {
  incidentOverrides({});
  filters({ severity: 'all', status: 'open', owner: 'all' });
  savedFilters([]);
  activityLog(initialLog());
  saveState('Reset local Harbor state.');
}

function persistSnapshot(snapshot) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    saveState(`Saved ${activityLog().length} activity event${activityLog().length === 1 ? '' : 's'} locally.`);
  } catch {
    saveState('Changes are not saved in this browser. Console edits will last for this session only.');
  }
}

effect(() => {
  const snapshot = {
    overrides: incidentOverrides(),
    filters: filters(),
    saved: savedFilters(),
    log: activityLog(),
  };
  if (typeof localStorage !== 'undefined') {
    persistSnapshot(snapshot);
  }
});
