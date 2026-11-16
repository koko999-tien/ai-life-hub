import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="heading-1 mb-4">404</h1>
      <p className="text-fluid-lg text-muted-foreground mb-8">
        Xin lỗi, trang bạn đang tìm kiếm không tồn tại.
      </p>
      <div className="flex gap-4">
        <Link href="/" className="btn btn-primary">Về trang chủ</Link>
        <Link href="/search" className="btn btn-outline">Tìm kiếm nội dung</Link>
      </div>
    </div>
  );
}