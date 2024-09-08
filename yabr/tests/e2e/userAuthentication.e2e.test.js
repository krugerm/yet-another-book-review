import puppeteer from 'puppeteer';
import { expect } from 'chai';

describe('User Authentication E2E Tests', () => {
  let browser;
  let page;

  const testUsername = "mikekruger78+test1@gmail.com";
  const testPassword = "Intrepid1!";

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false, slowMo: 50 });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should fail login with incorrect credentials', async () => {
    await page.goto('http://localhost:5173/login');
    await page.type('input[type="email"]', testUsername);
    await page.type('input[type="password"]', testPassword + "X");
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForSelector('#loading', { hidden: true })
    ]);

    await new Promise(resolve => setTimeout(resolve, 1000));
    const errorMessage = await page.$eval('#error-message', el => el.textContent);
    expect(errorMessage).to.include('Invalid login credentials');
  });

  it('should login successfully', async () => {
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

  it('should logout', async () => {
    await page.goto('http://localhost:5173/');

    // Wait until the loading spinner disappears
    await page.waitForSelector('#user-loading', { hidden: true });

    // Click on the parent element of the image with ID "user-profile-image"
    await page.evaluate(() => {
      const imgElement = document.querySelector('img[id="user-profile-image"]');
      if (imgElement && imgElement.parentElement) {
        imgElement.parentElement.click();
      }
    });
    
    await Promise.all([
      page.click('button[id="btn-logout"]'),
      page.waitForResponse(response => response.url().includes('/') && response.status() === 200)
    ]);

    await page.waitForSelector('#user-loading', { hidden: true });
    await new Promise(resolve => setTimeout(resolve, 1000));

    const loggedOutElement = await page.$('#user-logged-out');
    expect(loggedOutElement).to.be.not.null;
  });

  // it('should register a new user', async () => {
  //   await page.goto('http://localhost:5173/register');
  //   await page.type('input[type="email"]', testUsername);
  //   await page.type('input[type="password"]', testPassword);
  //   await page.type('input[name="confirmPassword"]', testPassword);
  //   await Promise.all([
  //     page.click('button[type="submit"]'),
  //     page.waitForNavigation()
  //   ]);
  //   const welcomeMessage = await page.$eval('.welcome-message', el => el.textContent);
  //   expect(welcomeMessage).to.include(`Welcome, ${testUsername}`);
  // });
});
