import { getPayload } from 'payload'
import config from '../dist/payload.config.js'

const payload = await getPayload({ config: await config })

const posts = await payload.find({
  collection: 'posts',
  limit: 10,
  depth: 0,
  sort: '-createdAt'
})

console.log(`📊 数据库中共有 ${posts.totalDocs} 篇文章\n`)

if (posts.totalDocs > 0) {
  console.log('最新的 10 篇文章：')
  posts.docs.forEach((post, i) => {
    console.log(`${i+1}. ${post.title || post.title_en}`)
    console.log(`   URL: ${post.source?.url || 'N/A'}`)
    console.log(`   创建: ${post.createdAt}\n`)
  })
} else {
  console.log('❌ 数据库为空！')
}

process.exit(0)
