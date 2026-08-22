import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { profileApi } from '@/services/profileApi';
import { toast } from 'sonner';

interface ProfileImageUploadProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  currentAvatarUrl?: string;
  fullName: string;
  onSuccess: (newAvatarUrl: string) => void;
}

export const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  isOpen,
  onClose,
  employeeId,
  currentAvatarUrl,
  fullName,
  onSuccess,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];

    if (!file) return;

    if (!acceptedTypes.includes(file.type)) {
      setErrorMessage('Invalid file format. Please upload JPG, JPEG, PNG, or WEBP images.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size exceeds 5MB limit. Please select a smaller image.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const result = await profileApi.uploadProfilePicture(employeeId, selectedFile);
      toast.success('Profile picture updated successfully!');
      onSuccess(result.avatarUrl);
      onClose();
    } catch (err: unknown) {
      setErrorMessage('Unable to upload profile picture. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrorMessage(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md text-center">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-extrabold text-slate-900 flex items-center justify-center gap-2">
            <Camera className="h-5 w-5 text-blue-600" />
            Update Profile Picture
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Upload a new photo for {fullName}. (JPG, JPEG, PNG, or WEBP max 5MB).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3 flex flex-col items-center">
          {errorMessage && (
            <Alert variant="destructive" className="text-left w-full">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs font-medium">{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Current / Preview Image Avatar */}
          <div className="relative group">
            <Avatar className="h-32 w-32 border-4 border-slate-100 shadow-md">
              <AvatarImage src={previewUrl || currentAvatarUrl} alt={fullName} />
              <AvatarFallback className="bg-slate-900 text-white font-extrabold text-3xl">
                {fullName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Selector Button */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-semibold h-9"
            >
              <Upload className="mr-1.5 h-3.5 w-3.5" /> Choose New Photo
            </Button>

            {selectedFile && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleReset}
                className="text-xs text-slate-500 h-9"
              >
                Clear Selection
              </Button>
            )}
          </div>

          {selectedFile && (
            <p className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="text-xs">
            Cancel
          </Button>

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            isLoading={isUploading}
            loadingText="Uploading Photo..."
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs h-9 shadow-sm"
          >
            Save Photo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
