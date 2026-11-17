'use client';

import Link from 'next/link';
import { 
  Sparkles, 
  Briefcase, 
  GraduationCap, 
  Terminal, 
  Scale, 
  Layers, 
  Calculator, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  FileText,
  Workflow
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
            Không cần hiểu kỹ thuật sâu — Chọn đúng nhóm bên dưới để vào thẳng công cụ và kết quả bạn cần.
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
                    <span className="text-xs font-semibold text-accent uppercase tracking-wider">Dành cho mọi người</span>
                    <h3 className="text-xl font-bold text-text">Dân Văn Phòng, Freelancer &amp; Người Học</h3>
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
                  <span><strong>80+ Mẫu câu lệnh làm việc (Prompts)</strong>: Copy dùng ngay cho ChatGPT, Claude, Gemini không cần chỉnh sửa nhiều.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>16 Lĩnh vực thực tế</strong>: Soạn văn bản, viết email đối tác, marketing, bán hàng, quản lý thời gian Pomodoro.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Trắc nghiệm AI Quiz vui nhộn</strong>: Kiểm tra mức độ am hiểu AI và nhận mẹo dùng câu lệnh hiệu quả hơn.</span>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="pt-6 mt-6 border-t border-border flex flex-wrap items-center gap-3">
              <Link
                href="/prompts"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold shadow-sm hover:bg-accent-hover transition-all"
              >
                <span>Xem Mẫu Câu Lệnh (Prompts)</span>
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

          {/* Track 2: Lập trình viên, Kỹ sư & Builders */}
          <div className="relative flex flex-col justify-between rounded-3xl border border-brand-500/30 bg-bg-surface/90 p-6 sm:p-8 shadow-lg shadow-brand-500/5 hover:border-brand-500/60 transition-all group">
            <div className="space-y-6">
              {/* Badge & Title */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/15 text-brand-500 flex items-center justify-center font-bold shadow-inner">
                    <Terminal className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-brand-500 uppercase tracking-wider">Dành cho kỹ thuật</span>
                    <h3 className="text-xl font-bold text-text">Lập Trình Viên, Kỹ Sư &amp; Builders</h3>
                  </div>
                </div>
              </div>

              <p className="text-sm text-text-muted leading-relaxed">
                Bộ công cụ thực chiến để xây dựng phần mềm AI: tính chi phí token, so sánh các mô hình LLM, thiết kế System Prompt và kiến trúc Agent.
              </p>

              {/* Action features */}
              <ul className="space-y-3 text-sm text-text">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                  <span><strong>So sánh các dòng AI (Model Arena)</strong>: Đối đầu trực tiếp Claude 3.5, GPT-4o, DeepSeek R1, Gemini 2.0.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                  <span><strong>Tính tiền Token ra VNĐ</strong>: Dự toán chính xác chi phí API hàng tháng trước khi kết nối vào ứng dụng.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                  <span><strong>14 Bản thiết kế AI Agent (Blueprints)</strong>: Mẫu kiến trúc tự động hóa nhiều tác nhân sẵn sàng triển khai.</span>
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
                <span>Bảng Tính Tiền Token</span>
              </Link>
              <Link
                href="/agents"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-bg text-sm font-medium text-text hover:bg-hover transition-all"
              >
                <Workflow className="w-4 h-4 text-brand-500" />
                <span>Mẫu AI Agent</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
