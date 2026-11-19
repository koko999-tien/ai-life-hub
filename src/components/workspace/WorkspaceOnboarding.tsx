'use client';

import { useEffect, useState } from 'react';
import { MousePointerClick, ClipboardPaste, Play, X } from 'lucide-react';

const STORAGE_KEY = 'ai-life-hub-workspace-onboarding-done';

const STEPS = [
  {
    icon: MousePointerClick,
    title: 'Bước 1 — Chọn việc cần làm',
    desc: 'Email, tóm tắt cuộc họp hay phân tích tài liệu — chọn 1 việc ở phía trên.',
  },
  {
    icon: ClipboardPaste,
    title: 'Bước 2 — Dán nội dung vào ô',
    desc: 'Chỉ cần dán ý chính hoặc bản nháp của bạn. Chưa có sẵn thì bấm "Điền ví dụ mẫu".',
  },
  {
    icon: Play,
    title: 'Bước 3 — Bấm "Tạo ngay"',
    desc: 'AI sẽ tạo kết quả cho bạn. Xong thì sao chép, chỉnh sửa hoặc lưu lại đều được.',
  },
];

export function WorkspaceOnboarding({ onFillSample }: { onFillSample: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Đọc localStorage sau khi mount để tránh lệch hydration giữa server/client.
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  if (!visible) {
    return null;
  }

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // Bỏ qua lỗi lưu cờ (ví dụ chế độ riêng tư): lần sau vẫn hiện lại.
    }
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Hướng dẫn nhanh cho người mới"
      className="mb-6 rounded-2xl border border-accent/30 bg-accent/5 p-4 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-sm sm:text-base font-bold text-text">
          Mới dùng lần đầu? Chỉ cần 3 bước là xong
        </h2>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Đóng hướng dẫn"
          className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-hover transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <ol className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <li key={step.title} className="flex items-start gap-2.5 rounded-xl border border-border bg-bg p-3">
              <span className="p-2 rounded-lg bg-accent/10 text-accent shrink-0">
                <Icon className="w-4 h-4" />
              </span>
              <span>
                <span className="block text-xs sm:text-sm font-bold text-text">{step.title}</span>
                <span className="block text-xs text-text-muted leading-relaxed mt-0.5">{step.desc}</span>
              </span>
            </li>
          );
        })}
      </ol>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            onFillSample();
            dismiss();
          }}
          className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-sm transition-colors"
        >
          Điền ví dụ mẫu để xem thử
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="px-4 py-2 rounded-xl border border-border bg-bg hover:border-accent text-xs font-semibold text-text transition-colors"
        >
          Đã hiểu, bắt đầu thôi
        </button>
      </div>
    </div>
  );
}
