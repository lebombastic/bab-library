import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, Clock, MessageCircle } from "lucide-react";
import { EventCalendar } from "./EventCalendar";

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  whatsappGroup: string;
}

interface EventsSectionProps {
  events: Event[];
}

export function EventsSection({ events }: EventsSectionProps) {
  const handleWhatsAppClick = (groupLink: string) => {
    window.open(groupLink, '_blank');
  };

  if (events.length === 0) {
    return (
      <div className="flex gap-8">
        <div className="flex-1 text-center py-12">
          <p className="text-muted-foreground">No upcoming events scheduled</p>
        </div>
        <div className="hidden md:block">
          <EventCalendar events={events} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-8">
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="mb-2">{event.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                  </div>
                  <Badge variant="secondary">Upcoming</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {event.description}
                </CardDescription>
                <Button 
                  onClick={() => handleWhatsAppClick(event.whatsappGroup)}
                  className="w-full gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Join WhatsApp Group
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="hidden lg:block">
        <EventCalendar events={events} />
      </div>
    </div>
  );
}