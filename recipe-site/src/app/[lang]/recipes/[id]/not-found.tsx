"use client";

import Link from "next/link";
import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { Container, buttonClass } from "@/components/ui";
import { useT } from "@/components/lang-provider";

export default function NotFound() {
  const t = useT();
  return (
    <Container className="pt-10">
      <EmptyState
        icon={SearchX}
        title={t("detail.notFound")}
        description={t("detail.notFoundDesc")}
        action={
          <Link href="/recipes" className={buttonClass("primary")}>
            {t("common.browse")}
          </Link>
        }
      />
    </Container>
  );
}
