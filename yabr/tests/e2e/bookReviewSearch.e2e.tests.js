import puppeteer from 'puppeteer';
import { expect, assert, should } from 'chai';

describe('Book Review Search E2E Tests', () => {
  let browser;
  let page;

  before(async () => {
    browser = await puppeteer.launch({ headless: false, slowMo: 50 });
    page = await browser.newPage();
  });

  after(async () => {
    await browser.close();
  });

  it('should search for a book by title', async () => {
    await page.goto('http://localhost:5173/search');
    await page.type('input[placeholder="Search reviewed books..."]', 'Lamborghini');
    await page.waitForSelector('#text-showing');
    const firstResult = await page.$eval('div > h5', el => el.textContent);
    expect(firstResult).to.include('Lamborghini Supercars 50 Years');
  });

  it('should search for a book by author', async () => {
    await page.goto('http://localhost:5173/search');
    await page.type('input[placeholder="Search reviewed books..."]', 'Stuart Codling');
    await page.waitForSelector('#text-showing');
    const firstResult = await page.$eval('div > h5', el => el.textContent);
    expect(firstResult).to.include('Lamborghini Supercars 50 Years');
  });

  it('should handle no search results', async () => {
    await page.goto('http://localhost:5173/search');
    await page.type('input[placeholder="Search reviewed books..."]', 'XXXXXX');
    await page.waitForSelector('#no-results-message');
    const noResultsMessage = await page.$eval('#no-results-message', el => el.textContent);
    expect(noResultsMessage).to.include('No reviewed books found');
  });

  it('should paginate search results', async () => {
    await page.goto('http://localhost:5173/search');
    await page.type('input[placeholder="Search reviewed books..."]', 'Car');
    await page.waitForSelector('#pagination');

    await page.waitForFunction(
      () => document.querySelector('#text-showing').textContent.trim().startsWith('Showing 1 to 12 of'),
      { timeout: 5000 }
    );

    // Find the "Next" button using `page.$$` and `evaluate`
    const nextButton = await page.evaluateHandle(() => {
      return Array.from(document.querySelectorAll('#pagination > ul > li > button'))
        .find(el => el.textContent.trim() === 'Next');
    });

    // Ensure the button was found before trying to click
    if (nextButton) {
      await nextButton.click();
    } else {
      throw new Error('Next button not found');
    }

    await page.waitForFunction(
      () => document.querySelector('#text-showing').textContent.trim().startsWith('Showing 13 to 24 of'),
      { timeout: 5000 }
    );
  });
});
