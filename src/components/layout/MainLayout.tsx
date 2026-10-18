<<<<<<< HEAD
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
=======

import React, { useEffect } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
>>>>>>> 5c0145fb4b60299445eee33f2a48bfb2fa84bcc8
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const MainLayout: React.FC = () => {
  const { user, isLoading, refreshUser } = useAuth();
  const navigate = useNavigate();

  // Refresh user data on mount
  useEffect(() => {
    if (!isLoading && user) {
      refreshUser().catch(error => {
        console.error("Error refreshing user data:", error);
        toast({
          title: "Error",
          description: "Failed to refresh user data. Please try again.",
          variant: "destructive"
        });
      });
    }
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-background px-6 text-center" role="status" aria-live="polite">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
        <p className="text-sm font-medium text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background text-foreground">
      <Navbar />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
<<<<<<< HEAD
        <main className="min-w-0 flex-1 overflow-x-hidden">
          <div className="cluby-container py-6 md:py-9">
=======
        <main className="flex-1 overflow-auto p-4">
          <div className="cluby-container">
>>>>>>> 5c0145fb4b60299445eee33f2a48bfb2fa84bcc8
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
