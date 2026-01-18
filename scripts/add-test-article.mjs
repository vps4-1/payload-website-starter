import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
const sql = neon(process.env.POSTGRES_URL)

const testArticle = {
  title: 'OpenAI 发布 GPT-4 Turbo',
  title_en: 'OpenAI Releases GPT-4 Turbo',
  slug: 'openai-gpt-4-turbo',
  source_url: 'https://openai.com/blog/gpt-4-turbo',
  source_name: 'OpenAI Blog',
  original_language: 'en',
  summary_zh_content: 'OpenAI 发布了 GPT-4 Turbo，新模型具有更强的推理能力和更长的上下文窗口...',
  summary_en_content: 'OpenAI released GPT-4 Turbo with enhanced reasoning and longer context...',
  published_at: new Date().toISOString()
}

try {
  await sql`
    INSERT INTO posts (
      title, title_en, slug, source_url, source_name, 
      original_language, summary_zh_content, summary_en_content, 
      published_at, created_at, updated_at
    ) VALUES (
      ${testArticle.title}, ${testArticle.title_en}, ${testArticle.slug},
      ${testArticle.source_url}, ${testArticle.source_name},
      ${testArticle.original_language}, ${testArticle.summary_zh_content},
      ${testArticle.summary_en_content}, ${testArticle.published_at},
      NOW(), NOW()
    )
  `
  
  console.log('✅ 测试文章已添加！')
  console.log('访问: https://sijigpt.com/posts/' + testArticle.slug)
} catch (error) {
  console.error('❌ 添加失败:', error.message)
}

process.exit(0)
