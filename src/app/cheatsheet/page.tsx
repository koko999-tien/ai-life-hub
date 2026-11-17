import type { Metadata } from 'next';
import { AICheatsheet } from '@/components/cheatsheet/AICheatsheet';
import { BookOpen, Terminal } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Engineering & Prompt Cheatsheet 2026 | AI Life Hub',
  description: 'Sổ tay tra cứu nhanh các mẫu Prompt Engineering, cấu trúc RAG, JSON Schema, tham số LLM và bảo mật Guardrails 2026.',
};

export default function CheatsheetPage() {
  return (
    <div className="container mx-auto px-section-x py-12">
      <div className="max-w-4xl mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Sổ tay Lập trình Trí tuệ Nhân tạo</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text mb-4 tracking-tight">
          AI Engineering & Prompt Cheatsheet
        </h1>
        <p className="text-text-muted text-base sm:text-lg leading-relaxed">
          Tổng hợp nhanh các kỹ thuật cốt lõi: CoT, XML Delimiters, Few-Shot, Strict JSON Schema, Semantic Chunking cho RAG, và siêu tham số LLM sẵn sàng copy-paste cho dự án của bạn.
        </p>
      </div>

      <AICheatsheet />
    </div>
  );
}
