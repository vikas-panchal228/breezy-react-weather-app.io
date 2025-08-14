
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";

interface SearchBarProps {
  onSearch: (city: string) => void;
  onLocationSearch: () => void;
}

const SearchBar = ({ onSearch, onLocationSearch }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex w-full max-w-md">
        <Input
          type="text"
          placeholder="Search city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10 bg-white/20 backdrop-blur-md text-white placeholder:text-white/70 border-0 focus-visible:ring-white/30"
        />
        <Button 
          type="submit" 
          size="icon" 
          className="ml-2 bg-white/20 hover:bg-white/30 backdrop-blur-md"
        >
          <Search className="h-4 w-4 text-white" />
        </Button>
        <Button
          type="button"
          size="icon"
          className="ml-2 bg-white/20 hover:bg-white/30 backdrop-blur-md"
          onClick={(e) => {
            e.preventDefault();
            onLocationSearch();
          }}
          title="Use my location"
        >
          <MapPin className="h-4 w-4 text-white" />
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
