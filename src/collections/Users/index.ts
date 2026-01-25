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
    // 暂时移除 enableAPIKey 字段，避免数据库 Schema 问题
    // {
    //   name: 'enableAPIKey',
    //   type: 'checkbox',
    //   label: 'Enable API Key',
    //   defaultValue: false,
    // },
  ],
  timestamps: true,
}
