import { describe, expect, it } from 'vitest';
import { deployRiskTone, deploys, incidents, ownerLoadRows, riskMeterStyle, serviceName, serviceStatusTone, services } from '../src/data/ops.js';

describe('synthetic ops data', () => {
  it('links every incident to a known service', () => {
    const serviceIds = new Set(services.map((service) => service.id));
    expect(incidents.every((incident) => serviceIds.has(incident.serviceId))).toBe(true);
  });

  it('links every deploy to a known service name', () => {
    expect(deploys.map((deploy) => serviceName(deploy.serviceId))).not.toContain(undefined);
    expect(serviceName('edge-router')).toBe('Edge Router');
  });

  it('maps deploy risk to 0-100 meter tones', () => {
    expect(deploys.map((deploy) => deployRiskTone(deploy.risk))).toEqual(['risk-high', 'risk-medium', 'risk-low', 'risk-low']);
    expect(riskMeterStyle(82)).toContain('--risk:82');
  });

  it('maps service status and owner load to visual metadata', () => {
    expect(services.map((service) => serviceStatusTone(service.status))).toEqual(['tone-warning', 'tone-watch', 'tone-healthy', 'tone-healthy', 'tone-warning']);
    const rows = ownerLoadRows(incidents);
    expect(rows[0]).toMatchObject({ owner: 'Mara', count: 2, share: 1 });
    expect(rows.every((row) => row.share > 0 && row.share <= 1)).toBe(true);
  });
});
