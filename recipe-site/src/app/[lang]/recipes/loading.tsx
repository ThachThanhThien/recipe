import { RecipeGridSkeleton } from "@/components/recipe-card-skeleton";
import { Container } from "@/components/ui";

export default function Loading() {
  return (
    <Container aria-hidden>
      <div className="pb-5 pt-6 sm:pt-10">
        <div className="h-8 w-40 animate-pulse rounded-full bg-muted" />
      </div>
      <div className="h-12 animate-pulse rounded-xl bg-muted" />
      <div className="mb-6 mt-3 h-10 animate-pulse rounded-full bg-muted" />
      <RecipeGridSkeleton />
    </Container>
  );
}
