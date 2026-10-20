import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      {Icon && (
        <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary-soft-foreground">
          <Icon size={26} aria-hidden />
        </div>
      )}
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="mt-1.5 max-w-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
