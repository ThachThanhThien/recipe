"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2 } from "lucide-react";
import { StarRating } from "@/components/star-rating";
import { submitReview, type Review } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ReviewSectionProps {
  recipeId: number;
  initialReviews: Review[];
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export function ReviewSection({ recipeId, initialReviews }: ReviewSectionProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (rating < 1 || rating > 5) {
      setError("Please pick a rating between 1 and 5.");
      return;
    }
    setSubmitting(true);
    try {
      const created = await submitReview(recipeId, {
        reviewerName: name.trim(),
        rating,
        comment: comment.trim() || undefined,
      });
      setReviews((prev) => [created, ...prev]);
      setName("");
      setRating(5);
      setComment("");
      setSuccess(true);
      window.setTimeout(() => setSuccess(false), 3000);
      // Recipe aggregate rating updated server-side; refresh server-rendered data
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section aria-labelledby="reviews-heading" className="mt-16">
      <div className="flex items-center gap-4 mb-8">
        <h2 id="reviews-heading" className="font-outfit text-3xl font-black">
          Reviews
        </h2>
        <div className="h-px flex-grow bg-border/40" />
        <span className="text-sm text-muted-foreground">
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-card rounded-3xl border border-border/60 p-6 sm:p-8 mb-10 shadow-sm space-y-4"
      >
        <h3 className="font-outfit font-black text-xl">Leave a review</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="reviewer-name" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Your name
            </label>
            <input
              id="reviewer-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              required
              disabled={submitting}
              className="bg-secondary/40 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
              placeholder="Jane Cook"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Your rating</label>
            <div className="bg-secondary/40 rounded-2xl px-4 py-3">
              <StarRating value={rating} onChange={setRating} size={28} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="reviewer-comment" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Comment <span className="text-muted-foreground/70 normal-case font-normal">(optional)</span>
          </label>
          <textarea
            id="reviewer-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={2000}
            rows={4}
            disabled={submitting}
            className="bg-secondary/40 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60 resize-none"
            placeholder="What did you think of this recipe?"
          />
          <span className="text-xs text-muted-foreground self-end">{comment.length}/2000</span>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-2xl px-4 py-3 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-accent/10 text-accent-foreground border border-accent/20 rounded-2xl px-4 py-3 text-sm">
            ✅ Thanks for the review!
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className={cn(
              "inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-bold transition-colors",
              submitting && "opacity-70 cursor-wait",
            )}
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Submitting…
              </>
            ) : (
              <>
                <Send size={16} /> Submit review
              </>
            )}
          </button>
        </div>
      </form>

      {reviews.length === 0 ? (
        <p className="text-muted-foreground text-center py-10">
          No reviews yet. Be the first to share your thoughts!
        </p>
      ) : (
        <ul className="space-y-5">
          {reviews.map((r) => (
            <li key={r.id} className="bg-card rounded-3xl border border-border/40 p-5 sm:p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-bold">{r.reviewerName}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</p>
                </div>
                <StarRating value={r.rating} readOnly size={16} />
              </div>
              {r.comment && <p className="text-foreground/80 leading-relaxed mt-3 whitespace-pre-wrap">{r.comment}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
