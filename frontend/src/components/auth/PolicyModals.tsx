import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShieldCheck, FileText } from 'lucide-react';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy';
  onAcceptTerms?: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  type,
  onAcceptTerms,
}) => {
  const isTerms = type === 'terms';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md sm:max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader className="border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800">
              {isTerms ? <FileText className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5 text-emerald-600" />}
            </div>
            <div>
              <DialogTitle className="text-lg font-extrabold text-slate-900">
                {isTerms ? 'Terms of Service' : 'Privacy Policy'}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Dayflow HRMS &bull; Effective August 2026
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Policy Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs text-slate-600 leading-relaxed py-2">
          {isTerms ? (
            <>
              <section className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">1. Acceptance of Terms</h4>
                <p>
                  By creating an account or signing in to Dayflow, you agree to adhere to all workplace regulations, role-based security permissions, and corporate data governance policies.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">2. Account Security & Credentials</h4>
                <p>
                  Users are strictly responsible for maintaining secret, unique passwords. Access tokens are stored in memory and HTTP-only cookies prevent unauthorized cross-site access.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">3. Acceptable Workplace Use</h4>
                <p>
                  Dayflow must be used solely for legitimate Human Resource operations including attendance tracking, leave requests, and payroll management. Any credential sharing or automated scraping is prohibited.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">4. Data Accuracy & Integrity</h4>
                <p>
                  Employees and HR officers must submit true and accurate employee IDs, timestamps, and leave requests. Falsification of HR logs may result in administrative action.
                </p>
              </section>
            </>
          ) : (
            <>
              <section className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">1. Information We Process</h4>
                <p>
                  We process professional data including employee ID, company email address, encrypted password hashes (bcrypt), attendance timestamps, and assigned workspace roles (`EMPLOYEE` or `HR`).
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">2. How We Protect Your Data</h4>
                <p>
                  Refresh tokens are stored in secure HTTP-only cookies, isolated from JavaScript access. Access tokens remain in volatile memory and expire automatically.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">3. Email & Cloud Services</h4>
                <p>
                  Email verification notices are delivered via secure SMTP servers. Profile assets are managed on Cloudinary with strict access control policies.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">4. Your Rights</h4>
                <p>
                  You may request a copy of your personal workforce records or request correction of attendance logs through your designated HR administrator.
                </p>
              </section>
            </>
          )}
        </div>

        <DialogFooter className="border-t border-slate-100 pt-3 flex items-center justify-between sm:justify-end gap-2">
          {isTerms && onAcceptTerms ? (
            <>
              <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  onAcceptTerms();
                  onClose();
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
              >
                I Understand & Accept
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={onClose}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold w-full sm:w-auto"
            >
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
