module.exports = {
  launch: {
    headless: process.env.HEADLESS !== 'false', // Run in headless mode unless explicitly set to 'false'
    slowMo: 10, // Slow down Puppeteer operations by 50ms for better visibility during testing
    // args: [
    //   '--start-maximized',
    //   '--no-sandbox', // Useful for CI environments
    //   '--disable-setuid-sandbox',
    //   '--disable-infobars',
    //   '--disable-dev-shm-usage',
    //   '--window-size=1280,800', // Set default window size
    //   '--host'
    // ],
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: {
      width: 1280,
      height: 800,
    },
  },
  browserContext: 'default', // Use default context (new incognito context could be an alternative)
  // exitOnPageError: false, // If true, Jest will fail on any page error. False is useful when testing error scenarios.
  server: {
    command: 'npm run dev',
    port: 5173, // The port where the server will run
    launchTimeout: 10000, // Time to wait for the server to start (in ms)
    debug: false, // Enable server debug output
    usedPortAction: 'kill', // Optionally kill the process on port if it is in use
    url: 'http://localhost:5173',
    waitOnScheme: {
      delay: 5000,  // Add a delay of 5 seconds to ensure the server is fully ready
      resources: ['http://localhost:5173'], // Monitor the server URL
    },
  },
};
  