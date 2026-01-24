import type { CollectionConfig } from 'payload'

import { apiKeyOrAuthenticated } from '../access/apiKeyOrAuthenticated'
import { anyone } from '../access/anyone'
import { notifyWorkerHook } from '../hooks/notifyWorkerHook'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', 'original_language'],
  },
  access: {
    read: anyone,
    create: anyone,  // 临时允许所有人创建，便于测试
    update: anyone,  // 临时允许所有人更新，便于测试
    delete: apiKeyOrAuthenticated,  // 删除仍需要认证
  },
  hooks: {
    afterChange: [notifyWorkerHook],
  },
  fields: [
    // ===== 基础信息 =====
    {
      name: 'title',
      label: '标题（中文）',
      type: 'text',
      required: true,
      admin: {
        description: '主标题，始终为中文',
      },
    },
    {
      name: 'title_en',
      label: '标题（英文）',
      type: 'text',
      required: true,
      admin: {
        description: '英文标题，用于英文摘要部分',
      },
    },
    {
      name: 'slug',
      label: 'URL别名',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    
    // ===== 来源信息 =====
    {
      name: 'source',
      label: '来源信息',
      type: 'group',
      fields: [
        {
          name: 'url',
          label: '原文链接',
          type: 'text',
          required: true,
        },
        {
          name: 'name',
          label: '出处名称',
          type: 'text',
          required: true,
          admin: {
            description: '例如：OpenAI Blog, 阿里云官方博客',
          },
        },
        {
          name: 'author',
          label: '作者',
          type: 'text',
        },
      ],
    },
    
    // ===== 语言标识 =====
    {
      name: 'original_language',
      label: '原文语言',
      type: 'select',
      required: true,
      defaultValue: 'en',
      options: [
        { label: '英文', value: 'en' },
        { label: '中文', value: 'zh' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    
    // ===== 中文摘要 =====
    {
      name: 'summary_zh',
      label: '中文摘要',
      type: 'group',
      fields: [
        {
          name: 'content',
          label: '摘要内容',
          type: 'textarea',
          required: true,
          admin: {
            description: '约300字，内容复杂可扩展至400-500字',
            rows: 8,
          },
        },
        {
          name: 'keywords',
          label: '中文关键词',
          type: 'array',
          minRows: 3,
          maxRows: 5,
          required: true,
          fields: [
            {
              name: 'keyword',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    
    // ===== 英文摘要 =====
    {
      name: 'summary_en',
      label: '英文摘要',
      type: 'group',
      fields: [
        {
          name: 'content',
          label: 'Summary Content',
          type: 'textarea',
          required: true,
          admin: {
            description: 'About 300 words, can extend to 400-500 words for complex content',
            rows: 8,
          },
        },
        {
          name: 'keywords',
          label: 'English Keywords',
          type: 'array',
          minRows: 3,
          maxRows: 5,
          required: true,
          fields: [
            {
              name: 'keyword',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    
    // ===== 发布时间 =====
    {
      name: 'publishedAt',
      label: '发布时间',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    
    // ===== SEO 元数据 =====
    {
      name: 'meta',
      label: 'SEO元数据',
      type: 'group',
      fields: [
        {
          name: 'description',
          label: '描述',
          type: 'textarea',
          maxLength: 160,
        },
        {
          name: 'image',
          label: '封面图片',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
}
