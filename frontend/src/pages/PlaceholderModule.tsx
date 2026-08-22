import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Construction, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface PlaceholderModuleProps {
  moduleName: string;
}

export const PlaceholderModule: React.FC<PlaceholderModuleProps> = ({ moduleName }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isHr = user?.role === 'HR';
  const dashboardPath = isHr ? '/admin/dashboard' : '/employee/dashboard';

  return (
    <AppLayout title={moduleName}>
      <Card className="border-slate-200/80 shadow-md text-center py-12">
        <CardContent className="flex flex-col items-center space-y-4 max-w-md mx-auto">
          <div className="h-16 w-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
            <Construction className="h-8 w-8 stroke-[1.8]" />
          </div>

          <div className="space-y-1">
            <CardTitle className="text-2xl font-extrabold text-slate-900">
              {moduleName} Module
            </CardTitle>
            <p className="text-xs text-slate-500 leading-relaxed">
              The full <span className="font-semibold text-slate-800">{moduleName}</span> module is scheduled for implementation in the next release phase of Dayflow.
            </p>
          </div>

          <div className="pt-2 w-full">
            <Button
              onClick={() => navigate(dashboardPath)}
              variant="outline"
              className="w-full h-10 text-xs font-semibold"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Return to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
};
