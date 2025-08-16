import { test, expect } from '@playwright/test';

test.describe('Multi-tenant routes', () => {
  test('/{slug} renders and shows tenant context message', async ({ page }) => {
    await page.goto('/demo');
    await expect(page).toHaveURL(/\/demo$/);
    // When DB is not connected, page shows not found message after loading
    await expect(page.getByText(/Klinik\/Hastane bulunamadı\./)).toBeVisible();
  });

  test('/{slug}/ameliyat-planlama renders tenant surgery planning page', async ({ page }) => {
    await page.goto('/demo/ameliyat-planlama');
    await expect(page).toHaveURL(/\/demo\/ameliyat-planlama$/);
    await expect(page.getByRole('heading', { name: 'Ameliyat Planlama (Tenant)' })).toBeVisible();
  });
});


