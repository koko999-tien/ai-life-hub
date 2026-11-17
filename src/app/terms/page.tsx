import type { Metadata } from 'next';
import { FileText, AlertCircle, CheckCircle, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Điều khoản Dịch vụ | AI Life Hub',
  description: 'Điều khoản sử dụng nền tảng và tuyên bố trách nhiệm về trí tuệ nhân tạo tại AI Life Hub.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-section-x py-16 max-w-4xl">
      <div className="mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
          <Scale className="w-3.5 h-3.5" />
          <span>Pháp lý & Quy định</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-bold text-text tracking-tight">
          Điều khoản Dịch vụ (Terms of Service)
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
            2. Tuyên bố Miễn trừ trách nhiệm về AI (AI Disclaimer)
          </h2>
          <p>
            Các câu lệnh mẫu (prompts), kỹ năng (skills), kiến trúc agent và kết quả tính toán chi phí token trên AI Life Hub được thiết kế nhằm mục đích hướng dẫn, tham khảo và tối ưu hiệu suất công việc:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              Các mô hình ngôn ngữ lớn (LLM) bên ngoài (như OpenAI, Anthropic, DeepSeek, Google) có thể đưa ra kết quả không hoàn hảo hoặc không chính xác trong một số ngữ cảnh đặc thù.
            </li>
            <li>
              Người dùng có trách nhiệm rà soát, kiểm thử mã nguồn và xác minh tính đúng đắn trước khi đưa vào môi trường sản xuất (production) hoặc sử dụng cho các quyết định pháp lý, tài chính và y tế quan trọng.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            3. Quyền sở hữu trí tuệ & Đóng góp cộng đồng
          </h2>
          <p>
            Mã nguồn giao diện và tài liệu hướng dẫn được chia sẻ theo giấy phép mã nguồn mở thân thiện. Khi bạn đóng góp một prompt hoặc kỹ năng thông qua trang Đóng góp (Submit), bạn đồng ý cấp quyền cho cộng đồng sử dụng, chia sẻ và phát triển thêm prompt đó vì mục đích phi thương mại hoặc thương mại hợp pháp.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text">4. Hành vi nghiêm cấm</h2>
          <p>
            Người dùng không được sử dụng các công cụ trên nền tảng để tạo ra hoặc phát tán các prompt độc hại (malware generation), jailbreak vi phạm pháp luật, phát ngôn thù hận hoặc tấn công phá hoại hạ tầng máy chủ của dự án.
          </p>
        </section>
      </div>
    </div>
  );
}
