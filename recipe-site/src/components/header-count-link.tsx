"use client";

import Link from "next/link";
import type { ReactNode } from "react";

interface HeaderCountLinkProps {
  href: string;
  count: number;
  label: string;
  icon: ReactNode;
}

export function HeaderCountLink({ href, count, label, icon }: HeaderCountLinkProps) {
  return (
    <Link
      href={href}
      aria-label={`${label}${count > 0 ? `, ${count} items` : ""}`}
      className="relative p-2 hover:bg-secondary rounded-full transition-colors"
    >
      {icon}
      {count > 0 && (
        <span
          className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center"
          aria-hidden
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
