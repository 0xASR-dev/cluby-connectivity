import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPosts } from '@/lib/mongodb/services/postService';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertCircle, MessageSquare, Share2, Heart } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CreatePostDialog from '@/components/community/CreatePostDialog';
import PostFilters from '@/components/community/PostFilters';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PostType {
  id: string;
  title: string;
  content: string;
  created_at: string;
  image_url: string | null;
  club_id: string;
  author_id: string;
  post_type: string;
  club: {
    name: string;
    logo_url: string | null;
  };
  author: {
    full_name: string | null;
    avatar_url: string | null;
  } | { error: boolean };
  _count?: {
    likes: number;
    comments: number;
  };
}

interface PostNotFoundProps {
  message: string;
}

const PostNotFound: React.FC<PostNotFoundProps> = ({ message }) => (
  <Alert variant="destructive" className="mb-6 rounded-2xl border-[#e8c5b9] bg-[#fbefe9] text-[#763d2d] dark:border-[#714f40] dark:bg-[#392b25] dark:text-[#f2c8b7]">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>No posts found</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

const Community = () => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const canCreatePost = user?.role === 'clubRepresentative' || user?.role === 'admin';

  const { data: posts, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['posts', activeFilter, searchTerm],
    queryFn: async () => {
      let query: any = {};
      
      if (activeFilter !== 'all') {
        if (activeFilter === 'following') {
          if (!user) {
            return [];
          }
          return [];
        } else if (activeFilter === 'events') {
          query.post_type = 'event';
        } else if (activeFilter === 'announcements') {
          query.post_type = 'announcement';
        }
      }
      
      const { data, error } = await getPosts(query);
      
      if (error) {
        console.error('Error fetching posts:', error);
        throw error;
      }
      
      let filteredPosts = data || [];
      
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        filteredPosts = filteredPosts.filter((post: PostType) => 
          post.title.toLowerCase().includes(lowerSearchTerm) || 
          post.content.toLowerCase().includes(lowerSearchTerm)
        );
      }
      
      const postsWithCounts = filteredPosts.map((post: PostType) => ({
        ...post,
        _count: {
          likes: 0,
          comments: 0
        }
      }));
      
      return postsWithCounts as PostType[];
    }
  });

  const handleFilterChange = (newFilter: string) => {
    setActiveFilter(newFilter);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearchTerm(newSearch);
  };

  const handlePostSuccess = () => {
    setIsDialogOpen(false);
    refetch();
    toast({
      title: "Post created",
      description: "Your post has been published successfully!"
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-7 py-6 text-[#1d2c24] dark:text-[#f5f2e9] sm:py-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Community</h1>
          <p className="mt-2 text-[#68736a] dark:text-[#b7c3ba]">
            Stay updated with the latest posts from college clubs
          </p>
        </div>
        
        {canCreatePost && (
          <Button className="bg-[#1d2c24] text-white hover:bg-[#344b38] dark:bg-[#d9e5dc] dark:text-[#1d2c24] dark:hover:bg-white" onClick={() => setIsDialogOpen(true)}>
            Create Post
          </Button>
        )}
      </div>

      <div className="rounded-2xl border border-[#e5dfd3] bg-white/70 p-4 dark:border-[#34443a] dark:bg-[#1c2921]">
        <PostFilters 
          activeFilter={activeFilter}
          searchTerm={searchTerm}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-[#e5dfd3] bg-white/70 py-20 text-[#68736a] dark:border-[#34443a] dark:bg-[#1c2921] dark:text-[#b7c3ba]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading posts...</span>
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-[#e5dfd3] bg-white/70 py-12 text-center dark:border-[#34443a] dark:bg-[#1c2921]">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-medium">Error loading posts</h3>
          <p className="mt-2 text-[#68736a] dark:text-[#b7c3ba]">{error?.message || "An unexpected error occurred"}</p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => refetch()}
          >
            Try Again
          </Button>
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="space-y-5">
          {posts.map((post: PostType) => (
            <Card key={post.id} className="overflow-hidden rounded-2xl border-[#e5dfd3] bg-white/85 shadow-sm transition-shadow hover:shadow-md dark:border-[#34443a] dark:bg-[#1c2921]">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={post.club.logo_url || ''} alt={post.club.name} />
                    <AvatarFallback>{post.club.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold leading-none">{post.club.name}</h3>
                    <p className="mt-1 text-sm text-[#68736a] dark:text-[#b7c3ba]">
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <h2 className="mb-2 text-xl font-semibold tracking-tight">{post.title}</h2>
                <p className="mb-4 whitespace-pre-line leading-7 text-[#68736a] dark:text-[#b7c3ba]">{post.content}</p>
                
                {post.image_url && (
                  <div className="mb-4 overflow-hidden rounded-xl">
                    <img 
                      src={post.image_url} 
                      alt={post.title} 
                      className="max-h-[400px] w-full object-cover"
                    />
                  </div>
                )}
                
                <div className="mt-4 flex items-center gap-2 border-t border-[#e9e4d9] pt-4 dark:border-[#34443a]">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Heart className="h-4 w-4" />
                    <span>{post._count?.likes || 0}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>{post._count?.comments || 0}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2" onClick={() => {
                    navigator.share?.({
                      title: post.title,
                      text: post.content,
                      url: window.location.href
                    }).catch(() => {
                      toast({
                        title: "Sharing not supported",
                        description: "Your browser doesn't support native sharing"
                      });
                    });
                  }}>
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <PostNotFound 
          message={
            searchTerm 
              ? `No posts found matching "${searchTerm}". Try a different search term.` 
              : activeFilter !== 'all' 
                ? `No posts found with the "${activeFilter}" filter.` 
                : "No posts found in the community yet."
          } 
        />
      )}

      {canCreatePost && (
        <CreatePostDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen}
          onSuccess={handlePostSuccess}
        />
      )}
    </div>
  );
};

export default Community;
