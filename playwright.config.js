import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './test/browser',
  outputDir: './test-results',
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4276',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run preview -- --port 4276 --strictPort',
    url: 'http://127.0.0.1:4276',
    reuseExistingServer: false,
    timeout: 120000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 15'] } },
  ],
});
