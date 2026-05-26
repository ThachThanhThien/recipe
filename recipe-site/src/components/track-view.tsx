"use client";

import { useTrackRecentlyViewed } from "@/hooks/use-recently-viewed";

export function TrackView({ id }: { id: number }) {
  useTrackRecentlyViewed(id);
  return null;
}
