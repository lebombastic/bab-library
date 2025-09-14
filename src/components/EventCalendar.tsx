import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Event } from "./EventsSection";

interface EventCalendarProps {
  events: Event[];
}

export function EventCalendar({ events }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventDates = () => {
    const eventDates = new Set<string>();
    events.forEach(event => {
      // Try to parse various date formats
      const dateStr = event.date.toLowerCase();
      const year = currentDate.getFullYear();
      
      // Extract day from common formats like "Friday, September 14th, 2025"
      const dayMatch = dateStr.match(/(\d{1,2})(st|nd|rd|th)/);
      if (dayMatch) {
        const day = parseInt(dayMatch[1]);
        const monthNames = [
          'january', 'february', 'march', 'april', 'may', 'june',
          'july', 'august', 'september', 'october', 'november', 'december'
        ];
        
        const currentMonthName = monthNames[currentDate.getMonth()];
        if (dateStr.includes(currentMonthName)) {
          eventDates.add(day.toString());
        }
      }
    });
    return eventDates;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const eventDates = getEventDates();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Create calendar grid
  const calendarDays = [];
  
  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <Card className="w-full max-w-sm mx-auto lg:mx-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Events Calendar
          </CardTitle>
        </div>
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="font-medium">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground p-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`
                h-9 w-9 flex items-center justify-center text-sm rounded-sm transition-colors
                ${day === null ? '' : 'hover:bg-muted/50 cursor-pointer active:bg-muted'}
                ${day && eventDates.has(day.toString())
                  ? 'bg-primary text-primary-foreground font-medium'
                  : day ? 'text-foreground' : ''
                }
              `}
            >
              {day}
            </div>
          ))}
        </div>
        {eventDates.size > 0 && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Highlighted dates have events
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}