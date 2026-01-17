import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { TerminalLayout } from '@/components/TerminalLayout'

// 示例文章数据
const mockPosts = [
  {
    id: '1',
    slug: 'zenken-chatgpt-enterprise',
    title: 'Zenken通过ChatGPT Enterprise增强精简销售团队',
    title_en: 'Zenken Enhances Lean Sales Team with ChatGPT Enterprise',
    publishedAt: '2026-01-15',
    source: {
      url: 'https://openai.com/index/zenken-chatgpt-enterprise/',
      name: 'OpenAI Blog',
      author: 'OpenAI Team'
    },
    original_language: 'en' as const,
    summary_zh: {
      content: '日本数字营销公司 Zenken 面临着一个独特的挑战：如何在维持精简团队的同时扩大销售运营。该公司采用了 ChatGPT Enterprise 来革新其销售流程，特别是在潜在客户资格认定和客户关系管理方面。通过将 AI 集成到日常工作流程中，Zenken 的销售代表能够自动化重复性任务，专注于高价值的客户互动，并更快地做出数据驱动的决策。这一实施不仅提高了运营效率，还使团队能够处理更大的客户负载而无需按比例增加人员配置。该案例展示了企业级 AI 工具如何赋能小型团队取得通常需要更大资源的成果，为各行业的可扩展增长提供了蓝图。',
      keywords: ['ChatGPT Enterprise', '销售自动化', 'AI商业应用', '客户关系管理', '数字化转型']
    },
    summary_en: {
      content: 'Zenken, a Japanese digital marketing firm, faced a unique challenge: how to scale sales operations while maintaining a lean team. The company adopted ChatGPT Enterprise to revolutionize its sales processes, particularly in lead qualification and customer relationship management. By integrating AI into daily workflows, Zenken\'s sales representatives were able to automate repetitive tasks, focus on high-value customer interactions, and make data-driven decisions faster. This implementation not only improved operational efficiency but also enabled the team to handle a larger customer load without proportionally increasing headcount. The case demonstrates how enterprise-grade AI tools can empower small teams to achieve results that typically require much larger resources, providing a blueprint for scalable growth across industries.',
      keywords: ['sales automation', 'AI business applications', 'customer relationship management', 'digital transformation', 'enterprise AI']
    },
    tags: ['ChatGPT', '企业应用', '销售', 'AI工具', '数字化转型']
  },
  {
    id: '2',
    slug: 'alibaba-tongyi-qianwen-3',
    title: '阿里云发布通义千问3.0大模型',
    title_en: 'Alibaba Cloud Releases Tongyi Qianwen 3.0 Large Model',
    publishedAt: '2026-01-14',
    source: {
      url: 'https://www.alibabacloud.com/blog/tongyi-qianwen-3-launch',
      name: '阿里云官方博客',
      author: '阿里云团队'
    },
    original_language: 'zh' as const,
    summary_zh: {
      content: '阿里云正式发布通义千问 3.0 大语言模型，这是中国企业在大模型领域的又一重要突破。相比前代版本，通义千问 3.0 在中文理解、逻辑推理和代码生成能力上都有显著提升。模型支持超长上下文窗口（最高 32K tokens），能够处理更复杂的企业级应用场景。阿里云还宣布将通义千问 3.0 开放给企业用户，提供 API 接口和私有化部署方案。新版本特别优化了金融、电商、客服等垂直领域的表现，并通过强化学习提升了模型的安全性和可控性。这一发布标志着国产大模型在商业化应用上迈出了坚实的一步，为企业 AI 转型提供了更多本土化的选择。',
      keywords: ['通义千问', '大语言模型', '阿里云AI', '企业级应用', '中文NLP']
    },
    summary_en: {
      content: 'Alibaba Cloud officially released Tongyi Qianwen 3.0, a large language model representing another significant breakthrough for Chinese enterprises in the LLM field. Compared to previous versions, Tongyi Qianwen 3.0 demonstrates substantial improvements in Chinese comprehension, logical reasoning, and code generation capabilities. The model supports extended context windows (up to 32K tokens), enabling it to handle more complex enterprise-level application scenarios. Alibaba Cloud has announced that Tongyi Qianwen 3.0 will be made available to enterprise users through API interfaces and private deployment options. The new version has been specifically optimized for vertical sectors such as finance, e-commerce, and customer service, with enhanced safety and controllability through reinforcement learning. This release marks a solid step forward in the commercialization of domestic large models, providing enterprises with more localized options for AI transformation.',
      keywords: ['Tongyi Qianwen', 'large language model', 'Alibaba Cloud AI', 'enterprise applications', 'Chinese NLP']
    },
    tags: ['通义千问', '阿里云', '大模型', '企业AI', '中文NLP']
  }
]

export async function generateStaticParams() {
  return mockPosts.map((post) => ({
    slug: post.slug,
  }))
}

// ✅ 修复：使用 Promise 包装 params
type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // ✅ 修复：await params
  const { slug } = await params
  const post = mockPosts.find(p => p.slug === slug)
  
  if (!post) {
    return {
      title: '文章未找到',
    }
  }

  return {
    title: `${post.title} - SiJiGPT`,
    description: post.summary_zh.content.slice(0, 160),
  }
}

export default async function PostPage({ params }: Props) {
  // ✅ 修复：await params
  const { slug } = await params
  const post = mockPosts.find(p => p.slug === slug)

  if (!post) {
    notFound()
  }

  return (
    <TerminalLayout title="SiJiGPT">
      <article className="bilingual-post">
        {/* 主标题 */}
        <header className="post-header">
          <h1>{post.title}</h1>
        </header>

        {/* 元数据 */}
        <div className="post-meta">
          <div className="post-source">
            <strong>来源：</strong>
            <a href={post.source.url} target="_blank" rel="noopener noreferrer">
              [{post.source.name}] {post.original_language === 'en' ? post.title_en : post.title}
            </Link>
          </div>
          <div className="post-date">
            <strong>发布时间：</strong>
            {new Date(post.publishedAt).toLocaleDateString('zh-CN')}
          </div>
          {post.source.author && (
            <div className="post-author">
              <strong>作者：</strong>
              {post.source.author}
            </div>
          )}
        </div>

        {/* 中文摘要 */}
        <section className="summary-section chinese-summary">
          <h2>━━━ 中文摘要 ━━━</h2>
          <div className="summary-content">
            <p>{post.summary_zh.content}</p>
          </div>
          <div className="summary-keywords">
            <strong>关键词：</strong>
            {post.summary_zh.keywords.map((keyword, index) => (
              <a 
                key={index}
                href={`/search?q=${encodeURIComponent(keyword)}`}
                className="keyword-link"
              >
                {keyword}
              </Link>
            ))}
          </div>
        </section>

        {/* 英文摘要 */}
        <section className="summary-section english-summary">
          <h2>━━━ English Summary ━━━</h2>
          <div className="english-title">
            <strong>标题：</strong>
            {post.title_en}
          </div>
          <div className="summary-content">
            <p>{post.summary_en.content}</p>
          </div>
          <div className="summary-keywords">
            <strong>Keywords: </strong>
            {post.summary_en.keywords.map((keyword, index) => (
              <a 
                key={index}
                href={`/search?q=${encodeURIComponent(keyword)}`}
                className="keyword-link"
              >
                {keyword}
              </Link>
            ))}
          </div>
        </section>

        {/* 文章标签 */}
        <section className="post-tags-section">
          <h3>━━━ 文章标签 ━━━</h3>
          <div className="post-tags">
            {post.tags.map((tag, index) => (
              <a 
                key={index}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="keyword-link"
              >
                {tag}
              </Link>
            ))}
          </div>
        </section>

        {/* 返回按钮 */}
        <div className="post-actions">
          <Link href="/posts" className="terminal-button">
            ← 返回文章列表
          </Link>
        </div>
      </article>
    </TerminalLayout>
  )
}
