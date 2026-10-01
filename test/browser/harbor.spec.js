import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { incidents } from '../../src/data/ops.js';

test.beforeEach(async ({ page }) => {
  page.consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().includes('Failed to load resource: the server responded with a status of 404')) {
      page.consoleErrors.push(message.text());
    }
  });
  page.on('pageerror', (error) => page.consoleErrors.push(error.message));
  await page.addInitScript(() => localStorage.removeItem('what-starter-harbor-v1'));
});

test.afterEach(async ({ page }) => {
  expect(page.consoleErrors).toEqual([]);
});

test('filters, saves a view, mutates incident detail, logs activity, and screenshots', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /operations console/i })).toBeVisible();

  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Incidents', exact: true }).click();
  await page.getByLabel('Severity').selectOption('critical');
  await expect(page.getByText('inc-1048')).toBeVisible();
  await page.getByRole('button', { name: /save current filter/i }).click();
  await expect(page.getByRole('button', { name: 'Console watch' })).toBeVisible();

  await page.getByRole('link', { name: /synthetic cold-start/i }).click();
  await page.getByRole('button', { name: 'Mark resolved' }).click();
  await page.getByRole('button', { name: 'Assign Theo' }).click();
  await expect(page.getByText(/status → resolved/)).not.toBeVisible();
  await page.getByRole('link', { name: 'Activity' }).click();
  await expect(page.getByText(/status → resolved/i)).toBeVisible();
  await expect(page.getByText(/owner → Theo/i)).toBeVisible();

  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Overview', exact: true }).click();
  await expect(page.getByRole('heading', { name: /operations console/i })).toBeVisible();
  await page.waitForTimeout(350);
  mkdirSync('test-results/screenshots', { recursive: true });
  await page.screenshot({ path: `test-results/screenshots/harbor-${testInfo.project.name}.png`, fullPage: false });
});

test('unknown route renders fallback', async ({ page }) => {
  await page.goto('/nowhere');
  await expect(page.getByRole('heading', { name: /no console route/i })).toBeVisible();
});

test('every incident detail route is directly addressable', async ({ page }) => {
  for (const incident of incidents) {
    await page.goto(`/incidents/${incident.id}`);
    await expect(page.getByRole('heading', { name: incident.title })).toBeVisible();
  }
});

test('storage-denied browsers keep session edits without crashing', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error('storage denied by test');
    };
  });
  await page.goto('/incidents/inc-1048');
  await page.getByRole('button', { name: 'Mark resolved' }).click();
  await expect(page.getByText(/not saved in this browser/i)).toBeVisible();
  await page.getByRole('link', { name: 'Activity' }).click();
  await expect(page.getByText(/status → resolved/i)).toBeVisible();
});

test('service grid is readable on mobile', async ({ page }) => {
  await page.goto('/services');
  await expect(page.getByRole('heading', { name: /synthetic health/i })).toBeVisible();
  await expect(page.getByText('Edge Router')).toBeVisible();
});
