import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const StudentProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-2xl border-[#e5dfd3] bg-white/85 shadow-sm dark:border-[#34443a] dark:bg-[#1c2921]">
        <CardHeader className="border-b border-[#e9e4d9] pb-5 dark:border-[#34443a]">
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row">
            <div className="flex min-w-0 items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.profile?.avatar_url} alt={user?.profile?.full_name || ''} />
                <AvatarFallback className="text-lg">{user?.profile?.full_name?.charAt(0) || user?.email.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl tracking-tight">{user?.profile?.full_name || 'Student Name'}</CardTitle>
                {user?.profile?.department && user?.profile?.year && (
                  <div className="mt-1 flex items-center text-sm text-[#68736a] dark:text-[#b7c3ba]">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>{user.profile.department}, {user.profile.year}</span>
                  </div>
                )}
                <div className="mt-1 flex items-center text-sm text-[#68736a] dark:text-[#b7c3ba]">
                  <Mail className="h-4 w-4 mr-1" />
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="shrink-0 border-[#d8d2c6] hover:bg-[#f0ede4] dark:border-[#48564d] dark:hover:bg-[#26382d]" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {user?.profile?.bio && (
            <div className="mt-1 rounded-xl bg-[#f6f3ec] p-5 dark:bg-[#223128]">
              <h3 className="mb-2 font-medium">Bio</h3>
              <p className="text-[#68736a] dark:text-[#b7c3ba]">{user.profile.bio}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfile;
