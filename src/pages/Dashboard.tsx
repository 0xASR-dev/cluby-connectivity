import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpRight, Bell, CalendarDays, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import StudentApplications from '@/components/dashboard/StudentApplications';
import CRPRecruitment from '@/components/dashboard/CRPRecruitment';
import SeedDatabase from '@/components/admin/SeedDatabase';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 text-foreground sm:px-6 lg:space-y-10 lg:px-8 lg:py-10">
      <header className="border-b border-border pb-6 sm:pb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Dashboard</h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Welcome to Cluby, your platform for campus clubs and activities.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
        <Card className="rounded-2xl border-border bg-card shadow-sm">
          <CardHeader className="space-y-1.5 pb-4">
            <CardTitle className="text-xl font-semibold tracking-tight text-card-foreground">Quick Actions</CardTitle>
            <CardDescription className="text-sm leading-relaxed text-muted-foreground">Common tasks you might want to do</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5">
            <Button
              variant="outline"
              className="h-12 justify-start gap-3 rounded-xl border-border bg-background px-3.5 text-left text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring"
              onClick={() => navigate('/clubs')}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <Users aria-hidden="true" className="h-4 w-4" />
              </span>
              Browse Clubs
            </Button>
            <Button
              variant="outline"
              className="h-12 justify-start gap-3 rounded-xl border-border bg-background px-3.5 text-left text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring"
              onClick={() => navigate('/events')}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <CalendarDays aria-hidden="true" className="h-4 w-4" />
              </span>
              Upcoming Events
            </Button>
            <Button
              variant="outline"
              className="h-12 justify-start gap-3 rounded-xl border-border bg-background px-3.5 text-left text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring"
              onClick={() => navigate('/community')}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <Bell aria-hidden="true" className="h-4 w-4" />
              </span>
              Community Updates
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border bg-card shadow-sm">
          <CardHeader className="space-y-1.5 pb-4">
            <CardTitle className="text-xl font-semibold tracking-tight text-card-foreground">Activity Overview</CardTitle>
            <CardDescription className="text-sm leading-relaxed text-muted-foreground">Your recent platform activity</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="clubs" className="space-y-4">
              <TabsList className="grid h-11 w-full grid-cols-3 rounded-xl bg-muted p-1 text-muted-foreground">
                <TabsTrigger value="clubs" className="rounded-lg data-[state=active]:bg-card data-[state=active]:text-card-foreground data-[state=active]:shadow-sm">Clubs</TabsTrigger>
                <TabsTrigger value="events" className="rounded-lg data-[state=active]:bg-card data-[state=active]:text-card-foreground data-[state=active]:shadow-sm">Events</TabsTrigger>
                <TabsTrigger value="posts" className="rounded-lg data-[state=active]:bg-card data-[state=active]:text-card-foreground data-[state=active]:shadow-sm">Posts</TabsTrigger>
              </TabsList>
              <TabsContent value="clubs" className="mt-0 space-y-0 rounded-xl border border-border bg-background px-4">
                <div className="flex items-center justify-between gap-4 border-b border-border py-3.5">
                  <span className="text-sm font-medium text-foreground">Clubs Joined</span>
                  <span className="text-2xl font-semibold tabular-nums text-primary">0</span>
                </div>
                <div className="flex items-center justify-between gap-4 py-3.5">
                  <span className="text-sm font-medium text-foreground">Applications</span>
                  <span className="text-2xl font-semibold tabular-nums text-primary">0</span>
                </div>
              </TabsContent>
              <TabsContent value="events" className="mt-0 space-y-0 rounded-xl border border-border bg-background px-4">
                <div className="flex items-center justify-between gap-4 border-b border-border py-3.5">
                  <span className="text-sm font-medium text-foreground">Upcoming</span>
                  <span className="text-2xl font-semibold tabular-nums text-primary">0</span>
                </div>
                <div className="flex items-center justify-between gap-4 py-3.5">
                  <span className="text-sm font-medium text-foreground">Attended</span>
                  <span className="text-2xl font-semibold tabular-nums text-primary">0</span>
                </div>
              </TabsContent>
              <TabsContent value="posts" className="mt-0 space-y-0 rounded-xl border border-border bg-background px-4">
                <div className="flex items-center justify-between gap-4 border-b border-border py-3.5">
                  <span className="text-sm font-medium text-foreground">Your Posts</span>
                  <span className="text-2xl font-semibold tabular-nums text-primary">0</span>
                </div>
                <div className="flex items-center justify-between gap-4 py-3.5">
                  <span className="text-sm font-medium text-foreground">Interactions</span>
                  <span className="text-2xl font-semibold tabular-nums text-primary">0</span>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {user?.role === 'student' && (
        <StudentApplications />
      )}

      {user?.role === 'clubRepresentative' && (
        <CRPRecruitment />
      )}

      {user?.role === 'admin' && (
        <section className="space-y-5 border-t border-border pt-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Admin Controls</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="rounded-2xl border-border bg-card shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-card-foreground">Database Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <SeedDatabase />
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-border bg-card shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-card-foreground">User Management</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  variant="default"
                  className="h-11 w-full rounded-lg bg-primary font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring"
                  onClick={() => navigate('/admin/users')}
                >
                  Manage Users
                  <ArrowUpRight aria-hidden="true" className="ml-auto h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-border bg-card shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-card-foreground">Club Approvals</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  variant="default"
                  className="h-11 w-full rounded-lg bg-primary font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring"
                  onClick={() => navigate('/admin/club-approvals')}
                >
                  Review Clubs
                  <ArrowUpRight aria-hidden="true" className="ml-auto h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
