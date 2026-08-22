import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { PersonalInfoCard } from '@/components/profile/PersonalInfoCard';
import { JobInfoCard } from '@/components/profile/JobInfoCard';
import { SalaryCard } from '@/components/profile/SalaryCard';
import { DocumentsCard } from '@/components/profile/DocumentsCard';
import { EditProfileForm } from '@/components/profile/EditProfileForm';
import { ProfileImageUpload } from '@/components/profile/ProfileImageUpload';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { profileApi } from '@/services/profileApi';
import { EmployeeProfile, EmployeeDocument } from '@/types/employee';

export const EmployeeProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);

  const fetchProfile = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await profileApi.getMyProfile();
      setProfile(data);
    } catch (err: unknown) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleDocumentAdded = (newDoc: EmployeeDocument) => {
    if (profile) {
      setProfile({
        ...profile,
        documents: [newDoc, ...profile.documents],
      });
    }
  };

  return (
    <AppLayout title="My Employee Profile">
      {isLoading ? (
        <LoadingState />
      ) : isError || !profile ? (
        <ErrorState onRetry={fetchProfile} title="Unable to load profile" />
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Profile Header */}
          <ProfileHeader
            profile={profile}
            isHrView={false}
            onEditClick={() => setIsEditOpen(true)}
            onChangePhotoClick={() => setIsPhotoOpen(true)}
          />

          {/* 2-Column Responsive Grid: Personal Info & Job Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <PersonalInfoCard profile={profile} isHrView={false} />
            <JobInfoCard profile={profile} />
          </div>

          {/* Salary Structure Card */}
          <SalaryCard salary={profile.salary} isHrView={false} />

          {/* Documents Card */}
          <DocumentsCard
            employeeId={profile.employeeId}
            documents={profile.documents}
            onDocumentAdded={handleDocumentAdded}
          />

          {/* Edit Profile Modal Dialog */}
          {isEditOpen && (
            <EditProfileForm
              isOpen={isEditOpen}
              onClose={() => setIsEditOpen(false)}
              profile={profile}
              isHrView={false}
              onSuccess={(updated) => setProfile(updated)}
            />
          )}

          {/* Profile Picture Uploader Dialog */}
          {isPhotoOpen && (
            <ProfileImageUpload
              isOpen={isPhotoOpen}
              onClose={() => setIsPhotoOpen(false)}
              employeeId={profile.employeeId}
              currentAvatarUrl={profile.avatarUrl}
              fullName={profile.fullName}
              onSuccess={(newAvatarUrl) => setProfile({ ...profile, avatarUrl: newAvatarUrl })}
            />
          )}
        </div>
      )}
    </AppLayout>
  );
};

export default EmployeeProfilePage;
