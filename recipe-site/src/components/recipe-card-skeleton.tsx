export function RecipeCardSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden>
      <div className="aspect-[4/3] rounded-2xl bg-muted" />
      <div className="mt-3 h-3 w-1/3 rounded-full bg-muted" />
      <div className="mt-2 h-4 w-4/5 rounded-full bg-muted" />
      <div className="mt-2 h-3 w-1/2 rounded-full bg-muted" />
    </div>
  );
}

export function RecipeGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <RecipeCardSkeleton key={i} />
      ))}
    </div>
  );
}
