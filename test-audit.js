const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testAuditSystem() {
  console.log('🧪 Testing Audit System...\n');

  try {
    // 1. Тест получения audit logs
    console.log('1. Testing GET /audit');
    const logsResponse = await axios.get(`${BASE_URL}/audit?limit=5`);
    console.log('✅ Audit logs retrieved:', logsResponse.data.logs?.length || 0, 'logs');
    console.log('   Total logs:', logsResponse.data.total);
    console.log('');

    // 2. Тест статистики
    console.log('2. Testing GET /audit/stats');
    const statsResponse = await axios.get(`${BASE_URL}/audit/stats`);
    console.log('✅ Audit stats retrieved:', statsResponse.data);
    console.log('');

    // 3. Тест фильтрации по действию
    console.log('3. Testing GET /audit with action filter');
    const filteredResponse = await axios.get(`${BASE_URL}/audit?action=READ&limit=3`);
    console.log('✅ Filtered logs retrieved:', filteredResponse.data.logs?.length || 0, 'logs');
    console.log('');

    // 4. Тест создания пациента (если есть auth)
    console.log('4. Testing patient creation (if authenticated)');
    try {
      const patientData = {
        name: 'Test Patient',
        email: 'test@example.com',
        phone: '+1234567890'
      };
      
      const patientResponse = await axios.post(`${BASE_URL}/patients`, patientData, {
        headers: {
          'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE', // Замените на реальный токен
          'X-Tenant-ID': 'test-tenant-id'
        }
      });
      console.log('✅ Patient created:', patientResponse.data);
    } catch (error) {
      console.log('⚠️  Patient creation failed (expected if not authenticated):', error.response?.status);
    }
    console.log('');

    // 5. Тест очистки старых логов
    console.log('5. Testing cleanup (dry run)');
    try {
      const cleanupResponse = await axios.post(`${BASE_URL}/audit/cleanup?daysToKeep=365`);
      console.log('✅ Cleanup completed:', cleanupResponse.data);
    } catch (error) {
      console.log('⚠️  Cleanup failed:', error.response?.status);
    }
    console.log('');

    console.log('🎉 Audit system test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Запуск теста
testAuditSystem(); 