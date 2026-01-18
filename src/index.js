// ==================== 配置区 ====================

const AI_PROVIDERS = {
  OPENROUTER: 'openrouter',
  CLAUDE: 'claude',
  CLAUDE_AGENT: 'claude_agent'
};

const CLAUDE_CONFIG = {
  endpoint: 'https://api.anthropic.com/v1/messages',
  model: 'claude-3-5-sonnet-20241022',
  version: '2023-06-01'
};

const OPENROUTER_CONFIG = {
  endpoint: 'https://openrouter.ai/api/v1/chat/completions',
  model: 'anthropic/claude-3.5-sonnet'
};

const CLAUDE_AGENT_CONFIG = {
  enabled: false,
  endpoint: '',
  features: {
    deepAnalysis: true,
    multiRound: true,
    customPrompts: true
  }
};

// ==================== 去重辅助函数 ====================

function normalizeUrl(url) {
  try {
    const parsed = new URL(url);
    let normalized = `${parsed.protocol}//${parsed.host}${parsed.pathname}`;
    normalized = normalized.toLowerCase().replace(/\/+$/, '');
    return normalized;
  } catch (error) {
    console.error('[URL] 解析失败:', url, error.message);
    return url.toLowerCase();
  }
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

function generateTitleHash(title) {
  const normalized = title
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fa5]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return simpleHash(normalized);
}

// ==================== Worker 入口 ====================

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }

    if (path === '/health' || path === '/') {
      return new Response(JSON.stringify({
        status: 'ok',
        service: 'Siji Worker V2',
        provider: env.AI_PROVIDER || 'openrouter',
        timestamp: new Date().toISOString(),
        version: '2.0.1'
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (path === '/test' && request.method === 'POST') {
      return new Response(JSON.stringify({
        status: 'Worker 已恢复到原始版本',
        message: '完整功能需要补充代码'
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    return new Response('Not Found', { status: 404 });
  }
};
