# 🚨 生产环境 Login API 500 错误修复方案

## 📊 **问题确认**
- **症状**: Admin Panel 访问正常，但登录时出现 "Application error: Digest 2157796927"
- **根本原因**: `/api/users/login` 返回 HTTP 500 错误
- **错误信息**: `{"errors":[{"message":"Something went wrong."}]}`

## 🔍 **可能的原因**

### 1. 数据库 Schema 不同步 (最可能)
- 生产环境数据库可能缺少 `users` 表的某些字段
- 或者字段名映射有问题 (`enableAPIKey` → `enable_a_p_i_key`)

### 2. 环境变量问题
- 数据库连接字符串可能有问题
- 认证配置不匹配

### 3. 版本不一致
- 某些包版本在生产环境与开发环境不同

## 🔧 **修复步骤**

### 立即修复方案 1: 数据库 Schema 同步

如果你有数据库访问权限：

```sql
-- 检查 users 表结构
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users';

-- 如果缺少字段，添加它们
ALTER TABLE users ADD COLUMN IF NOT EXISTS api_key VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS api_key_index VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS enable_a_p_i_key BOOLEAN DEFAULT false;
```

### 立即修复方案 2: 移除问题字段配置

更新 Users 集合配置，确保与本地一致：

```typescript
// src/collections/Users/index.ts
export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 7200,
    verify: false,
    maxLoginAttempts: 5,
    lockTime: 600 * 1000,
    useAPIKey: true, // 保持这个
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    // 不添加任何自定义 API Key 字段
  ],
  // ... 其他配置
}
```

### 立即修复方案 3: 创建数据库迁移

如果是 schema 问题，可以创建一个迁移脚本：

```javascript
// scripts/fix-production-users-schema.js
async function fixUsersSchema() {
  // 连接到生产数据库
  // 检查和修复 users 表结构
  // 确保所有必要的字段存在
}
```

## 📋 **建议的执行顺序**

### 方案 A: 保守修复 (推荐)
1. **确认 Users 配置一致性** - 检查本地和生产的 Users 集合配置
2. **重新部署** - 推送最新的修复代码
3. **验证修复效果** - 测试登录功能

### 方案 B: 数据库直接修复
1. **访问生产数据库** - 检查 users 表结构
2. **添加缺失字段** - 如果确认字段缺失
3. **测试登录功能**

## 🧪 **验证步骤**

修复后使用以下命令验证：

```bash
# 测试登录 API
curl -X POST https://sijigpt.com/api/users/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"test@example.com","password":"test"}'

# 应该返回 400 (字段验证错误) 而不是 500 (服务器错误)
```

## 🚀 **立即行动项**

1. **✅ 已完成**: 诊断确认问题在 Login API
2. **🔄 进行中**: 准备修复代码
3. **⏭️ 下一步**: 部署修复并验证

---

**🎯 目标**: 将 Login API 从 HTTP 500 修复为正常的认证流程，彻底解决 Digest 2157796927 错误**