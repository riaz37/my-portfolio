export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20" />
        <div className="absolute inset-2 animate-spin rounded-full border-b-2 border-primary" />
        <div className="absolute inset-4 animate-pulse rounded-full bg-primary/10" />
      </div>
    </div>
  );
}
