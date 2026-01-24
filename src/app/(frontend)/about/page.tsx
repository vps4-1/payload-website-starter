import { TerminalLayout } from '@/components/TerminalLayout'
import { SiteHeader, SubscribeSection } from '@/components/SiteComponents'

export const metadata = {
  title: '关于斯基GPT - AI驾驶员的全球资讯聚合站',
  description: '斯基GPT是基于AI的自动化内容聚合平台，使用GenSpark AI Developer和Claude Sonnet 4开发，专注AI/ML/大模型/前沿技术资讯收集与发布',
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
        
        {/* 平台介绍 */}
        <div className="space-y-8 max-w-5xl mx-auto">
          <section className="space-y-4">
            <div className="bg-terminal-bg border border-terminal-border p-6 rounded">
              <p className="text-base text-terminal-text leading-relaxed mb-4">
                斯基GPT是一个基于 AI 的自动化内容聚合平台，专注全球 AI/ML/大模型/前沿技术资讯的收集、筛选与发布。
                通过智能 RSS 监控、多模型 AI 分析与多平台自动发布，为 AI 从业者、研究者和爱好者提供高质量、中英双语的技术内容。
              </p>
            </div>
          </section>

          {/* 使命宣言 - 移到前面 */}
          <section className="space-y-4">
            <div className="bg-terminal-bg border border-pistachio-400 p-6 rounded text-center">
              <h3 className="text-lg font-bold text-pistachio-400 mb-3">SijiGPT 的使命</h3>
              <p className="text-terminal-text mb-4">
                用最小的阅读成本，让你第一时间掌握 AI 领域的最新进展与核心洞见。
              </p>
              <p className="text-terminal-muted text-sm">
                欢迎订阅，一起见证 AI 的未来！
              </p>
            </div>
          </section>

          {/* 多平台分发 - 移到前面 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-pistachio-400 border-l-4 border-pistachio-400 pl-4">
              📱 多平台分发
            </h2>
            <div className="pl-4">
              <div className="bg-terminal-bg border border-terminal-border p-4 rounded">
                <div className="text-sm text-terminal-text space-y-2">
                  <div>🌐 <strong>主站</strong>: sijigpt.com（Payload CMS 驱动）</div>
                  <div>💬 <strong>Telegram 频道</strong>: 实时资讯推送</div>
                  <div>📧 <strong>邮件订阅</strong>: 一点即可定时发送更新</div>
                  <div>📝 <strong>Notion 订阅</strong>: 一点即可定时发送更新</div>
                </div>
              </div>
            </div>
          </section>

          {/* 开发团队 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-pistachio-400 border-l-4 border-pistachio-400 pl-4">
              🛠️ 谁在背后
            </h2>
            <div className="pl-4">
              <div className="bg-terminal-bg border border-terminal-border p-4 rounded">
                <div className="text-sm text-terminal-text space-y-2">
                  <div>• <strong className="text-pistachio-400">主力开发</strong>: GenSpark AI Developer</div>
                  <div>• <strong className="text-pistachio-400">AI 助手</strong>: Claude Sonnet 4</div>
                  <div>• <strong className="text-pistachio-400">思路提供</strong>: Grok 4</div>
                  <div>• <strong className="text-pistachio-400">上线时间</strong>: 2026 年 1 月 1 日</div>
                  <div>• <strong className="text-pistachio-400">参考项目</strong>: <a href="https://aigc-weekly.agi.li/" className="text-pistachio-400 hover:underline" target="_blank" rel="noopener noreferrer">AIGC Weekly</a></div>
                </div>
              </div>
            </div>
          </section>

          {/* 架构连接说明 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-pistachio-400 border-l-4 border-pistachio-400 pl-4">
              🏗️ Cloudflare Workers + Payload CMS 架构
            </h2>
            <div className="pl-4">
              <div className="bg-terminal-bg border border-terminal-border p-4 rounded">
                <div className="text-sm text-terminal-text space-y-3">
                  <div className="ml-4 space-y-1">
                    <div>📡 <strong>RSS 采集</strong> → Cloudflare Workers（边缘计算）</div>
                    <div>🤖 <strong>AI 处理</strong> → OpenRouter 多模型分析</div>
                    <div>🗄️ <strong>数据存储</strong> → PostgreSQL (Neon)</div>
                    <div>🌐 <strong>前端展示</strong> → Next.js 读取 → Vercel 部署</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 技术栈 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-pistachio-400 border-l-4 border-pistachio-400 pl-4">
              ⚡ 核心技术栈
            </h2>
            <div className="pl-4">
              <div className="bg-terminal-bg border border-terminal-border p-4 rounded">
                <div className="text-sm text-terminal-text space-y-2">
                  <div>🚀 <strong>运行环境</strong>: Cloudflare Workers（全球边缘计算）</div>
                  <div>💾 <strong>存储</strong>: Cloudflare KV</div>
                  <div>⏰ <strong>定时调度</strong>: Cron Triggers（每天 4 次）</div>
                  <div>🌐 <strong>模型网关</strong>: OpenRouter（多模型智能聚合）</div>
                  <div>📝 <strong>内容管理</strong>: Payload CMS（Headless）</div>
                  <div>🚀 <strong>前端部署</strong>: Vercel</div>
                </div>
              </div>
            </div>
          </section>

          {/* 处理流程 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-pistachio-400 border-l-4 border-pistachio-400 pl-4">
              🔄 智能处理流程
            </h2>
            <div className="pl-4">
              <div className="bg-terminal-bg border border-terminal-border p-4 rounded">
                <div className="text-sm text-terminal-text space-y-3">
                  <div><strong className="text-pistachio-400">1. RSS 聚合</strong>: 100+ 高质量源轮换采集</div>
                  <div><strong className="text-pistachio-400">2. 智能筛选</strong>: 三层去重 + AI 判断价值</div>
                  <div><strong className="text-pistachio-400">3. 内容生成</strong>: 双语长摘要 + SEO 优化标题/slug</div>
                  <div><strong className="text-pistachio-400">4. 自动发布</strong>: Payload CMS → 站点 + Telegram 推送</div>
                </div>
              </div>
            </div>
          </section>

          {/* AI模型配置表格 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-pistachio-400 border-l-4 border-pistachio-400 pl-4">
              🤖 AI 模型配置（性价比优先）
            </h2>
            <div className="pl-4">
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="min-w-full">
                  <table className="w-full border-collapse border border-terminal-border text-sm">
                    <thead>
                      <tr className="bg-terminal-bg">
                        <th className="border border-terminal-border p-2 sm:p-3 text-left text-pistachio-400 min-w-[120px]">模型</th>
                        <th className="border border-terminal-border p-2 sm:p-3 text-left text-pistachio-400 min-w-[140px]">优势特点</th>
                        <th className="border border-terminal-border p-2 sm:p-3 text-left text-pistachio-400 min-w-[120px]">适用场景</th>
                        <th className="border border-terminal-border p-2 sm:p-3 text-left text-pistachio-400 min-w-[100px]">调度优先级</th>
                      </tr>
                    </thead>
                    <tbody className="text-terminal-text">
                      <tr>
                        <td className="border border-terminal-border p-2 sm:p-3">
                          <div className="font-semibold">Kimi</div>
                          <div className="text-xs text-terminal-muted">(moonshot-v1-8k)</div>
                        </td>
                        <td className="border border-terminal-border p-2 sm:p-3 text-terminal-muted">中文理解极强，语义准确</td>
                        <td className="border border-terminal-border p-2 sm:p-3 text-terminal-muted">详细摘要、翻译标注</td>
                        <td className="border border-terminal-border p-2 sm:p-3 text-center">
                          <span className="bg-pistachio-400 text-black px-2 py-1 rounded text-xs whitespace-nowrap">主力</span>
                        </td>
                      </tr>
                      <tr className="bg-terminal-bg/30">
                        <td className="border border-terminal-border p-2 sm:p-3">
                          <div className="font-semibold">DeepSeek</div>
                          <div className="text-xs text-terminal-muted">(deepseek-chat)</div>
                        </td>
                        <td className="border border-terminal-border p-2 sm:p-3 text-terminal-muted">AI/ML 技术专家，成本极低</td>
                        <td className="border border-terminal-border p-2 sm:p-3 text-terminal-muted">内容筛选、技术分析</td>
                        <td className="border border-terminal-border p-2 sm:p-3 text-center">
                          <span className="bg-blue-400 text-black px-2 py-1 rounded text-xs whitespace-nowrap">备用</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-terminal-border p-2 sm:p-3">
                          <div className="font-semibold">Groq</div>
                          <div className="text-xs text-terminal-muted">(Llama-3.1-70B)</div>
                        </td>
                        <td className="border border-terminal-border p-2 sm:p-3 text-terminal-muted">推理速度极快，高吞吐</td>
                        <td className="border border-terminal-border p-2 sm:p-3 text-terminal-muted">批量筛选、快速处理</td>
                        <td className="border border-terminal-border p-2 sm:p-3 text-center">
                          <span className="bg-yellow-400 text-black px-2 py-1 rounded text-xs whitespace-nowrap">筛选首选</span>
                        </td>
                      </tr>
                      <tr className="bg-terminal-bg/30">
                        <td className="border border-terminal-border p-2 sm:p-3">
                          <div className="font-semibold">Qwen 2.5</div>
                          <div className="text-xs text-terminal-muted">(qwen-2.5-72b)</div>
                        </td>
                        <td className="border border-terminal-border p-2 sm:p-3 text-terminal-muted">中文术语准确，稳定性高</td>
                        <td className="border border-terminal-border p-2 sm:p-3 text-terminal-muted">专业术语、稳定备份</td>
                        <td className="border border-terminal-border p-2 sm:p-3 text-center">
                          <span className="bg-gray-400 text-black px-2 py-1 rounded text-xs whitespace-nowrap">稳定备份</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* 调度策略 */}
              <div className="mt-4 bg-terminal-bg border border-terminal-border p-4 rounded">
                <h4 className="text-sm font-semibold text-pistachio-400 mb-2">智能调度策略</h4>
                <div className="text-sm text-terminal-muted grid grid-cols-1 md:grid-cols-3 gap-2">
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
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="min-w-full">
                  <table className="w-full border-collapse border border-terminal-border text-sm">
                    <thead>
                      <tr className="bg-terminal-bg">
                        <th className="border border-terminal-border p-2 sm:p-3 text-left text-pistachio-400 min-w-[120px]">技术实现</th>
                        <th className="border border-terminal-border p-2 sm:p-3 text-left text-pistachio-400 min-w-[140px]">关键优势</th>
                        <th className="border border-terminal-border p-2 sm:p-3 text-left text-pistachio-400 min-w-[100px]">性能指标</th>
                      </tr>
                    </thead>
                    <tbody className="text-terminal-text">
                      <tr>
                        <td className="border border-terminal-border p-2 sm:p-3 font-semibold">Edge Computing</td>
                        <td className="border border-terminal-border p-2 sm:p-3 text-terminal-muted">Cloudflare Workers 全球边缘网络</td>
                        <td className="border border-terminal-border p-2 sm:p-3 text-terminal-muted">毫秒级延迟</td>
                      </tr>
                      <tr className="bg-terminal-bg/30">
                        <td className="border border-terminal-border p-2 sm:p-3 font-semibold">智能轮换 RSS 源</td>
                        <td className="border border-terminal-border p-2 sm:p-3 text-terminal-muted">动态调度算法</td>
                        <td className="border border-terminal-border p-2 sm:p-3 text-terminal-muted">100+ RSS 源</td>
                      </tr>
                      <tr>
                        <td className="border border-terminal-border p-2 sm:p-3 font-semibold">多模型降级机制</td>
                        <td className="border border-terminal-border p-2 sm:p-3 text-terminal-muted">4 模型智能切换，高可用</td>
                        <td className="border border-terminal-border p-2 sm:p-3 text-terminal-muted">99.9% 可用性</td>
                      </tr>
                      <tr className="bg-terminal-bg/30">
                        <td className="border border-terminal-border p-2 sm:p-3 font-semibold">SEO 友好</td>
                        <td className="border border-terminal-border p-2 sm:p-3 text-terminal-muted">英文 slug 自动生成</td>
                        <td className="border border-terminal-border p-2 sm:p-3 text-terminal-muted">URL 规范化</td>
                      </tr>
                      <tr>
                        <td className="border border-terminal-border p-2 sm:p-3 font-semibold">实时预热</td>
                        <td className="border border-terminal-border p-2 sm:p-3 text-terminal-muted">内容发布后自动预热核心页面</td>
                        <td className="border border-terminal-border p-2 sm:p-3 text-terminal-muted">CDN 缓存优化</td>
                      </tr>
                      <tr className="bg-terminal-bg/30">
                        <td className="border border-terminal-border p-2 sm:p-3 font-semibold">成本控制</td>
                        <td className="border border-terminal-border p-2 sm:p-3 text-terminal-muted">性价比模型组合策略</td>
                        <td className="border border-terminal-border p-2 sm:p-3 text-terminal-muted">成本优化 60%+</td>
                      </tr>
                    </tbody>
                  </table>
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