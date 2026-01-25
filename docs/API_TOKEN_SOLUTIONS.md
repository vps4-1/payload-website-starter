# 🔑 解决 API Token 问题的三种方案

## 📋 问题诊断结果确认

你的诊断完全正确：
- ✅ 登录正常 (200 OK, Token 259字符)
- ✅ 端点存在 (/api/posts, 50篇现有文章) 
- ❌ 后台无法创建API Token (配置问题)
- ❌ 字段验证通过但仍500错误 (CMS内部问题)

## 🎯 方案一：使用 JWT Token 认证（推荐）

### 步骤1: 获取有效的 JWT Token

```bash
# 登录获取 JWT Token
curl -X POST "http://localhost:3004/api/users/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "你的管理员邮箱",
    "password": "你的管理员密码"
  }'
```

### 步骤2: 使用 JWT Token 测试文章创建

```bash
# 使用返回的 token 测试创建文章
curl -X POST "http://localhost:3004/api/posts" \
  -H "Authorization: JWT your-jwt-token-here" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "JWT Token测试文章",
    "title_en": "JWT Token Test Article",
    "slug": "jwt-test-article-2026",
    "source": {"url": "https://test.com", "name": "Test"},
    "summary_zh": {"content": "使用JWT Token认证测试", "keywords": [{"keyword": "JWT"}, {"keyword": "测试"}, {"keyword": "认证"}]},
    "summary_en": {"content": "Testing with JWT Token authentication", "keywords": [{"keyword": "JWT"}, {"keyword": "test"}, {"keyword": "auth"}]},
    "original_language": "zh",
    "publishedAt": "2026-01-25T02:00:00.000Z"
  }'
```

### 步骤3: 配置 Worker 使用 JWT Token

```javascript
// 在 Worker 的 publishToPayload 函数中
async function publishToPayload(env, article, logs) {
  // 首先登录获取 JWT Token
  let token = env.PAYLOAD_JWT_TOKEN; // 可以预先配置
  
  if (!token) {
    // 动态登录获取 token
    const loginResponse = await fetch('https://payload-website-starter-git-main-billboings-projects.vercel.app/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: env.PAYLOAD_EMAIL,     // 配置管理员邮箱
        password: env.PAYLOAD_PASSWORD // 配置管理员密码
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      token = loginData.token;
    }
  }
  
  // 使用 JWT token 发布文章
  const response = await fetch('https://payload-website-starter-git-main-billboings-projects.vercel.app/api/posts', {
    method: 'POST',
    headers: {
      'Authorization': `JWT ${token}`, // 使用 JWT 格式
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payloadData)
  });
  
  // 处理响应...
}
```

## 🎯 方案二：修复 API Token 功能

### 已修复的配置

我已经更新了 `src/collections/Users/index.ts`：

```javascript
auth: {
  useAPIKey: true, // 启用 API Key
},
fields: [
  {
    name: 'enableAPIKey',
    type: 'checkbox',
    label: 'Enable API Key',
    defaultValue: false,
  },
]
```

### 手动创建 API Writer 用户

1. **访问后台**: `http://localhost:3004/admin`
2. **进入 Users**: 点击左侧 "Users"
3. **创建用户**: 
   - Name: `API Writer`
   - Email: `api-writer@sijigpt.com`
   - Password: `SijiGPT-API-Writer-2026-Secure!`
   - ✅ **Enable API Key**: 勾选此选项
4. **保存用户**: 检查是否生成了 API Key
5. **复制 API Key**: 配置到 Worker

## 🎯 方案三：临时绕过认证（仅开发环境）

### 更新 Posts 集合权限

```javascript
// src/collections/Posts.ts
access: {
  create: () => true, // 临时允许所有创建请求
  read: () => true,
  update: () => true,
  delete: authenticated,
}
```

这样 Worker 就可以不需要任何认证直接创建文章。

## 🧪 测试命令

### 测试当前服务器状态
```bash
# 1. 检查健康状态
curl -I "http://localhost:3004/api/posts"

# 2. 测试登录
curl -X POST "http://localhost:3004/api/users/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "你的邮箱", "password": "你的密码"}'

# 3. 使用 JWT Token 测试创建文章  
curl -X POST "http://localhost:3004/api/posts" \
  -H "Authorization: JWT 你的JWT_Token" \
  -H "Content-Type: application/json" \
  -d '完整的文章数据'
```

## 📊 推荐执行顺序

1. **立即执行**: 方案一（JWT Token）- 最稳定可靠
2. **并行尝试**: 方案二（修复 API Token）- 长期解决方案
3. **备用方案**: 方案三（临时绕过）- 仅用于测试

## 🎯 Worker 环境变量配置

无论使用哪种方案，都需要在 Worker 中配置：

```bash
# 方案一：JWT Token 方式
wrangler secret put PAYLOAD_EMAIL      # 管理员邮箱
wrangler secret put PAYLOAD_PASSWORD   # 管理员密码

# 方案二：API Key 方式  
wrangler secret put PAYLOAD_API_KEY    # 生成的 API Key

# 方案三：无认证方式
# 不需要额外配置
```

选择最适合你的方案，我们可以立即测试和部署！