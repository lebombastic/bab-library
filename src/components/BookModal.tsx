import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ExternalLink } from "lucide-react";
import { Book } from "./BookCard";

interface BookModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookModal({ book, isOpen, onClose }: BookModalProps) {
  if (!book) return null;

  const handleRentClick = () => {
    // WhatsApp group link - replace with actual group link
    const whatsappLink = `https://wa.me/+01004709848?text=Hi! I'd like to rent "${book.title}" by ${book.author}`;
    window.open(whatsappLink, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">{book.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <ImageWithFallback
                src={book.coverImage}
                alt={book.title}
                className="w-24 h-32 object-cover rounded"
              />
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <h2>{book.title}</h2>
                <p className="text-muted-foreground">{book.author}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline">
                  {book.genre}
                </Badge>
                <Badge 
                  variant={book.available ? "default" : "secondary"}
                >
                  {book.available ? "Available" : "Borrowed"}
                </Badge>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="mb-2">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {book.description}
            </p>
          </div>
          
          {book.available && (
            <Button 
              onClick={handleRentClick}
              className="w-full"
              size="lg"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Rent via WhatsApp
            </Button>
          )}
          
          {!book.available && (
            <div className="text-center p-4 bg-muted/50 rounded">
              <p className="text-sm text-muted-foreground">
                This book is currently borrowed
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}