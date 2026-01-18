import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
const sql = neon(process.env.POSTGRES_URL)

try {
  const posts = await sql`
    SELECT id, title, title_en, slug, source_url 
    FROM posts 
    ORDER BY created_at DESC 
    LIMIT 5
  `
  
  console.log('📋 文章链接格式:\n')
  
  if (posts.length === 0) {
    console.log('数据库为空，示例链接格式：')
    console.log('https://sijigpt.com/posts/zenken-chatgpt-enterprise')
    console.log('https://sijigpt.com/posts/alibaba-tongyi-qianwen-3')
  } else {
    posts.forEach(post => {
      console.log(`标题: ${post.title || post.title_en}`)
      console.log(`链接: https://sijigpt.com/posts/${post.slug}`)
      console.log(`原文: ${post.source_url}`)
      console.log('')
    })
  }
} catch (error) {
  console.log('查询失败:', error.message)
}

process.exit(0)
