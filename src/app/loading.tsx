export default function Loading() {
  return (
    <div className="container-main py-10" aria-busy="true" aria-label="Đang tải">
      <div className="h-10 w-2/3 max-w-md rounded-lg bg-bg-hover animate-pulse mb-4" />
      <p className="text-muted-foreground mb-8">Đang tải...</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card h-40 animate-pulse" />
        <div className="card h-40 animate-pulse" />
        <div className="card h-40 animate-pulse" />
      </div>
      <div className="mt-6 space-y-3">
        <div className="h-4 w-full rounded bg-bg-hover animate-pulse" />
        <div className="h-4 w-5/6 rounded bg-bg-hover animate-pulse" />
        <div className="h-4 w-2/3 rounded bg-bg-hover animate-pulse" />
      </div>
    </div>
  );
}
