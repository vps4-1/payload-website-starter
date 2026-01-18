import { getPayload } from 'payload'
import config from './src/payload.config.js'

const payload = await getPayload({ config })

const posts = await payload.find({
  collection: 'posts',
  limit: 1,
  depth: 0
})

console.log('第一篇文章的结构：')
console.log(JSON.stringify(posts.docs[0], null, 2))
process.exit(0)
