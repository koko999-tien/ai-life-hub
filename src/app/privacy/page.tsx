import type { Metadata } from 'next';
import { ShieldCheck, Lock, EyeOff, Database } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chính sách Quyền riêng tư | AI Life Hub',
  description: 'Chính sách bảo mật và quyền riêng tư minh bạch tại AI Life Hub: Local-First, không thu thập dữ liệu người dùng cá nhân.',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-section-x py-16 max-w-4xl">
      <div className="mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Bảo mật & Minh bạch</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-bold text-text tracking-tight">
          Chính sách Quyền riêng tư (Privacy Policy)
        </h1>
        <p className="text-text-muted text-sm sm:text-base">
          Cập nhật lần cuối: Ngày 17 tháng 11 năm 2026
        </p>
      </div>

      <div className="card p-8 bg-bg-surface border-border space-y-8 text-sm text-text-muted leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text flex items-center gap-2">
            <Lock className="w-5 h-5 text-accent" />
            1. Nguyên tắc Local-First & Client-Side Execution
          </h2>
          <p>
            AI Life Hub được thiết kế theo tư duy <strong>Local-First</strong>. Các công cụ tính toán chi phí token (Token Calculator), trình tối ưu Prompt (Prompt Optimizer), và mô phỏng Playground chạy hoàn toàn bằng JavaScript ngay trên trình duyệt (client-side) của bạn.
          </p>
          <p>
            Chúng tôi <strong>không bao giờ lưu trữ hoặc gửi nội dung câu lệnh cá nhân của bạn</strong> về bất kỳ máy chủ nào của bên thứ ba khi bạn sử dụng các công cụ tính toán hoặc tối ưu hoá offline.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text flex items-center gap-2">
            <Database className="w-5 h-5 text-accent" />
            2. Dữ liệu lưu trữ qua Supabase & Trình duyệt
          </h2>
          <p>
            Đối với các tính năng cá nhân hóa như <strong>Lưu danh sách yêu thích (Bookmarks)</strong> hoặc <strong>Gửi Prompt đóng góp</strong>:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              Nếu bạn không đăng nhập hoặc không có cấu hình tài khoản: dữ liệu được lưu cục bộ trong <code className="text-accent bg-bg px-1.5 py-0.5 rounded">localStorage</code> của chính trình duyệt bạn đang sử dụng.
            </li>
            <li>
              Nếu bạn kết nối Supabase: dữ liệu được bảo vệ nghiêm ngặt qua cơ chế <strong>Row Level Security (RLS)</strong> của cơ sở dữ liệu PostgreSQL, chỉ có bạn mới có quyền xem và sửa đổi danh sách bookmark của mình.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-accent" />
            3. Không bán dữ liệu & Không quảng cáo theo dõi
          </h2>
          <p>
            AI Life Hub là dự án mã nguồn mở phục vụ mục đích giáo dục và nâng cao năng suất làm việc. Chúng tôi cam kết không kinh doanh, buôn bán hay chia sẻ danh tính, địa chỉ email hay bất kỳ thông tin nào của bạn cho bất kỳ đơn vị quảng cáo nào.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text">4. Liên hệ bộ phận phụ trách bảo mật</h2>
          <p>
            Nếu bạn có bất kỳ câu hỏi nào liên quan đến chính sách riêng tư hoặc muốn yêu cầu xóa dữ liệu, vui lòng gửi email về: <a href="mailto:privacy@ailifehub.dev" className="text-accent hover:underline font-semibold">privacy@ailifehub.dev</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
