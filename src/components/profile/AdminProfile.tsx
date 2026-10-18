import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Shield, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminProfile = () => {
  const { user } = useAuth();
  
  const adminData = {
    name: user?.profile?.full_name || 'Admin User',
    email: user?.email || 'admin@example.com',
    position: 'Platform Administrator',
    stats: {
      pendingClubs: 5,
      totalClubs: 32,
      totalStudents: 1256
    }
  };

  return (
    <div className="space-y-6">
<<<<<<< HEAD
      <Card className="overflow-hidden rounded-2xl border-[#e5dfd3] bg-white/85 shadow-sm dark:border-[#34443a] dark:bg-[#1c2921]">
        <CardHeader className="border-b border-[#e9e4d9] pb-5 dark:border-[#34443a]">
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row">
            <div className="flex min-w-0 items-center gap-4">
=======
      <Card className="bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
>>>>>>> 5c0145fb4b60299445eee33f2a48bfb2fa84bcc8
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.profile?.avatar_url} alt={adminData.name} />
                <AvatarFallback className="text-lg">{adminData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
<<<<<<< HEAD
                <CardTitle className="text-2xl tracking-tight">{adminData.name}</CardTitle>
                <div className="text-base font-medium text-[#344b38] dark:text-[#b7cbb7]">{adminData.position}</div>
                <div className="mt-1 flex items-center text-sm text-[#68736a] dark:text-[#b7c3ba]">
=======
                <CardTitle className="text-2xl text-foreground">{adminData.name}</CardTitle>
                <div className="text-lg font-medium text-primary">{adminData.position}</div>
                <div className="flex items-center text-muted-foreground mt-1">
>>>>>>> 5c0145fb4b60299445eee33f2a48bfb2fa84bcc8
                  <Mail className="h-4 w-4 mr-1" />
                  <span>{adminData.email}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="shrink-0 border-[#d8d2c6] hover:bg-[#f0ede4] dark:border-[#48564d] dark:hover:bg-[#26382d]">Edit Profile</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-4">
<<<<<<< HEAD
            <h3 className="mb-3 font-medium">Platform Overview</h3>
            <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl border border-[#e9e4d9] bg-[#f6f3ec] p-4 dark:border-[#34443a] dark:bg-[#223128]">
                <Shield className="h-5 w-5 text-[#344b38] dark:text-[#b7cbb7]" />
                <div>
                  <p className="text-sm text-[#68736a] dark:text-[#b7c3ba]">Pending Clubs</p>
                  <p className="font-semibold">{adminData.stats.pendingClubs}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-[#e9e4d9] bg-[#f6f3ec] p-4 dark:border-[#34443a] dark:bg-[#223128]">
                <Users className="h-5 w-5 text-[#344b38] dark:text-[#b7cbb7]" />
                <div>
                  <p className="text-sm text-[#68736a] dark:text-[#b7c3ba]">Total Clubs</p>
                  <p className="font-semibold">{adminData.stats.totalClubs}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-[#e9e4d9] bg-[#f6f3ec] p-4 dark:border-[#34443a] dark:bg-[#223128]">
                <Users className="h-5 w-5 text-[#344b38] dark:text-[#b7cbb7]" />
                <div>
                  <p className="text-sm text-[#68736a] dark:text-[#b7c3ba]">Total Students</p>
                  <p className="font-semibold">{adminData.stats.totalStudents}</p>
=======
            <h3 className="font-medium mb-2 text-foreground">Platform Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
              <div className="bg-muted/50 dark:bg-muted p-3 rounded-md flex items-center space-x-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending Clubs</p>
                  <p className="font-medium text-foreground">{adminData.stats.pendingClubs}</p>
                </div>
              </div>
              <div className="bg-muted/50 dark:bg-muted p-3 rounded-md flex items-center space-x-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Clubs</p>
                  <p className="font-medium text-foreground">{adminData.stats.totalClubs}</p>
                </div>
              </div>
              <div className="bg-muted/50 dark:bg-muted p-3 rounded-md flex items-center space-x-3">
                <BarChart className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="font-medium text-foreground">{adminData.stats.totalStudents}</p>
                </div>
              </div>
              <div className="bg-muted/50 dark:bg-muted p-3 rounded-md flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Reported Content</p>
                  <p className="font-medium text-foreground">{adminData.stats.reportedContent}</p>
>>>>>>> 5c0145fb4b60299445eee33f2a48bfb2fa84bcc8
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2 text-foreground">Administration</h3>
            <div className="space-y-3">
<<<<<<< HEAD
              <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-[#e9e4d9] bg-[#f6f3ec] p-4 sm:flex-row sm:items-center dark:border-[#34443a] dark:bg-[#223128]">
=======
              <div className="flex justify-between items-center p-3 bg-muted/50 dark:bg-muted rounded-md">
>>>>>>> 5c0145fb4b60299445eee33f2a48bfb2fa84bcc8
                <div>
                  <p className="font-medium text-foreground">Club Approvals</p>
                  <p className="text-sm text-muted-foreground">Review and manage club registrations</p>
                </div>
                <Button variant="secondary" size="sm">Manage</Button>
              </div>
<<<<<<< HEAD
              <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-[#e9e4d9] bg-[#f6f3ec] p-4 sm:flex-row sm:items-center dark:border-[#34443a] dark:bg-[#223128]">
=======
              <div className="flex justify-between items-center p-3 bg-muted/50 dark:bg-muted rounded-md">
>>>>>>> 5c0145fb4b60299445eee33f2a48bfb2fa84bcc8
                <div>
                  <p className="font-medium text-foreground">User Management</p>
                  <p className="text-sm text-muted-foreground">Manage student and club representative accounts</p>
                </div>
                <Button variant="secondary" size="sm">View</Button>
              </div>
<<<<<<< HEAD
              <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-[#e9e4d9] bg-[#f6f3ec] p-4 sm:flex-row sm:items-center dark:border-[#34443a] dark:bg-[#223128]">
=======
              <div className="flex justify-between items-center p-3 bg-muted/50 dark:bg-muted rounded-md">
>>>>>>> 5c0145fb4b60299445eee33f2a48bfb2fa84bcc8
                <div>
                  <p className="font-medium text-foreground">Content Moderation</p>
                  <p className="text-sm text-muted-foreground">Review reported content and take action</p>
                </div>
                <Button variant="secondary" size="sm">Review</Button>
              </div>
<<<<<<< HEAD
              <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-[#e9e4d9] bg-[#f6f3ec] p-4 sm:flex-row sm:items-center dark:border-[#34443a] dark:bg-[#223128]">
=======
              <div className="flex justify-between items-center p-3 bg-muted/50 dark:bg-muted rounded-md">
>>>>>>> 5c0145fb4b60299445eee33f2a48bfb2fa84bcc8
                <div>
                  <p className="font-medium text-foreground">Platform Settings</p>
                  <p className="text-sm text-muted-foreground">Configure platform-wide settings</p>
                </div>
                <Button variant="secondary" size="sm">Configure</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfile;
