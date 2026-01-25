#!/usr/bin/env node

import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: join(process.cwd(), '.env.local') });

const POSTGRES_URL = process.env.POSTGRES_URL;

async function verifyEnableAPIKeySetup() {
  console.log('🔧 Verifying Enable API Key Setup');
  
  if (!POSTGRES_URL) {
    console.error('❌ POSTGRES_URL environment variable is not set');
    return;
  }

  const sql = neon(POSTGRES_URL);
  
  try {
    // Check if enableAPIKey field exists in database
    const columns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      AND column_name IN ('enableAPIKey', 'enable_a_p_i_key', 'api_key', 'api_key_index')
      ORDER BY column_name
    `;
    
    console.log('\n📊 Database Schema for API Key fields:');
    if (columns.length === 0) {
      console.log('❌ No API key fields found in users table');
    } else {
      columns.forEach(col => {
        console.log(`✅ ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : '(not null)'} ${col.column_default ? `default: ${col.column_default}` : ''}`);
      });
    }
    
    // Check current users and their API key status
    const users = await sql`
      SELECT id, name, email, "enableAPIKey", api_key IS NOT NULL as has_api_key
      FROM users
      ORDER BY id
    `;
    
    console.log('\n👥 Current Users and API Key Status:');
    if (users.length === 0) {
      console.log('📝 No users found in the database');
    } else {
      users.forEach(user => {
        console.log(`- ID ${user.id}: ${user.name} (${user.email})`);
        console.log(`  └─ Enable API Key: ${user.enableAPIKey ? '✅ true' : '❌ false'}`);
        console.log(`  └─ Has API Token: ${user.has_api_key ? '✅ yes' : '❌ no'}`);
      });
    }
    
    console.log('\n🔍 Admin Panel Testing:');
    console.log('1. Open: https://3000-iv1utm22vom9yyelf9754-de59bda9.sandbox.novita.ai/admin');
    console.log('2. Log in with your credentials');
    console.log('3. Go to Collections → Users');
    console.log('4. Click on your user record');
    console.log('5. Look for "Enable API Key" checkbox field');
    console.log('6. If you see it, check the box and save');
    console.log('7. The system will generate an API Token automatically');
    
    // Test local API endpoint
    console.log('\n🧪 Testing Local API:');
    try {
      const response = await fetch('http://localhost:3000/api/users/me', {
        headers: {
          'Cookie': 'payload-token=test' // This will fail but show us the endpoint structure
        }
      });
      console.log(`- /api/users/me status: ${response.status}`);
      if (response.status === 401) {
        console.log('  └─ ✅ Authentication required (expected)');
      }
    } catch (fetchError) {
      console.log('- Local API test: Connection error (server may be starting)');
    }
    
  } catch (error) {
    console.error('❌ Database query failed:', error.message);
  }
}

verifyEnableAPIKeySetup();