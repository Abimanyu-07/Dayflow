import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to load dashboard data',
  message = 'A network or server error occurred while retrieving information. Please try again.',
  onRetry,
}) => {
  return (
    <div className="w-full my-4">
      <Alert variant="destructive" className="border-red-200 bg-red-50/70 p-5">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
          <div>
            <AlertTitle className="text-sm font-bold text-red-900">{title}</AlertTitle>
            <AlertDescription className="text-xs text-red-700 mt-1">
              {message}
            </AlertDescription>
          </div>
          {onRetry && (
            <Button
              onClick={onRetry}
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shrink-0 self-start sm:self-center"
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Try Again
            </Button>
          )}
        </div>
      </Alert>
    </div>
  );
};
