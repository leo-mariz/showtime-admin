import { Search } from "lucide-react";
import { Input } from "@/core/presentation/components/ui/input";
import { Button } from "@/core/presentation/components/ui/button";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  className?: string;
}

export const SearchBar = ({
  placeholder = "Buscar...",
  onSearch,
  className,
}: SearchBarProps) => {
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get("search") as string;
    
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative flex w-full max-w-sm items-center ${className}`}>
      <Input
        type="text"
        name="search"
        placeholder={placeholder}
        className="pr-10"
        onChange={e => onSearch?.(e.target.value)}
      />
      <Button 
        type="submit" 
        size="icon" 
        variant="ghost" 
        className="absolute right-0 top-0 h-full"
      >
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
};
