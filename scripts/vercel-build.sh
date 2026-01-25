#!/usr/bin/env bash

set -e  # 遇到错误立即退出

echo "🚀 开始 Vercel 生产环境构建..."

echo "📊 环境信息:"
echo "Node.js: $(node --version)"
echo "pnpm: $(pnpm --version)"
echo "Working Directory: $(pwd)"

echo "🔧 设置环境变量..."
export NODE_OPTIONS="--no-deprecation"

echo "📦 运行 Payload 数据库迁移..."
# 使用非交互模式运行迁移
payload migrate --forceAcceptWarning || {
    echo "⚠️  迁移可能有警告，继续构建..."
}

echo "🏗️  构建 Next.js 应用..."
pnpm build

echo "✅ 构建完成！"