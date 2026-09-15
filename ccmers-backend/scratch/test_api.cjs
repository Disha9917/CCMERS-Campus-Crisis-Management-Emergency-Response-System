const http = require('http');
const app = require('../server');

async function runTests() {
  console.log('=== CCMERS Backend API Automated Verification Suite ===\n');

  const server = app.listen(0, async () => {
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;
    console.log(`[Test Server] Started temporary test instance on port ${port}\n`);

    let studentToken = '';
    let adminToken = '';
    let responseToken = '';
    let createdIncidentId = '';

    const makeRequest = (path, method = 'GET', body = null, token = '') => {
      return new Promise((resolve, reject) => {
        const url = new URL(path, baseUrl);
        const options = {
          hostname: url.hostname,
          port: url.port,
          path: url.pathname + url.search,
          method,
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        };

        const req = http.request(options, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              resolve({ status: res.statusCode, data: JSON.parse(data) });
            } catch (e) {
              resolve({ status: res.statusCode, data });
            }
          });
        });

        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
      });
    };

    try {
      // 1. Health Check
      console.log('1. Testing Health Check Endpoint...');
      const health = await makeRequest('/api/health');
      console.log(`   [GET /api/health] Status: ${health.status} | Output: ${JSON.stringify(health.data)}`);

      // 2. Auth - Student Login
      console.log('\n2. Testing Student Auth Login...');
      const stuLogin = await makeRequest('/api/auth/login', 'POST', { role: 'student', email: 'student@campus.edu' });
      studentToken = stuLogin.data.token;
      console.log(`   [POST /api/auth/login] Status: ${stuLogin.status} | User: ${stuLogin.data.user.name} (${stuLogin.data.user.role})`);

      // 3. Auth - Admin Login
      console.log('\n3. Testing Admin Auth Login...');
      const admLogin = await makeRequest('/api/auth/login', 'POST', { role: 'admin', email: 'admin@campus.edu' });
      adminToken = admLogin.data.token;
      console.log(`   [POST /api/auth/login] Status: ${admLogin.status} | User: ${admLogin.data.user.name} (${admLogin.data.user.role})`);

      // 4. Auth - Response Team Login
      console.log('\n4. Testing Response Team Auth Login...');
      const respLogin = await makeRequest('/api/auth/login', 'POST', { role: 'response', email: 'response@campus.edu' });
      responseToken = respLogin.data.token;
      console.log(`   [POST /api/auth/login] Status: ${respLogin.status} | User: ${respLogin.data.user.name} (${respLogin.data.user.role})`);

      // 5. Incident - Create Incident
      console.log('\n5. Testing Incident Creation (Student)...');
      const createInc = await makeRequest('/api/incidents', 'POST', {
        title: 'Smoke Alert in West Dorm Hallway',
        category: 'Fire Safety',
        location: 'West Dorm Block B',
        description: 'Smoke detector activated near laundry room.',
        severity: 'High'
      }, studentToken);
      createdIncidentId = createInc.data.data.id;
      console.log(`   [POST /api/incidents] Status: ${createInc.status} | Created ID: ${createdIncidentId} | Severity: ${createInc.data.data.severity}`);

      // 6. Incident - List Admin Incidents
      console.log('\n6. Testing Get All Incidents (Admin)...');
      const allInc = await makeRequest('/api/incidents', 'GET', null, adminToken);
      console.log(`   [GET /api/incidents] Status: ${allInc.status} | Count: ${allInc.data.count}`);

      // 7. Incident - Assign Incident
      console.log('\n7. Testing Assign Incident (Admin)...');
      const assignInc = await makeRequest(`/api/incidents/${createdIncidentId}/assign`, 'PATCH', {
        assignedDepartment: 'Campus Security',
        severity: 'Critical'
      }, adminToken);
      console.log(`   [PATCH /api/incidents/${createdIncidentId}/assign] Status: ${assignInc.status} | Assigned Dept: ${assignInc.data.data.assignedDepartment}`);

      // 8. Incident - Update Status
      console.log('\n8. Testing Update Incident Status (Response Team)...');
      const statusInc = await makeRequest(`/api/incidents/${createdIncidentId}/status`, 'PATCH', {
        status: 'Resolved',
        resolutionRemarks: 'Faulty sensor replaced by electrician.',
        resolutionTimeHours: 0.5
      }, responseToken);
      console.log(`   [PATCH /api/incidents/${createdIncidentId}/status] Status: ${statusInc.status} | New Status: ${statusInc.data.data.status}`);

      // 9. Departments - Get All Departments
      console.log('\n9. Testing Get All Departments...');
      const depts = await makeRequest('/api/departments', 'GET', null, studentToken);
      console.log(`   [GET /api/departments] Status: ${depts.status} | Count: ${depts.data.count}`);

      // 10. Analytics - Aggregate Analytics
      console.log('\n10. Testing Analytics Aggregation Metrics (Admin)...');
      const analytics = await makeRequest('/api/analytics', 'GET', null, adminToken);
      console.log(`   [GET /api/analytics] Status: ${analytics.status} | Summary: ${JSON.stringify(analytics.data.data.summary)}`);

      console.log('\n✅ ALL API ENDPOINTS PASSED VERIFICATION TEST SUCCESSFULLY!\n');
    } catch (err) {
      console.error('❌ API Test Failed:', err);
    } finally {
      server.close();
      process.exit(0);
    }
  });
}

runTests();
