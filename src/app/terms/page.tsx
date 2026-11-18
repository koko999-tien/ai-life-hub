import type { Metadata } from 'next';
import { FileText, AlertCircle, CheckCircle, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Điều khoản Dịch vụ',
  description:
    'Điều khoản sử dụng nền tảng và lưu ý trách nhiệm khi áp dụng kết quả từ AI tại AI Life Hub.',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Điều khoản Dịch vụ | AI Life Hub',
    description:
      'Điều khoản sử dụng nền tảng và lưu ý trách nhiệm khi áp dụng kết quả từ AI tại AI Life Hub.',
    url: '/terms',
    type: 'website',
  },
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-section-x pt-24 pb-16 max-w-4xl">
      <div className="mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
          <Scale className="w-3.5 h-3.5" />
          <span>Pháp lý &amp; Quy định</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-bold text-text tracking-tight">
          Điều khoản Dịch vụ
        </h1>
        <p className="text-text-muted text-sm sm:text-base">
          Cập nhật lần cuối: Ngày 17 tháng 11 năm 2026
        </p>
      </div>

      <div className="card p-8 bg-bg-surface border-border space-y-8 text-sm text-text-muted leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-accent" />
            1. Chấp thuận Điều khoản
          </h2>
          <p>
            Bằng việc truy cập hoặc sử dụng trang web AI Life Hub, bạn đồng ý tuân thủ toàn bộ các điều khoản được nêu tại văn bản này. Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng ngưng sử dụng dịch vụ.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-accent" />
            2. Lưu ý về kết quả do AI tạo ra
          </h2>
          <p>
            Các câu lệnh mẫu, hướng dẫn ứng dụng, mẫu thiết kế trợ lý AI và bảng ước tính chi phí trên AI Life Hub được thiết kế nhằm mục đích hướng dẫn, tham khảo và tối ưu hiệu suất công việc:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              Các hệ thống AI bên ngoài (như ChatGPT, Claude, DeepSeek, Gemini) đôi khi có thể tạo ra thông tin chưa chính xác hoặc thiếu ngữ cảnh thực tế.
            </li>
            <li>
              Người dùng có trách nhiệm kiểm tra, rà soát mã nguồn và xác minh lại nội dung trước khi đưa vào vận hành thực tế hoặc sử dụng cho các quyết định quan trọng về pháp lý, tài chính và y tế.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            3. Quyền sở hữu trí tuệ &amp; Đóng góp cộng đồng
          </h2>
          <p>
            Mã nguồn giao diện và tài liệu hướng dẫn được chia sẻ theo giấy phép mã nguồn mở thân thiện. Khi bạn đóng góp một câu lệnh hoặc hướng dẫn kỹ năng thông qua trang Đóng góp, bạn đồng ý cấp quyền cho cộng đồng sử dụng, chia sẻ và phát triển thêm câu lệnh đó vì mục đích phi thương mại hoặc thương mại hợp pháp.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text">4. Hành vi nghiêm cấm</h2>
          <p>
            Người dùng không được sử dụng các công cụ trên nền tảng để tạo ra hoặc phát tán các câu lệnh phục vụ mục đích xấu (như viết mã độc, vượt rào bảo mật trái phép), vi phạm pháp luật, phát ngôn thù hận hoặc tấn công phá hoại hạ tầng máy chủ của dự án.
          </p>
        </section>
      </div>
    </div>
  );
}
