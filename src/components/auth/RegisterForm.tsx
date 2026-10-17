import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: '',
    department: '',
    year: '',
    club_id: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role as 'student' | 'club_rep' | 'admin',
        department: formData.department,
        year: formData.year,
        clubId: formData.club_id
      });

      toast({
        title: 'Success',
        description: 'Registration successful',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to register',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen grid-cols-[repeat(auto-fit,minmax(min(100%,30rem),1fr))] bg-background text-foreground">
      <section className="flex items-center justify-center px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        <Card className="w-full max-w-2xl space-y-7 rounded-2xl border-border bg-card p-6 shadow-lg shadow-primary/5 sm:p-9">
          <CardHeader className="space-y-3 p-0">
            <div className="mb-2 flex items-center gap-2.5 text-sm font-semibold tracking-wide text-primary">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-primary" />
              Cluby
            </div>
            <CardTitle className="text-3xl font-semibold tracking-tight text-card-foreground sm:text-[2rem]">
              Create an Account
            </CardTitle>
            <CardDescription className="text-base leading-relaxed text-muted-foreground">
              Enter your details to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2.5">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-foreground"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="h-12 w-full rounded-lg border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-offset-background"
                  />
                </div>

                <div className="space-y-2.5">
                  <Label
                    htmlFor="fullName"
                    className="text-sm font-medium text-foreground"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="h-12 w-full rounded-lg border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-offset-background"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label
                  htmlFor="role"
                  className="text-sm font-medium text-foreground"
                >
                  Role
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={handleRoleChange}
                >
                  <SelectTrigger id="role" className="h-12 w-full rounded-lg border-border bg-background text-foreground focus:ring-ring">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="club_rep">Club Representative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.role === 'student' && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-2.5">
                    <Label
                      htmlFor="department"
                      className="text-sm font-medium text-foreground"
                    >
                      Department
                    </Label>
                    <Input
                      id="department"
                      name="department"
                      type="text"
                      placeholder="Your department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="h-12 rounded-lg border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-offset-background"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label
                      htmlFor="year"
                      className="text-sm font-medium text-foreground"
                    >
                      Year
                    </Label>
                    <Input
                      id="year"
                      name="year"
                      type="number"
                      placeholder="Current year"
                      value={formData.year}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      min="1"
                      max="4"
                      className="h-12 rounded-lg border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-offset-background"
                    />
                  </div>
                </div>
              )}

              {formData.role === 'club_rep' && (
                <div className="space-y-2.5">
                  <Label
                    htmlFor="club_id"
                    className="text-sm font-medium text-foreground"
                  >
                    Club ID
                  </Label>
                  <Input
                    id="club_id"
                    name="club_id"
                    type="text"
                    placeholder="Enter your club ID"
                    value={formData.club_id}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="h-12 rounded-lg border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-offset-background"
                  />
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2.5">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
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

                <div className="space-y-2.5">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-foreground"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="h-12 w-full rounded-lg border-border bg-background pr-12 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-offset-background"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      aria-pressed={showConfirmPassword}
                      className="absolute right-2.5 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {showConfirmPassword ? <EyeOff aria-hidden="true" size={17} /> : <Eye aria-hidden="true" size={17} />}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="h-12 w-full rounded-lg bg-primary text-base font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:ring-ring focus-visible:ring-offset-background"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center p-0">
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="rounded-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                Sign in
              </Link>
            </p>
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
            Join our community and connect with clubs that match your interests.
          </p>
          <div className="mt-12 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/[0.06] p-5">
              <h3 className="font-semibold text-primary-foreground">For Students</h3>
              <p className="mt-2 text-sm leading-relaxed text-primary-foreground/80">Discover and join clubs that align with your interests</p>
            </div>
            <div className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/[0.06] p-5">
              <h3 className="font-semibold text-primary-foreground">For Clubs</h3>
              <p className="mt-2 text-sm leading-relaxed text-primary-foreground/80">Manage your club and connect with interested students</p>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}
