import { deployRollups } from '../state/ops.js';

export default function Deploys() {
  return (
    <section class="page-enter">
      <div class="page-heading">
        <p class="system-label">Deploy ledger</p>
        <h1>Risk is computed from local fixtures.</h1>
        <p>Deploy rows show how a dashboard can bind synthetic deploy metadata to service and incident state.</p>
      </div>
      <div class="deploy-list">
        {deployRollups().map((deploy) => (
          <article class="deploy-row">
            <div><p class="row-kicker">{deploy.id} · {deploy.serviceName}</p><h2>{deploy.title}</h2></div>
            <span class="pill">{deploy.state}</span>
            <span>{deploy.actor}</span>
            <span>{deploy.age}</span>
            <span>{deploy.linkedIncidents} linked</span>
            <meter min="0" max="100" value={deploy.risk}>{deploy.risk}</meter>
          </article>
        ))}
      </div>
    </section>
  );
}
