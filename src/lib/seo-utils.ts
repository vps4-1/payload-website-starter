import { Metadata } from 'next';
import { seoConfig } from './seo-config';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noIndex?: boolean;
}

/**
 * 生成Next.js Metadata对象，优化AI时代SEO
 */
export function generateMetadata(props: SEOProps = {}): Metadata {
  const {
    title = seoConfig.defaults.title,
    description = seoConfig.defaults.description,
    keywords = [],
    image = `${seoConfig.site.url}/og-image.png`,
    url = seoConfig.site.url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    noIndex = false
  } = props;

  // 合并关键词
  const allKeywords = [
    ...seoConfig.keywords.primary,
    ...seoConfig.keywords.chinese,
    ...keywords
  ].slice(0, 20); // 限制关键词数量

  const metadata: Metadata = {
    // 基础元数据
    title,
    description,
    keywords: allKeywords.join(', '),

    // 站点配置
    metadataBase: new URL(seoConfig.site.url),
    
    // 语言和地区
    alternates: {
      canonical: url,
      languages: {
        'zh-CN': url,
        'en-US': url.replace('/zh/', '/en/'),
        'x-default': url
      }
    },

    // 作者信息
    authors: author ? [{ name: author }] : [{ name: 'SijiGPT编辑团队' }],
    
    // 发布信息
    publisher: seoConfig.site.name,
    creator: seoConfig.site.name,

    // 机器人指令
    robots: noIndex ? {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    } : {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Open Graph
    openGraph: {
      title,
      description,
      url,
      siteName: seoConfig.site.title,
      type: type as 'website' | 'article',
      locale: seoConfig.defaults.locale,
      alternateLocale: [seoConfig.defaults.alternateLocale],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === 'article' && publishedTime && {
        publishedTime,
        modifiedTime: modifiedTime || publishedTime,
        authors: [author || 'SijiGPT编辑团队'],
        section: 'Technology',
        tags: keywords,
      }),
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      site: seoConfig.twitter.site,
      creator: seoConfig.twitter.creator,
    },

    // 其他元数据
    other: {
      // Google 相关
      ...(seoConfig.searchEngines.googleSiteVerification && {
        'google-site-verification': seoConfig.searchEngines.googleSiteVerification,
      }),
      
      // Bing 相关  
      ...(seoConfig.searchEngines.bingSiteVerification && {
        'msvalidate.01': seoConfig.searchEngines.bingSiteVerification,
      }),

      // 百度相关
      ...(seoConfig.searchEngines.baiduSiteVerification && {
        'baidu-site-verification': seoConfig.searchEngines.baiduSiteVerification,
      }),

      // AI搜索引擎优化
      'ai-content-type': type === 'article' ? 'news-article' : 'homepage',
      'content-language': 'zh-CN,en-US',
      'content-category': 'artificial-intelligence,technology,news',
      
      // 移动端优化
      'format-detection': 'telephone=no',
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',

      // 性能提示
      'dns-prefetch': seoConfig.site.url,
      'preconnect': seoConfig.site.url,
    },
  };

  return metadata;
}

/**
 * 生成文章页面专用的SEO元数据
 */
export function generateArticleMetadata(article: {
  title_chinese?: string;
  title?: string;
  summary_chinese?: string;
  summary?: string;
  keywords?: string[];
  slug: string;
  createdAt: string;
  updatedAt?: string;
}): Metadata {
  const title = article.title_chinese || article.title || '最新AI资讯';
  const description = article.summary_chinese || article.summary || '最新人工智能技术资讯和深度分析';
  const url = `${seoConfig.site.url}/posts/${article.slug}`;
  
  return generateMetadata({
    title: `${title} - ${seoConfig.site.name}`,
    description,
    keywords: article.keywords || [],
    url,
    type: 'article',
    publishedTime: article.createdAt,
    modifiedTime: article.updatedAt || article.createdAt,
  });
}

/**
 * 生成页面专用的SEO元数据
 */
export function generatePageMetadata(page: {
  title: string;
  description: string;
  slug: string;
  keywords?: string[];
}): Metadata {
  const url = `${seoConfig.site.url}/${page.slug}`;
  
  return generateMetadata({
    title: `${page.title} - ${seoConfig.site.name}`,
    description: page.description,
    keywords: page.keywords || [],
    url,
    type: 'website',
  });
}

/**
 * 生成结构化数据的辅助函数
 */
export function generateArticleStructuredData(article: any) {
  const siteUrl = seoConfig.site.url;
  
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title_chinese || article.title,
    "description": article.summary_chinese || article.summary,
    "url": `${siteUrl}/posts/${article.slug}`,
    "datePublished": article.createdAt,
    "dateModified": article.updatedAt || article.createdAt,
    "author": {
      "@type": "Organization",
      "name": "SijiGPT编辑团队",
      "url": siteUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": seoConfig.site.name,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/posts/${article.slug}`
    },
    "keywords": article.keywords?.join(', '),
    "inLanguage": "zh-CN",
    "about": {
      "@type": "Thing",
      "name": "人工智能",
      "sameAs": "https://zh.wikipedia.org/wiki/人工智能"
    }
  };
}

/**
 * URL优化函数
 */
export function optimizeUrl(path: string): string {
  return `${seoConfig.site.url}${path.startsWith('/') ? '' : '/'}${path}`;
}

/**
 * 关键词密度检查
 */
export function checkKeywordDensity(content: string, keyword: string): number {
  const words = content.toLowerCase().split(/\s+/);
  const keywordCount = words.filter(word => word.includes(keyword.toLowerCase())).length;
  return keywordCount / words.length;
}

/**
 * 生成面包屑导航结构化数据
 */
export function generateBreadcrumbStructuredData(breadcrumbs: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
}

export {seoConfig};