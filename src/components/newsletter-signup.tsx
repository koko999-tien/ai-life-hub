'use client';

import { useState } from 'react';
import { Mail, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { Button, Input, toast } from '@/components/ui';
import { cn } from '@/lib/utils';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus('error');
      setErrorMessage('Vui lòng nhập email');
      return;
    }

    if (!validateEmail(email)) {
      setStatus('error');
      setErrorMessage('Email không hợp lệ');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus('success');
      setEmail('');
      toast.success('Đăng ký thành công! Cảm ơn bạn đã tham gia AI Life Hub.');
    } catch {
      setStatus('error');
      setErrorMessage('Có lỗi xảy ra, vui lòng thử lại');
      toast.error('Đăng ký thất bại. Vui lòng thử lại sau.');
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-brand-500/10 via-transparent to-accent-500/10" aria-labelledby="newsletter-heading">
      <div className="container-main">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 text-sm font-medium mb-6">
            <Mail className="h-4 w-4" aria-hidden="true" />
            <span>Bản tin AI hàng tuần</span>
          </div>

          <h2 id="newsletter-heading" className="heading-2 mb-4">
            Cập nhật kiến thức AI mỗi tuần
          </h2>

          <p className="text-fluid-lg text-gray-600 dark:text-gray-400 mb-8">
            Nhận câu lệnh mẫu thực chiến, tình huống ứng dụng thực tế, công cụ mới và kinh nghiệm chọn lọc trực tiếp vào hộp thư.
            Không làm phiền, hủy đăng ký bất kỳ lúc nào.
          </p>

          {status === 'success' ? (
            <div className="flex flex-col items-center gap-4 p-8 bg-bg/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-800 animate-scale-in">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400">
                <CheckCircle className="h-8 w-8" aria-hidden="true" />
              </div>
              <h3 className="heading-4 text-gray-900 dark:text-white">Cảm ơn bạn đã đăng ký!</h3>
              <p className="text-gray-600 dark:text-gray-400">Đã ghi nhận email của bạn! Cảm ơn bạn đã đồng hành cùng cộng đồng AI Life Hub.</p>
              <Button variant="outline" onClick={() => setStatus('idle')} className="mt-2">
                Đăng ký email khác
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" noValidate>
              <label htmlFor="newsletter-email" className="sr-only">
                Email của bạn
              </label>
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400/50" aria-hidden="true" />
                <Input
                  id="newsletter-email"
                  type="email"
                  placeholder="nhap@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  className="pl-10 pr-10"
                  disabled={status === 'loading'}
                  aria-describedby={status === 'error' ? 'email-error' : undefined}
                  aria-invalid={status === 'error'}
                />
                {status === 'loading' && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-600 animate-spin" aria-hidden="true" />
                )}
              </div>
              <Button type="submit" size="lg" disabled={status === 'loading'} className="whitespace-nowrap">
                {status === 'loading' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    Đăng ký
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </Button>
            </form>
          )}

          {status === 'error' && (
            <p id="email-error" className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-1" role="alert">
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              {errorMessage}
            </p>
          )}

          <p className="mt-6 text-xs text-gray-500/70 dark:text-gray-500/70">
            Bằng cách đăng ký, bạn đồng ý với{' '}
            <a href="/privacy" className="underline hover:text-brand-600 dark:hover:text-brand-400">Chính sách bảo mật</a>
            {' '}của chúng tôi.
          </p>
        </div>
      </div>
    </section>
  );
}