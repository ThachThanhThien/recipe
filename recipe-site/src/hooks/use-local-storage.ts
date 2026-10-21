"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SetValue<T> = (value: T | ((prev: T) => T)) => void;

/**
 * Fired on `window` after this hook writes a key (`detail` is the key), so other
 * instances in the same tab can re-read it. The native `storage` event only
 * reaches other tabs.
 */
const SAME_TAB_EVENT = "tastyfresh:storage";

export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>, boolean] {
  const [hydrated, setHydrated] = useState(false);
  const [value, setValue] = useState<T>(initialValue);
  // Raw string this instance last read or wrote; skips no-op writes and stops notify loops.
  const rawRef = useRef<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      rawRef.current = raw;
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      // ignore corrupt data
    } finally {
      setHydrated(true);
    }
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      const raw = JSON.stringify(value);
      if (raw === rawRef.current) return;
      rawRef.current = raw;
      window.localStorage.setItem(key, raw);
      window.dispatchEvent(new CustomEvent<string>(SAME_TAB_EVENT, { detail: key }));
    } catch {
      // quota / disabled — ignore
    }
  }, [key, value, hydrated]);

  useEffect(() => {
    const sync = () => {
      try {
        const raw = window.localStorage.getItem(key);
        if (raw === null || raw === rawRef.current) return;
        const next = JSON.parse(raw) as T;
        rawRef.current = raw;
        setValue(next);
      } catch {
        // ignore
      }
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) sync();
    };
    const onSameTab = (e: Event) => {
      if ((e as CustomEvent<string>).detail === key) sync();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(SAME_TAB_EVENT, onSameTab);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(SAME_TAB_EVENT, onSameTab);
    };
  }, [key]);

  const set: SetValue<T> = useCallback((v) => {
    setValue((prev) => (typeof v === "function" ? (v as (p: T) => T)(prev) : v));
  }, []);

  return [value, set, hydrated];
}
