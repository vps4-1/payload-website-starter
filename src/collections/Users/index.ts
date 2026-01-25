import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: {
    tokenExpiration: 7200, // 2 hours, in seconds
    verify: false,
    maxLoginAttempts: 5,
    lockTime: 600 * 1000, // lock for 10 minutes
    useAPIKey: true, // 启用 API Key 功能
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
  timestamps: true,
}
