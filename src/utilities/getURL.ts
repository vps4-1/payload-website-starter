import canUseDOM from './canUseDOM'

export const getServerSideURL = () => {
  return (
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000')
  )
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  return process.env.NEXT_PUBLIC_SERVER_URL || ''
}

// 获取 API 基础 URL（针对服务器端和客户端）
export const getApiBaseUrl = () => {
  // 在服务器端运行时
  if (typeof window === 'undefined') {
    // 尝试使用环境变量，如果没有设置或为 undefined，使用本地地址
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
    if (!serverUrl || serverUrl === 'undefined') {
      return 'http://localhost:3003'  // 更新端口
    }
    return serverUrl
  }
  
  // 在客户端运行时，使用相对路径
  return ''
}
