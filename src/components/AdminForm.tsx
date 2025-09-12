import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Plus, Settings, Book as BookIcon, Calendar, Trash2, Search, Edit3, Loader2 } from "lucide-react";
import { Book } from "./BookCard";
import { Event } from "./EventsSection";

interface AdminFormProps {
  onAddBook: (book: Omit<Book, 'id'>) => void;
  onUpdateBook: (bookId: string, updates: Partial<Book>) => void;
  onRemoveBook: (bookId: string) => void;
  books: Book[];
  onAddEvent: (event: Omit<Event, 'id'>) => void;
  onRemoveEvent: (eventId: string) => void;
  events: Event[];
}

const GENRES = [
  "Fiction",
  "Non-Fiction", 
  "Mystery",
  "Romance",
  "Science Fiction",
  "Fantasy",
  "Biography",
  "History",
  "Self-Help",
  "Technology"
];

interface BookSearchResult {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  subject?: string[];
}

export function AdminForm({ 
  onAddBook, 
  onUpdateBook, 
  onRemoveBook, 
  books, 
  onAddEvent, 
  onRemoveEvent, 
  events
}: AdminFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [addMode, setAddMode] = useState<'search' | 'manual'>('search');
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSearchResult, setSelectedSearchResult] = useState<BookSearchResult | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    available: true,
    description: "",
    coverImage: ""
  });

  const [eventFormData, setEventFormData] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
    whatsappGroup: ""
  });

  const searchBooks = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`);
      const data = await response.json();
      setSearchResults(data.docs || []);
    } catch (error) {
      console.error('Error searching books:', error);
      setSearchResults([]);
    }
    setIsSearching(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchBooks(searchQuery);
  };

  const selectBookFromSearch = (book: BookSearchResult) => {
    setSelectedSearchResult(book);
    const author = book.author_name?.[0] || "Unknown Author";
    const coverUrl = book.cover_i 
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
      : "";
    
    setFormData({
      title: book.title,
      author: author,
      genre: book.subject?.[0] || "",
      available: true,
      description: `Published in ${book.first_publish_year || "Unknown year"}. ${book.subject?.slice(0, 3).join(", ") || ""}`,
      coverImage: coverUrl
    });
    
    // Switch to manual mode to allow editing
    setAddMode('manual');
  };

  const getCoverImageUrl = (coverId: number) => {
    return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.author) {
      return;
    }

    const finalGenre = formData.genre || "Fiction";
    
    onAddBook({
      ...formData,
      genre: finalGenre,
      coverImage: formData.coverImage || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop"
    });

    // Reset form
    setFormData({
      title: "",
      author: "",
      genre: "",
      available: true,
      description: "",
      coverImage: ""
    });
    setSelectedSearchResult(null);
    setSearchResults([]);
    setSearchQuery("");
    setAddMode('search'); // Reset to search mode
  };

  const handleStatusToggle = (bookId: string, currentStatus: boolean) => {
    onUpdateBook(bookId, { available: !currentStatus });
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventFormData.title || !eventFormData.date || !eventFormData.time || !eventFormData.description) {
      return;
    }

    onAddEvent({
      ...eventFormData,
      whatsappGroup: eventFormData.whatsappGroup || "https://chat.whatsapp.com/default-group"
    });

    // Reset form
    setEventFormData({
      title: "",
      date: "",
      time: "",
      description: "",
      whatsappGroup: ""
    });
  };

  const handleRemoveEvent = (eventId: string) => {
    onRemoveEvent(eventId);
  };

  const handleRemoveBook = (bookId: string) => {
    onRemoveBook(bookId);
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="w-4 h-4" />
          Admin
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Library Administration
          </DialogTitle>
          <DialogDescription>
            Manage books, events, and their availability status.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="add" className="w-full">
          <TabsList className="grid w-full grid-cols-5 text-xs">
            <TabsTrigger value="add">Add Book</TabsTrigger>
            <TabsTrigger value="manage">Manage Books</TabsTrigger>
            <TabsTrigger value="add-event">Add Event</TabsTrigger>
            <TabsTrigger value="manage-events">Manage Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="add" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                <h3 className="font-medium">Add New Book</h3>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant={addMode === 'search' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAddMode('search')}
                  className="gap-2"
                >
                  <Search className="w-4 h-4" />
                  Search API
                </Button>
                <Button
                  type="button"
                  variant={addMode === 'manual' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAddMode('manual')}
                  className="gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Manual Entry
                </Button>
              </div>
            </div>

            {addMode === 'search' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Search className="w-4 h-4" />
                      Search Books Database
                    </CardTitle>
                    <CardDescription>
                      Search from millions of books with automatic details filling
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSearchSubmit} className="flex gap-2">
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by title, author, or ISBN..."
                        className="flex-1"
                      />
                      <Button type="submit" disabled={isSearching}>
                        {isSearching ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {isSearching && (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <Card key={i}>
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <Skeleton className="w-16 h-24 rounded" />
                            <div className="flex-1 space-y-2">
                              <Skeleton className="h-4 w-3/4" />
                              <Skeleton className="h-3 w-1/2" />
                              <Skeleton className="h-3 w-2/3" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {searchResults.length > 0 && !isSearching && (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {searchResults.map((book) => (
                      <Card 
                        key={book.key} 
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedSearchResult?.key === book.key ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => selectBookFromSearch(book)}
                      >
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="w-16 h-24 bg-muted rounded flex-shrink-0 overflow-hidden">
                              {book.cover_i ? (
                                <img
                                  src={getCoverImageUrl(book.cover_i)}
                                  alt={book.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                  <BookIcon className="w-6 h-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">{book.title}</h4>
                              <p className="text-sm text-muted-foreground truncate">
                                by {book.author_name?.[0] || "Unknown Author"}
                              </p>
                              {book.first_publish_year && (
                                <p className="text-xs text-muted-foreground">
                                  Published: {book.first_publish_year}
                                </p>
                              )}
                              {book.subject && book.subject.length > 0 && (
                                <div className="flex gap-1 mt-2 flex-wrap">
                                  {book.subject.slice(0, 2).map((subject, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {subject}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {(selectedSearchResult || addMode === 'manual') && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4" />
                    {selectedSearchResult ? 'Review & Confirm Details' : 'Manual Book Entry'}
                  </CardTitle>
                  {selectedSearchResult && (
                    <CardDescription>
                      Details auto-filled from search. Review and modify as needed.
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Book Title*</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter book title"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="author">Author*</Label>
                        <Input
                          id="author"
                          value={formData.author}
                          onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                          placeholder="Enter author name"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="genre">Genre</Label>
                      <Select 
                        value={formData.genre} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, genre: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                        <SelectContent>
                          {GENRES.map((genre) => (
                            <SelectItem key={genre} value={genre}>
                              {genre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of the book"
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="coverImage">Cover Image URL</Label>
                      <Input
                        id="coverImage"
                        type="url"
                        value={formData.coverImage}
                        onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                        placeholder="https://example.com/book-cover.jpg"
                      />
                      {formData.coverImage && (
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                          <img
                            src={formData.coverImage}
                            alt="Cover preview"
                            className="w-20 h-28 object-cover rounded border"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <Label htmlFor="available">Available for rent</Label>
                      <Switch
                        id="available"
                        checked={formData.available}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, available: checked }))}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Book to Library
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="manage" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <BookIcon className="w-5 h-5" />
              <h3 className="font-medium">Manage Book Status</h3>
            </div>
            
            <div className="max-h-96 overflow-y-auto space-y-3">
              {books.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No books in the library</p>
              ) : (
                books.map((book) => (
                  <div key={book.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{book.title}</h4>
                      <p className="text-sm text-muted-foreground truncate">by {book.author}</p>
                      <p className="text-xs text-muted-foreground">{book.genre}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={book.available ? "default" : "secondary"}>
                        {book.available ? "Available" : "Borrowed"}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusToggle(book.id, book.available)}
                      >
                        Mark as {book.available ? "Borrowed" : "Available"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveBook(book.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="add-event" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Plus className="w-5 h-5" />
              <h3 className="font-medium">Add New Event</h3>
            </div>
            
            <form onSubmit={handleEventSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="event-title">Event Title*</Label>
                <Input
                  id="event-title"
                  value={eventFormData.title}
                  onChange={(e) => setEventFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter event title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="event-date">Date*</Label>
                <Input
                  id="event-date"
                  value={eventFormData.date}
                  onChange={(e) => setEventFormData(prev => ({ ...prev, date: e.target.value }))}
                  placeholder="e.g., Friday, September 14th, 2025"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="event-time">Time*</Label>
                <Input
                  id="event-time"
                  value={eventFormData.time}
                  onChange={(e) => setEventFormData(prev => ({ ...prev, time: e.target.value }))}
                  placeholder="e.g., 6:00 PM - 8:00 PM"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="event-description">Description*</Label>
                <Textarea
                  id="event-description"
                  value={eventFormData.description}
                  onChange={(e) => setEventFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the event"
                  rows={3}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="event-whatsapp">WhatsApp Group Link (optional)</Label>
                <Input
                  id="event-whatsapp"
                  type="url"
                  value={eventFormData.whatsappGroup}
                  onChange={(e) => setEventFormData(prev => ({ ...prev, whatsappGroup: e.target.value }))}
                  placeholder="https://chat.whatsapp.com/your-group-link"
                />
              </div>
              
              <Button type="submit" className="w-full">
                Add Event
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="manage-events" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5" />
              <h3 className="font-medium">Manage Events</h3>
            </div>
            
            <div className="max-h-96 overflow-y-auto space-y-3">
              {events.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No events scheduled</p>
              ) : (
                events.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{event.title}</h4>
                      <p className="text-sm text-muted-foreground truncate">{event.date}</p>
                      <p className="text-xs text-muted-foreground">{event.time}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">Upcoming</Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveEvent(event.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

        </Tabs>
      </DialogContent>
    </Dialog>
  );
}