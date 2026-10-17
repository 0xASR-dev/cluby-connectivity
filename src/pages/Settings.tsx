import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { User, ShieldAlert, Key } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings updated",
      description: "Your settings have been saved successfully.",
    });
  };

  return (
    <div className="space-y-8 text-[#1d2c24] dark:text-[#f5f2e9]">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Settings</h1>
        <p className="mt-2 text-[#68736a] dark:text-[#b7c3ba]">Manage your profile and preferences</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
        <TabsList className="grid h-auto w-full grid-cols-3 rounded-xl bg-[#ebe7dd] p-1 dark:bg-[#223128]">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Key className="h-4 w-4" /> Account
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card className="rounded-2xl border-border bg-card shadow-sm">
            <CardHeader className="border-b border-border">
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 p-5 sm:p-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user?.fullName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email} />
                </div>
              </div>
              
              {user?.role === 'student' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" defaultValue={user.department ?? ''} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input id="year" defaultValue={user.year ?? ''} />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" defaultValue="Student at Example University" />
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card className="rounded-2xl border-[#e5dfd3] bg-white/85 shadow-sm dark:border-[#34443a] dark:bg-[#1c2921]">
            <CardHeader className="border-b border-[#e9e4d9] dark:border-[#34443a]">
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 p-5 sm:p-7">
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="two-factor" className="flex flex-col space-y-1">
                    <span>Two-Factor Authentication</span>
                    <span className="font-normal text-muted-foreground text-sm">
                      Add an extra layer of security to your account
                    </span>
                  </Label>
                  <Switch id="two-factor" />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card className="rounded-2xl border-[#e5dfd3] bg-white/85 shadow-sm dark:border-[#34443a] dark:bg-[#1c2921]">
            <CardHeader className="border-b border-[#e9e4d9] dark:border-[#34443a]">
              <CardTitle>Account Management</CardTitle>
              <CardDescription>
                Manage your account settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 p-5 sm:p-7">
              <div className="space-y-4">
                <div className="rounded-xl border border-[#dfd6c2] bg-[#f4efe3] px-4 py-3 dark:border-[#526256] dark:bg-[#26382d]">
                  <h3 className="text-sm font-medium text-[#344b38] dark:text-[#e1eadf]">Account Type: {user?.role === 'student' ? 'Student' : user?.role === 'clubRepresentative' ? 'Club Representative' : 'Administrator'}</h3>
                  <p className="mt-1 text-sm text-[#68736a] dark:text-[#c1cec3]">
                    Your account permissions are based on your current role. Contact an administrator if you need to change your role.
                  </p>
                </div>
                
                <div className="pt-2">
                  <h3 className="mb-2 text-sm font-medium">Data & Privacy</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="data-collection" className="flex flex-col space-y-1">
                        <span>Data Collection</span>
                        <span className="font-normal text-muted-foreground text-sm">
                          Allow us to collect usage data to improve the platform
                        </span>
                      </Label>
                      <Switch id="data-collection" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
