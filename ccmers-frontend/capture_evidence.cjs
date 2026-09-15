const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const EVIDENCE_DIR = path.join(__dirname, 'evidence');
const DIRS = ['student', 'response', 'admin'].map(d => path.join(EVIDENCE_DIR, d));

// Create dirs
DIRS.forEach(d => fs.mkdirSync(d, { recursive: true }));

const BASE_URL = 'http://localhost:5173';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function captureScreenshots() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log("Capturing Empty States...");

  // 1. Student Empty States
  await page.goto(`${BASE_URL}/student/login`);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'student', '1_login_empty.png') });
  
  // Login to Student
  await page.click('button[type="submit"]');
  await delay(500);

  await page.goto(`${BASE_URL}/student/dashboard`);
  await delay(500);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'student', '2_dashboard_empty.png') });

  await page.goto(`${BASE_URL}/student/my-incidents`);
  await delay(500);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'student', '3_my_incidents_empty.png') });

  // 2. Response Empty States
  await page.goto(`${BASE_URL}/response/login`);
  await delay(500);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'response', '1_login_empty.png') });
  await page.click('button[type="submit"]');
  await delay(500);

  await page.goto(`${BASE_URL}/response/dashboard`);
  await delay(500);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'response', '2_dashboard_empty.png') });

  await page.goto(`${BASE_URL}/response/assigned-incidents`);
  await delay(500);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'response', '3_assigned_incidents_empty.png') });

  // 3. Admin Empty States
  await page.goto(`${BASE_URL}/admin/login`);
  await delay(500);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'admin', '1_login_empty.png') });
  await page.click('button[type="submit"]');
  await delay(500);

  await page.goto(`${BASE_URL}/admin/dashboard`);
  await delay(500);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'admin', '2_dashboard_empty.png') });

  await page.goto(`${BASE_URL}/admin/all-incidents`);
  await delay(500);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'admin', '3_all_incidents_empty.png') });

  await page.goto(`${BASE_URL}/admin/department-management`);
  await delay(500);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'admin', '4_dept_mgmt_empty.png') });

  await page.goto(`${BASE_URL}/admin/analytics`);
  await delay(500);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'admin', '5_analytics_empty.png') });

  // Add a department
  console.log("Adding department...");
  await page.goto(`${BASE_URL}/admin/department-management`);
  await delay(500);
  const btnHandles = await page.$x("//button[contains(., 'Add Department')]");
  if (btnHandles.length > 0) {
    await btnHandles[0].click();
    await delay(500);
    // Fill department name input
    const inputs = await page.$$('input');
    if (inputs.length >= 1) await inputs[0].type('Campus Security');
    if (inputs.length >= 2) await inputs[1].type('15');
    const saveBtns = await page.$x("//button[contains(., 'Save')]");
    if (saveBtns.length > 0) await saveBtns[0].click();
    await delay(500);
  }
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'admin', '6_dept_mgmt_populated.png') });

  console.log("Simulating Incident Report...");
  // Now submit an incident as a student
  await page.goto(`${BASE_URL}/student/report-incident`);
  await delay(500);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'student', '4_report_incident_form.png') });

  const inputs = await page.$$('input');
  if (inputs.length >= 1) await inputs[0].type('Fire in Main Library');
  if (inputs.length >= 2) await inputs[1].type('Main Library, 2nd Floor');
  const textareas = await page.$$('textarea');
  if (textareas.length >= 1) await textareas[0].type('Smoke coming from the electrical panel.');
  
  const submitBtn = await page.$x("//button[contains(., 'Submit Report')]");
  if (submitBtn.length > 0) await submitBtn[0].click();
  await delay(1000); // Wait for redirect and state update

  console.log("Incident submitted. Capturing populated states...");
  // Student - populated
  await page.goto(`${BASE_URL}/student/dashboard`);
  await delay(500);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'student', '5_dashboard_populated.png') });
  
  await page.goto(`${BASE_URL}/student/my-incidents`);
  await delay(500);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'student', '6_my_incidents_populated.png') });
  
  // Click first incident to go to details
  const incidentRows = await page.$$('tr.cursor-pointer, div.cursor-pointer');
  if (incidentRows.length > 0) {
    await incidentRows[0].click();
    await delay(500);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'student', '7_incident_details.png') });
    
    // Get incident ID from URL
    const url = page.url();
    const incidentId = url.split('/').pop();
    
    // Admin assigns incident
    await page.goto(`${BASE_URL}/admin/dashboard`);
    await delay(500);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'admin', '7_dashboard_populated.png') });

    await page.goto(`${BASE_URL}/admin/all-incidents`);
    await delay(500);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'admin', '8_all_incidents_populated.png') });

    await page.goto(`${BASE_URL}/admin/incident-details/${incidentId}`);
    await delay(500);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'admin', '9_incident_details.png') });

    await page.goto(`${BASE_URL}/admin/assign-incident/${incidentId}`);
    await delay(500);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'admin', '10_assign_incident_form.png') });
    
    // Select department and priority
    const selects = await page.$$('select');
    if (selects.length >= 1) await selects[0].select('Campus Security');
    if (selects.length >= 2) await selects[1].select('High');
    
    const confirmBtn = await page.$x("//button[contains(., 'Confirm Assignment')]");
    if (confirmBtn.length > 0) await confirmBtn[0].click();
    await delay(500);
    
    await page.goto(`${BASE_URL}/admin/analytics`);
    await delay(500);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'admin', '11_analytics_populated.png') });

    // Response team updates status
    await page.goto(`${BASE_URL}/response/dashboard`);
    await delay(500);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'response', '4_dashboard_populated.png') });

    await page.goto(`${BASE_URL}/response/assigned-incidents`);
    await delay(500);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'response', '5_assigned_incidents_populated.png') });

    await page.goto(`${BASE_URL}/response/incident-details/${incidentId}`);
    await delay(500);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'response', '6_incident_details.png') });

    await page.goto(`${BASE_URL}/response/update-status/${incidentId}`);
    await delay(500);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'response', '7_update_status_form.png') });
    
    const statusBtns = await page.$x("//button[contains(., 'In Progress')]");
    if (statusBtns.length > 0) await statusBtns[0].click();
    const tas = await page.$$('textarea');
    if (tas.length > 0) await tas[0].type('Team dispatched, verifying situation.');
    const updateBtn = await page.$x("//button[contains(., 'Update Status')]");
    if (updateBtn.length > 0) await updateBtn[0].click();
    await delay(500);
    
    // Finally verify student tracking updated
    await page.goto(`${BASE_URL}/student/incident-details/${incidentId}`);
    await delay(500);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'student', '8_incident_details_updated.png') });
  }

  await browser.close();
  console.log("Done capturing all evidence!");
}

captureScreenshots().catch(console.error);
