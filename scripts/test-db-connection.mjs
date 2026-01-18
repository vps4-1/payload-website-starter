import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const sql = neon(process.env.POSTGRES_URL)

console.log('🔍 测试 Neon 数据库连接...\n')

try {
  const result = await sql`SELECT version()`
  console.log('✅ 数据库连接成功！')
  console.log('PostgreSQL 版本:', result[0].version)
  
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name
  `
  
  console.log('\n📊 数据库表列表:')
  tables.forEach(t => console.log('  -', t.table_name))
  
  const posts = await sql`SELECT COUNT(*) as count FROM posts`
  console.log(`\n📝 Posts 表中有 ${posts[0].count} 条记录`)
  
} catch (error) {
  console.error('❌ 数据库连接失败:', error.message)
  console.error('完整错误:', error)
}

process.exit(0)
