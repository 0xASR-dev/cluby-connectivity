import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import { 
  MoreHorizontal, 
  Loader2, 
  Shield, 
  User, 
  Users, 
  AlertTriangle, 
  Edit, 
  Trash2, 
  Award
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { getInitials } from '@/lib/utils';

// Define interfaces
interface ClubRepresentative {
  id: string;
  name: string;
  club_id: string;
  email?: string;
  created_at?: string;
}

interface Student {
  id: string;
  full_name: string;
  email: string;
  department?: string;
  year?: string;
  created_at: string;
}

const UserManagement = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('students');
  
  // Fetch students
  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ['admin-students'],
    queryFn: async () => {
      const { data, error } = await fetch('/api/users');
        
      if (error) throw error;
      
      // Fetch email for each user from auth.users (would need admin access)
      // For now, just populate with a placeholder
      const studentsWithEmail = data.map(student => ({
        ...student,
        email: `${student.username || 'user'}@example.com`
      }));
      
      return studentsWithEmail as Student[];
    },
    enabled: activeTab === 'students',
  });
  
  // Fetch club representatives - Fix the SQL query
  const { data: clubReps, isLoading: clubRepsLoading } = useQuery({
    queryKey: ['admin-club-reps'],
    queryFn: async () => {
      // Fix the SQL query by joining the profiles table to get the representative's name
      const { data, error } = await fetch('/api/clubs');
        
      if (error) throw error;
      
      // Transform the data to match the ClubRepresentative interface
      const clubRepresentatives = data.map(club => ({
        id: club.representative_id || '',
        name: club.name || 'Unknown Club',
        club_id: club.id || '',
      }));
      
      return clubRepresentatives as ClubRepresentative[];
    },
    enabled: activeTab === 'club-reps',
  });
  
  // Ban user mutation (simulated)
  const banUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/users/${userId}/ban`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to ban user');
      return response.json();
    },
    onSuccess: (userId) => {
      toast({
        title: "User banned",
        description: "The user has been banned from the platform.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to ban user",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });
  
  // Delete user mutation (simulated)
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete user');
      return response.json();
    },
    onSuccess: (userId) => {
      toast({
        title: "User deleted",
        description: "The user has been permanently deleted from the platform.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete user",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const renderStudentsTable = () => {
    if (studentsLoading) {
      return (
        <div className="flex h-40 items-center justify-center text-[#344b38] dark:text-[#dce8dd]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!students || students.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-[#68736a] dark:text-[#b7c3ba]">
          <AlertTriangle className="h-12 w-12 mb-2" />
          <h3 className="text-lg font-medium">No students found</h3>
          <p>There are no student accounts registered on the platform.</p>
        </div>
      );
    }

    return (
      <Table className="min-w-[700px]">
        <TableCaption>List of all student accounts</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(student.full_name)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{student.full_name || 'Unknown Student'}</span>
                </div>
              </TableCell>
              <TableCell>{student.email || 'No email'}</TableCell>
              <TableCell>{student.department || 'Not specified'}</TableCell>
              <TableCell>{student.year || 'Not specified'}</TableCell>
              <TableCell>{student.created_at ? format(new Date(student.created_at), 'MMM d, yyyy') : 'Unknown'}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem 
                      className="flex items-center"
                      onClick={() => {
                        // View profile logic
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center"
                      onClick={() => {
                        // Edit user logic
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit User
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="flex items-center text-amber-600"
                      onClick={() => banUserMutation.mutate(student.id)}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Ban User
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center text-red-600"
                      onClick={() => deleteUserMutation.mutate(student.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderClubRepsTable = () => {
    if (clubRepsLoading) {
      return (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!clubReps || clubReps.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <AlertTriangle className="h-12 w-12 mb-2" />
          <h3 className="text-lg font-medium">No club representatives found</h3>
          <p>There are no club representative accounts registered on the platform.</p>
        </div>
      );
    }

    return (
      <Table className="min-w-[700px]">
        <TableCaption>List of all club representative accounts</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Club</TableHead>
            <TableHead>Representative ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clubReps.map((rep) => (
            <TableRow key={rep.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(rep.name)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{rep.name}</span>
                </div>
              </TableCell>
              <TableCell>{rep.id}</TableCell>
              <TableCell>
                <Badge variant="outline" className="border-[#cbd6cb] bg-[#e5ecdf] text-[#344b38] dark:border-[#48564d] dark:bg-[#26382d] dark:text-[#dce8dd]">
                  Active
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem 
                      className="flex items-center"
                      onClick={() => {
                        // View club logic
                      }}
                    >
                      <Award className="h-4 w-4 mr-2" />
                      View Club
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center"
                      onClick={() => {
                        // View rep profile logic
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="flex items-center text-amber-600"
                      onClick={() => banUserMutation.mutate(rep.id)}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Ban Representative
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center text-red-600"
                      onClick={() => deleteUserMutation.mutate(rep.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Representative
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-8 text-[#1d2c24] dark:text-[#f5f2e9]">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">User Management</h1>
        <p className="mt-2 text-[#68736a] dark:text-[#b7c3ba]">Manage user accounts and permissions</p>
      </div>
      
      <Card className="overflow-hidden rounded-2xl border-[#e5dfd3] bg-white/85 shadow-sm dark:border-[#34443a] dark:bg-[#1c2921]">
        <CardHeader className="border-b border-[#e9e4d9] dark:border-[#34443a]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Accounts</CardTitle>
              <CardDescription>View and manage all user accounts on the platform</CardDescription>
            </div>
            <Button className="bg-[#1d2c24] text-white hover:bg-[#344b38] dark:bg-[#d9e5dc] dark:text-[#1d2c24] dark:hover:bg-white">
              <User className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto p-4 sm:p-6">
          <Tabs defaultValue="students" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-auto flex-wrap rounded-xl bg-[#ebe7dd] p-1 dark:bg-[#223128]">
              <TabsTrigger value="students" onClick={() => setActiveTab('students')}>
                <User className="h-4 w-4 mr-2" />
                Students
              </TabsTrigger>
              <TabsTrigger value="club-reps" onClick={() => setActiveTab('club-reps')}>
                <Award className="h-4 w-4 mr-2" />
                Club Representatives
              </TabsTrigger>
              <TabsTrigger value="admins">
                <Shield className="h-4 w-4 mr-2" />
                Admins
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="students" className="mt-6">
              {renderStudentsTable()}
            </TabsContent>
            
            <TabsContent value="club-reps" className="mt-6">
              {renderClubRepsTable()}
            </TabsContent>
            
            <TabsContent value="admins" className="mt-6">
              <Table className="min-w-[700px]">
                <TableCaption>List of all admin accounts</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">Admin User</span>
                      </div>
                    </TableCell>
                    <TableCell>admin@cluby.com</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-[#cbd6cb] bg-[#e5ecdf] text-[#344b38] dark:border-[#48564d] dark:bg-[#26382d] dark:text-[#dce8dd]">
                        Super Admin
                      </Badge>
                    </TableCell>
                    <TableCell>Now</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" disabled>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
