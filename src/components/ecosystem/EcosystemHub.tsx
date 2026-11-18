'use client';

import { useState } from 'react';
import {
  FolderGit2,
  ExternalLink,
  CheckCircle2,
  Activity,
  Copy,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

export interface EcosystemProject {
  id: string;
  name: string;
  category:
    | 'Kiểm chứng Khoa học'
    | 'Văn thư & Báo cáo'
    | 'Kho Tri thức'
    | 'Thu thập Tài nguyên'
    | 'Hiệu suất & Media'
    | 'Thực tế Ảo & 3D'
    | 'Thương mại Điện tử';
  tagline: string;
  repoPath: string;
  githubUrl?: string;
  status: 'Sẵn sàng sử dụng' | 'Đã kiểm thử toàn diện' | 'Kho tri thức hoạt động';
  techStack: string[];
  keyFeatures: string[];
  quickStartCommand: string;
  stats: string;
}

export const ECOSYSTEM_PROJECTS: EcosystemProject[] = [
  {
    id: 'reality-science',
    name: 'Reality Science (Nền Tảng Kiểm Chứng Khoa Học)',
    category: 'Kiểm chứng Khoa học',
    tagline: 'Hệ thống Kiểm định Giả thuyết Khoa học & Đối chiếu Định luật Bảo toàn Vật lý',
    repoPath: 'reality-science/',
    githubUrl: 'https://github.com/koko999-tien/reality-science',
    status: 'Đã kiểm thử toàn diện',
    techStack: ['Next.js 14', 'FastAPI', 'Celery', 'Redis', 'React Flow', 'PostgreSQL', 'Pytest'],
    keyFeatures: [
      'Kiểm tra Định luật Bảo toàn: Tự động đối chiếu bảo toàn năng lượng, xung lượng và điện tích',
      'Kiểm tra Đơn vị Đo lường: Đảm bảo tính đồng nhất của đơn vị vật lý trong mọi công thức',
      'Kiểm tra Trường hợp Biên: Đánh giá giới hạn toán học khi biến số tiến tới 0 và vô cùng',
      'Hàng đợi Xử lý Bất đồng bộ: Tách luồng tính toán nặng giúp hệ thống luôn phản hồi ổn định',
    ],
    quickStartCommand: 'cd reality-science && python -m pytest backend/tests/ -v',
    stats: 'Đạt 100% bài kiểm thử • Hoàn thành 4 giai đoạn',
  },
  {
    id: 'unidoc-studio',
    name: 'UniDoc Studio Vietnam',
    category: 'Văn thư & Báo cáo',
    tagline: 'Studio Tự động hóa Soạn thảo Báo cáo Word & Slide chuẩn Thể thức Hành chính Việt Nam',
    repoPath: 'unidoc-studio-vietnam/',
    githubUrl: 'https://github.com/koko999-tien/unidoc-studio-vietnam',
    status: 'Sẵn sàng sử dụng',
    techStack: ['Python', 'FastAPI', 'python-docx', 'python-pptx', 'React', 'TypeScript', 'Tailwind'],
    keyFeatures: [
      'Soạn thảo văn bản chuẩn thể thức kỹ thuật theo Nghị định 30/2020/NĐ-CP',
      'Tự động sinh dàn ý tờ trình, đề án, báo cáo tổng kết và dự toán kinh phí',
      'Xuất bản tệp tin Word (.docx) và Slide (.pptx) định dạng chuyên nghiệp',
      'Bộ kiểm thử tự động hóa 87 kịch bản toàn diện',
    ],
    quickStartCommand: 'cd unidoc-studio-vietnam && pytest tests/ -v',
    stats: '87 bài kiểm thử đạt • Xuất DOCX & PPTX',
  },
  {
    id: 'ai-knowledge-lab',
    name: 'AI Knowledge Lab & Database',
    category: 'Kho Tri thức',
    tagline: 'Kho Tri thức 10 Cẩm nang Kỹ thuật Thực chiến & Cơ sở Dữ liệu Nghiên cứu',
    repoPath: 'ai-knowledge-lab/',
    status: 'Kho tri thức hoạt động',
    techStack: ['SQLite', 'Python', 'Pandas', 'Markdown Playbooks', 'Vector Index'],
    keyFeatures: [
      '10 Cẩm nang Thực chiến biên soạn từ 10 công trình kỹ thuật kinh điển',
      'Cơ sở dữ liệu SQLite (13MB) lưu trữ hàng nghìn mục tri thức có cấu trúc',
      'Kho tài nguyên phân loại các dự án GitHub tinh hoa theo chuyên ngành',
      'Lộ trình đào tạo 6 vai trò: Kỹ sư AI, Khoa học Dữ liệu, Backend, DevOps, Kiểm thử, Game',
    ],
    quickStartCommand: 'cd ai-knowledge-lab/docs/playbooks && ls -la',
    stats: '10 cẩm nang • CSDL tri thức 13MB',
  },
  {
    id: 'telegram-ai-tool',
    name: 'Telegram AI Knowledge Harvester',
    category: 'Thu thập Tài nguyên',
    tagline: 'Hệ thống Tổng hợp Tri thức & Lưu trữ Tài nguyên Có Kiểm Duyệt từ Kênh Telegram',
    repoPath: 'telegram-ai-tool/',
    githubUrl: 'https://github.com/koko999-tien/Telegram_AI_Tool',
    status: 'Sẵn sàng sử dụng',
    techStack: ['Python', 'Telethon', 'Pyrogram', 'SQLite', 'Duyệt thủ công'],
    keyFeatures: [
      'Quét sâu toàn bộ lịch sử tin nhắn các kênh công nghệ, kỹ thuật, AI và lập trình',
      'Bóc tách liên kết GitHub, sách kỹ thuật PDF và công cụ nguồn mở',
      'Cơ chế kiểm duyệt an toàn (Human-in-the-loop) trước khi lưu trữ vào thư mục tài nguyên',
      'Đồng bộ siêu dữ liệu trực tiếp vào cơ sở dữ liệu tri thức chung',
    ],
    quickStartCommand: 'cd telegram-ai-tool && python -m pytest tests/ -v',
    stats: '800+ tài liệu • Đạt 100% kiểm thử',
  },
  {
    id: 'lofi-pomodoro',
    name: 'Lofi Pomodoro Focus Studio',
    category: 'Hiệu suất & Media',
    tagline: 'Không gian Tập trung Làm việc & Học tập Sâu kết hợp Âm nhạc Lofi',
    repoPath: 'lofi-pomodoro/',
    githubUrl: 'https://github.com/koko999-tien/lofi-pomodoro',
    status: 'Sẵn sàng sử dụng',
    techStack: ['HTML5', 'Vanilla JavaScript', 'Web Audio API', 'CSS3 Modern'],
    keyFeatures: [
      'Bộ đếm thời gian Pomodoro tiêu chuẩn (25 phút tập trung / 5 phút nghỉ ngắn / 15 phút nghỉ dài)',
      'Kho âm thanh Lofi thư giãn, tiếng mưa và tiếng ồn trắng giúp duy trì tập trung sâu',
      'Giao diện tối giản tối ưu cho các phiên làm việc không bị phân tâm',
    ],
    quickStartCommand: 'cd lofi-pomodoro && npx serve .',
    stats: 'Tập trung sâu • Âm thanh Web',
  },
  {
    id: 'tubeflux',
    name: 'Tubeflux Streaming Engine',
    category: 'Hiệu suất & Media',
    tagline: 'Nền tảng Lưu trữ & Phát Video Tự chủ Hiệu năng cao (Node.js 24 + SQLite)',
    repoPath: 'tubeflux/',
    githubUrl: 'https://github.com/koko999-tien/tubeflux',
    status: 'Sẵn sàng sử dụng',
    techStack: ['Node.js 24', 'Express', 'node:sqlite', 'FFmpeg', 'Vanilla JS'],
    keyFeatures: [
      'Hỗ trợ phát video phân đoạn (chunked range HTTP) cho tốc độ xem mượt mà',
      'Tự động trích xuất ảnh thu nhỏ và thông tin thời lượng qua FFmpeg',
      'Bảng điều khiển quản trị phân loại danh mục, từ khóa và bình luận',
    ],
    quickStartCommand: 'cd tubeflux && npm install && npm start',
    stats: 'Node.js 24 • CSDL SQLite tích hợp',
  },
  {
    id: 'luma-fashion',
    name: 'Luma Fashion Storefront & Admin',
    category: 'Thương mại Điện tử',
    tagline: 'Nền tảng Thương mại Điện tử Thời trang Trọn gói (Giao diện & Máy chủ) với Next.js + Prisma + Cổng Thanh toán Việt Nam',
    repoPath: 'luma-fashion/',
    githubUrl: 'https://github.com/koko999-tien/luma-fashion',
    status: 'Sẵn sàng sử dụng',
    techStack: ['Next.js 14', 'Prisma ORM', 'Tailwind CSS', 'MoMo', 'VNPay', 'ZaloPay', 'TypeScript'],
    keyFeatures: [
      'Giao diện cửa hàng hiện đại, giỏ hàng trượt ngang, lọc đa tiêu chí và trang thanh toán',
      'Tích hợp đầy đủ các cổng thanh toán nội địa: MoMo, VNPay, ZaloPay',
      'Bảng điều khiển quản trị: quản lý danh mục, bộ sưu tập, đơn hàng, mã giảm giá và báo cáo doanh thu',
      'Hệ thống đánh giá sản phẩm, danh sách yêu thích, thông báo email và phân quyền người dùng',
    ],
    quickStartCommand: 'cd luma-fashion && npm run dev',
    stats: 'Bán hàng Trọn gói • MoMo / VNPay',
  },
  {
    id: 'vr-game-dev',
    name: 'VR & Spatial Game Dev Studio',
    category: 'Thực tế Ảo & 3D',
    tagline: 'Môi trường Phát triển Game Thực tế Ảo Đa luồng (Chuẩn kính thực tế ảo OpenXR trên Godot 4 & trên trình duyệt WebXR Three.js)',
    repoPath: 'vr-game-dev/',
    githubUrl: 'https://github.com/koko999-tien/vr-game-dev',
    status: 'Đã kiểm thử toàn diện',
    techStack: ['Godot Engine 4.3', 'OpenXR', 'WebXR', 'Three.js r170', 'Vite', 'DirectX 12 / Vulkan'],
    keyFeatures: [
      'Hỗ trợ chuẩn kính thực tế ảo độc lập (OpenXR) kèm chế độ giả lập trên máy tính không cần kính',
      'Mô-đun thực tế ảo trên trình duyệt (WebXR) chạy trực tiếp trên máy tính và kính Meta Quest qua Three.js + Vite',
      'Hệ thống kịch bản tự động hóa kiểm thử trong quy trình tích hợp & triển khai tự động (CI/CD)',
      'Bộ tài liệu kiến trúc kỹ thuật và kịch bản tương tác vật lý 3D hoàn chỉnh',
    ],
    quickStartCommand: 'cd vr-game-dev && godot --path . --headless --quit',
    stats: 'Godot 4.3 • Thực tế ảo OpenXR & trên trình duyệt (WebXR)',
  },
  {
    id: 'openbot-qoder',
    name: 'OpenBot & Qoder Trợ Lý Tự Hành',
    category: 'Kiểm chứng Khoa học',
    tagline: 'Hệ thống Trợ lý Tự động hóa & Khung Thực thi Lập trình Độc lập',
    repoPath: 'openbot/',
    status: 'Kho tri thức hoạt động',
    techStack: ['Python', 'LLM Agent Framework', 'AsyncIO', 'CLI Tools'],
    keyFeatures: [
      'Thực thi các tác vụ lập trình độc lập qua yêu cầu ngôn ngữ tự nhiên',
      'Tích hợp công cụ dòng lệnh an toàn và phân tích ngữ cảnh tệp mã nguồn',
      'Cộng tác đồng bộ với mô-đun mở rộng Qoder',
    ],
    quickStartCommand: 'cd openbot && python run.py',
    stats: 'Trợ lý tự hành • Thực thi tác vụ',
  },
];

export function EcosystemHub() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedCommandId, setCopiedCommandId] = useState<string | null>(null);

  const copyCommand = async (cmd: string, id: string) => {
    try {
      await navigator.clipboard.writeText(cmd);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = cmd;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
      } catch {
        document.body.removeChild(textarea);
        toast.error('Không thể sao chép lệnh.');
        return;
      }
      document.body.removeChild(textarea);
    }
    setCopiedCommandId(id);
    toast.success('Đã sao chép lệnh chạy vào bộ nhớ tạm!');
    setTimeout(() => setCopiedCommandId(null), 2000);
  };

  const getStatusBadge = (status: EcosystemProject['status']) => {
    switch (status) {
      case 'Sẵn sàng sử dụng':
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
      case 'Đã kiểm thử toàn diện':
        return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400';
      case 'Kho tri thức hoạt động':
        return 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400';
      default:
        return 'border-border bg-bg text-text-muted';
    }
  };

  const categories = [
    { id: 'all', label: 'Tất cả Dự án' },
    { id: 'Kiểm chứng Khoa học', label: '🔬 Kiểm chứng Khoa học' },
    { id: 'Văn thư & Báo cáo', label: '📄 Văn thư & Báo cáo' },
    { id: 'Kho Tri thức', label: '📚 Kho Tri thức 10 Sách' },
    { id: 'Thu thập Tài nguyên', label: '🌐 Telegram & Tài nguyên' },
    { id: 'Hiệu suất & Media', label: '⏱️ Hiệu suất & Streaming' },
    { id: 'Thương mại Điện tử', label: '🛍️ Thương mại Điện tử' },
    { id: 'Thực tế Ảo & 3D', label: '🥽 Thực tế Ảo & 3D' },
  ];

  const filteredProjects = selectedCategory === 'all'
    ? ECOSYSTEM_PROJECTS
    : ECOSYSTEM_PROJECTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Category Filter with Mobile Horizontal Scroll */}
      <div className="rounded-2xl p-6 bg-bg-surface border border-border space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted block">
              Danh mục dự án thực chiến
            </span>
            <h2 className="font-bold text-text text-base sm:text-lg">
              Mã nguồn &amp; công cụ thực tế
            </h2>
          </div>
          <span className="text-xs font-mono text-text-muted">
            {filteredProjects.length} dự án khả dụng
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={selectedCategory === c.id}
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

              {/* Repo Path & Stats Badge */}
              <div className="p-3.5 rounded-xl bg-bg border border-border space-y-1.5 mb-4 text-xs font-mono">
                <div className="flex justify-between items-center text-text-muted gap-2">
                  <span className="flex items-center gap-1.5 shrink-0">
                    <FolderGit2 className="w-3.5 h-3.5 text-accent" />
                    Thư mục mã nguồn:
                  </span>
                  <strong className="text-text truncate">{project.repoPath}</strong>
                </div>
                <div className="flex justify-between items-center text-text-muted gap-2">
                  <span className="flex items-center gap-1.5 shrink-0">
                    <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Chỉ số thực tế:
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold truncate">{project.stats}</span>
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
                <span className="text-text-muted font-mono">Dự án nghiên cứu nội bộ</span>
              )}

              <span className="text-[11px] text-text-muted font-mono">
                Chạy độc lập đa nền tảng
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
