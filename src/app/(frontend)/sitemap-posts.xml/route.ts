import { NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/utilities/getURL';

// 获取所有文章的函数
async function getAllPosts() {
  const baseUrl = getApiBaseUrl();
  const batchSize = 100; // 每批获取100篇文章
  let allPosts: any[] = [];
  let page = 1;
  let hasMore = true;

  try {
    while (hasMore) {
      const response = await fetch(
        `${baseUrl}/api/posts?limit=${batchSize}&page=${page}&sort=-createdAt`,
        {
          next: { revalidate: 3600 }, // 1小时缓存
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.error(`Failed to fetch posts page ${page}:`, response.status);
        break;
      }

      const data = await response.json();
      
      if (data.docs && Array.isArray(data.docs)) {
        allPosts = [...allPosts, ...data.docs];
        hasMore = data.hasNextPage || false;
        page++;
        
        // 安全限制：最多获取10000篇文章
        if (allPosts.length >= 10000) {
          break;
        }
      } else {
        break;
      }
    }

    return allPosts;
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error);
    return [];
  }
}

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://sijigpt.com';
  
  try {
    const posts = await getAllPosts();
    
    if (!posts || posts.length === 0) {
      // 如果没有文章，返回空的sitemap
      const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
  <!-- No posts available -->
</urlset>`;
      
      return new NextResponse(emptySitemap, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=1800, s-maxage=1800',
          'X-Robots-Tag': 'noindex'
        },
      });
    }

    // 生成文章sitemap
    const postUrls = posts.map(post => {
      const lastModified = post.updatedAt || post.createdAt || new Date().toISOString();
      const isRecent = new Date(lastModified) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7天内
      
      // 提取关键词
      const keywords = [];
      if (post.summary_zh?.keywords && Array.isArray(post.summary_zh.keywords)) {
        keywords.push(...post.summary_zh.keywords.map((k: any) => k.keyword));
      }
      if (post.summary_en?.keywords && Array.isArray(post.summary_en.keywords)) {
        keywords.push(...post.summary_en.keywords.map((k: any) => k.keyword));
      }
      
      return `  <url>
    <loc>${siteUrl}/posts/${post.slug}</loc>
    <lastmod>${new Date(lastModified).toISOString()}</lastmod>
    <changefreq>${isRecent ? 'weekly' : 'monthly'}</changefreq>
    <priority>${isRecent ? '0.8' : '0.6'}</priority>
    <mobile:mobile/>
    ${isRecent ? `<news:news>
      <news:publication>
        <news:name>SijiGPT</news:name>
        <news:language>zh-CN</news:language>
      </news:publication>
      <news:publication_date>${new Date(lastModified).toISOString()}</news:publication_date>
      <news:title>${post.title || post.title_en || 'AI资讯'}</news:title>
      ${keywords.length > 0 ? `<news:keywords>${keywords.slice(0, 10).join(', ')}</news:keywords>` : ''}
    </news:news>` : ''}
  </url>`;
    }).join('\n');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${postUrls}
</urlset>`;

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=1800, s-maxage=1800', // 30分钟缓存
        'X-Robots-Tag': 'noindex'
      },
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    
    // 错误情况下返回基本sitemap
    const errorSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Error occurred generating sitemap -->
</urlset>`;
    
    return new NextResponse(errorSitemap, {
      status: 500,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  }
}