import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const sql = neon(process.env.POSTGRES_URL)

const tables = ['posts', '_pages_v', 'search']

for (const table of tables) {
  try {
    const query = `SELECT COUNT(*) as count FROM "${table}"`
    const result = await sql(query)
    console.log(`${table}: ${result[0].count} 条记录`)
    
    if (result[0].count > 0) {
      const sampleQuery = `SELECT * FROM "${table}" LIMIT 2`
      const sample = await sql(sampleQuery)
      console.log('样本数据:', JSON.stringify(sample[0], null, 2))
    }
  } catch (error) {
    console.log(`${table}: 查询失败 - ${error.message}`)
  }
}

// 特别检查 posts 的字段
try {
  const fields = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'posts'
    ORDER BY ordinal_position
  `
  console.log('\n📋 posts 表字段:')
  fields.forEach(f => console.log(`  - ${f.column_name} (${f.data_type})`))
} catch (error) {
  console.log('字段查询失败')
}

process.exit(0)
