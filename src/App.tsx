import { useEffect, useState } from "react";
import { BookCard, Book } from "./components/BookCard";
import { BookModal } from "./components/BookModal";
import { LibraryHeader } from "./components/LibraryHeader";
import { EventsSection, Event } from "./components/EventsSection";
import { ThemeProvider } from "./components/ThemeProvider";

const INITIAL_BOOKS: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Fiction",
    available: true,
    description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream through the eyes of Nick Carraway and his mysterious neighbor Jay Gatsby.",
    coverImage: "https://images.unsplash.com/photo-1755545730104-3cb4545282b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBjbGFzc2ljJTIwbGl0ZXJhdHVyZXxlbnwxfHx8fDE3NTcyNzQ3NTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "2", 
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Help",
    available: false,
    description: "A comprehensive guide to building good habits and breaking bad ones, with practical strategies backed by science to help you make tiny changes that deliver remarkable results.",
    coverImage: "https://images.unsplash.com/photo-1517575563495-023867667b3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBib29rJTIwY292ZXIlMjBkZXNpZ258ZW58MXx8fHwxNzU3MzM4ODM1fDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "3",
    title: "Dune",
    author: "Frank Herbert", 
    genre: "Science Fiction",
    available: true,
    description: "An epic science fiction novel set on the desert planet Arrakis, following Paul Atreides as he navigates political intrigue, mystical powers, and the control of the universe's most valuable substance.",
    coverImage: "https://images.unsplash.com/photo-1677462679580-e56a3223ffff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwYm9vayUyMHNwaW5lJTIwbGlicmFyeXxlbnwxfHx8fDE3NTcyOTk4MjV8MA&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

const INITIAL_EVENTS: Event[] = [
  {
    id: "1",
    title: "Silent Reading Session",
    date: "Friday, September 14th, 2025",
    time: "6:00 PM - 8:00 PM",
    description: "Join us for a peaceful evening of silent reading. Bring your favorite book or choose from our collection. Refreshments will be provided.",
    whatsappGroup: "https://chat.whatsapp.com/silent-reading-group"
  },
  {
    id: "2", 
    title: "Book Club Discussion",
    date: "Saturday, September 21st, 2025",
    time: "2:00 PM - 4:00 PM",
    description: "This month we're discussing 'The Great Gatsby'. Come share your thoughts and insights with fellow book lovers.",
    whatsappGroup: "https://chat.whatsapp.com/book-club-discussion"
  },
  {
    id: "3",
    title: "Author Meet & Greet",
    date: "Sunday, September 29th, 2025", 
    time: "3:00 PM - 5:00 PM",
    description: "Meet local author Sarah Johnson as she discusses her latest novel and signs copies. Light refreshments will be served.",
    whatsappGroup: "https://chat.whatsapp.com/author-meetup"
  }
];


export default function App() {
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [layout, setLayout] = useState<'grid' | 'list' | 'compact'>('grid');
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentView, setCurrentView] = useState<'books' | 'events'>('books');

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleAddBook = (newBook: Omit<Book, 'id'>) => {
    // Persist to Supabase first to get the UUID
    import('./lib/supabaseClient').then(async ({ supabase }) => {
      const { data, error } = await supabase.from('books').insert({
        title: newBook.title,
        author: newBook.author,
        genre: newBook.genre,
        available: newBook.available,
        description: newBook.description,
        cover_image: newBook.coverImage
      }).select().single();
      
      if (error) {
        console.error('Error adding book:', error);
        return;
      }
      
      // Update local state with the returned book (including UUID)
      const book: Book = {
        id: data.id,
        title: data.title,
        author: data.author,
        genre: data.genre,
        available: data.available,
        description: data.description,
        coverImage: data.cover_image
      };
      setBooks(prev => [...prev, book]);
    });
  };

  const handleUpdateBook = (bookId: string, updates: Partial<Book>) => {
    setBooks(prev => prev.map(book => 
      book.id === bookId ? { ...book, ...updates } : book
    ));
    import('./lib/supabaseClient').then(async ({ supabase }) => {
      await supabase.from('books').update({
        title: updates.title,
        author: updates.author,
        genre: updates.genre,
        available: updates.available,
        description: updates.description,
        cover_image: updates.coverImage
      }).eq('id', bookId);
    });
  };

  const handleRemoveBook = (bookId: string) => {
    setBooks(prev => prev.filter(book => book.id !== bookId));
    import('./lib/supabaseClient').then(async ({ supabase }) => {
      await supabase.from('books').delete().eq('id', bookId);
    });
  };

  const handleAddEvent = (newEvent: Omit<Event, 'id'>) => {
    import('./lib/supabaseClient').then(async ({ supabase }) => {
      const { data, error } = await supabase.from('events').insert({
        title: newEvent.title,
        date: newEvent.date,
        time: newEvent.time,
        description: newEvent.description,
        whatsapp_group: newEvent.whatsappGroup
      }).select().single();
      
      if (error) {
        console.error('Error adding event:', error);
        return;
      }
      
      const event: Event = {
        id: data.id,
        title: data.title,
        date: data.date,
        time: data.time,
        description: data.description,
        whatsappGroup: data.whatsapp_group
      };
      setEvents(prev => [...prev, event]);
    });
  };

  const handleRemoveEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    import('./lib/supabaseClient').then(async ({ supabase }) => {
      await supabase.from('events').delete().eq('id', eventId);
    });
  };


  // Initial load from Supabase if configured
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { supabase } = await import('./lib/supabaseClient');
        if (!supabase) return;
        const [booksRes, eventsRes] = await Promise.all([
          supabase.from('books').select('*'),
          supabase.from('events').select('*')
        ]);
        if (!cancelled) {
          if (booksRes.data) {
            setBooks(booksRes.data.map((b: any) => ({
              id: b.id,
              title: b.title,
              author: b.author,
              genre: b.genre,
              available: b.available,
              description: b.description,
              coverImage: b.cover_image
            })));
          }
          if (eventsRes.data) {
            setEvents(eventsRes.data.map((e: any) => ({
              id: e.id,
              title: e.title,
              date: e.date,
              time: e.time,
              description: e.description,
              whatsappGroup: e.whatsapp_group
            })));
          }
        }
      } catch {
        // ignore if not configured
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const genres = Array.from(new Set(books.map(book => book.genre))).sort();
  
  const filteredBooks = books.filter(book => {
    const matchesGenre = selectedGenre === "all" || book.genre === selectedGenre;
    const matchesSearch = searchTerm === "" ||
      book.title.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesGenre && matchesSearch;
  });

  const getLayoutClasses = () => {
    switch (layout) {
      case 'list':
        return "space-y-3";
      case 'compact':
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3";
      default: // grid
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <LibraryHeader
            layout={layout}
            onLayoutChange={setLayout}
            selectedGenre={selectedGenre}
            onGenreChange={setSelectedGenre}
            genres={genres}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onAddBook={handleAddBook}
            onUpdateBook={handleUpdateBook}
            onRemoveBook={handleRemoveBook}
            currentView={currentView}
            onViewChange={setCurrentView}
            books={books}
            onAddEvent={handleAddEvent}
            onRemoveEvent={handleRemoveEvent}
            events={events}
          />
          
          <div className="mt-8">
            {currentView === 'books' ? (
              filteredBooks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {searchTerm ?
                      `No books found with title matching "${searchTerm}"` :
                      selectedGenre !== "all" ?
                        `No books found in ${selectedGenre} genre` :
                        "No books available"
                    }
                  </p>
                  {searchTerm && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Try searching for a different book title or clearing your search
                    </p>
                  )}
                </div>
              ) : (
                <div className={getLayoutClasses()}>
                  {filteredBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onClick={handleBookClick}
                      layout={layout}
                    />
                  ))}
                </div>
              )
            ) : (
              <EventsSection events={events} />
            )}
          </div>
        </div>

        <BookModal 
          book={selectedBook}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </ThemeProvider>
  );
}