import { Card, CardContent, CardHeader, CardTitle } from "@/core/presentation/components/ui/card";
import { UpcomingEvent } from "../../domain/entities/DashboardMetricsEntity";
import { Calendar, Clock, DollarSign } from "lucide-react";
import { Badge } from "@/core/presentation/components/ui/badge";

interface UpcomingEventsCardProps {
  events: UpcomingEvent[];
}

export const UpcomingEventsCard = ({ events }: UpcomingEventsCardProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      weekday: "short"
    }).format(date);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Próximos Eventos
          </CardTitle>
          <span className="text-sm text-muted-foreground">{events.length} confirmados</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="flex flex-col items-center justify-center bg-showtime-orange text-white rounded-md p-2 min-w-[60px]">
                <span className="text-xs font-medium uppercase">
                  {formatDate(event.date).split(',')[0]}
                </span>
                <span className="text-lg font-bold">
                  {event.date.getDate()}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{event.artistName}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      Cliente: {event.clientName}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 whitespace-nowrap">
                    {event.eventType}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-1 text-green-600 font-semibold">
                    <DollarSign className="h-3 w-3" />
                    {formatCurrency(event.value)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

