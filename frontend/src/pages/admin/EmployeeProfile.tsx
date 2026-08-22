import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { Button } from '@/components/ui/button';
import { profileApi } from '@/services/profileApi';
import { EmployeeProfile, EmployeeDocument } from '@/types/employee';
import { ArrowLeft } from 'lucide-react';

export const AdminEmployeeProfilePage: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);

  const fetchProfile = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await profileApi.getEmployeeProfile(employeeId || 'EMP1044');
      setProfile(data);
    } catch (err: unknown) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [employeeId]);

  const handleDocumentAdded = (newDoc: EmployeeDocument) => {
    if (profile) {
      setProfile({
        ...profile,
        documents: [newDoc, ...profile.documents],
      });
    }
  };

  return (
    <AppLayout title={`HR Administration • ${profile?.fullName || 'Employee Profile'}`}>
      {isLoading ? (
        <LoadingState />
      ) : isError || !profile ? (
        <ErrorState onRetry={fetchProfile} title="Unable to load employee profile" />
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Top Return Toolbar */}
          <div className="flex items-center justify-between">
            <Button
              onClick={() => navigate('/admin/dashboard')}
              variant="outline"
              size="sm"
              className="text-xs font-semibold"
            >
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to HR Dashboard
            </Button>
          </div>

          {/* Profile Header */}
          <ProfileHeader
            profile={profile}
            isHrView={true}
            onEditClick={() => setIsEditOpen(true)}
            onChangePhotoClick={() => setIsPhotoOpen(true)}
          />

          {/* 2-Column Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <PersonalInfoCard profile={profile} isHrView={true} />
            <JobInfoCard profile={profile} />
          </div>

          {/* Salary Structure Card (HR Editable) */}
          <SalaryCard salary={profile.salary} isHrView={true} />

          {/* Documents Card */}
          <DocumentsCard
            employeeId={profile.employeeId}
            documents={profile.documents}
            onDocumentAdded={handleDocumentAdded}
          />

          {/* HR Edit Employee Dialog */}
          {isEditOpen && (
            <EditProfileForm
              isOpen={isEditOpen}
              onClose={() => setIsEditOpen(false)}
              profile={profile}
              isHrView={true}
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

export default AdminEmployeeProfilePage;
