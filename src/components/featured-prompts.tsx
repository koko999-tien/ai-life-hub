'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Copy, Check, ExternalLink, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { resolveTagLabel } from '@/lib/constants';

interface Prompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  audience: 'everyday' | 'technical';
  tags: string[];
  useCase: string;
}

const featuredPrompts: Prompt[] = [
  {
    id: 'prompt-1',
    title: 'Soạn Email Công Việc & Đàm Phán Lịch Sự',
    description: 'Tạo email trao đổi công việc chuyên nghiệp, từ chối khéo léo hoặc đề xuất gia hạn tiến độ mà vẫn giữ hòa khí',
    prompt: `Bạn là một chuyên gia truyền thông doanh nghiệp với 10 năm kinh nghiệm.
Hãy giúp tôi soạn một email công việc chuyên nghiệp bằng tiếng Việt:

- Người nhận: {nguoi_nhan} (ví dụ: Đối tác, Trưởng phòng, Khách hàng)
- Bối cảnh: {boi_canh} (ví dụ: Cần xin dời hạn nộp báo cáo thêm 2 ngày do đối tác cập nhật số liệu mới)
- Mục tiêu chính: {muc_tieu} (ví dụ: Thể hiện trách nhiệm, nêu rõ lý do chính đáng và đề xuất giải pháp thay thế)
- Giọng văn: Lịch sự, trang trọng, chân thành và cầu thị.

Yêu cầu định dạng:
1. Dòng tiêu đề email ngắn gọn, rõ ý.
2. Lời chào và mở đầu súc tích.
3. Nội dung chính: cập nhật tiến độ hiện tại, nêu lý do điều chỉnh và cam kết mốc thời gian mới.
4. Lời kết và chữ ký mẫu.`,
    category: 'Công việc & Văn phòng',
    audience: 'everyday',
    tags: ['email-cong-so', 'giao-tiep', 'kem-vi-du-mau'],
    useCase: 'Soạn email xin phép, từ chối hoặc đàm phán hợp tác',
  },
  {
    id: 'prompt-2',
    title: 'Tóm Tắt Báo Cáo & Trích Xuất Dữ Liệu Cốt Lõi',
    description: 'Chắt lọc báo cáo dài thành 5 điểm then chốt, bảng số liệu tài chính và hành động cần triển khai ngay',
    prompt: `Bạn là trợ lý phân tích dữ liệu và điều hành cấp cao.
Hãy đọc kỹ nội dung tài liệu sau đây:
"""
{noi_dung_tai_lieu}
"""

Nhiệm vụ của bạn:
1. Tóm tắt tổng quan cho lãnh đạo: Tối đa 3 câu tóm lược vấn đề mấu chốt.
2. 5 Phát hiện quan trọng nhất: Mỗi phát hiện gồm số liệu định lượng và ý nghĩa thực tế.
3. Bảng phân tích rủi ro & cơ hội: Liệt kê dạng bảng có phân loại mức độ (Cao / Trung bình / Thấp).
4. Danh sách 3 việc cần làm ngay kèm người chịu trách nhiệm gợi ý.`,
    category: 'Phân tích & Quản lý',
    audience: 'everyday',
    tags: ['tom-tat-van-ban', 'bao-cao', 'ra-quyet-dinh'],
    useCase: 'Đọc nhanh hợp đồng, biên bản họp và tài liệu tài chính 20 trang',
  },
  {
    id: 'prompt-3',
    title: 'Lập Kế Hoạch Tài Chính Cá Nhân & Quản Lý Chi Tiêu',
    description: 'Phân bổ ngân sách hàng tháng theo quy tắc 50/30/20, tính toán quỹ dự phòng và lộ trình tiết kiệm',
    prompt: `Bạn là chuyên gia tư vấn tài chính cá nhân độc lập.
Tôi có các thông số tài chính sau:
- Thu nhập cố định mỗi tháng: {thu_nhap} VNĐ
- Chi phí thiết yếu cố định (tiền nhà, ăn uống, sinh hoạt): {chi_phi_thiet_yeu} VNĐ
- Mục tiêu tài chính trong 1 năm: {muc_tieu} (ví dụ: Tiết kiệm 100 triệu, trả dứt điểm khoản vay)

Hãy thiết lập cho tôi:
1. Bảng phân bổ dòng tiền chi tiết theo tỷ lệ 50/30/20 phù hợp với mức sống tại Việt Nam.
2. Kế hoạch xây dựng quỹ dự phòng khẩn cấp đủ dùng trong 6 tháng.
3. 3 gợi ý thực tế để cắt giảm các khoản chi lãng phí mà không làm giảm chất lượng sống.`,
    category: 'Tài chính Cá nhân',
    audience: 'everyday',
    tags: ['tai-chinh', 'ngan-sach', 'lap-ke-hoach'],
    useCase: 'Quản lý chi tiêu gia đình và tích lũy đầu tư an toàn',
  },
  {
    id: 'prompt-4',
    title: 'Sáng Tạo Nội Dung & Chuyển Đổi Đa Kênh',
    description: 'Chuyển hóa 1 ý tưởng cốt lõi thành bài viết Facebook, chuỗi bài ngắn trên mạng xã hội và kịch bản video',
    prompt: `Bạn là Chuyên gia Chiến lược Nội dung.
Từ chủ đề hoặc nội dung nguồn sau:
"{chu_de_nguon}"

Hãy chuyển hóa thành 3 định dạng truyền thông chất lượng cao:
1. Bài viết mạng xã hội (Facebook/LinkedIn): Có câu mở đầu thu hút sự chú ý, 3 bài học thực tế và lời kêu gọi người đọc tương tác.
2. Chuỗi thông điệp ngắn (5 bài đăng súc tích): Mỗi bài làm nổi bật một góc nhìn độc đáo.
3. Kịch bản video ngắn (60 giây): Gồm phân cảnh thị giác, lời thoại người dẫn và hiệu ứng chữ nhấn mạnh.`,
    category: 'Tiếp thị & Sáng tạo',
    audience: 'everyday',
    tags: ['sang-tao-noi-dung', 'truyen-thong', 'da-kenh'],
    useCase: 'Xây dựng thương hiệu cá nhân và nội dung doanh nghiệp',
  },
  {
    id: 'prompt-5',
    title: 'Phân Tích & Giải Quyết Bài Toán Khó Từng Bước',
    description: 'Kích hoạt năng lực tư duy logic tuần tự của AI để giải quyết bài toán phức tạp, kinh tế hoặc phân tích lỗi',
    prompt: `Hãy giải quyết bài toán sau theo trình tự suy luận logic từng bước:

Bài toán: {bai_toan}

Quy trình suy luận bắt buộc:
1. Bước 1: Xác định dữ kiện đã biết, điều kiện biên và biến số cần tìm.
2. Bước 2: Liệt kê các giả định logic và nguyên lý áp dụng.
3. Bước 3: Diễn giải từng bước tính toán hoặc suy luận trung gian rõ ràng.
4. Bước 4: Tự kiểm chứng lại kết quả với dữ kiện thực tế để loại trừ sai sót.
5. Bước 5: Đưa ra kết luận tối ưu và giải pháp khả thi nhất.`,
    category: 'Tư duy & Kỹ năng AI',
    audience: 'technical',
    tags: ['suy-luan-tung-buoc', 'logic', 'giai-quyet-van-de'],
    useCase: 'Giải toán kinh tế, tối ưu hóa quy trình và gỡ lỗi hệ thống',
  },
  {
    id: 'prompt-6',
    title: 'Thiết Lập Vai Trò & Nguyên Tắc Hoạt Động Cho Trợ Lý AI',
    description: 'Tạo chỉ dẫn hệ thống (System Prompt) có cấu trúc phân đoạn rõ ràng, kèm nguyên tắc an toàn chống trả lời sai lệch',
    prompt: `Hãy đóng vai trò chuyên gia thiết kế chỉ dẫn AI.
Nhiệm vụ: Hãy tạo một bản chỉ dẫn hệ thống (System Prompt — quy tắc nền tảng điều khiển trợ lý AI) cho công việc sau:
Nhiệm vụ của trợ lý: {nhiem_vu_tro_ly}

Cấu trúc chỉ dẫn cần sinh ra:
1. Vai trò (<vai_tro>): Định danh chuyên môn và phong cách phản hồi.
2. Nhiệm vụ (<nhiem_vu>): Mục tiêu cốt lõi và phạm vi công việc được phép xử lý.
3. Nguyên tắc an toàn (<nguyen_tac>): Chỉ trả lời đúng sự thật, không tự suy diễn khi thiếu dữ liệu, từ chối câu hỏi ngoài phạm vi.
4. Định dạng đầu ra (<dinh_dang>): Quy chuẩn trình bày câu trả lời (tiêu đề rõ ràng, gạch đầu dòng dễ đọc).
5. Ví dụ mẫu (<vi_du>): Cung cấp 1 ví dụ minh họa đầu vào và đầu ra thực tế.`,
    category: 'Kỹ thuật & Trợ lý AI',
    audience: 'technical',
    tags: ['chi-dan-he-thong', 'nguyen-tac-an-toan', 'ky-thuat'],
    useCase: 'Tạo trợ lý AI chuyên môn hóa cho doanh nghiệp và ứng dụng',
  },
  {
    id: 'prompt-7',
    title: 'Đánh Giá Mã Nguồn & Tối Ưu Hiệu Năng',
    description: 'Rà soát mã nguồn chuyên sâu: phát hiện lỗi bảo mật tiềm ẩn, tối ưu tốc độ xử lý và viết lại mã sạch',
    prompt: `Bạn là Kỹ sư Trưởng kiêm Chuyên gia Kiểm định Bảo mật Mã nguồn.
Hãy phân tích đoạn mã sau:
\`\`\`{ngon_ngu}
{ma_nguon}
\`\`\`

Báo cáo phân tích gồm 4 phần:
1. Lỗ hổng bảo mật & Rủi ro rò rỉ dữ liệu (lỗ hổng truy vấn dữ liệu, chèn mã độc giao diện, tràn bộ nhớ).
2. Đánh giá hiệu năng (tốc độ xử lý và mức tiêu tốn bộ nhớ khi dữ liệu lớn).
3. Các điểm cần cải thiện về cấu trúc mã sạch, tính dễ đọc và dễ bảo trì về lâu dài.
4. Bản vá hoàn chỉnh: Cung cấp đoạn mã đã sửa đổi kèm chú thích chi tiết lý do.`,
    category: 'Lập trình & Kỹ thuật',
    audience: 'technical',
    tags: ['kiem-tra-code', 'bao-mat', 'toi-uu-hieu-nang'],
    useCase: 'Kiểm duyệt mã nguồn trước khi triển khai thực tế',
  },
  {
    id: 'prompt-8',
    title: 'Thiết Kế Lộ Trình Tự Học Cá Nhân Hóa',
    description: 'Xây dựng kế hoạch học tập theo từng tuần, phù hợp với quỹ thời gian thực tế và nền tảng ban đầu',
    prompt: `Bạn là Giảng viên Đại học và Chuyên gia Đào tạo nghề nghiệp.
Tôi muốn học chủ đề: {chu_de} (ví dụ: Lập trình Python, Quản lý tài chính cá nhân, Thiết kế giao diện)
- Nền tảng hiện tại của tôi: {nen_tang} (ví dụ: Mới bắt đầu, chưa có kinh nghiệm)
- Quỹ thời gian có thể dành ra: {so_gio} giờ/tuần trong vòng {so_tuan} tuần.

Hãy xây dựng lộ trình học tập cá nhân hóa:
1. Lộ trình chi tiết từng tuần: Khái niệm cốt lõi cần nắm, bài tập thực hành cụ thể.
2. 2 Dự án thực hành tổng hợp để hoàn thành và đưa vào hồ sơ năng lực.
3. Danh sách tài nguyên miễn phí tốt nhất: Sách, khóa học mở, tài liệu tiếng Việt và quốc tế.`,
    category: 'Học tập & Giáo dục',
    audience: 'everyday',
    tags: ['lo-trinh-hoc', 'tu-hoc', 'nang-cao-ky-nang'],
    useCase: 'Tự nâng cao kỹ năng nghề nghiệp và học công nghệ mới',
  },
];

export function FeaturedPrompts() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [audienceFilter, setAudienceFilter] = useState<'everyday' | 'technical' | 'all'>('everyday');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const visiblePrompts = featuredPrompts.filter((p) =>
    audienceFilter === 'all' ? true : p.audience === audienceFilter
  );

  const handleFilterChange = (filter: 'everyday' | 'technical' | 'all') => {
    setAudienceFilter(filter);
    scrollRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 380;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const copyPrompt = async (prompt: string, id: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedId(id);
      toast.success('Đã sao chép câu lệnh vào bộ nhớ tạm!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = prompt;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopiedId(id);
        toast.success('Đã sao chép câu lệnh vào bộ nhớ tạm!');
        setTimeout(() => setCopiedId(null), 2000);
      } catch {
        toast.error('Không thể sao chép câu lệnh.');
      }
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-bg-surface/30 border-b border-border/50" aria-labelledby="prompts-heading">
      <div className="container mx-auto px-section-x">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mẫu Câu Lệnh Thực Chiến</span>
            </div>
            <h2 id="prompts-heading" className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-text tracking-tight">
              Mẫu Câu Lệnh Tuyển Chọn Dùng Ngay
            </h2>
            <p className="text-text-muted mt-2 text-sm sm:text-base max-w-xl">
              Được chuẩn hóa với cấu trúc rõ ràng, kèm ví dụ thực tế và hướng dẫn suy luận từng bước — sao chép dùng trực tiếp trên ChatGPT, Claude hoặc Gemini.
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <Link
              href="/prompts"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-hover transition-colors mr-2"
            >
              <span>Xem tất cả 80+ câu lệnh</span>
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </Link>

            <button
              type="button"
              onClick={() => scroll('left')}
              className="p-2.5 rounded-xl border border-border bg-bg-surface hover:bg-hover text-text-muted hover:text-text transition-all shadow-2xs active:scale-95"
              aria-label="Cuộn trái"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="p-2.5 rounded-xl border border-border bg-bg-surface hover:bg-hover text-text-muted hover:text-text transition-all shadow-2xs active:scale-95"
              aria-label="Cuộn phải"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Audience Filter Tabs */}
        <div
          className="flex flex-wrap items-center gap-2 mb-8"
          role="tablist"
          aria-label="Lọc mẫu câu lệnh theo đối tượng"
        >
          {[
            { id: 'everyday' as const, label: 'Dành cho Mọi người (5)' },
            { id: 'technical' as const, label: 'Dành cho Kỹ thuật (3)' },
            { id: 'all' as const, label: 'Tất cả (8)' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={audienceFilter === tab.id}
              onClick={() => handleFilterChange(tab.id)}
              className={cn(
                'px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all border',
                audienceFilter === tab.id
                  ? 'bg-accent text-white border-accent shadow-2xs'
                  : 'bg-bg-surface text-text-muted border-border hover:text-text hover:bg-hover'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Carousel Container with Native Smooth Snap */}
        <div className="relative -mx-section-x px-section-x">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-6 snap-x snap-mandatory scroll-smooth"
            role="list"
            aria-label="Danh sách mẫu câu lệnh tuyển chọn"
          >
            {visiblePrompts.map((prompt) => {
              const isExpanded = expandedId === prompt.id;
              return (
                <article
                  key={prompt.id}
                  className="shrink-0 w-[300px] sm:w-[350px] md:w-[380px] snap-start flex flex-col rounded-2xl border border-border bg-bg-surface p-6 shadow-2xs hover:border-accent/40 hover:shadow-card-hover transition-all group"
                  role="listitem"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-500 border border-brand-500/20">
                      {prompt.category}
                    </span>
                    <span className="text-[11px] text-text-muted font-medium line-clamp-1 max-w-[140px] text-right">
                      {prompt.useCase}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base sm:text-lg text-text mb-2 group-hover:text-accent transition-colors">
                    {prompt.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-muted mb-4 line-clamp-2 flex-1 leading-relaxed">
                    {prompt.description}
                  </p>

                  {/* Prompt Preview Box */}
                  <div className="mb-4 rounded-xl border border-border bg-bg/80 p-3">
                    <div
                      className={cn(
                        'font-mono text-[11px] text-text-muted leading-relaxed whitespace-pre-line',
                        isExpanded ? 'max-h-56 overflow-y-auto pr-1' : 'line-clamp-3'
                      )}
                    >
                      {prompt.prompt}
                    </div>
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : prompt.id)}
                      className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-accent hover:text-accent-hover transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          <span>Thu gọn</span>
                          <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                        </>
                      ) : (
                        <>
                          <span>Xem đầy đủ</span>
                          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {prompt.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-bg text-text-muted border border-border text-[11px]">
                        {`#${resolveTagLabel(tag)}`}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border mt-auto">
                    <button
                      type="button"
                      onClick={() => copyPrompt(prompt.prompt, prompt.id)}
                      className={cn(
                        'w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all shadow-2xs',
                        copiedId === prompt.id
                          ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                          : 'bg-accent/10 hover:bg-accent text-accent hover:text-white border border-accent/30'
                      )}
                      aria-label={copiedId === prompt.id ? 'Đã sao chép câu lệnh' : `Sao chép câu lệnh: ${prompt.title}`}
                    >
                      {copiedId === prompt.id ? (
                        <>
                          <Check className="h-4 w-4" aria-hidden="true" />
                          <span>Đã sao chép câu lệnh!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" aria-hidden="true" />
                          <span>Sao chép câu lệnh</span>
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/prompts"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
          >
            <span>Xem tất cả 80+ câu lệnh</span>
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
