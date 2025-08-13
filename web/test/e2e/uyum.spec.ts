import { test, expect } from '@playwright/test';

test.describe('Uyum sayfası', () => {
  test('PRD özetleri render edilir', async ({ page }) => {
    await page.goto('/uyum');
    await expect(page.getByTestId('spec-total-modules')).toBeVisible();
    await expect(page.getByTestId('spec-total-features')).toBeVisible();
    await expect(page.getByTestId('spec-standards-count')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'PRD Uyum Görünümü' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Standartlar' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Gereksinim Toplamları' })).toBeVisible();
  });
});


