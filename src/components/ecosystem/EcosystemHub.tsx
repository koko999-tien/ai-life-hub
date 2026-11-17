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
  HardDrive
} from 'lucide-react';

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
    status: 'Production Ready',
    techStack: ['Python', 'Telethon', 'Pyrogram', 'SQLite', 'Human-in-the-loop'],
    keyFeatures: [
      'Quét sâu toàn bộ lịch sử tin nhắn các kênh công nghệ, kỹ thuật, AI và lập trình',
      'Bóc tách liên kết GitHub, sách kỹ thuật PDF và công cụ nguồn mở',
      'Cơ chế kiểm duyệt an toàn Human-in-the-loop trước khi lưu trữ vào D:\\AI_Telegram_Downloads',
      'Đồng bộ siêu dữ liệu trực tiếp vào kho tri thức D:\\AI_Knowledge_Lab'
    ],
    quickStartCommand: 'cd D:\\Telegram_AI_Tool; python main.py',
    stats: 'Multi-Channel Crawl • HITL Safety'
  },
  {
    id: 'lofi-pomodoro',
    name: 'Lofi Pomodoro Focus Studio',
    category: 'Productivity',
    tagline: 'Không gian Tập trung Làm việc & Học tập Sâu kết hợp Âm nhạc Lofi',
    drivePath: 'D:\\lofi-pomodoro',
    status: 'Production Ready',
    techStack: ['React', 'Web Audio API', 'Tailwind CSS', 'LocalStorage'],
    keyFeatures: [
      'Bộ đếm thời gian Pomodoro tiêu chuẩn (25 phút tập trung / 5 phút nghỉ ngắn)',
      'Kho âm thanh Lofi thư giãn, tiếng mưa và white noise kích thích tập trung',
      'Giao diện tối giản tối ưu cho các phiên làm việc Deep Work'
    ],
    quickStartCommand: 'cd D:\\lofi-pomodoro; npm run dev',
    stats: 'Deep Work • Web Audio'
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
      {/* Category Filter */}
      <div className="card p-6 bg-bg-surface border-border flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="text-xs font-semibold uppercase text-text-muted block mb-1">
            Danh mục dự án thực chiến
          </span>
          <h3 className="font-bold text-text text-base">Hệ sinh thái mã nguồn & công cụ tại máy trạm</h3>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
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
            className="card p-6 bg-bg-surface border-border hover:border-accent/50 transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-accent/10 text-accent mb-1.5 inline-block">
                    {project.category}
                  </span>
                  <h3 className="font-bold text-xl text-text group-hover:text-accent transition-colors">
                    {project.name}
                  </h3>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 whitespace-nowrap">
                  {project.status}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-text-muted mb-4 font-medium leading-relaxed">
                {project.tagline}
              </p>

              {/* Local Path & Stats Badge */}
              <div className="p-3 rounded-xl bg-bg border border-border space-y-1.5 mb-4 text-xs font-mono">
                <div className="flex justify-between items-center text-text-muted">
                  <span className="flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-accent" />
                    Đường dẫn ổ D:
                  </span>
                  <strong className="text-text">{project.drivePath}</strong>
                </div>
                <div className="flex justify-between items-center text-text-muted">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    Chỉ số thực tế:
                  </span>
                  <span className="text-emerald-400 font-semibold">{project.stats}</span>
                </div>
              </div>

              {/* Key Features */}
              <div className="space-y-1.5 mb-4">
                <span className="text-[11px] font-semibold uppercase text-text">Tính năng nổi bật:</span>
                <ul className="space-y-1">
                  {project.keyFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-xs text-text-muted">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.techStack.map((tech, idx) => (
                  <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-bg border border-border/80 text-text-muted">
                    {tech}
                  </span>
                ))}
              </div>

              {/* CLI Execution Command */}
              <div className="mb-4">
                <span className="text-[10px] font-mono uppercase text-text-muted block mb-1">
                  Lệnh chạy kiểm thử / khởi động:
                </span>
                <pre className="p-2.5 rounded-lg bg-bg border border-border text-[11px] font-mono text-accent overflow-x-auto">
                  {project.quickStartCommand}
                </pre>
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
                  Mã nguồn GitHub <ExternalLink className="w-3.5 h-3.5" />
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
