'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="vi">
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <h1 className="heading-1 mb-4">Đã xảy ra lỗi</h1>
          <p className="text-fluid-lg text-muted-foreground mb-2">
            Xin lỗi, có lỗi nghiêm trọng xảy ra và trang không thể tải được.
          </p>
          {error?.digest ? (
            <p className="text-sm text-muted-foreground mb-8">Mã lỗi: {error.digest}</p>
          ) : (
            <p className="text-sm text-muted-foreground mb-8">
              Vui lòng thử lại hoặc quay về trang chủ.
            </p>
          )}
          <div className="flex gap-4">
            <button type="button" onClick={() => reset()} className="btn btn-primary">
              Thử lại
            </button>
            {/* Link của next/link không dùng được trong global-error (nằm ngoài router context) nên dùng <a> thường. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" className="btn btn-outline">
              Về trang chủ
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
