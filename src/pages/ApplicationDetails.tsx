
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getRecruitmentById } from '@/lib/mongodb/services/recruitmentService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import ApplyForm from '@/components/recruitment/ApplyForm';
import RecruitmentNotFound from '@/components/errors/RecruitmentNotFound';

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: position, isLoading, error } = useQuery({
    queryKey: ['recruitment', id],
    queryFn: () => getRecruitmentById(id || ''),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[#344b38] dark:text-[#dce8dd]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !position?.data) {
    return <RecruitmentNotFound />;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-6 text-[#1d2c24] dark:text-[#f5f2e9] sm:py-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Apply for Position</h1>
        <p className="mt-2 text-[#68736a] dark:text-[#b7c3ba]">Submit your application for {position.data.title}</p>
      </div>
      
      <Card className="overflow-hidden rounded-2xl border-[#e5dfd3] bg-white/85 shadow-sm dark:border-[#34443a] dark:bg-[#1c2921]">
        <CardHeader className="border-b border-[#e9e4d9] bg-[#f0ede4] dark:border-[#34443a] dark:bg-[#223128]">
          <CardTitle>Position Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 p-5 sm:p-7">
          <div className="space-y-5">
            <div>
              <h2 className="font-semibold text-lg">{position.data.title}</h2>
              <p className="text-[#68736a] dark:text-[#b7c3ba]">{position.data.club?.name}</p>
            </div>
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="text-[#68736a] dark:text-[#b7c3ba]">{position.data.description}</p>
            </div>
            <div>
              <h3 className="font-medium">Requirements</h3>
              <p className="text-[#68736a] dark:text-[#b7c3ba]">{position.data.requirements}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <ApplyForm position={position.data} />
    </div>
  );
};

export default ApplicationDetails;
