import { neon } from '@neondatabase/serverless'

const connectionString = process.env.POSTGRES_URL

if (!connectionString) {
  console.error('POSTGRES_URL environment variable is not set')
  process.exit(1)
}

console.log('Adding missing API key columns to users table...')

try {
  const sql = neon(connectionString)
  
  // Add the missing columns if they don't exist
  const result = await sql`
    ALTER TABLE users 
    ADD COLUMN IF NOT EXISTS enable_a_p_i_key boolean,
    ADD COLUMN IF NOT EXISTS api_key varchar,
    ADD COLUMN IF NOT EXISTS api_key_index varchar
  `
  
  console.log('✅ Successfully added API key columns to users table')
  console.log('Columns added: enable_a_p_i_key, api_key, api_key_index')
  
} catch (error) {
  console.error('❌ Error adding columns:', error)
  process.exit(1)
}

console.log('✅ Database schema fix completed successfully!')
process.exit(0)