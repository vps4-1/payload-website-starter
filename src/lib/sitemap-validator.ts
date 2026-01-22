import { getCanonicalSiteUrl } from './site-url';

interface SitemapValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  urlCount: number;
  sizeKB: number;
}

/**
 * 验证Sitemap XML格式和内容
 */
export async function validateSitemap(sitemapUrl: string): Promise<SitemapValidationResult> {
  const result: SitemapValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    urlCount: 0,
    sizeKB: 0
  };

  try {
    const response = await fetch(sitemapUrl);
    
    // 检查HTTP状态
    if (!response.ok) {
      result.isValid = false;
      result.errors.push(`HTTP错误: ${response.status} ${response.statusText}`);
      return result;
    }

    // 检查Content-Type
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('xml')) {
      result.warnings.push(`Content-Type应该是application/xml，当前是: ${contentType}`);
    }

    const xmlContent = await response.text();
    result.sizeKB = Math.round(xmlContent.length / 1024 * 100) / 100;

    // 检查文件大小 (Google限制50MB)
    if (result.sizeKB > 50 * 1024) {
      result.errors.push(`Sitemap文件过大: ${result.sizeKB}KB (限制: 50MB)`);
      result.isValid = false;
    }

    // 基础XML格式检查
    if (!xmlContent.includes('<?xml version="1.0"')) {
      result.errors.push('缺少XML声明');
      result.isValid = false;
    }

    if (!xmlContent.includes('<urlset')) {
      result.errors.push('缺少urlset根元素');
      result.isValid = false;
    }

    // 统计URL数量
    const urlMatches = xmlContent.match(/<loc>/g);
    result.urlCount = urlMatches ? urlMatches.length : 0;

    // 检查URL数量限制 (Google限制50,000个URL)
    if (result.urlCount > 50000) {
      result.errors.push(`URL数量过多: ${result.urlCount} (限制: 50,000)`);
      result.isValid = false;
    }

    // 检查域名一致性
    const siteUrl = getCanonicalSiteUrl();
    const siteDomain = new URL(siteUrl).hostname;
    
    if (!xmlContent.includes(siteDomain)) {
      result.errors.push(`Sitemap中没有找到正确的域名: ${siteDomain}`);
      result.isValid = false;
    }

    // 检查开发环境URL泄漏
    const devUrls = [
      'localhost',
      'sandbox',
      'vercel.app',
      '127.0.0.1',
      'ngrok',
      'tunnel'
    ];

    devUrls.forEach(devUrl => {
      if (xmlContent.includes(devUrl) && !siteUrl.includes(devUrl)) {
        result.warnings.push(`发现开发环境URL: ${devUrl}`);
      }
    });

    // 检查必要的XML命名空间
    const requiredNamespaces = [
      'http://www.sitemaps.org/schemas/sitemap/0.9'
    ];

    requiredNamespaces.forEach(ns => {
      if (!xmlContent.includes(ns)) {
        result.warnings.push(`缺少命名空间: ${ns}`);
      }
    });

    // 检查lastmod格式
    const lastmodMatches = xmlContent.match(/<lastmod>(.*?)<\/lastmod>/g);
    if (lastmodMatches) {
      lastmodMatches.forEach((match, index) => {
        const dateStr = match.replace(/<\/?lastmod>/g, '');
        if (isNaN(Date.parse(dateStr))) {
          result.warnings.push(`第${index + 1}个lastmod日期格式无效: ${dateStr}`);
        }
      });
    }

  } catch (error) {
    result.isValid = false;
    result.errors.push(`验证失败: ${error instanceof Error ? error.message : String(error)}`);
  }

  return result;
}

/**
 * 生成Sitemap诊断报告
 */
export function generateSitemapReport(validation: SitemapValidationResult): string {
  const lines: string[] = [];
  
  lines.push('=== Sitemap验证报告 ===');
  lines.push(`状态: ${validation.isValid ? '✅ 通过' : '❌ 失败'}`);
  lines.push(`URL数量: ${validation.urlCount}`);
  lines.push(`文件大小: ${validation.sizeKB}KB`);
  lines.push('');

  if (validation.errors.length > 0) {
    lines.push('🚨 错误:');
    validation.errors.forEach(error => {
      lines.push(`  - ${error}`);
    });
    lines.push('');
  }

  if (validation.warnings.length > 0) {
    lines.push('⚠️ 警告:');
    validation.warnings.forEach(warning => {
      lines.push(`  - ${warning}`);
    });
    lines.push('');
  }

  if (validation.isValid && validation.errors.length === 0) {
    lines.push('🎉 Sitemap格式正确，可以提交给搜索引擎！');
  }

  return lines.join('\n');
}

/**
 * 快速检查Sitemap是否可访问
 */
export async function quickSitemapCheck(baseUrl: string): Promise<boolean> {
  const sitemapUrls = [
    `${baseUrl}/sitemap.xml`,
    `${baseUrl}/sitemap-main.xml`,
    `${baseUrl}/sitemap-posts.xml`,
    `${baseUrl}/sitemap-tags.xml`
  ];

  const results = await Promise.allSettled(
    sitemapUrls.map(async (url) => {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    })
  );

  return results.every(result => 
    result.status === 'fulfilled' && result.value === true
  );
}