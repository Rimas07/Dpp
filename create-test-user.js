const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Схема пользователя
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  tenantId: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

async function createTestUser() {
  try {
    // Подключение к MongoDB
    await mongoose.connect('mongodb://localhost:27017/defaultdb');
    console.log('✅ Connected to MongoDB');

    // Проверяем, существует ли пользователь
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('⚠️  Test user already exists');
      return;
    }

    // Создаем тестового пользователя
    const hashedPassword = await bcrypt.hash('password123', 10);
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      tenantId: 'test-tenant-123'
    });

    await testUser.save();
    console.log('✅ Test user created successfully');
    console.log('   Email: test@example.com');
    console.log('   Password: password123');
    console.log('   Tenant ID: test-tenant-123');

  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createTestUser(); 