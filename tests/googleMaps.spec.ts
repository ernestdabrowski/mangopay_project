import { test, expect, type Page} from '@playwright/test';
import { googleMapsSearchLocators } from '../locators/locators';
import AxeBuilder from '@axe-core/playwright';

const googleMapsPage = "https://maps.google.com";

async function fillSearchBar(page: Page, destination) {
  await page.fill(googleMapsSearchLocators.searchBox, destination);
  await page.click(googleMapsSearchLocators.searchButton);
  // await page.keyboard.press('Enter');
}

async function openGoogleMaps(page: Page) {
  await page.goto(googleMapsPage);
  await page.click(googleMapsSearchLocators.acceptAll);
  await expect(page).toHaveTitle(/Google Maps/);
}

test.beforeEach(async ({ page }) => {
  openGoogleMaps(page);
});

test.describe('Set of tests for Mangopay recruitment task', () => {

  test('TC1: open Google Maps and search for Paris', async ({ page }) => {

    fillSearchBar(page, 'Paris');
    
    await expect(page.getByRole('heading', { name: 'Paris', exact: true })).toBeVisible({ timeout: 30000 });
    await expect(page.locator(googleMapsSearchLocators.directionsButton)).toBeVisible();
  });

  test('TC2: open Google Maps and search for London, vefify destination field', async ({ page }) => {

    fillSearchBar(page, 'London');
  
    await expect(page.getByRole('heading', { name: 'London', exact: true })).toBeVisible({ timeout: 30000 });
    await page.click(googleMapsSearchLocators.directionsButton);

    await (page.locator(googleMapsSearchLocators.destinationInput)).click();
    await expect(page.locator(googleMapsSearchLocators.destinationInput)).toHaveAttribute('aria-label', 'Destination London, UK');

    
  });

  test('TC3: accessablity test for GoogleMaps SearchBox', async ({page}) => {
    await page.locator(googleMapsSearchLocators.searchBox).waitFor();
    const accessibilityScanResults = await new AxeBuilder({ page })
    .include('#searchboxinput')
    .analyze(); 
     expect(accessibilityScanResults.violations).toEqual([]); 
  });
});