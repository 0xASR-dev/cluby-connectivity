
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, UserPlus, Edit, Trash2, ShieldAlert, ShieldCheck } from 'lucide-react';

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock user data - in a real app, this would come from an API
  const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'student', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'club_rep', status: 'active' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'admin', status: 'active' },
    { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', role: 'student', status: 'inactive' },
  ];
  
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="border-[#e8c5b9] bg-[#fbefe9] text-[#763d2d] dark:border-[#714f40] dark:bg-[#392b25] dark:text-[#f2c8b7]">Admin</Badge>;
      case 'club_rep':
        return <Badge className="border-[#cbd6cb] bg-[#e5ecdf] text-[#344b38] dark:border-[#48564d] dark:bg-[#26382d] dark:text-[#dce8dd]">Club Rep</Badge>;
      default:
        return <Badge className="border-[#cbd6cb] bg-[#e5ecdf] text-[#344b38] dark:border-[#48564d] dark:bg-[#26382d] dark:text-[#dce8dd]">Student</Badge>;
    }
  };
  
  return (
    <div className="space-y-8 text-[#1d2c24] dark:text-[#f5f2e9]">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">User Management</h1>
        <p className="mt-2 text-[#68736a] dark:text-[#b7c3ba]">Manage all users on the platform</p>
      </div>
      
      <div className="flex flex-col items-stretch justify-between gap-3 rounded-2xl border border-[#e5dfd3] bg-white/70 p-3 sm:flex-row sm:items-center dark:border-[#34443a] dark:bg-[#1c2921]">
        <div className="relative w-full sm:max-w-64">
          <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#68736a] dark:text-[#b7c3ba]" size={18} />
          <Input 
            type="search" 
            placeholder="Search users..." 
            className="border-[#e5dfd3] bg-[#fbfaf6] pl-10 dark:border-[#48564d] dark:bg-[#111a16]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      
      <Card className="overflow-hidden rounded-2xl border-[#e5dfd3] bg-white/85 shadow-sm dark:border-[#34443a] dark:bg-[#1c2921]">
        <CardHeader className="border-b border-[#e9e4d9] dark:border-[#34443a]">
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-4 sm:p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    {user.status === 'active' ? 
                      <Badge variant="outline" className="border-[#cbd6cb] bg-[#e5ecdf] text-[#344b38] dark:border-[#48564d] dark:bg-[#26382d] dark:text-[#dce8dd]">Active</Badge> :
                      <Badge variant="outline" className="border-[#d8d2c6] bg-[#f0ede4] text-[#68736a] dark:border-[#48564d] dark:bg-[#223128] dark:text-[#b7c3ba]">Inactive</Badge>
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {user.role !== 'admin' ? (
                        <Button variant="ghost" size="icon">
                          <ShieldCheck className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="icon">
                          <ShieldAlert className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" aria-label={`Delete ${user.name}`} className="text-[#9b4d32] hover:bg-[#fbefe9] hover:text-[#763d2d] dark:text-[#f2c8b7] dark:hover:bg-[#392b25]">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
