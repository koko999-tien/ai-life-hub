'use client';

import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="heading-1 mb-4">Đã xảy ra lỗi</h1>
      <p className="text-fluid-lg text-muted-foreground mb-2">
        Xin lỗi, có lỗi không mong muốn xảy ra khi tải trang này.
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
        <Link href="/" className="btn btn-outline">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
