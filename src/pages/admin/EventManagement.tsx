import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { 
  Check, 
  X, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Loader2,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, parseISO } from 'date-fns';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Define interfaces with exact properties from database
interface Profile {
  full_name: string;
  avatar_url: string | null;
}

interface Club {
  id: string;
  name: string;
  logo_url: string | null;
}

interface Event {
  id: string;
  title: string;
  description: string;
  club_id: string;
  created_by: string;
  event_type: string;
  location: string;
  start_time: string;
  end_time: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  club?: Club;
  profile?: Profile | null; // Make profile optional or null
  ui_status?: 'pending' | 'approved' | 'rejected'; // UI only field
}

const EventManagement = () => {
  const queryClient = useQueryClient();
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});
  const [events, setEvents] = useState<Event[]>([]);
  
  // Fetch events
  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchUserProfile = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Mutation for approving/rejecting events (simulated for UI)
  const updateEventMutation = useMutation({
    mutationFn: async ({ id, ui_status }: { id: string; ui_status: 'approved' | 'rejected' }) => {
      // Simulate for UI only
      return { id, ui_status };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['admin-events'], (oldData: Event[] | undefined) => 
        oldData?.map(event => 
          event.id === data.id 
            ? { ...event, ui_status: data.ui_status } 
            : event
        )
      );
      
      toast({
        title: `Event ${data.ui_status}`,
        description: `The event has been ${data.ui_status} successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Action failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await fetch(`/api/events/${id}`, {
        method: 'DELETE'
      });

      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData(['admin-events'], (oldData: Event[] | undefined) => 
        oldData?.filter(event => event.id !== id)
      );
      
      toast({
        title: "Event deleted",
        description: "The event has been permanently deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const toggleEventExpansion = (eventId: string) => {
    setExpandedEvents(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  if (events.length === 0) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-[#344b38] dark:text-[#dce8dd]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-[#1d2c24] dark:text-[#f5f2e9]">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Event Management</h1>
        <p className="mt-2 text-[#68736a] dark:text-[#b7c3ba]">Review and moderate events</p>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="h-auto flex-wrap rounded-xl bg-[#ebe7dd] p-1 dark:bg-[#223128]">
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          <Card className="overflow-hidden rounded-2xl border-[#e5dfd3] bg-white/85 shadow-sm dark:border-[#34443a] dark:bg-[#1c2921]">
          <CardHeader className="border-b border-[#e9e4d9] dark:border-[#34443a]">
              <CardTitle>All Events</CardTitle>
              <CardDescription>
                View and manage all events in the system
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto p-4 sm:p-6">
              <Table className="min-w-[760px]">
                <TableCaption>List of all events in the system</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Club</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Organizer</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events && events.length > 0 ? (
                    events.map((event) => (
                      <React.Fragment key={event.id}>
                        <TableRow>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={event.club?.logo_url || ''} alt={event.club?.name} />
                                <AvatarFallback>{event.club?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span>{event.club?.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{event.title}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleEventExpansion(event.id)}
                                className="p-0 h-6 w-6"
                              >
                                {expandedEvents[event.id] ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                              <Badge>{event.event_type}</Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="flex items-center text-sm">
                                <Calendar className="mr-1 h-4 w-4 text-[#7d877f] dark:text-[#9daa9f]" />
                                {format(parseISO(event.start_time), 'MMM d, yyyy')}
                              </div>
                              <div className="flex items-center text-sm text-[#7d877f] dark:text-[#9daa9f]">
                                <Clock className="h-4 w-4 mr-1" />
                                {format(parseISO(event.start_time), 'h:mm a')}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={event.profile?.avatar_url || ''} alt={event.profile?.full_name} />
                                <AvatarFallback>
                                  {event.profile?.full_name 
                                    ? event.profile.full_name.substring(0, 2).toUpperCase() 
                                    : 'UN'}
                                </AvatarFallback>
                              </Avatar>
                              <span>{event.profile?.full_name || 'Unknown'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {event.ui_status ? (
                                <Badge 
                                  variant={
                                    event.ui_status === 'approved' 
                                      ? 'default' 
                                      : event.ui_status === 'rejected' 
                                        ? 'destructive' 
                                        : 'outline'
                                  }
                                  className={event.ui_status === 'approved' ? "bg-[#344b38] text-white hover:bg-[#26382d]" : ""}
                                >
                                  {event.ui_status.charAt(0).toUpperCase() + event.ui_status.slice(1)}
                                </Badge>
                              ) : (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => updateEventMutation.mutate({ id: event.id, ui_status: 'approved' })}
                                    className="h-8 border-[#8da18e] text-[#344b38] hover:bg-[#edf2e9] dark:border-[#66806c] dark:text-[#dce8dd] dark:hover:bg-[#26382d]"
                                  >
                                    <Check className="h-4 w-4 mr-1" /> Approve
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => deleteEventMutation.mutate(event.id)}
                                    className="h-8 border-[#d9a28e] text-[#9b4d32] hover:bg-[#fbefe9] dark:border-[#9b614e] dark:text-[#f2c8b7] dark:hover:bg-[#392b25]"
                                  >
                                    <X className="h-4 w-4 mr-1" /> Delete
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                        
                        {expandedEvents[event.id] && (
                          <TableRow className="bg-[#f6f3ec] dark:bg-[#223128]">
                            <TableCell colSpan={5}>
                              <div className="space-y-4 p-4 text-[#344239] dark:text-[#e0e8e1]">
                                {event.image_url && (
                                  <div>
                                    <img 
                                      src={event.image_url} 
                                      alt={event.title} 
                                      className="rounded-md max-h-80 object-contain" 
                                    />
                                  </div>
                                )}
                                <div>
                                  <div className="flex items-center mb-2">
                                    <MapPin className="mr-1 h-4 w-4 text-[#7d877f] dark:text-[#9daa9f]" />
                                    <span className="text-sm">{event.location}</span>
                                  </div>
                                  <h4 className="font-medium">Description:</h4>
                                  <p className="whitespace-pre-line text-sm">{event.description}</p>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <AlertTriangle className="h-12 w-12 mb-2" />
                          <h3 className="text-lg font-medium">No events found</h3>
                          <p>There are no events in the system yet.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Events scheduled in the future</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-[#68736a] dark:text-[#b7c3ba]">
                <AlertTriangle className="h-12 w-12 mb-2" />
                <h3 className="text-lg font-medium">No upcoming events</h3>
                <p>There are no upcoming events scheduled.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="past">
          <Card>
            <CardHeader>
              <CardTitle>Past Events</CardTitle>
              <CardDescription>Events that have already taken place</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-[#68736a] dark:text-[#b7c3ba]">
                <AlertTriangle className="h-12 w-12 mb-2" />
                <h3 className="text-lg font-medium">No past events</h3>
                <p>There are no past events in the system.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventManagement;
