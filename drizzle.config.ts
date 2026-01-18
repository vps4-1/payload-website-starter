import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

export default {
  dialect: 'postgresql',
  schema: './src/collections/**/*.ts',
  out: './src/migrations',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
} satisfies Config
