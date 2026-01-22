// 环境感知的URL配置
export function getSiteUrl(): string {
  // 1. 优先使用环境变量
  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    return process.env.NEXT_PUBLIC_SERVER_URL;
  }
  
  // 2. 生产环境检测
  if (process.env.NODE_ENV === 'production') {
    // Vercel生产环境
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }
    
    // 默认生产域名
    return 'https://sijigpt.com';
  }
  
  // 3. 开发环境
  if (typeof window !== 'undefined') {
    // 客户端：使用当前域名
    return `${window.location.protocol}//${window.location.host}`;
  }
  
  // 4. 开发环境服务端
  return process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
}

// 验证URL是否为生产环境
export function isProductionUrl(url: string): boolean {
  return url.includes('sijigpt.com') || url.includes('vercel.app');
}

// 获取规范化的站点URL
export function getCanonicalSiteUrl(): string {
  const url = getSiteUrl();
  
  // 确保生产环境使用正确的域名
  if (process.env.NODE_ENV === 'production' && !isProductionUrl(url)) {
    console.warn(`Warning: Using development URL in production: ${url}`);
    return 'https://sijigpt.com'; // 强制使用生产域名
  }
  
  return url;
}