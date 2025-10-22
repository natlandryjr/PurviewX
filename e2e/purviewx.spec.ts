// FIX: Replace placeholder content with a valid Playwright E2E test.
import { test, expect } from '@playwright/test';

test.describe('PurviewX Application', () => {
  test.beforeEach(async ({ page }) => {
    // Assumes the app is running on localhost:3000 as per pm2.config.js
    await page.goto('http://localhost:3000');
  });

  test('should load the wizard and allow navigation to the final review step', async ({ page }) => {
    // Step 1: Cloud Environment
    await expect(page.getByText('Select Cloud Environment')).toBeVisible();
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 2: Admin Consent
    await expect(page.getByText('Grant Application Consent')).toBeVisible();
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 3: Custom SITs
    await expect(page.getByText('Import Custom Sensitive Info Types (SITs)')).toBeVisible();
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 4: Sensitivity Labels
    await expect(page.getByText('Configure Sensitivity Labels')).toBeVisible();
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 5: Retention Policies
    await expect(page.getByText('Configure Retention Policies')).toBeVisible();
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 6: DLP Policies
    await expect(page.getByText('Configure DLP Policies')).toBeVisible();
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 7: eDiscovery & Audit
    await expect(page.getByText('eDiscovery & Audit')).toBeVisible();
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 8: Review
    await expect(page.getByText('Review Your Configuration')).toBeVisible();
    
    // Check for the final button
    const reviewButton = page.getByRole('button', { name: 'Review & Generate Plan' });
    await expect(reviewButton).toBeVisible();
    await expect(reviewButton).toBeEnabled();

    // Go to the apply plan screen
    await reviewButton.click();
    await expect(page.getByText('Deployment Plan')).toBeVisible();
    const applyButton = page.getByRole('button', { name: 'Apply Configuration' });
    await expect(applyButton).toBeVisible();
    await expect(applyButton).toBeEnabled();
  });
});
