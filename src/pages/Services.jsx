import { serviceRollups } from '../state/ops.js';

export default function Services() {
  return (
    <section class="page-enter">
      <div class="page-heading">
        <p class="system-label">Service matrix</p>
        <h1>Synthetic health, tied to incidents.</h1>
        <p>These rows are bundled demo data. They are useful for app structure and not proof of real uptime.</p>
      </div>
      <div class="service-grid">
        {serviceRollups().map((service) => (
          <article class={`service-card status-${service.status}`}>
            <p class="row-kicker">{service.region} · {service.tier}</p>
            <h2>{service.name}</h2>
            <p class="metric-line"><span>Status</span><strong>{service.status}</strong></p>
            <p class="metric-line"><span>Latency fixture</span><strong>{service.latency}ms</strong></p>
            <p class="metric-line"><span>Open incidents</span><strong>{service.incidents}</strong></p>
            <p class="metric-line"><span>Deploy</span><strong>{service.deploy}</strong></p>
          </article>
        ))}
      </div>
    </section>
  );
}
