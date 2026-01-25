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
    useAPIKey: true, // 重新启用 API Key 功能，生产环境可能需要此列存在
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'enableAPIKey',
      type: 'checkbox',
      label: 'Enable API Key',
      defaultValue: false,
      admin: {
        description: '启用后将自动生成 API Token 用于程序化访问',
      },
    },
  ],
  timestamps: true,
}
