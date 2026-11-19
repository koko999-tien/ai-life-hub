import type { Metadata } from 'next';
import { SystemPromptBuilder } from '@/components/tools/SystemPromptBuilder';
import { Terminal } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tạo System Prompt cho dev',
  description: 'Công cụ thiết kế chỉ dẫn nền (System Prompt) có cấu trúc thẻ XML rõ ràng, quy tắc chống bịa đặt và ví dụ mẫu cho lập trình viên và người xây dựng trợ lý AI.',
  alternates: {
    canonical: '/tools/system-prompt-builder',
  },
  openGraph: {
    title: 'Tạo System Prompt cho dev | AI Life Hub',
    description: 'Thiết kế System Prompt (bộ chỉ dẫn nền cố định cho AI) với cấu trúc rõ ràng, quy tắc chống bịa đặt và ước tính chi phí ngay lập tức.',
    url: '/tools/system-prompt-builder',
    type: 'website',
  },
};

export default function SystemPromptBuilderPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-section-x">
        {/* Header */}
        <div className="max-w-4xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-4">
            <Terminal className="w-3.5 h-3.5" />
            <span>Dành cho Lập trình viên & Kỹ thuật</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text mb-4 tracking-tight">
            Tạo System Prompt cho dev
          </h1>
          <p className="text-text-muted text-base sm:text-lg leading-relaxed mb-4">
            Thiết kế System Prompt (bộ chỉ dẫn nền cố định giúp AI luôn giữ đúng vai trò, quy tắc và định dạng trả lời trong suốt cuộc trò chuyện) với cấu trúc thẻ XML rõ ràng và ví dụ minh họa.
          </p>
          <div className="rounded-xl border border-accent/25 bg-accent/5 px-4 py-3 text-sm text-text-muted">
            <strong className="text-text">Ghi chú cho người xây dựng AI:</strong> Bộ chỉ dẫn này thường được gắn vào mục cài đặt hệ thống khi tích hợp trợ lý AI vào chatbot, sản phẩm riêng hoặc Custom GPT.
          </div>
        </div>

        <SystemPromptBuilder />
      </div>
    </div>
  );
}
