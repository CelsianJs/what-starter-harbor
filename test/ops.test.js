import { describe, expect, it } from 'vitest';
import { deploys, incidents, serviceName, services } from '../src/data/ops.js';

describe('synthetic ops data', () => {
  it('links every incident to a known service', () => {
    const serviceIds = new Set(services.map((service) => service.id));
    expect(incidents.every((incident) => serviceIds.has(incident.serviceId))).toBe(true);
  });

  it('links every deploy to a known service name', () => {
    expect(deploys.map((deploy) => serviceName(deploy.serviceId))).not.toContain(undefined);
    expect(serviceName('edge-router')).toBe('Edge Router');
  });
});
