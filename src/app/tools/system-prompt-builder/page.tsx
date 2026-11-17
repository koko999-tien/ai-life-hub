import type { Metadata } from 'next';
import { SystemPromptBuilder } from '@/components/tools/SystemPromptBuilder';
import { Sparkles, Terminal, Sliders } from 'lucide-react';

export const metadata: Metadata = {
  title: 'System Prompt Studio & Generator 2026 | AI Life Hub',
  description: 'Trình tạo và tối ưu hóa System Prompt chuyên nghiệp chuẩn XML Tags, Few-Shot, Guardrails cho Claude 3.5, GPT-4o, DeepSeek R1.',
};

export default function SystemPromptBuilderPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-section-x">
        {/* Header */}
        <div className="max-w-4xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-4">
            <Terminal className="w-3.5 h-3.5" />
            <span>Meta-Prompt Engineering Suite</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text mb-4 tracking-tight">
            System Prompt Studio & Architect
          </h1>
          <p className="text-text-muted text-base sm:text-lg leading-relaxed">
            Thiết kế System Prompt chuẩn doanh nghiệp với cấu trúc XML Tags, định nghĩa vai trò (Identity), kiểm soát ranh giới ảo giác (Guardrails) và ví dụ mẫu Few-Shot giúp mô hình hoạt động ổn định và chính xác 100%.
          </p>
        </div>

        <SystemPromptBuilder />
      </div>
    </div>
  );
}
