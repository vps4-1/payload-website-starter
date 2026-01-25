# 🔑 Payload CMS API Token 配置指南

## 📋 问题分析

Worker → Payload 文章创建遇到 500 内部服务器错误的原因：
1. **API Token 功能未启用**: Users 集合缺少 `useAPIKey: true` 配置
2. **认证方式不匹配**: Worker 使用 API Key 认证，但 Payload 未正确配置

## ✅ 已修复的配置

我们已经更新了 `src/collections/Users/index.ts`，启用了 API Token 功能：

```javascript
auth: {
  tokenExpiration: 7200, // 2 hours
  verify: false,
  maxLoginAttempts: 5,
  lockTime: 600 * 1000, // 10 minutes
  useAPIKey: true, // 🎯 启用 API Key 功能
}
```

## 🎯 创建 API Token 步骤

### 1. 登录 Payload 后台
```
访问: http://localhost:3003/admin
或生产环境: https://payload-website-starter-git-main-billboings-projects.vercel.app/admin
```

### 2. 进入用户管理
1. 点击左侧导航的 **"Users"**
2. 找到你的用户账户
3. 点击编辑用户

### 3. 查找 API Key 部分
重启服务器后，在用户编辑页面应该会看到：
- **"API Key"** 字段
- **"Enable API Key"** 开关或按钮
- **"Generate API Key"** 按钮

### 4. 生成 API Token
1. 启用 API Key 功能
2. 点击 **"Generate API Key"** 
3. 复制生成的 API Token
4. 保存用户配置

## 🔧 Worker 环境变量配置

获得 API Token 后，在 Cloudflare Worker 中配置：

```bash
# 在 Cloudflare Dashboard 或通过 wrangler CLI 设置
wrangler secret put PAYLOAD_API_KEY
# 输入刚才生成的 API Token
```

## 🧪 测试 API Token

### 方法1: 直接测试 Payload API
```bash
curl -X POST "https://payload-website-starter-git-main-billboings-projects.vercel.app/api/posts" \
  -H "Authorization: Bearer YOUR_NEW_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "API Token测试",
    "source": {"url": "https://test.com", "name": "Test"},
    "summary_zh": {"content": "测试", "keywords": [{"keyword": "测试"}]},
    "original_language": "zh"
  }'
```

### 方法2: 测试 Worker → Payload 流程
```bash
# 触发 Worker 的测试端点，让它尝试发布文章
curl -X POST "https://siji-worker-v2.chengqiangshang.workers.dev/test"
```

## 🚨 故障排除

### 问题1: 看不到 API Key 选项
**解决方案**:
1. 确认服务器已重启 ✅
2. 清除浏览器缓存
3. 检查用户权限是否为管理员
4. 尝试创建新的管理员用户

### 问题2: API Token 生成失败
**可能原因**:
- 数据库权限问题
- Payload 配置冲突

**解决方案**:
```bash
# 重新构建并启动
cd /home/user/webapp
npm run build
npm run dev
```

### 问题3: 仍然无法创建文章
**检查步骤**:
1. 验证 API Token 格式正确
2. 检查 Posts 集合权限配置
3. 查看 Worker 和 Payload 日志

## 🔄 权限配置验证

确认 Posts 集合允许 API Key 访问：

```javascript
// src/collections/Posts.ts 中应该有：
access: {
  create: anyone, // 或 apiKeyOrAuthenticated
  read: anyone,
  update: anyone,
  delete: apiKeyOrAuthenticated,
}
```

## 📊 预期结果

配置成功后：
1. ✅ Payload 后台可以看到和生成 API Key
2. ✅ Worker 可以使用 API Key 创建文章
3. ✅ 返回 HTTP 201 而不是 500 错误
4. ✅ 文章正常显示在前端

## 🎯 测试完整流程

一旦 API Token 配置成功：

1. **Worker RSS 聚合** → 分析 AI 相关文章
2. **Worker → Payload** → 使用 API Token 发布文章  
3. **Payload Hook** → 通知 Worker webhook
4. **Worker 通知** → 发送 Telegram 消息
5. **前端展示** → 文章出现在网站上

完整的自动化 AI 资讯平台就运行起来了！🚀