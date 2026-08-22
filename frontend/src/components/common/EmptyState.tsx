import React, { ReactNode } from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No data available',
  description = 'There are no records to display at this time.',
  icon,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
      <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
        {icon || <FolderOpen className="h-6 w-6 stroke-[1.5]" />}
      </div>
      <h4 className="text-sm font-bold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button onClick={onAction} size="sm" variant="outline" className="text-xs font-semibold">
          {actionText}
        </Button>
      )}
    </div>
  );
};
