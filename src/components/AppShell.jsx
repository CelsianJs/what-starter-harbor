import { Link } from 'what-framework/router';
import { consoleSummary, saveState, savedFilters } from '../state/ops.js';

const nav = [
  ['/', 'Overview'],
  ['/incidents', 'Incidents'],
  ['/services', 'Services'],
  ['/deploys', 'Deploys'],
  ['/activity', 'Activity'],
  ['/build', 'Build'],
];

export default function AppShell({ children }) {
  return (
    <div class="console-shell">
      <a class="skip-link" href="#content">Skip to content</a>
      <header class="topbar">
        <div>
          <p class="system-label">Synthetic operations</p>
          <Link class="brand" href="/">Harbor</Link>
        </div>
        <nav class="nav" aria-label="Primary">
          {nav.map(([href, label]) => <Link href={href} activeClass="active" exactActiveClass="active">{label}</Link>)}
        </nav>
      </header>
      <section class="status-strip" aria-label="Console storage state">
        <span>Synthetic fixtures only</span>
        <span><strong>{savedFilters().length}</strong> saved filters</span>
        <span>{saveState()}</span>
      </section>
      <main id="content" class="content">{children}</main>
      <footer class="footer">
        <p>Harbor uses bundled synthetic data only. It does not monitor or mutate live infrastructure.</p>
      </footer>
    </div>
  );
}
