
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import StudentProfile from '@/components/profile/StudentProfile';
import ClubRepProfile from '@/components/profile/ClubRepProfile';
import AdminProfile from '@/components/profile/AdminProfile';
import { Loader2 } from 'lucide-react';

const Profile = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to auth if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-[#344b38] dark:text-[#dce8dd]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  // Render the appropriate profile component based on user role
  const renderProfile = () => {
    switch (user.role) {
      case 'student':
        return <StudentProfile />;
      case 'clubRepresentative':
        return <ClubRepProfile />;
      case 'admin':
        return <AdminProfile />;
      default:
        return <div>Invalid user role</div>;
    }
  };

  return (
    <div className="space-y-8 text-[#1d2c24] dark:text-[#f5f2e9]">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Profile</h1>
        <p className="mt-2 text-[#68736a] dark:text-[#b7c3ba]">Manage your personal information and preferences</p>
      </div>
      
      {renderProfile()}
    </div>
  );
};

export default Profile;
