import { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center">
      {icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          {icon}
        </div>
      )}
      <div className="space-y-2">
        <h3 className="font-semibold tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-[300px]">
          {description}
        </p>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
