#!/usr/bin/env node

import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: join(process.cwd(), '.env.local') });

const POSTGRES_URL = process.env.POSTGRES_URL;

if (!POSTGRES_URL) {
  console.error('❌ POSTGRES_URL environment variable is not set');
  process.exit(1);
}

const sql = neon(POSTGRES_URL);

async function addEnableAPIKeyField() {
  try {
    console.log('🔧 Adding enableAPIKey field to users table...');
    
    // Add enableAPIKey field if it doesn't exist
    await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS "enableAPIKey" boolean DEFAULT false
    `;
    
    console.log('✅ Successfully added enableAPIKey field to users table');
    
    // Check current table structure
    const columns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `;
    
    console.log('\n📊 Current users table structure:');
    columns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : '(not null)'} ${col.column_default ? `default: ${col.column_default}` : ''}`);
    });
    
  } catch (error) {
    console.error('❌ Failed to add enableAPIKey field:', error.message);
    process.exit(1);
  }
}

addEnableAPIKeyField();