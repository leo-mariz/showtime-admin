
import { useState } from "react";
import { Event, EventStatus } from "@/utils/mockData";
import { Card, CardContent, CardFooter } from "@/core/presentation/components/ui/card";
import { Badge } from "@/core/presentation/components/ui/badge";
import { Button } from "@/core/presentation/components/ui/button";
import { Calendar, Clock, MapPin, Users, DollarSign } from "lucide-react";
import { EventModal } from "./EventModal";

interface EventsGridProps {
  events: Event[];
  visibleColumns?: string[];
}

export const EventsGrid = ({ events, visibleColumns = [] }: EventsGridProps) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case "Agendado":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Agendado
          </Badge>
        );
      case "Em Andamento":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Em Andamento
          </Badge>
        );
      case "Concluído":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Concluído
          </Badge>
        );
      case "Cancelado":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            Cancelado
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-4">
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    {(!visibleColumns.length || visibleColumns.includes("name")) && (
                      <h3 className="font-semibold">{event.name}</h3>
                    )}
                    {(!visibleColumns.length || visibleColumns.includes("status")) && 
                      getStatusBadge(event.status)
                    }
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {(!visibleColumns.length || visibleColumns.includes("date")) && (
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formatDate(event.date)}
                      </div>
                    )}
                    {(!visibleColumns.length || visibleColumns.includes("duration")) && (
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4" />
                        {event.duration}
                      </div>
                    )}
                    {(!visibleColumns.length || visibleColumns.includes("location")) && (
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        {event.location.split(',')[0]}
                      </div>
                    )}
                    {(!visibleColumns.length || visibleColumns.includes("attendees")) && (
                      <div className="flex items-center text-muted-foreground">
                        <Users className="mr-2 h-4 w-4" />
                        {event.attendees} convidados
                      </div>
                    )}
                    {(!visibleColumns.length || visibleColumns.includes("value")) && (
                      <div className="flex items-center text-muted-foreground">
                        <DollarSign className="mr-2 h-4 w-4" />
                        {formatCurrency(event.value)}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="px-4 py-2 bg-muted/50">
                  <div className="flex justify-between">
                    {(!visibleColumns.length || visibleColumns.includes("clientName")) && (
                      <div>
                        <p className="text-xs text-muted-foreground">Cliente</p>
                        <p className="text-sm font-medium">{event.clientName}</p>
                      </div>
                    )}
                    {(!visibleColumns.length || visibleColumns.includes("artistName")) && (
                      <div>
                        <p className="text-xs text-muted-foreground">Artista</p>
                        <p className="text-sm font-medium">{event.artistName}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="p-4 pt-0 mt-4">
                <Button
                  className="w-full bg-gradient-showtime hover:opacity-90"
                  onClick={() => setSelectedEvent(event)}
                >
                  Ver Detalhes
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">Nenhum evento encontrado</p>
        </div>
      )}

      <EventModal
        event={selectedEvent}
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
};
