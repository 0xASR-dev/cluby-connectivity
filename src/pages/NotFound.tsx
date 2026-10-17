
import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type ErrorContext = {
  title: string;
  description: string;
  actionText: string;
  actionLink: string;
  icon: React.ReactNode;
};

const NotFound = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [errorContext, setErrorContext] = useState<ErrorContext>({
    title: "Page not found",
    description: "The page you're looking for doesn't exist or has been moved.",
    actionText: "Go to Home",
    actionLink: user ? "/dashboard" : "/",
    icon: <Home className="h-5 w-5 mr-2" />,
  });

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    // Determine context based on the URL pattern
    if (location.pathname.includes("/clubs/")) {
      setErrorContext({
        title: "Club not found",
        description: "The club you're looking for doesn't exist or has been removed.",
        actionText: "Browse Clubs",
        actionLink: "/clubs",
        icon: <Search className="h-5 w-5 mr-2" />,
      });
    } else if (location.pathname.includes("/recruit/")) {
      setErrorContext({
        title: "Position not found",
        description: "This recruitment position is no longer available or has been filled.",
        actionText: "View Open Positions",
        actionLink: "/recruit",
        icon: <Search className="h-5 w-5 mr-2" />,
      });
    } else if (location.pathname.includes("/community/")) {
      setErrorContext({
        title: "Post not found",
        description: "This post has been removed or doesn't exist.",
        actionText: "Community Feed",
        actionLink: "/community",
        icon: <Search className="h-5 w-5 mr-2" />,
      });
    }
  }, [location.pathname, user]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f3ec] px-4 py-12 text-[#1d2c24] dark:bg-[#111a16] dark:text-[#f5f2e9]">
      <div className="w-full max-w-xl space-y-7 rounded-[1.75rem] border border-[#e5dfd3] bg-white/85 p-8 shadow-sm dark:border-[#34443a] dark:bg-[#1c2921] sm:p-12">
        <div className="text-center">
          <h1 className="text-8xl font-semibold tracking-[-0.08em] text-[#344b38] dark:text-[#b7cbb7] sm:text-9xl">404</h1>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">{errorContext.title}</h2>
          <p className="mt-3 text-[#68736a] dark:text-[#b7c3ba]">{errorContext.description}</p>
        </div>
        
        <div className="flex flex-col space-y-3">
          <Button asChild className="w-full">
            <Link to={errorContext.actionLink}>
              {errorContext.icon}
              {errorContext.actionText}
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full">
            <Link to={-1 as any}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
