
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import React from 'react';

interface PostFiltersProps {
  activeFilter: string;
  searchTerm: string;
  onFilterChange: (filter: string) => void;
  onSearchChange: (search: string) => void;
}

const PostFilters: React.FC<PostFiltersProps> = ({ 
  activeFilter, 
  searchTerm, 
  onFilterChange, 
  onSearchChange 
}) => {
  const filters = [
    { value: 'all', label: 'All Posts' },
    { value: 'following', label: 'Following' },
    { value: 'events', label: 'Events' },
    { value: 'announcements', label: 'Announcements' }
  ];

  return (
    <div className="space-y-4">
      <div role="group" aria-label="Filter community posts" className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map(filter => (
          <Button
            key={filter.value}
            variant={activeFilter === filter.value ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(filter.value)}
            className="whitespace-nowrap border-[#d8d2c6] transition-colors hover:bg-[#f0ede4] dark:border-[#48564d] dark:hover:bg-[#26382d]"
          >
            {filter.label}
          </Button>
        ))}
      </div>
      
      <div className="relative">
        <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#68736a] dark:text-[#b7c3ba]" />
        <Input
          placeholder="Search posts..."
          className="border-[#e5dfd3] bg-[#fbfaf6] pl-10 dark:border-[#48564d] dark:bg-[#111a16]"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default PostFilters;
