import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { getInitials } from '@/lib/utils';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
<<<<<<< HEAD
    <nav aria-label="Main navigation" className="sticky top-0 z-30 border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="cluby-container flex h-16 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-6">
          <Link to="/app/dashboard" className="shrink-0 text-xl font-bold tracking-[-0.04em] text-primary transition-colors duration-300 ease-out hover:text-primary/80 sm:text-2xl">
            Cluby
          </Link>
          
          <div className="relative hidden w-96 max-w-sm md:flex">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={17} aria-hidden="true" />
            <Input 
              type="search" 
              placeholder="Search clubs, events..." 
              aria-label="Search clubs and events"
              className="w-full rounded-full border-border/80 bg-card pl-9 shadow-none placeholder:text-muted-foreground"
=======
    <nav className="border-b bg-background">
      <div className="cluby-container flex justify-between items-center py-3">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-2xl font-bold text-primary">
            Cluby
          </Link>
          
          <div className="hidden md:flex relative w-96 max-w-sm">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              type="search" 
              placeholder="Search clubs, events..." 
              className="pl-8 w-full"
>>>>>>> 5c0145fb4b60299445eee33f2a48bfb2fa84bcc8
            />
          </div>
        </div>
        
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeSwitcher />
          
<<<<<<< HEAD
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" aria-label="Open account menu" className="relative h-10 w-10 rounded-full transition-colors duration-300 ease-out hover:bg-secondary">
                  <Avatar>
                    <AvatarImage src="/avatar-placeholder.jpg" alt={user.fullName || 'User avatar'} />
                    <AvatarFallback>{getInitials(user.fullName || user.email)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.fullName || user.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/app/profile" className="w-full">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/app/dashboard" className="w-full">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/app/settings" className="w-full">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
=======
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar>
                  <AvatarImage src="/avatar-placeholder.jpg" alt={user?.profile?.full_name || 'User avatar'} />
                  <AvatarFallback>{user ? getInitials(user.profile?.full_name || user.email) : '??'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.profile?.full_name || user?.email || 'User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || 'No email'}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/profile" className="w-full">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/dashboard" className="w-full">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/settings" className="w-full">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
>>>>>>> 5c0145fb4b60299445eee33f2a48bfb2fa84bcc8
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
