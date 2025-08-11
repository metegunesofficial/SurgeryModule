import { test, expect } from '@playwright/test';

test('surgeries flow creates item and display updates', async ({ page, context }) => {
  // Open main app
  await page.goto('/surgeries');

  // Fill and submit form
  await page.fill('input[name="patientName"]', 'E2E Hasta');
  await page.fill('input[name="procedureType"]', 'E2E İşlem');
  await page.fill('input[type="datetime-local"]', '2025-01-01T10:00');
  await page.fill('input[type="number"]', '30');
  await page.click('text=Kaydet');

  // Verify toast or success text exists
  await expect(page.locator('text=Kayıt oluşturuldu.')).toBeVisible();

  // Open display in another tab
  const display = await context.newPage();
  await display.goto('/display');
  await expect(display.locator('text=E2E Hasta')).toBeVisible({ timeout: 5000 });
});


