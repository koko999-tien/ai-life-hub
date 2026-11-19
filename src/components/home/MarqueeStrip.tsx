'use client';

const CHIPS = [
  'Soạn email',
  'Tóm tắt họp',
  'Phân tích tài liệu',
  '80+ câu lệnh tiếng Việt',
  'Không cần biết code',
  'Builder Lab cho dev',
  'Chạy ngay trên trình duyệt',
  'Miễn phí bắt đầu',
];

/**
 * Dải chip từ khóa chạy ngang kiểu PeachWeb. Hai bản giống hệt nhau,
 * bản thứ hai ẩn với trình đọc màn hình để vòng lặp marquee liền mạch.
 * Dừng chạy khi prefers-reduced-motion (xem globals.css).
 */
export function MarqueeStrip() {
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-navy-950 py-4">
      <div className="animate-marquee flex w-max gap-3">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex gap-3"
            aria-hidden={copy === 1 ? true : undefined}
          >
            {CHIPS.map((chip) => (
              <span
                key={`${copy}-${chip}`}
                className="inline-flex items-center gap-2 rounded-full border border-aqua-400/30 bg-aqua-400/15 px-4 py-1.5 text-sm font-semibold whitespace-nowrap text-aqua-300"
              >
                {chip}
                <span className="text-aqua-400" aria-hidden="true">
                  ✦
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
