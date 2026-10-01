import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { incidents } from '../src/data/ops.js';

const routes = [
  ['/', 'Harbor — Operations console', 'Synthetic operations console with incidents, deploys, services, filters, and activity state.'],
  ['/incidents', 'Incidents — Harbor', 'Routeable incident queue and triage workflow.'],
  ...incidents.map((incident) => [
    `/incidents/${incident.id}`,
    `${incident.id} — Harbor`,
    incident.summary,
  ]),
  ['/services', 'Services — Harbor', 'Synthetic service-health grid with deploy metadata.'],
  ['/deploys', 'Deploys — Harbor', 'Deployment ledger for local operations workflows.'],
  ['/activity', 'Activity — Harbor', 'Audit log for local operations workflows.'],
  ['/build', 'How Harbor is built', 'Implementation notes for agents learning What Framework.'],
];

const shellPath = join('dist', 'index.html');
if (!existsSync(shellPath)) throw new Error('dist/index.html missing; run vite build first');
const shell = readFileSync(shellPath, 'utf8');

function writeRoute(path, title, description) {
  const out = path === '/' ? shellPath : join('dist', path.slice(1), 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(
    out,
    shell
      .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
      .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`)
      .replace('<div id="app"></div>', `<div id="app"><noscript><main><h1>${title}</h1><p>${description}</p></main></noscript></div>`),
  );
}

for (const route of routes) writeRoute(...route);
writeRoute('/404', 'Page not found — Harbor', 'Harbor includes a genuine 404 artifact for static hosting.');
copyFileSync(join('dist', '404', 'index.html'), join('dist', '404.html'));
console.log(`static aliases OK: ${routes.length} routes plus 404`);
