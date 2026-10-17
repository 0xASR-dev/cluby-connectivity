import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Eye, EyeOff, Mail } from 'lucide-react';
import { Label } from '@/components/ui/label';

const LoginForm = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }

      await login({ email, password });

      toast({
        title: 'Success',
        description: 'Login successful',
      });
    } catch (error: any) {
      console.error("Login failed:", error);

      let errorMessage = 'An error occurred during login';
      if (error.message.includes('404')) {
        errorMessage = 'Server is not responding. Please try again later.';
      } else if (error.message.includes('401')) {
        errorMessage = 'Invalid email or password';
      } else if (error.message.includes('403')) {
        errorMessage = 'Account is not active';
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen grid-cols-[repeat(auto-fit,minmax(min(100%,30rem),1fr))] bg-background text-foreground">
      <section className="flex items-center justify-center px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        <Card className="w-full max-w-lg space-y-7 rounded-2xl border-border bg-card p-6 shadow-lg shadow-primary/5 sm:p-9">
          <CardHeader className="space-y-3 p-0">
            <div className="mb-2 flex items-center gap-2.5 text-sm font-semibold tracking-wide text-primary">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-primary" />
              Cluby
            </div>
            <CardTitle className="text-3xl font-semibold tracking-tight text-card-foreground sm:text-[2rem]">
              Welcome back
            </CardTitle>
            <CardDescription className="text-base leading-relaxed text-muted-foreground">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
                <div className="relative">
                  <Mail aria-hidden="true" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12 w-full rounded-lg border-border bg-background pl-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-offset-background"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="rounded-sm text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12 w-full rounded-lg border-border bg-background pr-12 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-offset-background"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    className="absolute right-2.5 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {showPassword ? <EyeOff aria-hidden="true" size={17} /> : <Eye aria-hidden="true" size={17} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-0.5">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="border-border focus-visible:ring-ring data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />
                <Label
                  htmlFor="remember-me"
                  className="cursor-pointer text-sm text-muted-foreground"
                >
                  Remember me
                </Label>
              </div>

              <Button
                type="submit"
                className="h-12 w-full rounded-lg bg-primary text-base font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:ring-ring focus-visible:ring-offset-background"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-5 p-0">
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="rounded-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                Create an account
              </Link>
            </p>

            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-[0.12em]">
                <span className="bg-card px-3 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-3">
              <Button variant="outline" className="h-11 rounded-lg border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring" type="button">
                Google
              </Button>
              <Button variant="outline" className="h-11 rounded-lg border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring" type="button">
                GitHub
              </Button>
            </div>
          </CardFooter>
        </Card>
      </section>

      <aside className="relative hidden overflow-hidden bg-primary px-10 py-14 text-primary-foreground lg:flex lg:items-center lg:px-14 xl:px-20">
        <div aria-hidden="true" className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full border border-primary-foreground/10" />
        <div aria-hidden="true" className="absolute -right-16 -top-16 h-[21rem] w-[21rem] rounded-full border border-primary-foreground/10" />
        <div className="relative mx-auto w-full max-w-xl">
          <div aria-hidden="true" className="mb-9 h-px w-16 bg-primary-foreground/50" />
          <h2 className="max-w-lg text-4xl font-semibold leading-[1.12] tracking-tight xl:text-5xl">
            Welcome to Cluby
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-primary-foreground/80">
            Connect with your favorite clubs and stay updated with campus activities.
          </p>
          <div className="mt-12 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/[0.06] p-5">
              <h3 className="font-semibold text-primary-foreground">Quick Access</h3>
              <p className="mt-2 text-sm leading-relaxed text-primary-foreground/80">Access your club activities and events in one place</p>
            </div>
            <div className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/[0.06] p-5">
              <h3 className="font-semibold text-primary-foreground">Stay Connected</h3>
              <p className="mt-2 text-sm leading-relaxed text-primary-foreground/80">Get real-time updates from your clubs and community</p>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
};

export default LoginForm;
