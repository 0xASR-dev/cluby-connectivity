import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f3ec] p-4 text-[#1d2c24] dark:bg-[#111a16] dark:text-[#f5f2e9]">
      <div className="w-full max-w-lg space-y-6 rounded-[1.75rem] border border-[#e5dfd3] bg-white/85 p-8 text-center shadow-sm dark:border-[#34443a] dark:bg-[#1c2921] sm:p-12">
        <h1 className="text-4xl font-semibold tracking-tight text-[#9b4d32]">403 - Unauthorized</h1>
        <p className="text-lg text-[#68736a] dark:text-[#b7c3ba]">
          You don't have permission to access this page.
        </p>
        <div className="space-x-4">
          <Button
            variant="default"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
          >
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 