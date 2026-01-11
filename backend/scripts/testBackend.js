const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testBackend() {
  console.log('🧪 TESTING BACKEND...\n');
  
  try {
    // Test 1: Health check
    const health = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health check:', health.data.mongodb);
    
    // Test 2: Get incidents
    const incidents = await axios.get(`${BASE_URL}/api/incidents`);
    console.log(`✅ Incidents loaded: ${incidents.data.length}`);
    
    // Test 3: Get stats
    const stats = await axios.get(`${BASE_URL}/api/incidents/stats`);
    console.log(`✅ Stats:`, {
      total: stats.data.total,
      resolved: stats.data.resolved,
      policeRate: stats.data.policeInvolvedPercentage + '%'
    });
    
    // Test 4: Get volunteers
    const volunteers = await axios.get(`${BASE_URL}/api/volunteers`);
    console.log(`✅ Volunteers: ${volunteers.data.length}`);
    
    // Test 5: Simulate crisis
    console.log('\n🚨 Simulating crisis...');
    await axios.post(`${BASE_URL}/api/sms/incoming`, 
      'From=%2B15555551234&Body=Someone%20is%20following%20me',
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    console.log('✅ Crisis processed!');
    
    console.log('\n✅ ALL TESTS PASSED! Backend is solid! 🔥');
    
  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }
}

testBackend();
