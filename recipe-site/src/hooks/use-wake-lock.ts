"use client";

import { useEffect, useState } from "react";

/**
 * Keeps the screen on while `enabled` (e.g. in cooking mode, hands covered in flour).
 * Browsers drop the lock when the tab is hidden, so it is re-acquired on return.
 * Returns whether a lock is currently held.
 */
export function useWakeLock(enabled: boolean): boolean {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!enabled || !("wakeLock" in navigator)) return;
    let sentinel: WakeLockSentinel | null = null;
    let disposed = false;

    const acquire = async () => {
      try {
        const lock = await navigator.wakeLock.request("screen");
        if (disposed) {
          await lock.release();
          return;
        }
        sentinel = lock;
        setActive(true);
        lock.addEventListener("release", () => setActive(false));
      } catch {
        setActive(false); // denied, e.g. battery saver
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") void acquire();
    };

    void acquire();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      disposed = true;
      document.removeEventListener("visibilitychange", onVisibility);
      void sentinel?.release();
    };
  }, [enabled]);

  return enabled && active;
}
