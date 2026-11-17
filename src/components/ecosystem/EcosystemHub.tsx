'use client';

import { useState } from 'react';
import {
  FolderGit2,
  ExternalLink,
  Terminal,
  CheckCircle2,
  Cpu,
  Layers,
  Database,
  FileText,
  Sparkles,
  Bot,
  Activity,
  Code2,
  HardDrive,
  Copy,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

export interface EcosystemProject {
  id: string;
  name: string;
  category: 'Epistemic Science' | 'Document Automation' | 'Knowledge Base' | 'OSINT & Scraping' | 'Productivity';
  tagline: string;
  drivePath: string;
  githubUrl?: string;
  status: 'Production Ready' | 'Fully Verified' | 'Active Knowledge';
  techStack: string[];
  keyFeatures: string[];
  quickStartCommand: string;
  stats: string;
}

export const ECOSYSTEM_PROJECTS: EcosystemProject[] = [
  {
    id: 'reality-science',
    name: 'Reality Science (Epistemic Platform)',
    category: 'Epistemic Science',
    tagline: 'Hệ thống Khoa học Nhận thức, Kiểm định Giả thuyết & Động cơ Ràng buộc Thực tại',
    drivePath: 'D:\\Reality_Science',
    githubUrl: 'https://github.com/koko999-tien/reality-science',
    status: 'Fully Verified',
    techStack: ['Next.js 14', 'FastAPI', 'Celery', 'Redis', 'React Flow', 'PostgreSQL', 'Pytest'],
    keyFeatures: [
      'Reality Constraint Engine: Bắt buộc tuân thủ định luật bảo toàn vật lý (năng lượng, xung lượng, điện tích)',
      'Dimensional Analysis: Tự động phân tích và kiểm tra tính đồng nhất thứ nguyên (M, L, T, Q, Theta)',
      'Boundary Engine: Đánh giá giới hạn toán học khi biến số tiến tới 0 và vô cùng',
      'Soft-Deadline Compute Queue: Hàng đợi xử lý tác vụ điện toán mềm chống treo worker'
    ],
    quickStartCommand: 'cd D:\\Reality_Science; python -m pytest backend/tests/ -v',
    stats: '100% Tests Pass • 4 Stages Complete'
  },
  {
    id: 'unidoc-studio',
    name: 'UniDoc Studio Vietnam',
    category: 'Document Automation',
    tagline: 'Studio Tự động hóa Soạn thảo Báo cáo Word & Slide chuẩn Thể thức Hành chính Việt Nam',
    drivePath: 'D:\\tao-bao-cao-word-slide',
    githubUrl: 'https://github.com/koko999-tien/unidoc-studio-vietnam',
    status: 'Production Ready',
    techStack: ['Python', 'FastAPI', 'python-docx', 'python-pptx', 'React', 'TypeScript', 'Tailwind'],
    keyFeatures: [
      'Soạn thảo văn bản chuẩn thể thức kỹ thuật theo Nghị định 30/2020/NĐ-CP',
      'Tự động sinh dàn ý tờ trình, đề án, báo cáo tổng kết và dự toán kinh phí',
      'Xuất bản tệp tin Word (.docx) và Slide (.pptx) định dạng chuyên nghiệp',
      'Bộ kiểm thử tự động hóa 87 test case toàn diện'
    ],
    quickStartCommand: 'cd D:\\tao-bao-cao-word-slide; pytest tests/ -v',
    stats: '87 Test Cases Passed • DOCX & PPTX'
  },
  {
    id: 'ai-knowledge-lab',
    name: 'AI Knowledge Lab & Database',
    category: 'Knowledge Base',
    tagline: 'Kho Tri thức 10 Cẩm nang Kỹ thuật Thực chiến & Cơ sở Dữ liệu Nghiên cứu',
    drivePath: 'D:\\AI_Knowledge_Lab',
    status: 'Active Knowledge',
    techStack: ['SQLite', 'Python', 'Pandas', 'Markdown Playbooks', 'Vector Index'],
    keyFeatures: [
      '10 Cẩm nang Master Playbooks biên soạn từ 10 công trình kinh điển thế giới',
      'Cơ sở dữ liệu SQLite knowledge_base.db (13MB) lưu trữ hàng nghìn tri thức có cấu trúc',
      'Kho tài nguyên web_repos.db phân loại repository GitHub tinh hoa',
      'Lộ trình đào tạo 6 vai trò: AI Engineer, Data Scientist, Backend, DevOps, SDET, Game Dev'
    ],
    quickStartCommand: 'cd D:\\AI_Knowledge_Lab\\docs\\playbooks; ls -la',
    stats: '10 Master Books • 13MB Knowledge DB'
  },
  {
    id: 'telegram-ai-tool',
    name: 'Telegram AI Knowledge Harvester',
    category: 'OSINT & Scraping',
    tagline: 'Hệ thống Bóc tách Tri thức & Tải Tài nguyên Tự động từ Telegram về Ổ D',
    drivePath: 'D:\\Telegram_AI_Tool',
    githubUrl: 'https://github.com/koko999-tien/Telegram_AI_Tool',
    status: 'Production Ready',
    techStack: ['Python', 'Telethon', 'Pyrogram', 'SQLite', 'Human-in-the-loop'],
    keyFeatures: [
      'Quét sâu toàn bộ lịch sử tin nhắn các kênh công nghệ, kỹ thuật, AI và lập trình',
      'Bóc tách liên kết GitHub, sách kỹ thuật PDF và công cụ nguồn mở',
      'Cơ chế kiểm duyệt an toàn Human-in-the-loop trước khi lưu trữ vào D:\\AI_Telegram_Downloads',
      'Đồng bộ siêu dữ liệu trực tiếp vào kho tri thức D:\\AI_Knowledge_Lab'
    ],
    quickStartCommand: 'cd D:\\Telegram_AI_Tool; python -m pytest tests/ -v',
    stats: '800+ Files • 100% Tests Pass'
  },
  {
    id: 'lofi-pomodoro',
    name: 'Lofi Pomodoro Focus Studio',
    category: 'Productivity',
    tagline: 'Không gian Tập trung Làm việc & Học tập Sâu kết hợp Âm nhạc Lofi',
    drivePath: 'D:\\lofi-pomodoro',
    githubUrl: 'https://github.com/koko999-tien/lofi-pomodoro',
    status: 'Production Ready',
    techStack: ['HTML5', 'Vanilla JavaScript', 'Web Audio API', 'CSS3 Modern'],
    keyFeatures: [
      'Bộ đếm thời gian Pomodoro tiêu chuẩn (25 phút tập trung / 5 phút nghỉ ngắn / 15 phút nghỉ dài)',
      'Kho âm thanh Lofi thư giãn, tiếng mưa và white noise kích thích trạng thái Flow State',
      'Giao diện tối giản tối ưu cho các phiên làm việc Deep Work không gây phân tâm'
    ],
    quickStartCommand: 'cd D:\\lofi-pomodoro; start index.html',
    stats: 'Deep Work • Web Audio'
  },
  {
    id: 'tubeflux',
    name: 'Tubeflux Streaming Engine',
    category: 'Productivity',
    tagline: 'Nền tảng Lưu trữ & Phát Video Tự lưu trữ Hiệu năng cao (Node 24 + SQLite)',
    drivePath: 'D:\\tubeflux',
    githubUrl: 'https://github.com/koko999-tien/tubeflux',
    status: 'Production Ready',
    techStack: ['Node.js 24', 'Express', 'node:sqlite', 'FFmpeg', 'Vanilla JS'],
    keyFeatures: [
      'Hỗ trợ streaming video chunked range HTTP cho tốc độ xem mượt mà',
      'Tự động trích xuất thumbnail và metadata thời lượng qua FFmpeg',
      'Bảng điều khiển quản trị Admin phân loại danh mục, từ khóa và bình luận'
    ],
    quickStartCommand: 'cd D:\\tubeflux; npm install; npm start',
    stats: 'Node 24 • Native SQLite'
  },
  {
    id: 'openbot-qoder',
    name: 'OpenBot & Qoder Autonomous Agent',
    category: 'Epistemic Science',
    tagline: 'Hệ thống Tác tử Tự động hóa & Khung Thực thi Lập trình Độc lập',
    drivePath: 'D:\\openbot',
    status: 'Active Knowledge',
    techStack: ['Python', 'LLM Agent Framework', 'AsyncIO', 'CLI Tools'],
    keyFeatures: [
      'Thực thi các tác vụ lập trình độc lập qua lời nhắc (autonomous coding execution)',
      'Tích hợp công cụ shell an toàn và phân tích ngữ cảnh file',
      'Cộng tác đồng bộ với dự án Qoder (D:\\Qoder)'
    ],
    quickStartCommand: 'cd D:\\openbot; python run.py',
    stats: 'Autonomous Agents • Task Runner'
  }
];

export function EcosystemHub() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedCommandId, setCopiedCommandId] = useState<string | null>(null);

  const copyCommand = async (cmd: string, id: string) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedCommandId(id);
      toast.success('Đã sao chép lệnh chạy vào bộ nhớ tạm!');
      setTimeout(() => setCopiedCommandId(null), 2000);
    } catch {
      toast.error('Không thể sao chép lệnh.');
    }
  };

  const getStatusBadge = (status: EcosystemProject['status']) => {
    switch (status) {
      case 'Production Ready':
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
      case 'Fully Verified':
        return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400';
      case 'Active Knowledge':
        return 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400';
      default:
        return 'border-border bg-bg text-text-muted';
    }
  };

  const categories = [
    { id: 'all', label: 'Tất cả Dự án Ổ D' },
    { id: 'Epistemic Science', label: '🔬 Khoa học & Nhận thức' },
    { id: 'Document Automation', label: '📄 Văn thư & Báo cáo' },
    { id: 'Knowledge Base', label: '📚 Kho Tri thức 10 Sách' },
    { id: 'OSINT & Scraping', label: '🌐 Telegram & Bóc tách' },
    { id: 'Productivity', label: '⏱️ Hiệu suất & Focus' },
  ];

  const filteredProjects = selectedCategory === 'all'
    ? ECOSYSTEM_PROJECTS
    : ECOSYSTEM_PROJECTS.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Category Filter with Mobile Horizontal Scroll */}
      <div className="rounded-2xl p-6 bg-bg-surface border border-border space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted block">
              Danh mục dự án thực chiến
            </span>
            <h3 className="font-bold text-text text-base sm:text-lg">
              Hệ sinh thái mã nguồn &amp; công cụ tại máy trạm
            </h3>
          </div>
          <span className="text-xs font-mono text-text-muted">
            {filteredProjects.length} dự án khả dụng
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === c.id
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-bg border border-border text-text-muted hover:text-text hover:border-accent/40'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="rounded-2xl p-6 bg-bg-surface border border-border hover:border-accent/50 transition-all flex flex-col justify-between group shadow-xs hover:shadow-card-hover"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent/10 text-accent mb-1.5 inline-block border border-accent/20">
                    {project.category}
                  </span>
                  <h3 className="font-bold text-lg sm:text-xl text-text group-hover:text-accent transition-colors">
                    {project.name}
                  </h3>
                </div>
                <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full border whitespace-nowrap font-medium ${getStatusBadge(project.status)}`}>
                  {project.status}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-text-muted mb-4 font-medium leading-relaxed">
                {project.tagline}
              </p>

              {/* Local Path & Stats Badge */}
              <div className="p-3.5 rounded-xl bg-bg border border-border space-y-1.5 mb-4 text-xs font-mono">
                <div className="flex justify-between items-center text-text-muted gap-2">
                  <span className="flex items-center gap-1.5 shrink-0">
                    <HardDrive className="w-3.5 h-3.5 text-accent" />
                    Đường dẫn ổ D:
                  </span>
                  <strong className="text-text truncate">{project.drivePath}</strong>
                </div>
                <div className="flex justify-between items-center text-text-muted gap-2">
                  <span className="flex items-center gap-1.5 shrink-0">
                    <Activity className="w-3.5 h-3.5 text-emerald-500" />
                    Chỉ số thực tế:
                  </span>
                  <span className="text-emerald-500 font-semibold truncate">{project.stats}</span>
                </div>
              </div>

              {/* Key Features */}
              <div className="space-y-1.5 mb-4">
                <span className="text-[11px] font-semibold uppercase text-text block">Tính năng nổi bật:</span>
                <ul className="space-y-1.5">
                  {project.keyFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-text-muted leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.techStack.map((tech, idx) => (
                  <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-bg border border-border/80 text-text-muted">
                    {tech}
                  </span>
                ))}
              </div>

              {/* CLI Execution Command with Copy Button */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
                    Lệnh chạy kiểm thử / khởi động:
                  </span>
                  <button
                    type="button"
                    onClick={() => copyCommand(project.quickStartCommand, project.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-accent hover:text-accent-hover transition-colors"
                    aria-label={`Sao chép lệnh cho ${project.name}`}
                  >
                    {copiedCommandId === project.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500 animate-in zoom-in" />
                        <span className="text-emerald-500">Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Sao chép lệnh</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="relative group/cli">
                  <pre className="p-3 rounded-xl bg-bg border border-border text-[11px] font-mono text-accent overflow-x-auto select-all leading-relaxed">
                    {project.quickStartCommand}
                  </pre>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-accent hover:underline flex items-center gap-1"
                >
                  <span>Mã nguồn GitHub</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="text-text-muted font-mono">Dự án Nội bộ máy trạm</span>
              )}

              <span className="text-[11px] text-text-muted font-mono">
                Windows 11 Local-First
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
