import { test, expect } from '@playwright/test';

test.describe('Smoke routes', () => {
  test('home responds and renders sidebar/header', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\//);
    await expect(page.getByRole('navigation', { name: 'Birincil' })).toBeVisible();
  });

  test('/ameliyat-planlama renders', async ({ page }) => {
    await page.goto('/ameliyat-planlama');
    await expect(page).toHaveURL(/ameliyat-planlama/);
    await expect(page.getByRole('heading', { name: 'Ameliyat Planlama' })).toBeVisible();
  });

  test('/sterilizasyon renders', async ({ page }) => {
    await page.goto('/sterilizasyon');
    await expect(page).toHaveURL(/sterilizasyon/);
    await expect(page.getByRole('heading', { level: 1, name: 'Sterilizasyon Döngü Yönetimi' }).first()).toBeVisible();
  });

  test('/uyum renders', async ({ page }) => {
    await page.goto('/uyum');
    await expect(page.getByRole('heading', { name: /PRD Uyum Görünümü/i })).toBeVisible();
  });

  test('/account/signin renders', async ({ page }) => {
    await page.goto('/account/signin');
    await expect(page.getByRole('heading', { name: /Giriş Yap|Kayıt Ol/ })).toBeVisible();
  });
});


