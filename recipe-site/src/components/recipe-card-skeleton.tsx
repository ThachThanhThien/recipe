export function RecipeCardSkeleton() {
  return (
    <div className="bg-card rounded-3xl overflow-hidden border border-border/40 animate-pulse">
      <div className="aspect-[4/3] bg-secondary/60" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-24 bg-secondary/60 rounded-full" />
        <div className="h-5 w-3/4 bg-secondary/70 rounded" />
        <div className="h-3 w-full bg-secondary/40 rounded" />
        <div className="h-3 w-2/3 bg-secondary/40 rounded" />
        <div className="pt-3 border-t border-border/40 flex justify-between">
          <div className="h-3 w-12 bg-secondary/50 rounded-full" />
          <div className="h-3 w-16 bg-secondary/50 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function RecipeGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <RecipeCardSkeleton key={i} />
      ))}
    </div>
  );
}
