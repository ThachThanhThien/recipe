import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="py-16 px-6 text-center flex flex-col items-center gap-4">
      {icon && <div className="text-5xl mb-2" aria-hidden>{icon}</div>}
      <h3 className="font-outfit text-2xl font-bold">{title}</h3>
      {description && <p className="text-muted-foreground max-w-md">{description}</p>}
      {action}
    </div>
  );
}
