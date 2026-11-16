'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Send, CheckCircle2, ArrowLeft, Bot, Database } from 'lucide-react';
import { Button, toast } from '@/components/ui';
import { submitCommunityPrompt, isSupabaseConfigured } from '@/lib/supabase/client';
import { CATEGORIES } from '@/lib/constants';

export default function SubmitPromptPage() {
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [categoryId, setCategoryId] = useState('prompt-engineering');
  const [targetService, setTargetService] = useState('chatgpt');
  const [description, setDescription] = useState('');
  const [template, setTemplate] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Auto-detect template variables like {{var}}
  const detectedVariables = Array.from(
    new Set((template.match(/\{\{([^}]+)\}\}/g) || []).map((m) => m.replace(/[{}]/g, '').trim()))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !template.trim() || !description.trim()) {
      toast.error('Vui lòng điền đầy đủ tiêu đề, mô tả và nội dung prompt.');
      return;
    }

    setIsSubmitting(true);
    try {
      const tags = tagsStr
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const res = await submitCommunityPrompt({
        title: title.trim(),
        description: description.trim(),
        template: template.trim(),
        categoryId,
        authorName: authorName.trim() || 'Thành viên cộng đồng',
        tags: tags.length ? tags : ['community', categoryId],
        targetService,
      });

      if (res?.error) {
        toast.error(`Lỗi: ${res.error.message || 'Không thể gửi prompt'}`);
      } else {
        toast.success('Gửi prompt thành công vào cơ sở dữ liệu Supabase!');
        setIsSuccess(true);
      }
    } catch (err: any) {
      toast.error('Lỗi khi gửi prompt.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Link
          href="/prompts"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại thư viện prompt
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 text-xs font-semibold mb-3">
            <Database className="h-3.5 w-3.5" />
            <span>Supabase Community Hub</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Đóng Góp Prompt Mới
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-base">
            Chia sẻ các prompt, agent templates và kỹ thuật bạn đã áp dụng hiệu quả để đóng góp vào thư viện kiến thức mở của cộng đồng.
          </p>
        </div>

        {isSuccess ? (
          <div className="p-8 sm:p-12 text-center rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
            <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Prompt của bạn đã được ghi nhận!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8 text-sm">
              Cảm ơn bạn đã đóng góp. Prompt đã được lưu vào hệ thống cơ sở dữ liệu Supabase và sẵn sàng cho cộng đồng sử dụng.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => { setIsSuccess(false); setTitle(''); setTemplate(''); setDescription(''); }}>
                Đóng góp thêm prompt khác
              </Button>
              <Button variant="outline" asChild>
                <Link href="/prompts">Xem tất cả prompt</Link>
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-5">
            {/* Form Fields */}
            <div className="lg:col-span-3 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Tiêu đề Prompt <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Senior Code Reviewer với phân tích bảo mật"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Tên tác giả / Nickname
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Tên của bạn hoặc ẩn danh"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Danh mục
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Tối ưu cho AI nào?
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'chatgpt', label: 'ChatGPT' },
                    { id: 'claude', label: 'Claude' },
                    { id: 'gemini', label: 'Gemini' },
                    { id: 'all', label: 'Tất cả' },
                  ].map((srv) => (
                    <button
                      type="button"
                      key={srv.id}
                      onClick={() => setTargetService(srv.id)}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                        targetService === srv.id
                          ? 'border-brand-600 bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400'
                          : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {srv.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Mô tả & Công dụng <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Giải thích ngắn gọn prompt này giải quyết bài toán gì và khi nào nên dùng..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                    Nội dung Prompt Template <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-gray-400">
                    Dùng <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">{'{{tên_biến}}'}</code> cho các ô điền
                  </span>
                </div>
                <textarea
                  required
                  rows={8}
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  placeholder="Bạn là một chuyên gia {{vai_trò}}... Hãy thực hiện nhiệm vụ: {{nhiệm_vụ}}..."
                  className="w-full font-mono text-xs px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Tags (phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  placeholder="code-review, gpt-4o, security, devops"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <Button type="submit" size="lg" disabled={isSubmitting} className="w-full gap-2">
                <Send className="h-4 w-4" />
                {isSubmitting ? 'Đang lưu vào Supabase...' : 'Gửi Prompt Lên Cộng Đồng'}
              </Button>
            </div>

            {/* Live Preview Panel */}
            <div className="lg:col-span-2">
              <div className="sticky top-28 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 p-6">
                <div className="flex items-center gap-2 mb-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <Sparkles className="h-4 w-4 text-brand-500" />
                  Xem Trước (Live Preview)
                </div>

                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm mb-4">
                  <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                    {categoryId}
                  </span>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mt-2">
                    {title || 'Tiêu đề Prompt'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {description || 'Mô tả prompt sẽ hiển thị ở đây...'}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-2">
                    Tác giả: {authorName || 'Ẩn danh'} • {targetService.toUpperCase()}
                  </p>
                </div>

                {detectedVariables.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Biến số tự động phát hiện ({detectedVariables.length}):
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {detectedVariables.map((v) => (
                        <span
                          key={v}
                          className="px-2 py-0.5 rounded text-[11px] font-mono bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-xl bg-gray-100 dark:bg-gray-950 p-3 font-mono text-[11px] text-gray-600 dark:text-gray-400 max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {template || '// Nội dung template sẽ hiển thị ở đây...'}
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
