'use client';

import Link from 'next/link';
import {
  Sparkles,
  GraduationCap,
  Terminal,
  Scale,
  Calculator,
  ArrowRight,
  CheckCircle2,
  Workflow,
} from 'lucide-react';

export function AudienceSplitSection() {
  return (
    <section className="py-12 sm:py-16 border-y border-border/60 bg-gradient-to-b from-bg to-bg-surface/50" aria-labelledby="audience-heading">
      <div className="container mx-auto px-section-x max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-semibold uppercase tracking-wider mb-3">
            Chọn mục tiêu của bạn
          </div>
          <h2 id="audience-heading" className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-text tracking-tight">
            Bạn muốn ứng dụng AI vào việc gì hôm nay?
          </h2>
          <p className="text-sm sm:text-base text-text-muted mt-3">
            Dù bạn là nhân viên văn phòng mới làm quen hay kỹ sư đang xây dựng phần mềm AI — hãy chọn đúng nhóm để đi thẳng tới công cụ phù hợp.
          </p>
        </div>

        {/* 2-Column Split Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Track 1: Người đi làm, Học sinh & Người dùng thường */}
          <div className="relative flex flex-col justify-between rounded-3xl border border-accent/30 bg-bg-surface/90 p-6 sm:p-8 shadow-lg shadow-accent/5 hover:border-accent/60 transition-all group">
            <div className="space-y-6">
              {/* Badge & Title */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center font-bold shadow-inner">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-accent uppercase tracking-wider">Dùng ngay cho mọi người</span>
                    <h3 className="text-xl font-bold text-text">Dân Văn Phòng, Người Làm Tự Do &amp; Người Học</h3>
                  </div>
                </div>
              </div>

              <p className="text-sm text-text-muted leading-relaxed">
                Tăng tốc công việc hàng ngày, viết email, làm báo cáo, học ngoại ngữ và sáng tạo nội dung chỉ với vài câu lệnh tiếng Việt có sẵn.
              </p>

              {/* Action features */}
              <ul className="space-y-3 text-sm text-text">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>80+ Mẫu câu lệnh thực chiến</strong>: Sao chép và dán thẳng vào ChatGPT, Claude, Gemini không cần hiểu kỹ thuật.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>16 Lĩnh vực đời sống &amp; công việc</strong>: Viết email đối tác, làm báo cáo, tiếp thị, bán hàng, quản lý tài chính và thời gian.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Trắc nghiệm kiến thức AI trực quan</strong>: Tự kiểm tra mức độ thành thạo và nhận mẹo ra lệnh hiệu quả hơn.</span>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="pt-6 mt-6 border-t border-border flex flex-wrap items-center gap-3">
              <Link
                href="/prompts"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold shadow-sm hover:bg-accent-hover transition-all"
              >
                <span>Xem 80+ Mẫu Câu Lệnh</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/learn/quiz"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-bg text-sm font-medium text-text hover:bg-hover transition-all"
              >
                <GraduationCap className="w-4 h-4 text-accent" />
                <span>Làm Trắc Nghiệm AI</span>
              </Link>
            </div>
          </div>

          {/* Track 2: Lập trình viên & Kỹ thuật */}
          <div className="relative flex flex-col justify-between rounded-3xl border border-brand-500/30 bg-bg-surface/90 p-6 sm:p-8 shadow-lg shadow-brand-500/5 hover:border-brand-500/60 transition-all group">
            <div className="space-y-6">
              {/* Badge & Title */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/15 text-brand-500 flex items-center justify-center font-bold shadow-inner">
                    <Terminal className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-brand-500 uppercase tracking-wider">Khu vực chuyên sâu</span>
                    <h3 className="text-xl font-bold text-text">Lập Trình Viên &amp; Kỹ Thuật</h3>
                  </div>
                </div>
              </div>

              <p className="text-sm text-text-muted leading-relaxed">
                Bộ công cụ chuyên sâu để xây dựng ứng dụng AI: giải thích dễ hiểu về đơn vị chữ (token), so sánh các mô hình ngôn ngữ lớn (LLM), thiết lập chỉ dẫn hệ thống (System Prompt) và quy trình trợ lý tự động.
              </p>

              {/* Action features */}
              <ul className="space-y-3 text-sm text-text">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                  <span><strong>Bảng so sánh sức mạnh AI</strong>: Đối chiếu trực tiếp tốc độ, giá cước và thế mạnh của Claude 3.5, GPT-4o, DeepSeek R1, Gemini 2.0.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                  <span><strong>Bảng tính chi phí Token ra VNĐ</strong>: Quy đổi độ dài văn bản sang tiền Việt và ước tính ngân sách gọi AI hàng tháng.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                  <span><strong>14 Mẫu thiết kế Trợ lý AI tự động</strong>: Kiến trúc điều phối trợ lý xử lý công việc theo từng bước, sẵn sàng áp dụng.</span>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="pt-6 mt-6 border-t border-border flex flex-wrap items-center gap-3">
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-semibold shadow-sm hover:bg-brand-600 transition-all"
              >
                <Scale className="w-4 h-4" />
                <span>So Sánh Các Mô Hình</span>
              </Link>
              <Link
                href="/tools/token-calculator"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-bg text-sm font-medium text-text hover:bg-hover transition-all"
              >
                <Calculator className="w-4 h-4 text-brand-500" />
                <span>Bảng Tính Chi Phí AI</span>
              </Link>
              <Link
                href="/agents"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-bg text-sm font-medium text-text hover:bg-hover transition-all"
              >
                <Workflow className="w-4 h-4 text-brand-500" />
                <span>Mẫu Trợ Lý AI</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
