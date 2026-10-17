
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface ApplicationFormProps {
  position: {
    id: string;
    title: string;
    club: string;
    description: string;
    requirements: string;
    deadline: string;
  }
}

const ApplicationForm = ({ position }: ApplicationFormProps) => {
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would submit to an API
    toast({
      title: "Application submitted",
      description: "Your application has been submitted successfully. You'll be notified when there's an update.",
    });
    
    // Redirect after submission
    navigate('/dashboard');
  };
  
  return (
    <Card className="mx-auto max-w-2xl overflow-hidden rounded-2xl border-[#e5dfd3] bg-white/85 shadow-sm dark:border-[#34443a] dark:bg-[#1c2921]">
      <CardHeader className="border-b border-[#e9e4d9] bg-[#f0ede4] dark:border-[#34443a] dark:bg-[#223128]">
        <CardTitle>Apply for {position.title}</CardTitle>
        <CardDescription>{position.club}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5 p-5 sm:p-7">
          <div className="space-y-2">
            <Label>Position Details</Label>
            <div className="rounded-xl border border-[#e9e4d9] bg-[#f6f3ec] p-4 dark:border-[#34443a] dark:bg-[#223128]">
              <h3 className="font-medium">{position.title}</h3>
              <p className="text-sm mt-1">{position.description}</p>
              <div className="mt-2">
                <p className="text-sm"><span className="font-medium">Requirements:</span> {position.requirements}</p>
                <p className="text-sm"><span className="font-medium">Deadline:</span> {position.deadline}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="app-motivation">Why are you interested in this position? *</Label>
            <Textarea 
              id="app-motivation" 
              placeholder="Describe your motivation and interest in this role..." 
              rows={4}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="app-experience">Relevant Experience *</Label>
            <Textarea 
              id="app-experience" 
              placeholder="Describe your experience related to this position..." 
              rows={4}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="app-availability">Availability *</Label>
            <RadioGroup defaultValue="flexible">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="flexible" id="flexible" />
                <Label htmlFor="flexible" className="font-normal">Flexible - Anytime</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekday" id="weekday" />
                <Label htmlFor="weekday" className="font-normal">Weekdays Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekend" id="weekend" />
                <Label htmlFor="weekend" className="font-normal">Weekends Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="evening" id="evening" />
                <Label htmlFor="evening" className="font-normal">Evenings Only</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="app-portfolio">Portfolio URL (if applicable)</Label>
            <Input 
              id="app-portfolio" 
              type="url" 
              placeholder="https://yourportfolio.com" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="app-additional">Additional Information</Label>
            <Textarea 
              id="app-additional" 
              placeholder="Any other information you'd like to share..." 
              rows={3}
            />
          </div>
        </CardContent>
        
        <CardFooter className="justify-between border-t border-[#e9e4d9] px-5 pt-5 dark:border-[#34443a] sm:px-7">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit">
            Submit Application
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ApplicationForm;
