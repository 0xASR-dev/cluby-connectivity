
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, BookOpen, Calendar, UserCheck, TrendingUp, BarChart2 } from 'lucide-react';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';

const AdminOverview = () => {
  // Mock data for dashboard stats
  const stats = [
    { title: 'Total Users', value: '1,245', icon: Users },
    { title: 'Active Clubs', value: '32', icon: BookOpen },
    { title: 'Events This Month', value: '18', icon: Calendar },
    { title: 'New Applications', value: '54', icon: UserCheck },
  ];
  
  // Mock data for activity chart
  const activityData = [
    { name: 'Jan', users: 30, events: 10, applications: 5 },
    { name: 'Feb', users: 45, events: 12, applications: 8 },
    { name: 'Mar', users: 55, events: 15, applications: 12 },
    { name: 'Apr', users: 65, events: 18, applications: 14 },
    { name: 'May', users: 90, events: 20, applications: 22 },
    { name: 'Jun', users: 100, events: 25, applications: 28 },
  ];
  
  // Mock data for club distribution
  const clubData = [
    { name: 'Technical', value: 12 },
    { name: 'Cultural', value: 8 },
    { name: 'Sports', value: 6 },
    { name: 'Academic', value: 4 },
    { name: 'Others', value: 2 },
  ];
  
  return (
    <div className="space-y-8 text-[#1d2c24] dark:text-[#f5f2e9]">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Platform Overview</h1>
        <p className="mt-2 text-[#68736a] dark:text-[#b7c3ba]">Monitor platform activity and statistics</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="rounded-2xl border-[#e5dfd3] bg-white/85 shadow-sm dark:border-[#34443a] dark:bg-[#1c2921]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className="rounded-xl bg-[#e5ecdf] p-3 text-[#344b38] dark:bg-[#34443a] dark:text-[#dce8dd]">
                  <stat.icon size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card className="col-span-1 rounded-2xl border-[#e5dfd3] bg-white/85 shadow-sm dark:border-[#34443a] dark:bg-[#1c2921]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Platform Activity</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription>User growth and platform activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <CartesianGrid stroke="#e9e4d9" strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#7d877f" />
                  <YAxis stroke="#7d877f" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#344b38" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="events" stroke="#c96343" />
                  <Line type="monotone" dataKey="applications" stroke="#b18b51" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 rounded-2xl border-[#e5dfd3] bg-white/85 shadow-sm dark:border-[#34443a] dark:bg-[#1c2921]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Club Distribution</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription>Number of clubs by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clubData}>
                  <CartesianGrid stroke="#e9e4d9" strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#7d877f" />
                  <YAxis stroke="#7d877f" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#66806c" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
