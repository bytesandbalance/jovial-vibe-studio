import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Category {
  value: string;
  label: string;
  color?: string;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}

export default function CategorySelector({
  categories,
  selectedCategory,
  onCategoryChange,
  className
}: CategorySelectorProps) {
  return (
    <div className={cn("w-full mb-8", className)}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
        {categories.map((category) => (
          <Button
            key={category.value}
            variant={selectedCategory === category.value ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category.value)}
            className={cn(
              "justify-center text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105",
              selectedCategory === category.value 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "hover:bg-muted"
            )}
          >
            {category.label}
          </Button>
        ))}
      </div>
    </div>
  );
}