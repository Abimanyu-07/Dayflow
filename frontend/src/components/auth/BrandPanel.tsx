import React from 'react';
import { Users, Clock, CreditCard, Layers, ShieldCheck, Sparkles } from 'lucide-react';

export const BrandPanel: React.FC = () => {
  return (
    <div className="relative flex flex-col justify-between h-full p-8 lg:p-12 dayflow-panel-gradient text-white overflow-hidden rounded-2xl border border-slate-800 shadow-2xl">
      {/* Subtle background ambient mesh glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header / Logo section */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30">
            <Layers className="h-6 w-6 text-white stroke-[2.2]" />
          </div>
          <div>
            <span className="text-2xl font-extrabold tracking-tight text-white font-sans">
              Dayflow
            </span>
            <span className="block text-[10px] uppercase font-bold tracking-widest text-blue-400">
              Enterprise HRMS
            </span>
          </div>
        </div>

        {/* Tagline & Description */}
        <div className="space-y-4 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-medium text-blue-300">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>Human Resource Management</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Every workday, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-400">
              perfectly aligned.
            </span>
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed font-normal">
            Manage employees, attendance, leave and payroll from one secure workspace.
          </p>
        </div>
      </div>

      {/* Feature Highlights section */}
      <div className="relative z-10 my-10 space-y-3.5">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Core Capabilities
        </div>

        <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-xs transition-all hover:bg-slate-800/80">
          <div className="h-9 w-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100">Employee Management</h4>
            <p className="text-xs text-slate-400">Unified profiles, onboarding & workforce records</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-xs transition-all hover:bg-slate-800/80">
          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Clock className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100">Attendance Tracking</h4>
            <p className="text-xs text-slate-400">Automated shift check-ins & real-time logs</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-xs transition-all hover:bg-slate-800/80">
          <div className="h-9 w-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <CreditCard className="h-4 w-4 text-indigo-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100">Leave & Payroll</h4>
            <p className="text-xs text-slate-400">Streamlined approvals & accurate pay runs</p>
          </div>
        </div>
      </div>

      {/* Footer security badge */}
      <div className="relative z-10 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2 text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Enterprise Grade Security</span>
        </div>
        <span className="text-slate-500 font-mono text-[11px]">v2.4.0</span>
      </div>
    </div>
  );
};
