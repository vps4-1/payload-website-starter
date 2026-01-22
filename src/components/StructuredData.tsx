interface StructuredDataProps {
  type: 'website' | 'article' | 'blogposting' | 'newsarticle' | 'organization';
  title?: string;
  description?: string;
  url?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
  image?: string;
  articleBody?: string;
}

export function generateStructuredData(props: StructuredDataProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://sijigpt.com';
  
  const baseData = {
    "@context": "https://schema.org",
    "@graph": []
  };

  // 组织信息 - AI资讯聚合站点
  const organizationData = {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    "name": "SijiGPT",
    "alternateName": "斯基GPT",
    "description": "AI驾驶员的全球资讯聚合站 - 专注人工智能、机器学习、深度学习最新资讯",
    "url": siteUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${siteUrl}/logo.png`,
      "width": 512,
      "height": 512
    },
    "sameAs": [
      `${siteUrl}/rss.xml`,
      `${siteUrl}/about`
    ],
    "foundingDate": "2024",
    "keywords": [
      "人工智能", "AI", "机器学习", "深度学习", "GPT", "ChatGPT", 
      "Claude", "Gemini", "大语言模型", "LLM", "自然语言处理", "NLP",
      "计算机视觉", "机器人", "自动化", "AI资讯", "科技新闻"
    ],
    "areaServed": {
      "@type": "Place",
      "name": "全球"
    },
    "knowsAbout": [
      "人工智能技术",
      "机器学习算法", 
      "深度学习框架",
      "AI产品开发",
      "科技趋势分析"
    ]
  };

  // 网站信息
  const websiteData = {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    "url": siteUrl,
    "name": "SijiGPT - 斯基GPT",
    "description": "聚合全球优质AI资讯，提供中英双语深度解读，AI智能筛选，每天4次更新",
    "publisher": {
      "@id": `${siteUrl}/#organization`
    },
    "inLanguage": ["zh-CN", "en-US"],
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": "AI资讯文章",
      "description": "最新AI技术资讯和深度分析文章"
    }
  };

  baseData["@graph"].push(organizationData, websiteData);

  // 根据类型添加特定数据
  if (props.type === 'article' || props.type === 'blogposting' || props.type === 'newsarticle') {
    const articleType = props.type === 'newsarticle' ? 'NewsArticle' : 'BlogPosting';
    
    const articleData = {
      "@type": articleType,
      "@id": `${props.url}#article`,
      "headline": props.title,
      "description": props.description,
      "url": props.url,
      "datePublished": props.publishedTime,
      "dateModified": props.modifiedTime || props.publishedTime,
      "author": {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`
      },
      "publisher": {
        "@id": `${siteUrl}/#organization`
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": props.url
      },
      "inLanguage": ["zh-CN", "en-US"],
      "keywords": props.keywords?.join(", "),
      "about": [
        {
          "@type": "Thing",
          "name": "人工智能",
          "sameAs": "https://zh.wikipedia.org/wiki/人工智能"
        },
        {
          "@type": "Thing", 
          "name": "机器学习",
          "sameAs": "https://zh.wikipedia.org/wiki/机器学习"
        }
      ],
      "mentions": props.keywords?.slice(0, 5).map(keyword => ({
        "@type": "Thing",
        "name": keyword
      })) || []
    };

    if (props.image) {
      articleData["image"] = {
        "@type": "ImageObject",
        "url": props.image,
        "width": 1200,
        "height": 630
      };
    }

    if (props.articleBody) {
      articleData["articleBody"] = props.articleBody.substring(0, 1000) + "...";
      articleData["wordCount"] = props.articleBody.split(' ').length;
    }

    baseData["@graph"].push(articleData);
  }

  return JSON.stringify(baseData, null, 0);
}

// 用于页面中嵌入结构化数据的组件
export function StructuredData(props: StructuredDataProps) {
  const jsonLd = generateStructuredData(props);
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd }}
    />
  );
}

export default StructuredData;