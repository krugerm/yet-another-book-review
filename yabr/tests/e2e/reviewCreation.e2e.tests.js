const puppeteer = require('puppeteer');
const { expect } = require('chai');

describe('Review Creation E2E Tests', () => {
  let browser;
  let page;

  before(async () => {
    browser = await puppeteer.launch({ headless: false, slowMo: 50 });
    page = await browser.newPage();
    // Login before tests
    // ... login code here ...
  });

  after(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    // Navigate to review form for a specific book before each test
    await page.goto('http://localhost:5173/create-book-review');
    await page.type('input[placeholder="Search for a book..."]', 'Pride and Prejudice');
    await page.waitForSelector('ul.mt-4.space-y-4 li');
    await page.click('ul.mt-4.space-y-4 li:first-child button');
    await page.waitForSelector('form.space-y-4');
  });

  it('should create a review with all fields filled', async () => {
    await page.click('button.text-2xl:nth-child(4)'); // 4-star rating
    await page.evaluate(() => {
      const quill = document.querySelector('.ql-editor');
      quill.innerHTML = 'This is a great classic novel. Highly recommended!';
    });
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation()
    ]);
    const successMessage = await page.$eval('.Toastify__toast--success', el => el.textContent);
    expect(successMessage).to.include('Review submitted successfully');
  });

  it('should not submit a review without a rating', async () => {
    await page.evaluate(() => {
      const quill = document.querySelector('.ql-editor');
      quill.innerHTML = 'This is a test review without a rating.';
    });
    const submitButton = await page.$('button[type="submit"]');
    const isDisabled = await (await submitButton.getProperty('disabled')).jsonValue();
    expect(isDisabled).to.be.true;
  });

  it('should not submit a review without text', async () => {
    await page.click('button.text-2xl:nth-child(3)'); // 3-star rating
    const submitButton = await page.$('button[type="submit"]');
    const isDisabled = await (await submitButton.getProperty('disabled')).jsonValue();
    expect(isDisabled).to.be.true;
  });

  it('should submit a review with minimum allowed text', async () => {
    await page.click('button.text-2xl:nth-child(5)'); // 5-star rating
    await page.evaluate(() => {
      const quill = document.querySelector('.ql-editor');
      quill.innerHTML = 'Good.'; // Assuming 'Good.' is the minimum allowed text
    });
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation()
    ]);
    const successMessage = await page.$eval('.Toastify__toast--success', el => el.textContent);
    expect(successMessage).to.include('Review submitted successfully');
  });
});
