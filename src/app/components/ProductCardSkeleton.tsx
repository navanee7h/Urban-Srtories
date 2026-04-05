export default function ProductCardSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="aspect-[3/4] bg-muted rounded-sm" />
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-4 bg-muted rounded w-1/3" />
      </div>
    </div>
  );
}
