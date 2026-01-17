import React from 'react'
import Link from 'next/link'
import { TerminalLayout } from '@/components/TerminalLayout'
import { notFound } from 'next/navigation'

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

// 模拟双语文章数据
const bilingualPosts: Record<string, any> = {
  'zenken-chatgpt-enterprise': {
    title: 'Zenken通过ChatGPT Enterprise增强精简销售团队',
    title_en: 'Zenken boosts a lean sales team with ChatGPT Enterprise',
    source: {
      url: 'https://openai.com/index/zenken',
      name: 'OpenAI Blog',
      author: 'OpenAI Team',
    },
    original_language: 'en',
    publishedAt: '2026-01-14',
    summary_zh: {
      content: `日本企业Zenken成功部署ChatGPT Enterprise版本，显著提升了其精简销售团队的工作效率和业务成果。该公司通过AI驱动的工作流程实现了三大突破：首先，销售准备时间大幅缩短，团队成员能够更快速地响应客户需求；其次，商业提案的成功率明显提升，AI辅助使提案更加精准和个性化；第三，实现了更高质量的客户互动，通过智能分析客户需求提供定制化解决方案。

这个案例充分展示了企业级AI工具在实际商业场景中的应用价值，特别是在销售和客户关系管理领域。即使是小型团队，通过合理利用AI技术，也能实现运营效率的显著提升和业务成果的突破。Zenken的成功经验表明，AI技术正在成为企业数字化转型的关键驱动力，帮助企业在激烈的市场竞争中保持优势。`,
      keywords: [
        'ChatGPT Enterprise',
        '销售自动化',
        'AI商业应用',
        '客户关系管理',
        '数字化转型'
      ]
    },
    summary_en: {
      content: `Japanese company Zenken has successfully deployed ChatGPT Enterprise, significantly enhancing the efficiency and business outcomes of its lean sales team. Through AI-driven workflows, the company achieved three major breakthroughs: First, sales preparation time was dramatically reduced, enabling team members to respond to customer needs more quickly; Second, the success rate of business proposals notably improved, with AI assistance making proposals more precise and personalized; Third, higher-quality customer interactions were achieved through intelligent analysis of customer needs and customized solutions.

This case fully demonstrates the practical value of enterprise-level AI tools in real business scenarios, particularly in sales and customer relationship management. Even small teams can achieve significant improvements in operational efficiency and business outcomes through proper utilization of AI technology. Zenken's success shows that AI technology is becoming a key driver of enterprise digital transformation, helping businesses maintain competitive advantages in fierce market competition.`,
      keywords: [
        'ChatGPT Enterprise',
        'sales automation',
        'AI business applications',
        'customer relationship management',
        'digital transformation'
      ]
    }
  },
  'alibaba-tongyi-qianwen-3': {
    title: '阿里云发布通义千问3.0大模型',
    title_en: 'Alibaba Cloud Releases Tongyi Qianwen 3.0 Large Language Model',
    source: {
      url: 'https://example.com/alibaba-qianwen-3',
      name: '阿里云官方博客',
      author: '阿里云团队',
    },
    original_language: 'zh',
    publishedAt: '2026-01-14',
    summary_zh: {
      content: `阿里云正式发布通义千问3.0大语言模型，标志着中国AI技术取得重大突破。新版本在多项核心指标上实现显著提升，包括推理能力、代码生成、多语言理解等方面。通义千问3.0采用了全新的训练架构和数据处理技术，参数规模达到千亿级别，在中文理解和生成任务上表现尤为出色。

该模型特别针对企业应用场景进行了优化，支持私有化部署和定制化训练，能够满足不同行业的专业需求。在金融、医疗、教育等领域的实际测试中，通义千问3.0展现出了强大的领域适应能力和任务完成质量。阿里云还宣布将开放API接口，让更多开发者和企业能够使用这一先进的AI技术，推动产业智能化升级。`,
      keywords: [
        '通义千问',
        '大语言模型',
        '阿里云AI',
        '企业级应用',
        '中文NLP'
      ]
    },
    summary_en: {
      content: `Alibaba Cloud officially released Tongyi Qianwen 3.0, marking a major breakthrough in Chinese AI technology. The new version achieves significant improvements in multiple core metrics, including reasoning capabilities, code generation, and multilingual understanding. Tongyi Qianwen 3.0 adopts a new training architecture and data processing technology, with parameters reaching hundreds of billions, and performs exceptionally well in Chinese understanding and generation tasks.

The model has been specifically optimized for enterprise application scenarios, supporting private deployment and customized training to meet the professional needs of different industries. In practical tests across finance, healthcare, and education sectors, Tongyi Qianwen 3.0 demonstrated strong domain adaptation capabilities and task completion quality. Alibaba Cloud also announced the opening of API interfaces, enabling more developers and enterprises to leverage this advanced AI technology and drive industrial intelligence upgrades.`,
      keywords: [
        'Tongyi Qianwen',
        'large language model',
        'Alibaba Cloud AI',
        'enterprise applications',
        'Chinese NLP'
      ]
    }
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = bilingualPosts[slug]

  if (!post) {
    notFound()
  }

  return (
    <TerminalLayout title="我的终端博客">
      <article className="bilingual-post">
        {/* 文章标题 */}
        <h1 className="post-title">
          {post.title}
        </h1>

        {/* 来源信息 */}
        <div className="post-source">
          <strong>来源：</strong>
          <a href={post.source.url} target="_blank" rel="noopener noreferrer">
            {post.source.name}
          </a>
          {' - '}
          <a href={post.source.url} target="_blank" rel="noopener noreferrer">
            {post.original_language === 'en' ? post.title_en : post.title}
          </a>
        </div>

        {/* 发布时间 */}
        <div className="post-meta">
          发布时间：{new Date(post.publishedAt).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>

        <hr style={{ margin: '2rem 0' }} />

        {/* 中文摘要 */}
        <section className="summary-section">
          <h2>📝 中文摘要</h2>
          <div className="summary-content">
            {post.summary_zh.content.split('\n\n').map((paragraph: string, idx: number) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
          <div className="keywords">
            <strong>关键词：</strong>
            {post.summary_zh.keywords.map((keyword: string, idx: number) => (
              <React.Fragment key={keyword}>
                <Link href={`/search?q=${encodeURIComponent(keyword)}`} className="keyword-link">
                  {keyword}
                </Link>
                {idx < post.summary_zh.keywords.length - 1 && ', '}
              </React.Fragment>
            ))}
          </div>
        </section>

        <hr style={{ margin: '2rem 0' }} />

        {/* 英文摘要 */}
        <section className="summary-section">
          <h2>📝 English Summary</h2>
          <h3 className="english-title">{post.title_en}</h3>
          <div className="summary-content">
            {post.summary_en.content.split('\n\n').map((paragraph: string, idx: number) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
          <div className="keywords">
            <strong>Keywords:</strong>
            {' '}
            {post.summary_en.keywords.map((keyword: string, idx: number) => (
              <React.Fragment key={keyword}>
                <Link href={`/search?q=${encodeURIComponent(keyword)}`} className="keyword-link">
                  {keyword}
                </Link>
                {idx < post.summary_en.keywords.length - 1 && ', '}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* 返回按钮 */}
        <div style={{ marginTop: '3rem' }}>
          <Link className="button" href="/posts">
            ← 返回列表
          </Link>
        </div>
      </article>
    </TerminalLayout>
  )
}

export async function generateStaticParams() {
  return Object.keys(bilingualPosts).map((slug) => ({ slug }))
}
