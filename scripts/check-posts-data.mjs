import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const sql = neon(process.env.POSTGRES_URL)

try {
  const result = await sql`SELECT COUNT(*) as count FROM posts`
  console.log(`📊 Posts 表共 ${result[0].count} 条记录\n`)
  
  if (result[0].count > 0) {
    const posts = await sql`
      SELECT id, title, title_en, source_url, slug, created_at 
      FROM posts 
      ORDER BY created_at DESC 
      LIMIT 10
    `
    
    console.log('最新的文章:')
    posts.forEach((p, i) => {
      console.log(`${i+1}. ${p.title || p.title_en}`)
      console.log(`   URL: ${p.source_url}`)
      console.log(`   Slug: ${p.slug}`)
      console.log(`   创建: ${p.created_at}\n`)
    })
  }
} catch (error) {
  console.error('错误:', error.message)
}

process.exit(0)
