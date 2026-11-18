import type { Metadata } from 'next';
import { ShieldCheck, Lock, EyeOff, Database } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chính sách Quyền riêng tư',
  description:
    'Chính sách bảo mật minh bạch tại AI Life Hub: ưu tiên xử lý trực tiếp trên trình duyệt, không thu thập nội dung câu lệnh cá nhân.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Chính sách Quyền riêng tư | AI Life Hub',
    description:
      'Chính sách bảo mật minh bạch tại AI Life Hub: ưu tiên xử lý trực tiếp trên trình duyệt, không thu thập nội dung câu lệnh cá nhân.',
    url: '/privacy',
    type: 'website',
  },
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-section-x pt-24 pb-16 max-w-4xl">
      <div className="mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Bảo mật &amp; Minh bạch</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-bold text-text tracking-tight">
          Chính sách Quyền riêng tư
        </h1>
        <p className="text-text-muted text-sm sm:text-base">
          Cập nhật lần cuối: Ngày 17 tháng 11 năm 2026
        </p>
      </div>

      <div className="card p-8 bg-bg-surface border-border space-y-8 text-sm text-text-muted leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text flex items-center gap-2">
            <Lock className="w-5 h-5 text-accent" />
            1. Xử lý trực tiếp trên trình duyệt của bạn
          </h2>
          <p>
            AI Life Hub ưu tiên bảo mật dữ liệu ngay tại thiết bị người dùng. Các công cụ như Bảng tính chi phí sử dụng AI, Trình tối ưu câu lệnh và Khu thử nghiệm AI đều chạy trực tiếp trên trình duyệt bạn đang mở.
          </p>
          <p>
            Chúng tôi <strong>không bao giờ lưu trữ hoặc gửi nội dung câu lệnh cá nhân của bạn</strong> về bất kỳ máy chủ bên thứ ba nào khi bạn sử dụng các công cụ trên trang web.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text flex items-center gap-2">
            <Database className="w-5 h-5 text-accent" />
            2. Dữ liệu Mục yêu thích &amp; Đóng góp cộng đồng
          </h2>
          <p>
            Đối với các tính năng cá nhân hóa như <strong>Lưu mục yêu thích</strong> hoặc <strong>Gửi câu lệnh đóng góp</strong>:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              Khi bạn chưa đăng nhập: dữ liệu được lưu cục bộ ngay trong bộ nhớ trình duyệt (<code className="text-accent bg-bg px-1.5 py-0.5 rounded">localStorage</code>) trên chính thiết bị bạn đang sử dụng.
            </li>
            <li>
              Khi bạn đồng bộ qua đám mây (Supabase): dữ liệu được bảo vệ bằng cơ chế phân quyền riêng theo từng tài khoản, chỉ bạn mới có quyền xem và sửa đổi danh sách đã lưu của mình.
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
