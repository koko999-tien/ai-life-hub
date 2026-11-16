'use client';

import { useState } from 'react';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from '@/components/ui/Toast';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus('success');
      setMessage('Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi tài nguyên AI hay hàng tuần.');
      setEmail('');
      toast.success('Đăng ký thành công!');
    } catch {
      setStatus('error');
      setMessage('Có lỗi xảy ra. Vui lòng thử lại sau.');
      toast.error('Đăng ký thất bại');
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900/50" aria-labelledby="newsletter-heading">
      <div className="container-main">
        <div className="mx-auto max-w-xl text-center">
          <h2 id="newsletter-heading" className="text-fluid-2xl font-heading font-bold text-gray-900 dark:text-white">
            Nhận tài nguyên AI hàng tuần
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Hàng thứ 2, chúng tôi gửi 5 prompt hay, 1 skill mới, 3 tài nguyên miễn phí. Không spam, hủy bất cứ lúc nào.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3" noValidate>
            <label htmlFor="email" className="sr-only">
              Email của bạn
            </label>
            <Input
              id="email"
              type="email"
              placeholder="nhap@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === 'loading' || status === 'success'}
              className="flex-1"
              aria-describedby="email-hint"
            />
            <Button type="submit" className="whitespace-nowrap" disabled={status === 'loading' || status === 'success'}>
              {status === 'loading' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Đang xử lý...
                </>
              ) : status === 'success' ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                  Đã đăng ký
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                  Đăng ký
                </>
              )}
            </Button>
          </form>
          <p id="email-hint" className="mt-3 text-sm text-gray-500 dark:text-gray-500">
            {status === 'success' ? (
              <span className="text-green-600 dark:text-green-400">{message}</span>
            ) : status === 'error' ? (
              <span className="text-red-600 dark:text-red-400">{message}</span>
            ) : (
              'Chúng tôi tôn trọng quyền riêng tư. Xem <a href="/privacy" className="underline hover:text-brand-600">Chính sách bảo mật</a>.'
            )}
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400 dark:text-gray-500">
            <span>5,000+ người đã đăng ký</span>
            <span aria-hidden="true">·</span>
            <span>Mở rate 42%</span>
          </div>
        </div>
      </div>
    </section>
  );
}