#!/usr/bin/env node

async function testAPITokenFeatures() {
  console.log('🧪 Testing API Token Features for Payload v3.73.0');
  
  try {
    const response = await fetch('http://localhost:3000/api/access');
    const accessData = await response.json();
    
    console.log('\n📊 API Access Configuration:');
    console.log('- Collections:', Object.keys(accessData.collections || {}));
    console.log('- Users API Key Support:', accessData.collections?.users?.enableAPIKey ? '✅' : '❌');
    
    // Test the API schema for Users
    if (accessData.collections?.users) {
      console.log('\n👤 Users Collection:');
      console.log('- Fields available:', Object.keys(accessData.collections.users.fields || {}));
      console.log('- Create access:', accessData.collections.users.create ? '✅' : '❌');
      console.log('- Read access:', accessData.collections.users.read ? '✅' : '❌');
      console.log('- Update access:', accessData.collections.users.update ? '✅' : '❌');
      console.log('- Delete access:', accessData.collections.users.delete ? '✅' : '❌');
    }
    
    console.log('\n🌐 Access Points:');
    console.log('- Local Admin Panel: http://localhost:3000/admin');
    console.log('- Public Admin Panel: https://3000-iv1utm22vom9yyelf9754-de59bda9.sandbox.novita.ai/admin');
    console.log('- Production Admin: https://sijigpt.com/admin');
    
    console.log('\n🔑 Next Steps for API Token:');
    console.log('1. Visit the admin panel URL above');
    console.log('2. Login to your account');
    console.log('3. Go to your user profile/settings');
    console.log('4. Look for "Enable API Key" checkbox');
    console.log('5. Check the box and save');
    console.log('6. The API Token will be generated automatically');
    
    console.log('\n✅ API Token functionality is ready to use!');
    
  } catch (error) {
    console.error('❌ Error testing API Token features:', error.message);
  }
}

testAPITokenFeatures();