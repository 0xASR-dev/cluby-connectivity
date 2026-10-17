import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Briefcase, 
  Settings, 
  UserCircle, 
  Calendar,
  Bell,
  Award,
  ClipboardList,
  UserPlus,
  BarChart3,
  Megaphone
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  
  // Common navigation items for all users
  const commonNavItems = [
    { 
      name: 'Dashboard', 
      path: '/app/dashboard',
      icon: <LayoutDashboard size={20} /> 
    },
    { 
      name: 'Clubs', 
      path: '/app/clubs',
      icon: <Users size={20} /> 
    },
    { 
      name: 'Events', 
      path: '/app/events',
      icon: <Calendar size={20} /> 
    },
    { 
      name: 'Community', 
      path: '/app/community',
      icon: <MessageSquare size={20} /> 
    },
    { 
      name: 'Profile', 
      path: '/app/profile',
      icon: <UserCircle size={20} /> 
    },
    { 
      name: 'Settings', 
      path: '/app/settings',
      icon: <Settings size={20} /> 
    }
  ];
  
  // Student-specific navigation items
  const studentNavItems = [
    { 
      name: 'Recruit', 
      path: '/app/recruit',
      icon: <Briefcase size={20} /> 
    }
  ];
  
  // Club Representative-specific navigation items
  const clubRepNavItems = [
    { 
      name: 'Recruit', 
      path: '/app/recruit',
      icon: <Briefcase size={20} /> 
    },
    { 
      name: 'Create Position', 
      path: '/app/recruitment/create',
      icon: <ClipboardList size={20} /> 
    },
    { 
      name: 'Members', 
      path: '/app/club-members',
      icon: <UserPlus size={20} /> 
    }
  ];
  
  // Admin-only navigation items
  const adminNavItems = [
    { 
      name: 'Platform Overview', 
      path: '/app/admin/overview',
      icon: <BarChart3 size={20} /> 
    },
    { 
      name: 'User Management', 
      path: '/app/admin/users',
      icon: <Users size={20} /> 
    },
    { 
      name: 'Club Approvals', 
      path: '/app/admin/club-approvals',
      icon: <Award size={20} /> 
    },
    { 
      name: 'Event Management', 
      path: '/app/admin/events',
      icon: <Calendar size={20} /> 
    },
    { 
      name: 'Community Moderation', 
      path: '/app/admin/community',
      icon: <Megaphone size={20} /> 
    }
  ];

  // Get role-specific nav items
  const getRoleSpecificNavItems = () => {
    if (!user) return [...commonNavItems];
    
    switch(user.role) {
      case 'admin':
        return [...commonNavItems];
      case 'clubRepresentative':
        return [...commonNavItems, ...clubRepNavItems];
      case 'student':
      default:
        return [...commonNavItems, ...studentNavItems];
    }
  };

  const navItems = getRoleSpecificNavItems();
  
  return (
    <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-border/70 bg-background md:block">
      <div className="px-3 py-6">
        <nav aria-label="Workspace navigation" className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-300 ease-out",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
              )}
            >
              <span className="mr-3 flex items-center">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
          
          {user?.role === 'admin' && (
            <>
              <div className="pt-5 pb-2">
                <p className="px-4 text-xs font-semibold tracking-wide text-muted-foreground">
                  Administration
                </p>
              </div>
              
              {adminNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-300 ease-out",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                  )}
                >
                  <span className="mr-3 flex items-center">{item.icon}</span>
                  {item.name}
                </NavLink>
              ))}
            </>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
