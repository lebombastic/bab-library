import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Settings, Lock } from "lucide-react";
import { AdminForm } from "./AdminForm";
import { Book } from "./BookCard";
import { Event } from "./EventsSection";
import { EventTemplate } from "./EventTemplateManager";

interface AdminAuthProps {
  onAddBook: (book: Omit<Book, 'id'>) => void;
  onUpdateBook: (bookId: string, updates: Partial<Book>) => void;
  onRemoveBook: (bookId: string) => void;
  books: Book[];
  onAddEvent: (event: Omit<Event, 'id'>) => void;
  onRemoveEvent: (eventId: string) => void;
  events: Event[];
  templates: EventTemplate[];
  onAddTemplate: (template: Omit<EventTemplate, 'id'>) => void;
  onRemoveTemplate: (templateId: string) => void;
}

const ADMIN_PASSWORD = "admin123"; // In production, this should be properly secured

export function AdminAuth({ 
  onAddBook, 
  onUpdateBook, 
  onRemoveBook, 
  books, 
  onAddEvent, 
  onRemoveEvent, 
  events,
  templates,
  onAddTemplate,
  onRemoveTemplate
}: AdminAuthProps) {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setIsAuthOpen(false);
      setPassword("");
      setError("");
      // Keep authentication for 1 hour
      setTimeout(() => {
        setIsAuthenticated(false);
      }, 60 * 60 * 1000);
    } else {
      setError("Incorrect password");
      setPassword("");
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsAuthOpen(open);
    if (!open) {
      setPassword("");
      setError("");
    }
  };

  if (isAuthenticated) {
    return (
      <AdminForm 
        onAddBook={onAddBook} 
        onUpdateBook={onUpdateBook}
        onRemoveBook={onRemoveBook}
        books={books}
        onAddEvent={onAddEvent}
        onRemoveEvent={onRemoveEvent}
        events={events}
        templates={templates}
        onAddTemplate={onAddTemplate}
        onRemoveTemplate={onRemoveTemplate}
      />
    );
  }

  return (
    <Dialog open={isAuthOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="w-4 h-4" />
          Admin
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Admin Authentication
          </DialogTitle>
          <DialogDescription>
            Enter the admin password to access book and event management features.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoFocus
              required
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
          
          <Button type="submit" className="w-full">
            Authenticate
          </Button>
          
          {/* <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Demo password: admin123
            </p>
          </div> */}
        </form>
      </DialogContent>
    </Dialog>
  );
}