const puppeteer = require('puppeteer');
const { expect } = require('chai');

describe('Create Book Review E2E Test with Login', () => {
  let browser;
  let page;
  const testUser = {
    email: 'mikekruger78+test1@gmail.com',
    password: 'Intrepid1!'
  };

  before(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 50,
      args: ['--start-maximized']
    });
    page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
  });

  after(async () => {
    await browser.close();
  });

  it('should login and create a new book review', async () => {
    // Navigate to the login page
    await page.goto('http://localhost:5173/login');

    // Wait for the login form to be visible
    await page.waitForSelector('form');

    // Fill in login credentials
    await page.type('input[type="email"]', testUser.email);
    await page.type('input[type="password"]', testUser.password);

    // Submit the login form
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle0' })
    ]);

    // Verify successful login (adjust based on your UI)
    const loggedInElement = await page.$('.user-profile') || await page.$('button:contains("Sign Out")');
    expect(loggedInElement).to.not.be.null;

    // Navigate to the create book review page
    await page.goto('http://localhost:5173/create-book-review/');

    // Wait for the search input to be visible
    await page.waitForSelector('input[placeholder="Search for a book..."]');

    // Search for a book
    await page.type('input[placeholder="Search for a book..."]', 'The Great Gatsby');
    await page.waitForSelector('ul.mt-4.space-y-4 li', { visible: true });

    // Select the first book from the search results
    await page.click('ul.mt-4.space-y-4 li:first-child button');

    // Wait for the review form to appear
    await page.waitForSelector('form.space-y-4');

    // Set the rating
    await page.click('button.text-2xl:nth-child(4)'); // 4-star rating

    // Enter review content
    const reviewContent = 'This is a test review for The Great Gatsby. It\'s a classic novel that...';
    await page.evaluate((content) => {
      const quill = document.querySelector('.ql-editor');
      quill.innerHTML = content;
    }, reviewContent);

    // Submit the review
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle0' })
    ]);

    // Wait for the success message
    await page.waitForSelector('.Toastify__toast--success', { visible: true });

    // Verify the success message
    const successMessage = await page.$eval('.Toastify__toast-body', el => el.textContent);
    expect(successMessage).to.include('Review submitted successfully');

    // Verify redirection to book detail page
    const currentUrl = page.url();
    expect(currentUrl).to.include('/book/');
  });
});
