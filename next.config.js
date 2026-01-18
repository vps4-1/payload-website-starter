import { withPayload } from '@payloadcms/next/withPayload'

export default withPayload({
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // 禁用构建时的数据库查询
    serverComponentsExternalPackages: ['payload'],
  },
})
