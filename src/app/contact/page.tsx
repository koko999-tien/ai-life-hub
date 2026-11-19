'use client';

import { useState } from 'react';
import {
  Mail,
  MessageSquare,
  CodeXml,
  Send,
  CheckCircle2,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export default function ContactPage() {
  const [topic, setTopic] = useState<string>('feedback');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    // Lưu vào localStorage hoặc log
    try {
      const existing = JSON.parse(localStorage.getItem('ai_life_hub_feedback') || '[]');
      existing.push({
        topic,
        name,
        email,
        message,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('ai_life_hub_feedback', JSON.stringify(existing));
    } catch {}

    setSubmitted(true);
  };

  return (
    <div className="container mx-auto px-section-x pt-24 pb-16 max-w-4xl">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Liên hệ &amp; Hỗ trợ</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-bold text-text tracking-tight">
          Kết nối cùng Đội ngũ AI Life Hub
        </h1>
        <p className="text-text-muted text-base leading-relaxed">
          Bạn có ý tưởng cải tiến, phát hiện lỗi hoặc muốn hợp tác tích hợp công cụ AI mới? Hãy để lại lời nhắn cho chúng tôi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Info Column */}
        <div className="md:col-span-5 space-y-6">
          <div className="card p-6 bg-bg-surface border-border space-y-4">
            <h2 className="font-bold text-text text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              Kênh liên lạc chính thức
            </h2>
            <div className="space-y-4 text-sm">
              <a
                href="mailto:contact@ailifehub.dev"
                className="flex items-center gap-3 p-3 rounded-lg bg-bg border border-border text-text hover:border-accent/40 transition-all"
              >
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <div>
                  <strong className="block text-text">Email Trực tiếp</strong>
                  <span className="text-xs text-text-muted">contact@ailifehub.dev</span>
                </div>
              </a>

              <a
                href="https://github.com/koko999-tien/ai-life-hub"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-bg border border-border text-text hover:border-accent/40 transition-all"
              >
                <CodeXml className="w-5 h-5 text-accent shrink-0" />
                <div>
                  <strong className="block text-text">Mã nguồn trên GitHub</strong>
                  <span className="text-xs text-text-muted">Đóng góp mã nguồn &amp; báo lỗi</span>
                </div>
              </a>
            </div>
          </div>

          <div className="card p-6 bg-bg-surface border-border space-y-3">
            <h3 className="font-semibold text-text text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-accent" />
              Thời gian phản hồi
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Các báo cáo lỗi và đề xuất câu lệnh mới thường được rà soát và phản hồi trong vòng 24 - 48 giờ làm việc.
            </p>
          </div>
        </div>

        {/* Form Column */}
        <div className="md:col-span-7">
          <div className="card p-8 bg-bg-surface border-border shadow-md">
            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
                <h3 className="text-2xl font-bold text-text">Cảm ơn bạn đã gửi lời nhắn!</h3>
                <p className="text-sm text-text-muted max-w-sm mx-auto leading-relaxed">
                  Ý kiến đóng góp của bạn đã được ghi nhận. Đội ngũ AI Life Hub sẽ xem xét và phản hồi sớm nhất có thể.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="py-2.5 px-6 rounded-xl bg-accent text-white font-medium text-sm hover:bg-accent-hover transition-all"
                >
                  Gửi thêm tin nhắn khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="contact-topic" className="text-xs font-semibold uppercase text-text block mb-2">
                    Chủ đề phản hồi
                  </label>
                  <select
                    id="contact-topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full p-3 rounded-lg bg-bg border border-border text-text text-sm focus:border-accent focus:outline-hidden"
                  >
                    <option value="feedback">Đóng góp ý kiến cải tiến</option>
                    <option value="bug">Báo lỗi hiển thị hoặc chức năng</option>
                    <option value="prompt">Đề xuất thêm câu lệnh / chủ đề mới</option>
                    <option value="collaboration">Hợp tác nội dung &amp; tích hợp công cụ mới</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-name" className="text-xs font-semibold uppercase text-text block mb-2">
                    Họ và tên của bạn
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full p-3 rounded-lg bg-bg border border-border text-text text-sm focus:border-accent focus:outline-hidden"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="text-xs font-semibold uppercase text-text block mb-2">
                    Email liên hệ
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tenban@email.com"
                    className="w-full p-3 rounded-lg bg-bg border border-border text-text text-sm focus:border-accent focus:outline-hidden"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="text-xs font-semibold uppercase text-text block mb-2">
                    Nội dung chi tiết
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hãy mô tả chi tiết vấn đề hoặc đề xuất của bạn..."
                    className="w-full p-3 rounded-lg bg-bg border border-border text-text text-sm focus:border-accent focus:outline-hidden resize-y"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Gửi tin nhắn ngay
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
