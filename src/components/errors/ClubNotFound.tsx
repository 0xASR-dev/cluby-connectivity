
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";

const ClubNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-[#1d2c24] dark:text-[#f5f2e9]">
      <div className="w-full max-w-xl space-y-6 rounded-[1.75rem] border border-[#e5dfd3] bg-white/85 p-8 text-center shadow-sm dark:border-[#34443a] dark:bg-[#1c2921] sm:p-10">
        <div className="inline-flex rounded-2xl bg-[#e5ecdf] p-5 text-[#344b38] dark:bg-[#34443a] dark:text-[#dce8dd]">
          <Search aria-hidden="true" className="h-10 w-10" />
        </div>
        
        <h2 className="text-2xl font-semibold tracking-tight">Club Not Found</h2>
        <p className="mx-auto max-w-md leading-7 text-[#68736a] dark:text-[#b7c3ba]">
          The club you're looking for might have been removed or doesn't exist. 
          Please check the club ID or browse other available clubs.
        </p>
        
        <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild className="bg-[#1d2c24] text-white hover:bg-[#344b38] dark:bg-[#d9e5dc] dark:text-[#1d2c24] dark:hover:bg-white">
            <Link to="/clubs">Browse Clubs</Link>
          </Button>
          
          <Button asChild variant="outline" className="border-[#d8d2c6] dark:border-[#48564d]">
            <Link to={-1 as any}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClubNotFound;
