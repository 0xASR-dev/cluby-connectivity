import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ClubRepProfile = () => {
  const { user } = useAuth();
  
  const repData = {
    name: user?.profile?.full_name || 'Club Representative',
    email: user?.email || 'rep@example.com',
    position: 'Representative',
    club: {
      name: 'Club Name',
      openPositions: 3
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
                <AvatarImage src={user?.profile?.avatar_url} alt={repData.name} />
                <AvatarFallback className="text-lg">{repData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
<<<<<<< HEAD
                <CardTitle className="text-2xl tracking-tight">{repData.name}</CardTitle>
                <div className="text-base font-medium text-[#344b38] dark:text-[#b7cbb7]">{repData.position} at {repData.club.name}</div>
                <div className="mt-1 flex items-center text-sm text-[#68736a] dark:text-[#b7c3ba]">
=======
                <CardTitle className="text-2xl text-foreground">{repData.name}</CardTitle>
                <div className="text-lg font-medium text-primary">{repData.position} at {repData.club.name}</div>
                <div className="flex items-center text-muted-foreground mt-1">
>>>>>>> 5c0145fb4b60299445eee33f2a48bfb2fa84bcc8
                  <Mail className="h-4 w-4 mr-1" />
                  <span>{repData.email}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="shrink-0 border-[#d8d2c6] hover:bg-[#f0ede4] dark:border-[#48564d] dark:hover:bg-[#26382d]">Edit Profile</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-4">
<<<<<<< HEAD
            <h3 className="mb-3 font-medium">Club Overview</h3>
            <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl border border-[#e9e4d9] bg-[#f6f3ec] p-4 dark:border-[#34443a] dark:bg-[#223128]">
                <Users className="h-5 w-5 text-[#344b38] dark:text-[#b7cbb7]" />
                <div>
                  <p className="text-sm text-[#68736a] dark:text-[#b7c3ba]">Open Positions</p>
                  <p className="font-semibold">{repData.club.openPositions}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-[#e9e4d9] bg-[#f6f3ec] p-4 dark:border-[#34443a] dark:bg-[#223128]">
                <Users className="h-5 w-5 text-[#344b38] dark:text-[#b7cbb7]" />
=======
            <h3 className="font-medium mb-2 text-foreground">Club Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div className="bg-muted/50 dark:bg-muted p-3 rounded-md flex items-center space-x-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Members</p>
                  <p className="font-medium text-foreground">{repData.club.members}</p>
                </div>
              </div>
              <div className="bg-muted/50 dark:bg-muted p-3 rounded-md flex items-center space-x-3">
                <CalendarDays className="h-5 w-5 text-primary" />
>>>>>>> 5c0145fb4b60299445eee33f2a48bfb2fa84bcc8
                <div>
                  <p className="text-sm text-[#68736a] dark:text-[#b7c3ba]">Total Members</p>
                  <p className="font-semibold">25</p>
                </div>
              </div>
<<<<<<< HEAD
=======
              <div className="bg-muted/50 dark:bg-muted p-3 rounded-md flex items-center space-x-3">
                <Building className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Founded</p>
                  <p className="font-medium">{repData.club.founded}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2 text-foreground">Club Management</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted/50 dark:bg-muted rounded-md">
                <div>
                  <p className="font-medium text-foreground">Manage Club Profile</p>
                  <p className="text-sm text-muted-foreground">Update club details and information</p>
                </div>
                <Button variant="secondary" size="sm">Manage</Button>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 dark:bg-muted rounded-md">
                <div>
                  <p className="font-medium">Open Positions ({repData.club.openPositions})</p>
                  <p className="text-sm text-muted-foreground">Manage recruitment and applications</p>
                </div>
                <Button variant="secondary" size="sm">View</Button>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 dark:bg-muted rounded-md">
                <div>
                  <p className="font-medium">Membership Requests</p>
                  <p className="text-sm text-muted-foreground">Review and approve member applications</p>
                </div>
                <Button variant="secondary" size="sm">Review</Button>
              </div>
>>>>>>> 5c0145fb4b60299445eee33f2a48bfb2fa84bcc8
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClubRepProfile;
