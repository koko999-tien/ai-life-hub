'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, Mail, FileCheck2, FileSearch } from 'lucide-react';

const RESULTS = [
  {
    icon: Mail,
    href: '/workspace?workflow=email-assistant',
    chip: 'Trợ lý Email AI',
    chipClass: 'bg-peach-400/20 text-peach-300',
    title: 'Email xin gia hạn nộp báo cáo',
    sample:
      '“Kính gửi Anh/Chị, em xin dời thời hạn bàn giao thêm 02 ngày để đảm bảo số liệu chuẩn xác trước khi trình Ban Giám đốc…”',
    desc: 'Soạn, rút gọn hay đổi giọng văn — giữ đúng ý bạn, đúng văn phong công sở.',
  },
  {
    icon: FileCheck2,
    href: '/workspace?workflow=meeting-summary',
    chip: 'Tóm tắt Cuộc họp',
    chipClass: 'bg-emerald-500/20 text-emerald-300',
    title: 'Biên bản họp 45 phút thành 10 dòng',
    sample:
      '“Quyết định: chốt phương án A. Đầu việc: Minh gửi lại bảng giá trước thứ Sáu; Lan xác nhận lịch với đối tác…”',
    desc: 'Quyết định, đầu việc và người phụ trách tách rõ ràng, không còn phải đọc lại cả biên bản.',
  },
  {
    icon: FileSearch,
    href: '/workspace?workflow=document-analysis',
    chip: 'Phân tích Tài liệu',
    chipClass: 'bg-brand-500/20 text-brand-300',
    title: 'Hợp đồng 20 trang, hỏi gì cũng rõ',
    sample:
      '“Điều 5.2: bên B được quyền chấm dứt sớm nếu bên A chậm thanh toán quá 30 ngày. Rủi ro cần lưu ý: …”',
    desc: 'Trích xuất điểm chính và hỏi đáp bám sát nội dung tài liệu, có trích dẫn đoạn gốc.',
  },
];

/**
 * Lưới mẫu kết quả kiểu PeachWeb (gallery 9 ô mẫu của họ, gọn lại thành
 * 3 ô lớn): mỗi ô là một kết quả thật mà Workspace làm ra, bo góc lớn.
 */
export function ResultsGrid() {
  return (
    <section
      className="relative overflow-hidden bg-navy-950 py-16 text-white sm:py-20"
      aria-labelledby="ket-qua-heading"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <div className="peach-hero-bg absolute inset-0 opacity-60" />
      </div>

      <div className="container relative mx-auto px-section-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-widest text-aqua-300 uppercase">
            Kết quả thật
          </p>
          <h2
            id="ket-qua-heading"
            className="mt-2 font-display text-3xl leading-tight font-extrabold tracking-tight text-balance text-white sm:text-5xl"
          >
            Xem AI làm ra thứ bạn dùng được ngay
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/75">
            Không phải câu trả lời chung chung. Đây là dạng kết quả bạn nhận
            được khi bấm Tạo ngay.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
          {RESULTS.map((result, i) => {
            const Icon = result.icon;
            return (
              <motion.article
                key={result.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  delay: i * 0.1,
                  type: 'spring',
                  stiffness: 120,
                  damping: 16,
                }}
                className="glass-dark flex flex-col rounded-3xl p-6"
              >
                <span
                  className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${result.chipClass}`}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {result.chip}
                </span>
                <h3 className="mt-4 text-lg leading-snug font-bold text-white">
                  {result.title}
                </h3>
                <p className="mt-2 flex-1 rounded-2xl border border-white/10 bg-navy-950/60 p-3.5 text-sm leading-relaxed text-white/80">
                  {result.sample}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {result.desc}
                </p>
                <Link
                  href={result.href}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-aqua-300 transition-colors hover:text-white"
                >
                  Dùng mẫu này
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
