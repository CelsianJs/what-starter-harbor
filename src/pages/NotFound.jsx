import { Link, route } from 'what-framework/router';

export default function NotFound() {
  return (
    <section class="empty-panel page-enter">
      <p class="system-label">404</p>
      <h1>No console route here.</h1>
      <p>Harbor has no console route for <code>{route.path}</code>.</p>
      <Link class="button primary" href="/incidents">Return to queue</Link>
    </section>
  );
}
