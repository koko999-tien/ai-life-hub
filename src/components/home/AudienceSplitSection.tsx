'use client';

import Link from 'next/link';
import {
  Sparkles,
  Terminal,
  Scale,
  Calculator,
  ArrowRight,
  CheckCircle2,
  Workflow,
  Play,
  Briefcase,
} from 'lucide-react';

export function AudienceSplitSection() {
  return (
    <section className="py-12 sm:py-16 border-y border-border/60 bg-linear-to-b from-bg to-bg-surface/50" aria-labelledby="audience-heading">
      <div className="container mx-auto px-section-x max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-semibold uppercase tracking-wider mb-3">
            Hai Lộ Trình Rõ Ràng
          </div>
          <h2 id="audience-heading" className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-text tracking-tight">
            Bạn muốn ứng dụng AI vào việc gì hôm nay?
          </h2>
          <p className="text-sm sm:text-base text-text-muted mt-3">
            Chọn đúng không gian làm việc theo vai trò của bạn để nhận kết quả ngay mà không bị ngợp bởi thông tin thừa.
          </p>
        </div>

        {/* 2-Column Split Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Audience A: Everyday users & professionals */}
          <div className="relative flex flex-col justify-between rounded-3xl border border-accent/30 bg-bg-surface/90 p-6 sm:p-8 shadow-lg shadow-accent/5 hover:border-accent/60 transition-all group">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center font-bold shadow-inner">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-accent uppercase tracking-wider">Không cần biết lập trình</span>
                  <h3 className="text-xl font-bold text-text">Dân Văn Phòng, Người Làm Tự Do &amp; Người Học</h3>
                </div>
              </div>

              <p className="text-sm text-text-muted leading-relaxed">
                Đi từ nhiệm vụ cụ thể đến sản phẩm hoàn chỉnh: soạn email đối tác, tóm tắt cuộc họp, phân tích tài liệu dài hoặc chọn từ 80 câu lệnh tiếng Việt phân loại sẵn.
              </p>

              <ul className="space-y-3 text-sm text-text">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>AI Workspace trực tuyến</strong>: Chạy 3 quy trình cốt lõi (Email, Biên bản họp, Phân tích tài liệu), chỉnh sửa và lưu lịch sử phiên làm việc.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>8 Nhóm công việc &amp; 80 mẫu câu lệnh</strong>: Biết rõ cần nhập thông tin gì và kết quả trả về ra sao trước khi bấm chạy.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Lưu trữ minh bạch &amp; kiểm soát dữ liệu</strong>: Đánh dấu câu lệnh yêu thích, tạo mẫu cá nhân và xóa dữ liệu 1 chạm bất kỳ lúc nào.</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-border flex flex-wrap items-center gap-3">
              <Link
                href="/workspace"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold shadow-sm hover:bg-accent-hover transition-all"
              >
                <Play className="w-4 h-4" />
                <span>Mở AI Workspace</span>
              </Link>
              <Link
                href="/ai-work"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-bg text-sm font-medium text-text hover:bg-hover transition-all"
              >
                <Briefcase className="w-4 h-4 text-accent" />
                <span>8 Nhóm Công Việc</span>
              </Link>
              <Link
                href="/prompts"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-bg text-sm font-medium text-text hover:bg-hover transition-all"
              >
                <span>Thư Viện 80 Câu Lệnh</span>
                <ArrowRight className="w-4 h-4 text-accent" />
              </Link>
            </div>
          </div>

          {/* Audience B: Developers & AI builders */}
          <div className="relative flex flex-col justify-between rounded-3xl border border-brand-500/30 bg-bg-surface/90 p-6 sm:p-8 shadow-lg shadow-brand-500/5 hover:border-brand-500/60 transition-all group">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/15 text-brand-500 flex items-center justify-center font-bold shadow-inner">
                  <Terminal className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-brand-500 uppercase tracking-wider">AI Builder Lab</span>
                  <h3 className="text-xl font-bold text-text">Lập Trình Viên, Kỹ Sư AI &amp; Nhà Sáng Lập</h3>
                </div>
              </div>

              <p className="text-sm text-text-muted leading-relaxed">
                Tra cứu thông số kỹ thuật có nguồn kiểm chứng, tính toán chi phí vận hành API sát thực tế và thiết kế kiến trúc chỉ dẫn hệ thống (System Prompt) cho sản phẩm phần mềm.
              </p>

              <ul className="space-y-3 text-sm text-text">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                  <span><strong>Sổ đăng ký mô hình xác thực</strong>: Đối chiếu mã API, ngữ cảnh, vòng đời hỗ trợ và điểm kiểm thử gốc của Claude Sonnet 4.6, GPT-4.1, Gemini 2.5 Pro, DeepSeek R1.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                  <span><strong>Máy tính Token &amp; Prompt Caching</strong>: Dự toán chi phí USD &amp; VNĐ làm tròn chuẩn xác kèm ghi chú giả định tỷ giá minh bạch.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                  <span><strong>Xưởng System Prompt &amp; 14 Mẫu Trợ lý AI</strong>: Xuất cấu trúc thẻ XML/Markdown kèm quy tắc kiểm soát an toàn đầu ra.</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-border flex flex-wrap items-center gap-3">
              <Link
                href="/builder-lab"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-semibold shadow-sm hover:bg-brand-600 transition-all"
              >
                <Terminal className="w-4 h-4" />
                <span>Vào Builder Lab</span>
              </Link>
              <Link
                href="/compare"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-bg text-sm font-medium text-text hover:bg-hover transition-all"
              >
                <Scale className="w-4 h-4 text-brand-500" />
                <span>So Sánh Mô Hình</span>
              </Link>
              <Link
                href="/tools/token-calculator"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-bg text-sm font-medium text-text hover:bg-hover transition-all"
              >
                <Calculator className="w-4 h-4 text-brand-500" />
                <span>Tính Chi Phí Token</span>
              </Link>
              <Link
                href="/agents"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-bg text-sm font-medium text-text hover:bg-hover transition-all"
              >
                <Workflow className="w-4 h-4 text-brand-500" />
                <span>14 Mẫu Trợ Lý</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
