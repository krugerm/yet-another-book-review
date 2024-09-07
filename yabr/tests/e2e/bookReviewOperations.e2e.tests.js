import puppeteer from 'puppeteer';
import { expect, assert, should } from 'chai';

describe('Review Operations E2E Tests', () => {
  let browser;
  let page;

  const testUsername = "mikekruger78+test1@gmail.com";
  const testPassword = "Intrepid1!";

  before(async () => {
    browser = await puppeteer.launch({ headless: false, slowMo: 50 });
    page = await browser.newPage();

    await page.goto('http://localhost:5173/login');
    await page.type('input[type="email"]', testUsername, { delay: 1 });
    await page.type('input[type="password"]', testPassword, { delay: 1 });

    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation()
    ]);
    await page.waitForSelector('#user-loading', { hidden: true });
    const loggedInElement = await page.$('#user-logged-in');
    expect(loggedInElement).to.not.be.null;
  });

  after(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    // Navigate to a specific book details page
    await page.goto('http://localhost:5173/book/Iy2dAgAAQBAJ');
    await page.waitForSelector('.container');
  });

  it('should delete an existing review if preset', async () => {
    // check if there is a review we can edit
    const editButton = await page.$('#btn-edit-review');
    if (editButton === null) {
      return;
    }

    await page.click('#btn-edit-review');
    
    // Wait for the edit modal to appear
    await page.waitForSelector('#title-edit-review');

    // Click the delete button
    await Promise.all([
      page.click('#btn-delete-review'),
      page.waitForSelector('#alert-message-success'),
    ]);

    // Check for success message
    const successMessage = await page.$eval('#alert-message-success', el => el.textContent);
    expect(successMessage).to.include('Review deleted.');
    await page.click('#alert-btn-ok');

    // Verify the review no longer appears on the page
    const reviewElements = await page.$$('#btn-edit-review');
    expect(reviewElements.length).to.equal(0);
  });

  it('should create a new review', async () => {
    // Click the "Create your own review" button
    await page.click('#btn-create-review');
    
    // Wait for the modal to appear
    await page.waitForSelector('#title-create-review');

    // Set rating
    await page.click('#create-btn-star-4'); // 4-star rating

    // Enter review content
    await page.evaluate(() => {
      const quill = document.querySelector('.ql-editor');
      quill.innerHTML = 'This is a test review for the book. Great read!';
    });

    // Submit the review
    await Promise.all([
      page.click('#btn-save-review'),
      page.waitForSelector('#alert-message-success')
    ]);

    // Check for success message
    const successMessage = await page.$eval('#alert-message-success', el => el.textContent);
    expect(successMessage).to.include('Review created!');

    await page.click('#alert-btn-ok');

    // Verify the new review appears on the page
    const reviewText = await page.$eval('.rounded.shadow p', el => el.textContent);
    expect(reviewText).to.include('This is a test review for the book');
  });


  it('should update an existing review', async () => {
    // Click the edit button on the first review
    await page.click('#btn-edit-review');
    
    // Wait for the edit modal to appear
    await page.waitForSelector('#title-edit-review');

    // Change rating
    await page.click('#edit-btn-star-5'); // 5-star rating

    // Update review content
    await page.evaluate(() => {
      const quill = document.querySelector('.ql-editor');
      quill.innerHTML = 'Updated review content. Even better on second reading!';
    });

    // Submit the updated review
    await Promise.all([
      page.click('#btn-update-review'),
      page.waitForSelector('#alert-message-success')
    ]);

    // Check for success message
    const successMessage = await page.$eval('#alert-message-success', el => el.textContent);
    expect(successMessage).to.include('Review updated!');

    // Verify the updated review appears on the page
    const updatedReviewText = await page.$eval('.rounded.shadow p', el => el.textContent);
    expect(updatedReviewText).to.include('Updated review content');
  });

  it('should delete an existing review', async () => {
    // Click the edit button on the first review
    await page.click('#btn-edit-review');
    
    // Wait for the edit modal to appear
    await page.waitForSelector('#title-edit-review');

    // Click the delete button
    await Promise.all([
      page.click('#btn-delete-review'),
      page.waitForSelector('#alert-message-success')
    ]);

    // Check for success message
    const successMessage = await page.$eval('#alert-message-success', el => el.textContent);
    expect(successMessage).to.include('Review deleted.');

    // Verify the review no longer appears on the page
    const reviewElements = await page.$$('#btn-edit-review');
    expect(reviewElements.length).to.equal(0);
  });
});