import { defineConfig } from '@celsian/vura-core';

export default defineConfig({
  pages: {
    defaultMode: 'hybrid',
  },
  api: {
    defaultKind: 'serverless',
  },
  cache: {
    store: 'memory',
    maxEntries: 80,
  },
});
