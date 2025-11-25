import { useState } from "react";
import { EventsTable } from "../components/EventsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/presentation/components/ui/tabs";
import { useEvents } from "../context/EventsContext";
import { EventEntity } from "../../domain/entities/EventEntity";
import { Alert, AlertDescription } from "@/core/presentation/components/ui/alert";
import { AlertCircle, Calendar } from "lucide-react";

const Events = () => {
  const { events, isLoading, error } = useEvents();
  console.dir(events, { depth: null });
  
  const [visibleColumns, setVisibleColumns] = useState([
    "date", "time", "duration", "artist", "contractor", "eventType", "location", "status", "statusPayment"
  ]);

  // Ordena eventos por data (mais recentes primeiro)
  const sortByDate = (arr: EventEntity[]) =>
    arr.slice().sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA; // Ordem decrescente (mais recente primeiro)
    });

  // Filtra eventos por status
  const allEvents = sortByDate(events);
  const upcomingEvents = sortByDate(
    events.filter(e => {
      const eventDate = new Date(e.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate >= today && (e.status === "PENDING" || e.status === "ACCEPTED" || e.status === "CONFIRMED");
    })
  );
  const ongoingEvents = sortByDate(
    events.filter(e => e.status === "IN_PROGRESS")
  );
  const completedEvents = sortByDate(
    events.filter(e => e.status === "FINISHED")
  );
  const cancelledEvents = sortByDate(
    events.filter(e => e.status === "CANCELLED" || e.status === "REFUSED")
  );

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-8 space-y-4">
        <div className="flex items-center gap-4">
          <Calendar className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Eventos</h1>
            <p className="text-muted-foreground">
              Visualize e monitore todos os eventos da plataforma
            </p>
          </div>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar eventos: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <Calendar className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Eventos</h1>
        </div>
        <p className="text-muted-foreground">
          Visualize e monitore todos os eventos da plataforma
        </p>
      </div>

      {/* Estatísticas rápidas */}
      {/* <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-card rounded-lg p-4 border">
          <div className="text-2xl font-bold">{allEvents.length}</div>
          <div className="text-sm text-muted-foreground">Total</div>
        </div>
        <div className="bg-card rounded-lg p-4 border">
          <div className="text-2xl font-bold text-blue-600">{upcomingEvents.length}</div>
          <div className="text-sm text-muted-foreground">Próximos</div>
        </div>
        <div className="bg-card rounded-lg p-4 border">
          <div className="text-2xl font-bold text-green-600">{ongoingEvents.length}</div>
          <div className="text-sm text-muted-foreground">Em Andamento</div>
        </div>
        <div className="bg-card rounded-lg p-4 border">
          <div className="text-2xl font-bold text-gray-600">{completedEvents.length}</div>
          <div className="text-sm text-muted-foreground">Concluídos</div>
        </div>
        <div className="bg-card rounded-lg p-4 border">
          <div className="text-2xl font-bold text-red-600">{cancelledEvents.length}</div>
          <div className="text-sm text-muted-foreground">Cancelados</div>
        </div>
      </div> */}

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todos ({allEvents.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Próximos ({upcomingEvents.length})</TabsTrigger>
          <TabsTrigger value="ongoing">Em Andamento ({ongoingEvents.length})</TabsTrigger>
          <TabsTrigger value="completed">Concluídos ({completedEvents.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelados ({cancelledEvents.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <EventsTable
            events={allEvents}
            title="Todos os Eventos"
            emptyMessage="Nenhum evento encontrado"
            visibleColumns={visibleColumns}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="upcoming">
          <EventsTable
            events={upcomingEvents}
            title="Próximos Eventos"
            emptyMessage="Nenhum evento próximo encontrado"
            visibleColumns={visibleColumns}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="ongoing">
          <EventsTable
            events={ongoingEvents}
            title="Eventos em Andamento"
            emptyMessage="Nenhum evento em andamento"
            visibleColumns={visibleColumns}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="completed">
          <EventsTable
            events={completedEvents}
            title="Eventos Concluídos"
            emptyMessage="Nenhum evento concluído encontrado"
            visibleColumns={visibleColumns}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="cancelled">
          <EventsTable
            events={cancelledEvents}
            title="Eventos Cancelados"
            emptyMessage="Nenhum evento cancelado encontrado"
            visibleColumns={visibleColumns}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Events;
