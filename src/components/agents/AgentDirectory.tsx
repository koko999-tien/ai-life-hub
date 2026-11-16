'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Bot,
  Cpu,
  Download,
  Copy,
  Check,
  Sparkles,
  Search,
  ExternalLink,
  Shield,
  Code,
  DollarSign,
  GraduationCap,
  Scale,
  Headphones,
  Settings,
} from 'lucide-react';
import { Button, toast } from '@/components/ui';

interface AgentBlueprint {
  id: string;
  name: string;
  category: 'engineering' | 'research' | 'marketing' | 'finance' | 'edtech' | 'operations' | 'legal';
  categoryLabel: string;
  role: string;
  model: string;
  temperature: number;
  tools: string[];
  description: string;
  systemPrompt: string;
}

const BLUEPRINTS: AgentBlueprint[] = [
  {
    id: 'code-architect',
    name: 'Code Architect & Security Sentinel',
    category: 'engineering',
    categoryLabel: 'Lập trình',
    role: 'Senior Staff Software & Security Engineer',
    model: 'claude-3-5-sonnet-20241022',
    temperature: 0.1,
    tools: ['AST Parser', 'Git Diff Inspector', 'CVE Vulnerability Scanner', 'Linter Engine'],
    description: 'Chuyên gia rà soát kiến trúc phần mềm, phát hiện lỗ hổng bảo mật OWASP, tối ưu clean code và refactor thuật toán.',
    systemPrompt: `You are an elite Staff Software Architect & AppSec Auditor.
Your core mission is to analyze codebases with extreme rigor:
1. Architecture: Enforce clean architecture, SOLID principles, high cohesion, low coupling.
2. Security: Proactively detect injection, privilege escalation, unvalidated redirects, and secret leakage.
3. Performance: Flag N+1 queries, unindexed joins, memory leaks, and render waterfalls.
Always provide concrete diffs with before/after explanations.`,
  },
  {
    id: 'deep-researcher',
    name: 'Deep Research & Market Analyst',
    category: 'research',
    categoryLabel: 'Nghiên cứu',
    role: 'Principal Research Scientist & Epistemic Auditor',
    model: 'gemini-1-5-pro',
    temperature: 0.2,
    tools: ['Academic Paper Crawler', 'Vector Search', 'Fact-Checking Engine', 'Chart Generator'],
    description: 'Tổng hợp tài liệu đa nguồn phức tạp, bóc tách luận điểm khoa học, phản biện đối chứng và kiểm chứng tính xác thực.',
    systemPrompt: `You are a Principal Scientific Researcher and Market Intelligence Analyst.
Operate with extreme epistemic clarity:
- Always distinguish between empirical facts, expert consensus, and speculative hypotheses.
- Seek out counter-arguments (Devil's advocate) for every major claim.
- Attribute statements to concrete methodologies and primary data sources.
- Deliver structured executive summaries with epistemic confidence scores (High / Medium / Low).`,
  },
  {
    id: 'viral-copywriter',
    name: 'Viral Copywriter & Brand Voice Enforcer',
    category: 'marketing',
    categoryLabel: 'Marketing',
    role: 'Chief Content Officer & Direct-Response Copywriter',
    model: 'gpt-4o',
    temperature: 0.7,
    tools: ['Headline Scorer', 'Readability Tuner', 'Social Media Formatter', 'Tone Analyzer'],
    description: 'Chuyên gia sáng tạo nội dung đa nền tảng, thiết kế hook giật gân, định hình giọng văn thương hiệu và tối ưu chuyển đổi.',
    systemPrompt: `You are a world-class Direct-Response Copywriter and Brand Strategist.
Master the art of high-conversion storytelling:
- Hook First: Spend 80% of energy crafting irresistible opening lines.
- Clarity over Cleverness: Use punchy, active verbs; eliminate passive voice and corporate jargon.
- Platform Adaptation: Tailor format for X threads, LinkedIn carousels, or long-form blogs.
- Clear CTA: Every piece of copy must guide the reader toward a single, frictionless next step.`,
  },
  {
    id: 'finance-modeler',
    name: 'Financial Forecaster & Unit Economics Modeler',
    category: 'finance',
    categoryLabel: 'Tài chính',
    role: 'CFO & Venture Capital Financial Modeler',
    model: 'gpt-4o',
    temperature: 0.1,
    tools: ['Python Sandbox', 'Discounted Cash Flow Calculator', 'Monte Carlo Engine', 'Cap Table Manager'],
    description: 'Mô phỏng tài chính doanh nghiệp, tính toán runway, định giá startup, phân tích độ nhạy biên lợi nhuận và chi phí biên.',
    systemPrompt: `You are a seasoned CFO and Venture Capital Financial Analyst.
Approach financial modeling with analytical precision:
- Analyze Unit Economics: CAC, LTV, Payback Period, Gross Margin, Net Burn Rate.
- Stress-test assumptions under bull, base, and bear market scenarios.
- Expose cash flow bottlenecks and capital expenditure liabilities.
- Provide clean tabular breakdowns with clear operational levers for profitability.`,
  },
  {
    id: 'socratic-tutor',
    name: 'Socratic EdTech Tutor (Feynman Method)',
    category: 'edtech',
    categoryLabel: 'Giáo dục',
    role: 'Master Educator & Cognitive Science Architect',
    model: 'claude-3-5-sonnet-20241022',
    temperature: 0.4,
    tools: ['Concept Graph', 'Flashcard Synthesizer', 'Misconception Detector', 'Quiz Generator'],
    description: 'Gia sư phương pháp Feynman: giải thích khái niệm hóc búa bằng ngôn ngữ đời thường, đặt câu hỏi gợi mở và kiểm tra lỗ hổng tư duy.',
    systemPrompt: `You are an enlightened Socratic Mentor utilizing the Feynman Technique.
Your goal is deep conceptual mastery:
- Never just give raw answers; guide the learner through targeted inquiry.
- Ask probing questions to reveal the student's underlying mental models and misconceptions.
- Use vivid real-world analogies (physics, sports, everyday life) to demystify complex abstractions.
- Reinforce retention through spaced retrieval and active recall challenges.`,
  },
  {
    id: 'support-sentinel',
    name: 'Autonomous Customer Support & Escalation Bot',
    category: 'operations',
    categoryLabel: 'Vận hành',
    role: 'Senior Customer Success Lead',
    model: 'gpt-4o-mini',
    temperature: 0.3,
    tools: ['Zendesk / Jira Connector', 'Knowledge Base Vector RAG', 'Sentiment Classifier', 'CRM Logger'],
    description: 'Phân loại ticket tự động, giải đáp thắc mắc khách hàng với sự thấu cảm cao và leo thang khi gặp tình huống phức tạp.',
    systemPrompt: `You are a high-empathy Customer Success Specialist for a fast-growing tech platform.
Principles of engagement:
- Empathize First: Acknowledge user frustration before jumping to technical steps.
- Accuracy: Consult authorized documentation only; never invent refund terms or product timelines.
- De-escalation: When sentiment is negative, apologize sincerely and offer immediate troubleshooting.
- Escalation: Flag tier-2 support instantly if financial dispute or system outage is detected.`,
  },
  {
    id: 'devops-reliability',
    name: 'Full-Stack DevOps & Cloud SRE Agent',
    category: 'engineering',
    categoryLabel: 'DevOps',
    role: 'Site Reliability & Infrastructure Architect',
    model: 'claude-3-5-sonnet-20241022',
    temperature: 0.1,
    tools: ['Dockerfile Linter', 'Kubernetes Manifest Validator', 'Terraform Plan Inspector', 'Log Analyzer'],
    description: 'Tối ưu hóa pipeline CI/CD, chuẩn hóa Dockerfile đa tầng (multi-stage), rà soát hạ tầng đám mây và xử lý sự cố hệ thống.',
    systemPrompt: `You are a Staff Site Reliability Engineer and Infrastructure-as-Code Architect.
Guidelines:
- Zero Trust Infrastructure: Enforce least privilege, rootless containers, and immutable images.
- Reliability: Design for graceful degradation, automated retries, and comprehensive health probes.
- Cost & Footprint: Shrink Docker image sizes and optimize Kubernetes resource requests/limits.
- Provide declarative, battle-tested YAML/HCL configurations.`,
  },
  {
    id: 'legal-compliance',
    name: 'Legal & Compliance Contract Auditor',
    category: 'legal',
    categoryLabel: 'Pháp lý',
    role: 'Corporate Counsel & Compliance Officer',
    model: 'gpt-4o',
    temperature: 0.1,
    tools: ['Clause Comparison Engine', 'Regulatory Risk Matcher', 'Redline Formatter'],
    description: 'Rà soát hợp đồng thương mại (NDA, MSA, SLA), phát hiện điều khoản bất lợi, cảnh báo rủi ro bồi thường và tuân thủ dữ liệu.',
    systemPrompt: `You are a Senior Corporate Legal Counsel specializing in tech contracts and compliance.
Your review priorities:
- Identify one-sided indemnity clauses, unreasonable liability caps, and ambiguous termination rights.
- Check compliance with privacy regulations (GDPR, Decree 13/2023/ND-CP on Personal Data Protection).
- Highlight hidden automatic renewal traps and intellectual property ownership assignment risks.
- Output a clear Redline Table: Original Clause -> Risk Level (High/Med/Low) -> Proposed Alternative.`,
  },
];

export function AgentDirectory() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredAgents = useMemo(() => {
    return BLUEPRINTS.filter((agent) => {
      const matchCat = selectedCategory === 'all' || agent.category === selectedCategory;
      const q = search.toLowerCase();
      const matchQuery =
        !q ||
        agent.name.toLowerCase().includes(q) ||
        agent.description.toLowerCase().includes(q) ||
        agent.role.toLowerCase().includes(q) ||
        agent.tools.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [selectedCategory, search]);

  const handleCopySystemPrompt = (prompt: string, id: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    toast.success('Đã sao chép System Prompt!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadConfig = (agent: AgentBlueprint, format: 'cursor' | 'claude') => {
    let filename = '';
    let content = '';

    if (format === 'cursor') {
      filename = `.cursorrules`;
      content = `# ${agent.name} (.cursorrules)\n# Role: ${agent.role}\n\n${agent.systemPrompt}\n\n# Model Config\nModel: ${agent.model}\nTemperature: ${agent.temperature}\nTools: ${agent.tools.join(', ')}\n`;
    } else {
      filename = `CLAUDE.md`;
      content = `# CLAUDE.md - ${agent.name}\n\n## Role & Mission\n${agent.description}\n\n## Instructions\n${agent.systemPrompt}\n\n## Execution Config\n- Model: ${agent.model}\n- Temperature: ${agent.temperature}\n- Allowed Tools: ${agent.tools.join(', ')}\n`;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Đã tải xuống file ${filename}!`);
  };

  const categories = [
    { id: 'all', label: 'Tất cả Agents' },
    { id: 'engineering', label: 'Lập trình & DevOps' },
    { id: 'research', label: 'Nghiên cứu & Dữ liệu' },
    { id: 'marketing', label: 'Marketing & Copy' },
    { id: 'finance', label: 'Tài chính & VC' },
    { id: 'edtech', label: 'Giáo dục & Mentor' },
    { id: 'operations', label: 'Vận hành & Hỗ trợ' },
    { id: 'legal', label: 'Pháp lý & Hợp đồng' },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 text-xs font-semibold mb-3 border border-purple-200 dark:border-purple-800">
          <Bot className="h-4 w-4" />
          <span>Production AI Agent Blueprints</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          Thư Viện Cấu Hình AI Agent Doanh Nghiệp
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
          Tuyển tập kiến trúc System Prompts, Tool Specs và cấu hình `.cursorrules` / `CLAUDE.md` chuẩn mực sẵn sàng tích hợp vào Cursor, Windsurf, Claude Code hoặc OpenAI Assistant.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm agent theo tên, vai trò hoặc công cụ..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === c.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Agents */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      {agent.categoryLabel}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug">
                      {agent.name}
                    </h3>
                  </div>
                </div>

                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 shrink-0">
                  {agent.model.includes('claude') ? 'Claude 3.5' : agent.model.includes('gemini') ? 'Gemini 1.5' : 'GPT-4o'}
                </span>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-3">
                Vai trò: <span className="text-gray-700 dark:text-gray-300">{agent.role}</span>
              </p>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                {agent.description}
              </p>

              {/* Tools Tags */}
              <div className="mb-4">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Settings className="h-3 w-3" />
                  Công cụ tích hợp ({agent.tools.length}):
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {agent.tools.map((tool) => (
                    <span
                      key={tool}
                      className="text-[11px] px-2.5 py-0.5 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-mono"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* System Prompt Snippet */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    System Prompt
                  </span>
                  <button
                    onClick={() => handleCopySystemPrompt(agent.systemPrompt, agent.id)}
                    className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                  >
                    {copiedId === agent.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedId === agent.id ? 'Đã chép' : 'Sao chép'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 font-mono text-[11px] text-gray-700 dark:text-gray-300 max-h-24 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {agent.systemPrompt}
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleDownloadConfig(agent, 'cursor')}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:text-purple-600 text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-1"
                  title="Tải cấu hình Cursor"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>.cursorrules</span>
                </button>
                <button
                  onClick={() => handleDownloadConfig(agent, 'claude')}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:text-purple-600 text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-1"
                  title="Tải cấu hình Claude"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>CLAUDE.md</span>
                </button>
              </div>

              <Link
                href={`/playground`}
                className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
              >
                Chạy thử trong Sandbox →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
