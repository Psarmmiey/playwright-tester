import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const TARGET_URL = 'https://solvente-ai-powered-charter-flight-management-358485273829.us-west1.run.app/#/atc-portal';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');
const MAX_FILENAME_LENGTH = 30;
const ANIMATION_WAIT_MS = 500;

async function navigateToPortal(page: import('@playwright/test').Page): Promise<void> {
  await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
}

test.describe('ATC Portal Full-Page Screenshots', () => {
  test.beforeAll(async () => {
    // Ensure screenshots directory exists
    if (!fs.existsSync(SCREENSHOTS_DIR)) {
      fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    }
  });

  test('Take full-page screenshots of all pages by clicking all buttons', async ({ page }) => {
    // Navigate to the ATC portal and wait for network idle
    await navigateToPortal(page);
    
    // Take initial screenshot of the landing page
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'initial-page.png'),
      fullPage: true
    });
    console.log('Captured initial page screenshot');

    // Get all visible buttons on the page
    const buttons = await page.locator('button').all();
    console.log(`Found ${buttons.length} buttons on the page`);

    // Track visited pages to avoid duplicates
    const visitedUrls = new Set<string>();
    visitedUrls.add(page.url());

    // Click each button and take screenshots
    for (let i = 0; i < buttons.length; i++) {
      try {
        // Re-query buttons since page state may have changed
        const currentButtons = await page.locator('button').all();
        
        if (i >= currentButtons.length) {
          console.log(`Button index ${i} no longer exists, skipping`);
          continue;
        }

        const button = currentButtons[i];
        
        // Check if button is visible and enabled
        const isVisible = await button.isVisible();
        const isEnabled = await button.isEnabled();
        
        if (!isVisible || !isEnabled) {
          console.log(`Button ${i} is not visible or not enabled, skipping`);
          continue;
        }

        // Get button text for naming the screenshot
        const buttonText = await button.textContent() || `button-${i}`;
        const sanitizedButtonText = buttonText.replace(/[^a-zA-Z0-9]/g, '-').substring(0, MAX_FILENAME_LENGTH);
        
        console.log(`Clicking button ${i}: "${buttonText}"`);
        
        // Click the button
        await button.click();
        
        // Wait for network idle after click
        await page.waitForLoadState('networkidle');
        
        // Small additional wait for any animations
        await page.waitForTimeout(ANIMATION_WAIT_MS);
        
        // Take full-page screenshot
        const screenshotPath = path.join(SCREENSHOTS_DIR, `page-after-${sanitizedButtonText}-${i}.png`);
        await page.screenshot({
          path: screenshotPath,
          fullPage: true
        });
        console.log(`Captured screenshot: ${screenshotPath}`);

        // Check if we're on a new page
        const currentUrl = page.url();
        if (!visitedUrls.has(currentUrl)) {
          visitedUrls.add(currentUrl);
          console.log(`New page discovered: ${currentUrl}`);
        }

        // Navigate back to the original page to find more buttons
        await navigateToPortal(page);
        
      } catch (error) {
        console.log(`Error clicking button ${i}: ${error}`);
        // Navigate back to the original page in case of error
        await navigateToPortal(page);
      }
    }

    console.log(`Total unique URLs visited: ${visitedUrls.size}`);
    expect(visitedUrls.size).toBeGreaterThan(0);
  });
});
