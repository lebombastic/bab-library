import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  available: boolean;
  description: string;
  coverImage: string;
}

interface BookCardProps {
  book: Book;
  onClick: (book: Book) => void;
  layout: 'grid' | 'list' | 'compact';
}

export function BookCard({ book, onClick, layout }: BookCardProps) {
  if (layout === 'list') {
    return (
      <Card 
        className="p-4 cursor-pointer hover:shadow-md transition-shadow border-0 bg-card/50 backdrop-blur-sm"
        onClick={() => onClick(book)}
      >
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <ImageWithFallback
              src={book.coverImage}
              alt={book.title}
              className="w-16 h-20 object-cover rounded"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="truncate">{book.title}</h3>
                <p className="text-muted-foreground text-sm">{book.author}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Badge variant="outline" className="text-xs">
                  {book.genre}
                </Badge>
                <Badge 
                  variant={book.available ? "default" : "secondary"}
                  className="text-xs"
                >
                  {book.available ? "Available" : "Borrowed"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (layout === 'compact') {
    return (
      <Card 
        className="p-3 cursor-pointer hover:shadow-md transition-shadow border-0 bg-card/50 backdrop-blur-sm"
        onClick={() => onClick(book)}
      >
        <div className="flex items-center gap-3">
          <ImageWithFallback
            src={book.coverImage}
            alt={book.title}
            className="w-12 h-14 object-cover rounded"
          />
          <div className="flex-1 min-w-0">
            <h4 className="truncate text-sm">{book.title}</h4>
            <p className="text-muted-foreground text-xs">{book.author}</p>
            <div className="flex gap-1 mt-1">
              <Badge variant="outline" className="text-xs px-1 py-0">
                {book.genre}
              </Badge>
              <Badge 
                variant={book.available ? "default" : "secondary"}
                className="text-xs px-1 py-0"
              >
                {book.available ? "✓" : "✗"}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Default grid layout
  return (
    <Card 
      className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 border-0 bg-card/50 backdrop-blur-sm group"
      onClick={() => onClick(book)}
    >
      <div className="space-y-3">
        <div className="relative overflow-hidden rounded">
          <ImageWithFallback
            src={book.coverImage}
            alt={book.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2">
            <Badge 
              variant={book.available ? "default" : "secondary"}
              className="text-xs shadow-sm"
            >
              {book.available ? "Available" : "Borrowed"}
            </Badge>
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="line-clamp-1">{book.title}</h3>
          <p className="text-muted-foreground text-sm">{book.author}</p>
          <Badge variant="outline" className="text-xs w-fit">
            {book.genre}
          </Badge>
        </div>
      </div>
    </Card>
  );
}