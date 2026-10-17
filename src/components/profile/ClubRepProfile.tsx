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
      <Card className="overflow-hidden rounded-2xl border-[#e5dfd3] bg-white/85 shadow-sm dark:border-[#34443a] dark:bg-[#1c2921]">
        <CardHeader className="border-b border-[#e9e4d9] pb-5 dark:border-[#34443a]">
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row">
            <div className="flex min-w-0 items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.profile?.avatar_url} alt={repData.name} />
                <AvatarFallback className="text-lg">{repData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl tracking-tight">{repData.name}</CardTitle>
                <div className="text-base font-medium text-[#344b38] dark:text-[#b7cbb7]">{repData.position} at {repData.club.name}</div>
                <div className="mt-1 flex items-center text-sm text-[#68736a] dark:text-[#b7c3ba]">
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
                <div>
                  <p className="text-sm text-[#68736a] dark:text-[#b7c3ba]">Total Members</p>
                  <p className="font-semibold">25</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClubRepProfile;
