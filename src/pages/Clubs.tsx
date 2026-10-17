
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Users, Calendar, MessageSquare, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for clubs
const MOCK_CLUBS = [
  {
    id: '1',
    name: 'Programming Club',
    description: 'A community of coding enthusiasts who love to build and learn together.',
    members: 128,
    events: 12,
    posts: 45,
    logo: 'https://via.placeholder.com/150?text=PC',
    tags: ['Technology', 'Coding', 'Web Development'],
    isFollowing: true,
    isMember: false,
    featured: true
  },
  {
    id: '2',
    name: 'Photography Club',
    description: 'Capturing moments and creating memories through the lens of a camera.',
    members: 85,
    events: 8,
    posts: 67,
    logo: 'https://via.placeholder.com/150?text=Photo',
    tags: ['Arts', 'Photography', 'Creative'],
    isFollowing: false,
    isMember: true,
    featured: true
  },
  {
    id: '3',
    name: 'Debate Club',
    description: 'Enhancing critical thinking and public speaking skills through debates and discussions.',
    members: 62,
    events: 5,
    posts: 23,
    logo: 'https://via.placeholder.com/150?text=DC',
    tags: ['Speaking', 'Debates', 'Communication'],
    isFollowing: false,
    isMember: false,
    featured: false
  },
  {
    id: '4',
    name: 'Music Club',
    description: 'For students who are passionate about music, singing, and playing instruments.',
    members: 94,
    events: 10,
    posts: 36,
    logo: 'https://via.placeholder.com/150?text=Music',
    tags: ['Arts', 'Music', 'Performance'],
    isFollowing: true,
    isMember: false,
    featured: false
  },
  {
    id: '5',
    name: 'Sports Club',
    description: 'Promoting physical fitness, team spirit, and sportsmanship through various games and activities.',
    members: 156,
    events: 15,
    posts: 42,
    logo: 'https://via.placeholder.com/150?text=Sports',
    tags: ['Sports', 'Fitness', 'Games'],
    isFollowing: false,
    isMember: false,
    featured: true
  },
  {
    id: '6',
    name: 'Dance Club',
    description: 'Expressing emotions and stories through the art of dance and movement.',
    members: 78,
    events: 9,
    posts: 31,
    logo: 'https://via.placeholder.com/150?text=Dance',
    tags: ['Arts', 'Dance', 'Performance'],
    isFollowing: false,
    isMember: false,
    featured: false
  },
];

const Clubs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter clubs based on search and active tab
  const filteredClubs = MOCK_CLUBS.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          club.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          club.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'following') return matchesSearch && club.isFollowing;
    if (activeTab === 'member') return matchesSearch && club.isMember;
    if (activeTab === 'featured') return matchesSearch && club.featured;
    
    return matchesSearch;
  });

  return (
    <div className="space-y-8 text-[#1d2c24] dark:text-[#f5f2e9]">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Clubs</h1>
        <p className="mt-2 text-[#68736a] dark:text-[#b7c3ba]">Discover and connect with campus clubs</p>
      </div>
      
      <div className="flex flex-col gap-3 rounded-2xl border border-[#e5dfd3] bg-white/70 p-3 sm:flex-row dark:border-[#34443a] dark:bg-[#1c2921]">
        <div className="relative flex-1">
          <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#68736a] dark:text-[#b7c3ba]" />
          <Input
            type="search"
            placeholder="Search clubs..."
            className="border-[#e5dfd3] bg-[#fbfaf6] pl-10 dark:border-[#48564d] dark:bg-[#111a16]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="w-full border-[#d8d2c6] bg-white hover:bg-[#f0ede4] sm:w-auto dark:border-[#48564d] dark:bg-[#1c2921] dark:hover:bg-[#26382d]">
          <Filter className="h-4 w-4 mr-2" /> Filter
        </Button>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-xl bg-[#ebe7dd] p-1 sm:grid-cols-4 dark:bg-[#223128]">
          <TabsTrigger value="all">All Clubs</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="member">Member</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredClubs.length > 0 ? (
              filteredClubs.map(club => (
                <ClubCard key={club.id} club={club} />
              ))
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-[#d8d2c6] py-12 text-center dark:border-[#48564d]">
                <p className="text-lg text-[#68736a] dark:text-[#b7c3ba]">No clubs found matching your criteria</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ClubCard = ({ club }: { club: any }) => {
  return (
    <Card className="overflow-hidden rounded-2xl border-[#e5dfd3] bg-white/85 shadow-sm transition-shadow hover:shadow-md dark:border-[#34443a] dark:bg-[#1c2921]">
      <CardHeader className="p-0">
        <div className="relative h-24 bg-gradient-to-r from-[#e8dfc9] to-[#d9e5dc] dark:from-[#26382d] dark:to-[#34443a]">
          {club.featured && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-[#9b4d32] text-white">
                <Star className="h-3 w-3 mr-1" /> Featured
              </Badge>
            </div>
          )}
        </div>
        <div className="flex justify-center -mt-10">
          <img 
            src={club.logo || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=300&fit=crop'} 
            alt={club.name} 
            className="h-20 w-20 rounded-full border-4 border-[#f6f3ec] bg-[#f6f3ec] object-cover dark:border-[#1c2921] dark:bg-[#1c2921]"
          />
        </div>
        <div className="mt-3 text-center">
          <h3 className="text-xl font-semibold tracking-tight">{club.name}</h3>
          <div className="flex justify-center gap-1 mt-1 flex-wrap px-4">
            {club.tags.map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="bg-[#e5ecdf] text-xs text-[#344b38] dark:bg-[#34443a] dark:text-[#dce8dd]">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="line-clamp-3 text-sm leading-6 text-[#68736a] dark:text-[#b7c3ba]">{club.description}</p>
        
        <div className="flex justify-between mt-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{club.members}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{club.events}</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{club.posts}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2 p-4 pt-0">
        <Link to={`/clubs/${club.id}`} className="flex-1">
          <Button variant="default" className="w-full">View Club</Button>
        </Link>
        
        <Button variant="outline" size="icon" aria-label={club.isFollowing ? `Unfollow ${club.name}` : `Follow ${club.name}`} className="border-[#d8d2c6] dark:border-[#48564d]">
          <Heart aria-hidden="true" className={`h-4 w-4 ${club.isFollowing ? 'fill-[#c96343] text-[#c96343]' : ''}`} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Clubs;
