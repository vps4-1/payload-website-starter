const { withPayload } = require('@payloadcms/next/withPayload')

module.exports = withPayload({
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
})
