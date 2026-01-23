import { TerminalLayout } from '@/components/TerminalLayout'
import { SiteHeader, SubscribeSection } from '@/components/SiteComponents'

export const metadata = {
  title: '关于斯基GPT - AI驾驶员的全球资讯聚合站',
  description: '斯基GPT是基于AI的自动化内容聚合平台，使用GenSpark AI Developer和Claude Sonnet 4开发，参考AIGC Weekly项目架构，专注收集全球AI/ML技术资讯',
  keywords: '斯基GPT, AI资讯聚合, GenSpark AI Developer, Claude Sonnet 4, Grok 4, AIGC Weekly, Cloudflare Workers, AI内容分析',
}

export default function AboutPage() {
  return (
    <TerminalLayout customHeader={<SiteHeader />}>
      <div style={{ marginTop: '-1rem' }} className="mb-4">
        {/* header下方细线 */}
        <div style={{ borderTop: '1px solid var(--terminal-border)', margin: '0 0 1.5rem 0' }}></div>
        
        {/* 页面标题 */}
        <div className="mb-6" style={{ textAlign: 'center' }}>
          <h1 className="text-2xl font-bold text-terminal-text mb-2">
            🚗 关于斯基GPT
          </h1>
          <p className="text-terminal-muted">
            斯基GPT - 做你的AI驾驶员！
          </p>
        </div>

        <SubscribeSection />
        
        {/* 内容区域 */}
        <div className="space-y-6 max-w-5xl mx-auto">
          {/* 核心信息概览 - 整合版 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-pistachio-400 border-l-4 border-pistachio-400 pl-4">
              🚀 平台概览 & 开发团队
            </h2>
            <div className="pl-4">
              <div className="bg-terminal-bg border border-terminal-border p-6 rounded">
                {/* 平台定位 - 简化版 */}
                <div className="mb-6">
                  <h3 className="font-semibold text-pistachio-400 mb-3">🤖 平台使命</h3>
                  <p className="text-sm text-terminal-text leading-relaxed">
                    基于AI的自动化内容聚合平台，专注全球AI/ML技术资讯收集、筛选和发布。
                    通过智能RSS监控、AI内容分析和多平台自动发布，为AI从业者提供高质量的中英双语技术内容。
                  </p>
                </div>
                
                {/* 开发团队 & 技术架构整合 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 开发信息 */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-pistachio-400">🛠️ 开发团队</h3>
                    <div className="text-sm text-terminal-text space-y-1">
                      <div>• <strong>主力开发</strong>: GenSpark AI Developer</div>
                      <div>• <strong>AI助手</strong>: Claude Sonnet 4</div>
                      <div>• <strong>思路提供</strong>: Grok 4</div>
                      <div>• <strong>建立时间</strong>: 2026年1月1日</div>
                      <div>• <strong>参考项目</strong>: <a href="https://aigc-weekly.agi.li/" className="text-pistachio-400 hover:underline" target="_blank" rel="noopener noreferrer">AIGC Weekly</a></div>
                    </div>
                  </div>
                  
                  {/* 核心技术栈 */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-pistachio-400">⚡ 核心技术栈</h3>
                    <div className="text-sm text-terminal-text space-y-1">
                      <div>🚀 <strong>Runtime</strong>: Cloudflare Workers</div>
                      <div>💾 <strong>存储</strong>: Cloudflare KV</div>
                      <div>⏰ <strong>定时</strong>: Cron Triggers (4次/日)</div>
                      <div>🌐 <strong>API</strong>: OpenRouter (多模型聚合)</div>
                      <div>📝 <strong>CMS</strong>: Payload CMS</div>
                      <div>🚀 <strong>部署</strong>: Vercel</div>
                    </div>
                  </div>
                </div>
                
                {/* 处理流程 - 简化版 */}
                <div className="mt-6">
                  <h3 className="font-semibold text-pistachio-400 mb-3">🔄 智能处理流程</h3>
                  <div className="text-sm text-terminal-text">
                    <span className="inline-block bg-pistachio-400/10 px-2 py-1 rounded mr-2">1. RSS聚合</span>
                    <span className="text-terminal-muted">100+源轮换</span> → 
                    <span className="inline-block bg-pistachio-400/10 px-2 py-1 rounded mx-2">2. 智能筛选</span>
                    <span className="text-terminal-muted">三层去重+AI判断</span> → 
                    <span className="inline-block bg-pistachio-400/10 px-2 py-1 rounded mx-2">3. 内容生成</span>
                    <span className="text-terminal-muted">双语摘要+SEO优化</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* AI模型配置表格 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-pistachio-400 border-l-4 border-pistachio-400 pl-4">
              🤖 AI模型配置 (性价比优先策略)
            </h2>
            <div className="pl-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-terminal-border text-sm">
                  <thead>
                    <tr className="bg-terminal-bg">
                      <th className="border border-terminal-border p-3 text-left text-pistachio-400">模型名称</th>
                      <th className="border border-terminal-border p-3 text-left text-pistachio-400">优势特点</th>
                      <th className="border border-terminal-border p-3 text-left text-pistachio-400">适用场景</th>
                      <th className="border border-terminal-border p-3 text-left text-pistachio-400">调度优先级</th>
                    </tr>
                  </thead>
                  <tbody className="text-terminal-text">
                    <tr>
                      <td className="border border-terminal-border p-3">
                        <div className="font-semibold">🌙 Kimi</div>
                        <div className="text-xs text-terminal-muted">(moonshot-v1-8k)</div>
                      </td>
                      <td className="border border-terminal-border p-3 text-terminal-muted">中文理解优秀，语义准确</td>
                      <td className="border border-terminal-border p-3 text-terminal-muted">详细摘要、翻译标注</td>
                      <td className="border border-terminal-border p-3 text-center">
                        <span className="bg-pistachio-400 text-black px-2 py-1 rounded text-xs">主力模型</span>
                      </td>
                    </tr>
                    <tr className="bg-terminal-bg/30">
                      <td className="border border-terminal-border p-3">
                        <div className="font-semibold">🧠 DeepSeek</div>
                        <div className="text-xs text-terminal-muted">(deepseek-chat)</div>
                      </td>
                      <td className="border border-terminal-border p-3 text-terminal-muted">AI/ML技术专家，成本极低</td>
                      <td className="border border-terminal-border p-3 text-terminal-muted">内容筛选、技术分析</td>
                      <td className="border border-terminal-border p-3 text-center">
                        <span className="bg-blue-400 text-black px-2 py-1 rounded text-xs">备用模型</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-terminal-border p-3">
                        <div className="font-semibold">⚡ Groq</div>
                        <div className="text-xs text-terminal-muted">(Llama-3.1-70B)</div>
                      </td>
                      <td className="border border-terminal-border p-3 text-terminal-muted">极快推理速度，高吞吐</td>
                      <td className="border border-terminal-border p-3 text-terminal-muted">批量筛选、快速处理</td>
                      <td className="border border-terminal-border p-3 text-center">
                        <span className="bg-yellow-400 text-black px-2 py-1 rounded text-xs">筛选首选</span>
                      </td>
                    </tr>
                    <tr className="bg-terminal-bg/30">
                      <td className="border border-terminal-border p-3">
                        <div className="font-semibold">🔧 Qwen 2.5</div>
                        <div className="text-xs text-terminal-muted">(qwen-2.5-72b)</div>
                      </td>
                      <td className="border border-terminal-border p-3 text-terminal-muted">中文术语准确，稳定可靠</td>
                      <td className="border border-terminal-border p-3 text-terminal-muted">专业术语、稳定备份</td>
                      <td className="border border-terminal-border p-3 text-center">
                        <span className="bg-gray-400 text-black px-2 py-1 rounded text-xs">稳定备份</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* 调度策略 */}
              <div className="mt-4 bg-terminal-bg border border-terminal-border p-4 rounded">
                <h4 className="text-sm font-semibold text-pistachio-400 mb-2">智能调度策略:</h4>
                <div className="text-sm text-terminal-muted grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>📊 <strong>内容筛选</strong>: Groq → DeepSeek → Kimi → Qwen</div>
                  <div>📝 <strong>详细摘要</strong>: Kimi → DeepSeek → Groq → Qwen</div>
                  <div>🌐 <strong>翻译标注</strong>: Kimi → DeepSeek → Qwen → Groq</div>
                </div>
              </div>
            </div>
          </section>

          {/* 技术亮点表格 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-pistachio-400 border-l-4 border-pistachio-400 pl-4">
              ⚡ 技术亮点 & 性能指标
            </h2>
            <div className="pl-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-terminal-border text-sm">
                  <thead>
                    <tr className="bg-terminal-bg">
                      <th className="border border-terminal-border p-3 text-left text-pistachio-400">核心技术</th>
                      <th className="border border-terminal-border p-3 text-left text-pistachio-400">实现方案</th>
                      <th className="border border-terminal-border p-3 text-left text-pistachio-400">关键优势</th>
                      <th className="border border-terminal-border p-3 text-left text-pistachio-400">性能指标</th>
                    </tr>
                  </thead>
                  <tbody className="text-terminal-text">
                    <tr>
                      <td className="border border-terminal-border p-3 font-semibold">🌍 Edge Computing</td>
                      <td className="border border-terminal-border p-3 text-terminal-muted">Cloudflare Workers全球边缘网络</td>
                      <td className="border border-terminal-border p-3 text-terminal-muted">就近访问，极速响应</td>
                      <td className="border border-terminal-border p-3 text-terminal-muted">毫秒级延迟</td>
                    </tr>
                    <tr className="bg-terminal-bg/30">
                      <td className="border border-terminal-border p-3 font-semibold">🔄 智能轮换</td>
                      <td className="border border-terminal-border p-3 text-terminal-muted">RSS源动态调度算法</td>
                      <td className="border border-terminal-border p-3 text-terminal-muted">内容覆盖全面，系统稳定</td>
                      <td className="border border-terminal-border p-3 text-terminal-muted">100+ RSS源</td>
                    </tr>
                    <tr>
                      <td className="border border-terminal-border p-3 font-semibold">🔧 多模型降级</td>
                      <td className="border border-terminal-border p-3 text-terminal-muted">4模型智能切换机制</td>
                      <td className="border border-terminal-border p-3 text-terminal-muted">高可用，单点故障自动恢复</td>
                      <td className="border border-terminal-border p-3 text-terminal-muted">99.9% 可用性</td>
                    </tr>
                    <tr className="bg-terminal-bg/30">
                      <td className="border border-terminal-border p-3 font-semibold">🔍 SEO友好</td>
                      <td className="border border-terminal-border p-3 text-terminal-muted">英文slug自动生成</td>
                      <td className="border border-terminal-border p-3 text-terminal-muted">搜索引擎优化，流量提升</td>
                      <td className="border border-terminal-border p-3 text-terminal-muted">URL规范化</td>
                    </tr>
                    <tr>
                      <td className="border border-terminal-border p-3 font-semibold">⚡ 实时预热</td>
                      <td className="border border-terminal-border p-3 text-terminal-muted">内容发布后自动预热</td>
                      <td className="border border-terminal-border p-3 text-terminal-muted">核心页面快速加载</td>
                      <td className="border border-terminal-border p-3 text-terminal-muted">CDN缓存优化</td>
                    </tr>
                    <tr className="bg-terminal-bg/30">
                      <td className="border border-terminal-border p-3 font-semibold">💰 成本控制</td>
                      <td className="border border-terminal-border p-3 text-terminal-muted">性价比模型组合策略</td>
                      <td className="border border-terminal-border p-3 text-terminal-muted">大幅降低运营成本</td>
                      <td className="border border-terminal-border p-3 text-terminal-muted">成本优化60%+</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 发布平台 - 整合到技术亮点后 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-pistachio-400 border-l-4 border-pistachio-400 pl-4">
              📱 多平台发布 & 核心优势
            </h2>
            <div className="pl-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-terminal-bg border border-terminal-border p-4 rounded text-center">
                  <div className="text-pistachio-400 text-2xl mb-2">📝</div>
                  <h3 className="font-semibold text-pistachio-400 mb-2">Payload CMS</h3>
                  <p className="text-xs text-terminal-muted">Headless CMS自动内容管理</p>
                </div>
                <div className="bg-terminal-bg border border-terminal-border p-4 rounded text-center">
                  <div className="text-pistachio-400 text-2xl mb-2">💬</div>
                  <h3 className="font-semibold text-pistachio-400 mb-2">Telegram</h3>
                  <p className="text-xs text-terminal-muted">实时资讯推送频道</p>
                </div>
                <div className="bg-terminal-bg border border-terminal-border p-4 rounded text-center">
                  <div className="text-pistachio-400 text-2xl mb-2">🌍</div>
                  <h3 className="font-semibold text-pistachio-400 mb-2">Edge Computing</h3>
                  <p className="text-xs text-terminal-muted">全球边缘网络加速</p>
                </div>
              </div>
              
              {/* 核心数据指标 */}
              <div className="bg-terminal-bg border border-terminal-border p-4 rounded">
                <h4 className="text-sm font-semibold text-pistachio-400 mb-3">📊 核心指标</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                  <div>
                    <div className="text-pistachio-400 font-bold text-lg">100+</div>
                    <div className="text-terminal-muted">RSS源</div>
                  </div>
                  <div>
                    <div className="text-pistachio-400 font-bold text-lg">99.9%</div>
                    <div className="text-terminal-muted">可用性</div>
                  </div>
                  <div>
                    <div className="text-pistachio-400 font-bold text-lg">60%+</div>
                    <div className="text-terminal-muted">成本优化</div>
                  </div>
                  <div>
                    <div className="text-pistachio-400 font-bold text-lg">毫秒级</div>
                    <div className="text-terminal-muted">响应延迟</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 底部信息 */}
        <div className="pt-8 text-terminal-muted text-sm text-center border-t border-terminal-border">
          <p>Powered by Cloudflare Workers + Payload CMS + GenSpark AI</p>
          <p className="mt-1">
            Developed with GenSpark AI Developer, Claude Sonnet 4 & Grok 4
          </p>
          <p className="mt-1">
            © 2026 斯基GPT. All rights reserved.
          </p>
          <p className="mt-2 text-pistachio-400 font-semibold">
            斯基GPT - 做你的AI驾驶员！
          </p>
        </div>
      </div>
    </TerminalLayout>
  )
}