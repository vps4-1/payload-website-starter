export const seoConfig = {
  // 基础站点信息
  site: {
    name: "SijiGPT",
    title: "SijiGPT - 斯基GPT",
    description: "AI驾驶员的全球资讯聚合站 - 聚合全球优质AI资讯，提供中英双语深度解读，AI智能筛选，每天4次更新",
    url: process.env.NEXT_PUBLIC_SERVER_URL || 'https://sijigpt.com',
    logo: '/logo.png',
    favicon: '/favicon.ico'
  },

  // AI时代关键词策略
  keywords: {
    primary: [
      "斯基GPT", "AI资讯聚合", "人工智能", "机器学习", "深度学习", "大语言模型", "LLM",
      "ChatGPT", "Claude", "Gemini", "GPT-4", "AI新闻", "科技资讯", "GenSpark AI"
    ],
    secondary: [
      "自然语言处理", "NLP", "计算机视觉", "CV", "机器人技术", "RPA",
      "神经网络", "Transformer", "AI应用", "AI工具", "AI产品", "AI趋势",
      "Cloudflare Workers", "Edge Computing", "多模型AI", "RSS聚合"
    ],
    technical: [
      "PyTorch", "TensorFlow", "Hugging Face", "OpenAI API", "AI训练",
      "模型优化", "AI部署", "MLOps", "AI安全", "AI伦理", "Payload CMS",
      "Kimi", "DeepSeek", "Groq", "Qwen", "OpenRouter"
    ],
    chinese: [
      "斯基GPT", "AI驾驶员", "智能资讯", "AI聚合", "人工智能新闻",
      "机器学习资讯", "深度学习动态", "AI技术前沿", "智能科技", "AI创新",
      "内容聚合平台", "自动化内容", "双语摘要", "智能筛选"
    ]
  },

  // 页面默认配置
  defaults: {
    title: "SijiGPT - 斯基GPT - 你的AI资讯驾驶员",
    description: "斯基GPT是基于AI的自动化内容聚合平台，专注收集全球AI/ML技术资讯。使用Cloudflare Workers和多模型AI提供高质量双语内容，每天4次更新。",
    type: "website",
    locale: "zh_CN",
    alternateLocale: "en_US"
  },

  // Open Graph 配置
  openGraph: {
    type: "website",
    siteName: "SijiGPT - 斯基GPT",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SijiGPT - AI资讯聚合平台"
      }
    ]
  },

  // Twitter 配置
  twitter: {
    card: "summary_large_image",
    site: "@sijigpt",
    creator: "@sijigpt"
  },

  // 结构化数据配置
  structuredData: {
    organization: {
      "@type": "Organization",
      name: "SijiGPT",
      alternateName: "斯基GPT",
      foundingDate: "2024",
      areaServed: "全球",
      knowsAbout: [
        "人工智能技术",
        "机器学习算法",
        "深度学习框架",
        "AI产品开发",
        "科技趋势分析"
      ]
    }
  },

  // RSS 配置
  rss: {
    title: "SijiGPT - AI资讯聚合",
    description: "最新AI技术资讯和深度分析，每天4次更新",
    language: "zh-cn",
    copyright: "© 2024 SijiGPT. All rights reserved.",
    managingEditor: "editor@sijigpt.com (SijiGPT编辑团队)",
    webMaster: "webmaster@sijigpt.com (SijiGPT技术团队)",
    category: "Technology/Artificial Intelligence",
    ttl: 360 // 6小时
  },

  // 搜索引擎优化配置
  searchEngines: {
    // Google 相关
    googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION,
    googleAnalytics: process.env.GOOGLE_ANALYTICS_ID,
    
    // Bing 相关
    bingSiteVerification: process.env.BING_SITE_VERIFICATION,
    
    // 百度相关
    baiduSiteVerification: process.env.BAIDU_SITE_VERIFICATION,
    baiduAnalytics: process.env.BAIDU_ANALYTICS_ID,
    
    // 其他
    yandexVerification: process.env.YANDEX_VERIFICATION
  },

  // 缓存配置
  cache: {
    // 静态页面缓存时间（秒）
    staticPages: 3600, // 1小时
    // 文章页面缓存时间
    articles: 1800, // 30分钟  
    // RSS缓存时间
    rss: 1800, // 30分钟
    // Sitemap缓存时间
    sitemap: 3600, // 1小时
    // API缓存时间
    api: 300 // 5分钟
  },

  // 社交媒体链接
  social: {
    rss: "/rss.xml",
    github: "https://github.com/sijigpt",
    twitter: "https://twitter.com/sijigpt",
    email: "contact@sijigpt.com"
  },

  // AI时代特定的SEO策略
  ai: {
    // 针对AI搜索引擎的优化
    aiSearchEngines: ['GPTBot', 'ChatGPT-User', 'Claude-Web', 'Perplexity-Bot'],
    
    // 内容质量标准
    contentStandards: {
      minWordCount: 100,
      maxWordCount: 5000,
      readabilityScore: 60, // Flesch Reading Ease
      keywordDensity: 0.02 // 2%
    },
    
    // 多语言支持
    languages: ['zh-CN', 'en-US'],
    
    // AI相关的特殊标记
    aiTags: [
      'artificial-intelligence',
      'machine-learning', 
      'deep-learning',
      'natural-language-processing',
      'computer-vision',
      'robotics'
    ]
  }
};

export default seoConfig;