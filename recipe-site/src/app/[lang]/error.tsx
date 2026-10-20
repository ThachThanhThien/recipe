"use client";

import Link from "next/link";
import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { Container, buttonClass } from "@/components/ui";
import { useT } from "@/components/lang-provider";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useT();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="pt-10">
      <EmptyState
        icon={TriangleAlert}
        title={t("error.title")}
        description={t("error.desc")}
        action={
          <div className="flex gap-2">
            <button type="button" onClick={() => reset()} className={buttonClass("primary")}>
              {t("error.retry")}
            </button>
            <Link href="/" className={buttonClass("secondary")}>
              {t("nav.home")}
            </Link>
          </div>
        }
      />
    </Container>
  );
}
