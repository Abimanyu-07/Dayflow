import React, { ReactNode, useState } from 'react';
import { Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PolicyModal } from './PolicyModals';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const [policyModalType, setPolicyModalType] = useState<'terms' | 'privacy' | null>(null);

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {policyModalType && (
        <PolicyModal
          isOpen={!!policyModalType}
          onClose={() => setPolicyModalType(null)}
          type={policyModalType}
        />
      )}

      <div className="w-full max-w-[440px] space-y-6">
        {/* Simple & Clean Header: Logo + Title Dayflow */}
        <div className="text-center">
          <Link to="/login" className="inline-flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md">
              <Layers className="h-5 w-5 stroke-[2.2]" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              Dayflow
            </span>
          </Link>
        </div>

        {/* Centered Auth Card Container */}
        <div>
          {children}
        </div>

        {/* Minimal Footer with Policy Triggers */}
        <div className="text-center text-xs text-slate-400 font-normal space-x-1">
          <span>&copy; {new Date().getFullYear()} Dayflow. All rights reserved.</span>
          <span>&bull;</span>
          <button
            type="button"
            onClick={() => setPolicyModalType('terms')}
            className="hover:text-slate-600 underline cursor-pointer"
          >
            Terms
          </button>
          <span>&bull;</span>
          <button
            type="button"
            onClick={() => setPolicyModalType('privacy')}
            className="hover:text-slate-600 underline cursor-pointer"
          >
            Privacy
          </button>
        </div>
      </div>
    </div>
  );
};
