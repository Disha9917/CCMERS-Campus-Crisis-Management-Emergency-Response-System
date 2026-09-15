const puppeteer = require('puppeteer');
const { createServer } = require('vite');
const path = require('path');

(async () => {
  console.log('Starting Vite server...');
  const server = await createServer({
    root: path.resolve(__dirname, '..'),
    server: {
      port: 5173,
    },
  });
  await server.listen();
  console.log('Vite server listening on http://localhost:5173');

  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // 1. Test Student Login & Sidebar
    console.log('Testing Student Login...');
    await page.goto('http://localhost:5173/student/login', { waitUntil: 'networkidle0' });
    await page.type('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 1500));

    console.log('Current URL after Student Login:', page.url());
    const studentNavLinks = await page.$$eval('nav a span', els => els.map(e => e.textContent.trim()));
    console.log('Student Nav Links:', studentNavLinks);

    // 2. Test Cross-role Access (Student trying to visit /admin/dashboard)
    console.log('Testing Student visiting /admin/dashboard...');
    await page.goto('http://localhost:5173/admin/dashboard', { waitUntil: 'networkidle0' });
    const accessDeniedHeading = await page.$eval('h1', el => el.textContent.trim()).catch(() => 'No H1');
    console.log('Page H1 heading when Student accesses /admin/dashboard:', accessDeniedHeading);

    // 3. Test Response Login & Sidebar
    console.log('Testing Response Login...');
    await page.goto('http://localhost:5173/response/login', { waitUntil: 'networkidle0' });
    await page.type('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 1500));

    console.log('Current URL after Response Login:', page.url());
    const responseNavLinks = await page.$$eval('nav a span', els => els.map(e => e.textContent.trim()));
    console.log('Response Nav Links:', responseNavLinks);

    // 4. Test Admin Login & Sidebar
    console.log('Testing Admin Login...');
    await page.goto('http://localhost:5173/admin/login', { waitUntil: 'networkidle0' });
    await page.type('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 1500));

    console.log('Current URL after Admin Login:', page.url());
    const adminNavLinks = await page.$$eval('nav a span', els => els.map(e => e.textContent.trim()));
    console.log('Admin Nav Links:', adminNavLinks);

    console.log('\n--- VERIFICATION RESULT ---');
    if (
      studentNavLinks.length === 4 &&
      studentNavLinks.includes('Dashboard') &&
      studentNavLinks.includes('Report Incident') &&
      studentNavLinks.includes('My Incidents') &&
      studentNavLinks.includes('Profile') &&
      accessDeniedHeading === 'Access Denied' &&
      responseNavLinks.includes('Assigned Incidents') &&
      adminNavLinks.includes('Analytics')
    ) {
      console.log('SUCCESS: Dynamic sidebar rendering and route protection verified!');
    } else {
      console.log('FAILED: Sidebar or route protection check did not match expected results.');
    }
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    if (browser) await browser.close();
    await server.close();
    process.exit(0);
  }
})();
