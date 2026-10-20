import { Container } from "@/components/ui";

export default function Loading() {
  return (
    <Container className="animate-pulse pt-2 sm:pt-6" aria-hidden>
      <div className="flex justify-between py-2">
        <div className="h-11 w-28 rounded-xl bg-muted" />
        <div className="h-11 w-24 rounded-xl bg-muted" />
      </div>
      <div className="mt-2 grid gap-6 lg:grid-cols-2 lg:gap-10">
        <div className="aspect-[4/3] rounded-2xl bg-muted" />
        <div>
          <div className="h-4 w-1/3 rounded-full bg-muted" />
          <div className="mt-3 h-8 w-4/5 rounded-full bg-muted" />
          <div className="mt-4 h-4 w-full rounded-full bg-muted" />
          <div className="mt-2 h-4 w-2/3 rounded-full bg-muted" />
          <div className="mt-5 h-20 rounded-2xl bg-muted" />
          <div className="mt-5 h-12 rounded-xl bg-muted" />
        </div>
      </div>
    </Container>
  );
}
