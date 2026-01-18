import { withPayload } from '@payloadcms/next/withPayload'

export default withPayload({
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
})
