import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { EmployeeDocument } from '@/types/employee';
import { EmptyState } from '@/components/common/EmptyState';
import { FileText, Download, ExternalLink, Plus, Upload, Calendar } from 'lucide-react';
import { profileApi } from '@/services/profileApi';
import { toast } from 'sonner';

interface DocumentsCardProps {
  employeeId: string;
  documents: EmployeeDocument[];
  onDocumentAdded: (doc: EmployeeDocument) => void;
}

export const DocumentsCard: React.FC<DocumentsCardProps> = ({
  employeeId,
  documents,
  onDocumentAdded,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadSubmit = async () => {
    if (!selectedFile) {
      toast.error('Please select a document file to upload.');
      return;
    }

    setIsUploading(true);
    try {
      const addedDoc = await profileApi.uploadDocument(
        employeeId,
        selectedFile,
        docTitle || selectedFile.name
      );
      toast.success(`Document "${addedDoc.title}" uploaded successfully!`);
      onDocumentAdded(addedDoc);
      setIsUploadOpen(false);
      setDocTitle('');
      setSelectedFile(null);
    } catch (err: unknown) {
      toast.error('Unable to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="border-slate-200/80 shadow-sm">
      {/* Document Upload Modal */}
      {isUploadOpen && (
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Upload className="h-4 w-4" />
                </div>
                <DialogTitle className="text-lg font-bold text-slate-900">
                  Upload Document
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-slate-500 pt-1">
                Upload official employee verification, resumes, or certificates (PDF/DOCX/JPG).
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Document Title</label>
                <Input
                  placeholder="e.g. Higher Secondary Certificate.pdf"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Select File</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-10 text-xs font-semibold justify-start"
                >
                  <FileText className="mr-2 h-4 w-4 text-slate-400" />
                  {selectedFile ? selectedFile.name : 'Choose file from computer...'}
                </Button>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsUploadOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleUploadSubmit}
                isLoading={isUploading}
                loadingText="Uploading..."
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
              >
                Upload Document
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-slate-700" />
          <CardTitle className="text-base font-bold text-slate-900">
            Employee Documents
          </CardTitle>
        </div>

        <Button
          onClick={() => setIsUploadOpen(true)}
          size="sm"
          variant="outline"
          className="h-8 text-xs font-semibold"
        >
          <Plus className="mr-1 h-3.5 w-3.5" /> Add Document
        </Button>
      </CardHeader>

      <CardContent className="pt-4">
        {documents.length === 0 ? (
          <EmptyState
            title="No documents available"
            description="No official certificates or documents have been uploaded to this profile yet."
            actionText="Upload First Document"
            onAction={() => setIsUploadOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="h-10 w-10 rounded-lg bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="truncate space-y-0.5">
                    <h5 className="font-bold text-slate-900 text-xs truncate">
                      {doc.title}
                    </h5>
                    <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Uploaded: {doc.uploadedAt}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toast.info(`Opening ${doc.fileName}...`)}
                  className="h-8 text-xs font-semibold text-blue-600 hover:bg-blue-50 shrink-0"
                >
                  <ExternalLink className="mr-1 h-3.5 w-3.5" /> View
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
