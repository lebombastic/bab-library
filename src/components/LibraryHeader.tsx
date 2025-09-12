import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Grid3X3, List, Rows3, BookOpen, Moon, Sun } from "lucide-react";
import { AdminAuth } from "./AdminAuth";
import { JoinBabPopup } from "./JoinBabPopup";
import { Book } from "./BookCard";
import { Event } from "./EventsSection";
import { EventTemplate } from "./EventTemplateManager";
import { useTheme } from "./ThemeProvider";

interface LibraryHeaderProps {
  layout: 'grid' | 'list' | 'compact';
  onLayoutChange: (layout: 'grid' | 'list' | 'compact') => void;
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  genres: string[];
  onAddBook: (book: Omit<Book, 'id'>) => void;
  onUpdateBook: (bookId: string, updates: Partial<Book>) => void;
  onRemoveBook: (bookId: string) => void;
  currentView: 'books' | 'events';
  onViewChange: (view: 'books' | 'events') => void;
  books: Book[];
  onAddEvent: (event: Omit<Event, 'id'>) => void;
  onRemoveEvent: (eventId: string) => void;
  events: Event[];
  templates: EventTemplate[];
  onAddTemplate: (template: Omit<EventTemplate, 'id'>) => void;
  onRemoveTemplate: (templateId: string) => void;
}

export function LibraryHeader({ 
  layout, 
  onLayoutChange, 
  selectedGenre, 
  onGenreChange, 
  genres,
  onAddBook,
  onUpdateBook,
  onRemoveBook,
  currentView,
  onViewChange,
  books,
  onAddEvent,
  onRemoveEvent,
  events,
  templates,
  onAddTemplate,
  onRemoveTemplate
}: LibraryHeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8" />
          <div className="flex items-center gap-3">
            <h1>Library</h1>
            <JoinBabPopup />
          </div>
          <p className="text-muted-foreground text-sm">Discover and rent books</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="gap-2"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            {theme === "light" ? "Dark" : "Light"}
          </Button>
          <AdminAuth 
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
        </div>
      </div>
      
      <div className="space-y-4">
        <Tabs value={currentView} onValueChange={onViewChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="books">Books</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center justify-between gap-4">
          {currentView === 'books' && (
            <div className="flex items-center gap-3">
              <Select value={selectedGenre} onValueChange={onGenreChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All genres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All genres</SelectItem>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {currentView === 'events' && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Upcoming library events</span>
            </div>
          )}
          
          {currentView === 'books' && (
            <div className="flex items-center gap-1 bg-muted/50 rounded-md p-1">
              <Button
                variant={layout === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onLayoutChange('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={layout === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onLayoutChange('list')}
                className="h-8 w-8 p-0"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={layout === 'compact' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onLayoutChange('compact')}
                className="h-8 w-8 p-0"
              >
                <Rows3 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}