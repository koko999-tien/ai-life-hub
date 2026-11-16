export default function Loading() {
  return (
    <div className="container py-12 space-y-8 animate-pulse">
      <div className="h-12 bg-muted rounded-md w-1/3"></div>
      <div className="h-6 bg-muted rounded-md w-2/3"></div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-6">
        {[1, 2, 3, 4, 5, 6].map(n => (
          <div key={n} className="h-48 bg-muted rounded-xl"></div>
        ))}
      </div>
    </div>
  );
}