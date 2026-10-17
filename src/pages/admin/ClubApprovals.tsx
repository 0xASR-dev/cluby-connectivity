
import React, { useEffect } from 'react';
import { useClubApprovals } from '@/hooks/useClubApprovals';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const ClubApprovals = () => {
  const { clubs, isLoading, fetchPendingClubs, approveClub, rejectClub } = useClubApprovals();
  
  useEffect(() => {
    fetchPendingClubs();
  }, [fetchPendingClubs]);
  
  const handleApprove = (clubId: string) => {
    approveClub(clubId);
  };
  
  const handleReject = (clubId: string) => {
    rejectClub(clubId);
  };
  
  return (
    <div className="space-y-8 text-[#1d2c24] dark:text-[#f5f2e9]">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Club Approvals</h1>
        <p className="mt-2 text-[#68736a] dark:text-[#b7c3ba]">Review and manage club registration requests</p>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {clubs.length === 0 ? (
            <Card className="rounded-2xl border-[#e5dfd3] bg-white/85 dark:border-[#34443a] dark:bg-[#1c2921]">
              <CardContent className="py-10">
                <div className="text-center text-muted-foreground">
                  No pending club approval requests.
                </div>
              </CardContent>
            </Card>
          ) : (
            clubs.map((club) => (
              <Card key={club.id} className="rounded-2xl border-[#e5dfd3] bg-white/85 shadow-sm dark:border-[#34443a] dark:bg-[#1c2921]">
                <CardHeader className="border-b border-[#e9e4d9] pb-4 dark:border-[#34443a]">
                  <div className="flex flex-col items-start justify-between gap-3 sm:flex-row">
                    <div>
                      <CardTitle>{club.name}</CardTitle>
                      <CardDescription>Representative: {club.representative_id}</CardDescription>
                    </div>
                    <Badge variant="outline" className="border-[#dfd6c2] bg-[#f4efe3] text-[#76573c] dark:border-[#526256] dark:bg-[#26382d] dark:text-[#e3c9a8]">
                      Pending Approval
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm leading-6 text-[#68736a] dark:text-[#b7c3ba]">
                    {club.description || "No description provided"}
                  </p>
                  
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-[#e8c5b9] text-[#9b4d32] hover:bg-[#fbefe9] dark:border-[#714f40] dark:text-[#f2c8b7]"
                      onClick={() => handleReject(club.id)}
                    >
                      <XCircle className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="bg-[#344b38] text-white hover:bg-[#26382d]"
                      onClick={() => handleApprove(club.id)}
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ClubApprovals;
