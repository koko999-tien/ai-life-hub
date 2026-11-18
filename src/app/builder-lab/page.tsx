import { Metadata } from 'next';
import Link from 'next/link';
import {
  Terminal,
  Scale,
  Calculator,
  Sliders,
  Bot,
  Workflow,
  BookOpen,
  FileText,
  FolderGit2,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Cpu,
} from 'lucide-react';
import {
  MODEL_REGISTRY,
  REGISTRY_VERIFIED_DISPLAY,
  DEFAULT_USD_TO_VND,
  formatUsdPrice,
} from '@/lib/models/registry';

export const metadata: Metadata = {
  title: 'Builder Lab — Trung Tâm Kỹ Thuật & Phát Triển Ứng Dụng AI',
  description:
    'Bộ công cụ kỹ thuật xác thực cho lập trình viên và kỹ sư AI: so sánh mô hình, tính chi phí Token ra VNĐ, thiết kế System Prompt, 14 mẫu trợ lý AI và cẩm nang thực chiến.',
  alternates: {
    canonical: '/builder-lab',
  },
  openGraph: {
    title: 'Builder Lab — Trung Tâm Kỹ Thuật & Phát Triển Ứng Dụng AI | AI Life Hub',
    description:
      'Tra cứu thông số mô hình xác thực từ tài liệu gốc, ước tính ngân sách API và thiết kế kiến trúc trợ lý AI sẵn sàng đưa vào sản phẩm.',
    url: '/builder-lab',
    type: 'website',
  },
};

const BUILDER_TOOLS = [
  {
    title: 'Bảng So Sánh Mô Hình Xác Thực',
    href: '/compare',
    badge: `${MODEL_REGISTRY.filter((m) => m.status === 'stable').length} mô hình ổn định`,
    description:
      'Đối chiếu trực tiếp mã định danh API, cửa sổ ngữ cảnh, chi phí USD/1M token, trạng thái vòng đời (Ổn định / Thế hệ cũ / Đã ngừng) và điểm kiểm thử kèm nguồn gốc.',
    icon: Scale,
    primary: true,
  },
  {
    title: 'Máy Tính Chi Phí Token & Bộ Nhớ Đệm',
    href: '/tools/token-calculator',
    badge: 'Quy đổi USD & VNĐ',
    description:
      'Ước tính hóa đơn gọi API theo lượt, ngày và tháng từ sổ đăng ký mô hình dùng chung. Hỗ trợ nhập số liệu chính xác, tỷ lệ lưu đệm (Prompt Caching) và tự chỉnh tỷ giá VNĐ.',
    icon: Calculator,
    primary: true,
  },
  {
    title: 'Xưởng Thiết Kế Chỉ Dẫn Hệ Thống',
    href: '/tools/system-prompt-builder',
    badge: 'XML & Markdown',
    description:
      'Xây dựng chỉ dẫn hệ thống (System Prompt) phân tách rõ vai trò, mục tiêu, ràng buộc chống bịa đặt và ví dụ mẫu kèm ước tính độ dài token.',
    icon: Terminal,
    primary: true,
  },
  {
    title: '14 Mẫu Kiến Trúc Trợ Lý AI',
    href: '/agents',
    badge: 'Cấu hình sẵn',
    description:
      'Bộ mẫu trợ lý chuyên trách cho rà soát mã nguồn, phân tích nghiệp vụ, kiểm tra bảo mật và tự động hóa tác vụ nhiều bước.',
    icon: Bot,
    primary: false,
  },
  {
    title: 'Quy Trình Phối Hợp Đa Trợ Lý',
    href: '/workflows',
    badge: 'Điều phối luồng',
    description:
      'Sơ đồ tổ chức nhiều bước xử lý nối tiếp và kiểm tra chéo dành cho hệ thống phần mềm và tự động hóa doanh nghiệp.',
    icon: Workflow,
    primary: false,
  },
  {
    title: 'Cẩm Nang Kỹ Thuật Thực Chiến',
    href: '/playbooks',
    badge: 'Phương pháp chuẩn',
    description:
      'Hướng dẫn thiết kế đầu ra có cấu trúc, kiểm soát chi phí, giảm sai lệch thông tin và đánh giá chất lượng phản hồi AI.',
    icon: BookOpen,
    primary: false,
  },
  {
    title: 'Sổ Tay Tra Cứu Tham Số AI',
    href: '/cheatsheet',
    badge: 'Tra cứu nhanh',
    description:
      'Tổng hợp tham số nhiệt độ sinh từ (temperature), cấu trúc JSON, thẻ XML và bảng quy tắc viết chỉ dẫn ngắn gọn.',
    icon: FileText,
    primary: false,
  },
  {
    title: 'Tối Ưu Hóa Câu Lệnh',
    href: '/tools/prompt-optimizer',
    badge: '4 khung chuẩn',
    description:
      'Chuyển hóa yêu cầu thô thành cấu trúc chỉ dẫn rõ ràng để thử nghiệm nhanh trước khi đưa vào mã nguồn.',
    icon: Sliders,
    primary: false,
  },
  {
    title: 'Hệ Sinh Thái Dự Án Nghiên Cứu Mở',
    href: '/ecosystem',
    badge: '9 dự án tham khảo',
    description:
      'Tổng hợp các dự án mã nguồn mở, công cụ kiểm định và tài liệu kỹ thuật phục vụ cộng đồng phát triển AI.',
    icon: FolderGit2,
    primary: false,
  },
];

export default function BuilderLabPage() {
  const highlightModels = MODEL_REGISTRY.filter((m) => m.showInCompareDefault).slice(0, 6);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-12">
        {/* Hero Header */}
        <div className="rounded-3xl border border-brand-500/30 bg-gradient-to-br from-brand-500/10 via-bg-surface to-bg p-6 sm:p-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-600 dark:text-brand-400 text-xs font-semibold">
              <Cpu className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Trụ cột 3 • AI Builder Lab • Dữ liệu rà soát ngày {REGISTRY_VERIFIED_DISPLAY}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-text">
              Phòng Thí Nghiệm Kỹ Thuật &amp; Kiến Trúc AI
            </h1>
            <p className="text-base sm:text-lg text-text-muted leading-relaxed">
              Không gian dành riêng cho lập trình viên, kỹ sư AI và nhà sáng lập sản phẩm: mọi thông số ngữ cảnh, mã định danh API và biểu giá đều dùng chung một sổ đăng ký xác thực từ tài liệu gốc của hãng.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-sm transition-all"
              >
                <Scale className="w-4 h-4" />
                <span>Mở Bảng So Sánh Mô Hình</span>
              </Link>
              <Link
                href="/tools/token-calculator"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-bg hover:border-brand-500/50 text-text text-sm font-semibold transition-all"
              >
                <Calculator className="w-4 h-4 text-brand-500" />
                <span>Ước Tính Ngân Sách Token</span>
              </Link>
              <Link
                href="/workspace"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-accent/40 bg-accent/10 hover:bg-accent/20 text-accent text-sm font-semibold transition-all"
              >
                <span>Thử Thực Thi Qua API Thật</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <section aria-labelledby="builder-tools-heading">
          <div className="mb-6">
            <h2 id="builder-tools-heading" className="text-2xl font-display font-bold text-text">
              Bộ Công Cụ &amp; Tài Liệu Kỹ Sư AI
            </h2>
            <p className="text-sm text-text-muted mt-1">
              Đi thẳng tới công cụ tính toán, thiết kế chỉ dẫn hoặc mẫu kiến trúc bạn cần tích hợp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {BUILDER_TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={`group flex flex-col justify-between rounded-2xl border p-6 transition-all ${
                    tool.primary
                      ? 'border-brand-500/35 bg-bg-elevated hover:border-brand-500 shadow-sm'
                      : 'border-border bg-bg-surface hover:border-accent/50'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-500 border border-brand-500/20">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-bg border border-border text-text-muted">
                        {tool.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-text group-hover:text-brand-500 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-5 border-t border-border flex items-center justify-between text-xs font-semibold text-brand-600 dark:text-brand-400">
                    <span>Mở công cụ</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Quick Verified API Pricing Reference Snapshot */}
        <section
          aria-labelledby="verified-snapshot-heading"
          className="rounded-3xl border border-border bg-bg-elevated overflow-hidden shadow-sm"
        >
          <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 id="verified-snapshot-heading" className="text-lg font-bold text-text flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Bảng Tra Nhanh Mã API &amp; Đơn Giá Chuẩn (USD / 1.000.000 Token)
              </h2>
              <p className="text-xs text-text-muted mt-1">
                Đồng bộ trực tiếp từ sổ đăng ký mô hình ngày {REGISTRY_VERIFIED_DISPLAY} (tỷ giá dự toán mặc định:{' '}
                {DEFAULT_USD_TO_VND.toLocaleString('vi-VN')} VNĐ/USD).
              </p>
            </div>
            <Link
              href="/compare"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline shrink-0"
            >
              <span>Xem đầy đủ 16 mô hình &amp; nguồn kiểm thử</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-border bg-bg text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  <th className="py-3 px-5">Mô hình</th>
                  <th className="py-3 px-4">Mã định danh API</th>
                  <th className="py-3 px-4">Ngữ cảnh / Đầu ra</th>
                  <th className="py-3 px-4">Đầu vào / 1M</th>
                  <th className="py-3 px-4">Đầu ra / 1M</th>
                  <th className="py-3 px-5 text-right">Nguồn hãng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {highlightModels.map((m) => (
                  <tr key={m.id} className="hover:bg-bg/60">
                    <td className="py-3.5 px-5 font-bold text-text">{m.name}</td>
                    <td className="py-3.5 px-4 font-mono text-xs text-accent">{m.apiModelId}</td>
                    <td className="py-3.5 px-4 font-mono text-xs text-text-muted">
                      {m.contextWindowLabel} / {m.maxOutputLabel}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-text">
                      {formatUsdPrice(m.inputPricePer1M)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-text">
                      {formatUsdPrice(m.outputPricePer1M)}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <a
                        href={m.officialDocsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-brand-500 hover:underline"
                      >
                        <span>Tài liệu</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
