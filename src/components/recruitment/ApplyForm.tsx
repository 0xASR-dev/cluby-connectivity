
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { applyForRecruitment } from '@/lib/mongodb/services/recruitmentService';

const applicationSchema = z.object({
  coverLetter: z.string().min(50, 'Cover letter must be at least 50 characters'),
  resumeUrl: z.string().url('Please enter a valid URL').optional(),
});

const ApplyForm = ({ position }: { position: any }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const form = useForm<z.infer<typeof applicationSchema>>({
    resolver: zodResolver(applicationSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof applicationSchema>) => {
      return applyForRecruitment({
        recruitment_id: position.id,
        applicant_id: user?.id,
        club_id: position.club_id,
        cover_letter: data.coverLetter,
        resume_url: data.resumeUrl,
        status: 'pending'
      });
    },
    onSuccess: () => {
      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully.",
      });
      navigate('/dashboard');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit application",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: z.infer<typeof applicationSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to apply for positions",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 rounded-2xl border border-[#e5dfd3] bg-white/80 p-5 shadow-sm dark:border-[#34443a] dark:bg-[#1c2921] sm:p-7">
        <FormField
          control={form.control}
          name="coverLetter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Letter</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Tell us why you're interested in this position..."
                  className="min-h-[200px]"
                />
              </FormControl>
              <FormDescription>
                Explain your interest in the position and relevant experience
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resumeUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume URL (Optional)</FormLabel>
              <FormControl>
                <Input {...field} type="url" placeholder="https://your-resume.com" />
              </FormControl>
              <FormDescription>
                Link to your resume or portfolio
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col-reverse justify-end gap-3 border-t border-[#e9e4d9] pt-5 dark:border-[#34443a] sm:flex-row">
          <Button 
            type="button" 
            variant="outline" 
            className="border-[#d8d2c6] dark:border-[#48564d]"
            onClick={() => navigate(-1)}
            disabled={mutation.isPending}
            className="bg-[#1d2c24] text-white hover:bg-[#344b38] dark:bg-[#d9e5dc] dark:text-[#1d2c24] dark:hover:bg-white"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ApplyForm;
