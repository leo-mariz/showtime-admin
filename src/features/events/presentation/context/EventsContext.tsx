import { createContext, useContext, useEffect, useState } from "react";
import { EventEntity } from "@/features/events/domain/entities/EventEntity";
import { EventTypeEntity } from "@/features/events/domain/entities/EventTypeEntity";
import { EventRepository } from "@/features/events/data/repositories/EventRepository";
import { EventTypeRepository } from "@/features/events/data/repositories/EventTypeRepository";
import { EventLocalDataSource } from "@/features/events/data/datasources/EventLocalDataSource";
import { EventRemoteDataSource } from "@/features/events/data/datasources/EventRemoteDataSource";
import { EventTypeLocalDataSource } from "@/features/events/data/datasources/EventTypeLocalDataSource";
import { EventTypeRemoteDataSource } from "@/features/events/data/datasources/EventTypeRemoteDataSource";
import { cacheService } from "@/core/services/LocalCacheServices";

type EventsContextType = {
  events: EventEntity[];
  eventTypes: EventTypeEntity[];
  isLoading: boolean;
  error: string | null;
  refetchEvents: () => Promise<void>;
  refetchEventTypes: () => Promise<void>;
};

const EventsContext = createContext<EventsContextType | undefined>(undefined);

const eventRepository = new EventRepository(
  new EventLocalDataSource(cacheService),
  new EventRemoteDataSource()
);

const eventTypeRepository = new EventTypeRepository(
  new EventTypeLocalDataSource(cacheService),
  new EventTypeRemoteDataSource()
);

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<EventEntity[]>([]);
  const [eventTypes, setEventTypes] = useState<EventTypeEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("[EventsContext] Buscando eventos...");
      const eventsData = await eventRepository.getAll();
      console.log("[EventsContext] Eventos encontrados:", eventsData);
      setEvents(eventsData);
    } catch (err: any) {
      console.error("[EventsContext] Erro ao buscar eventos:", err);
      setError(err.message || "Erro ao buscar eventos");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEventTypes = async () => {
    try {
      console.log("[EventsContext] Buscando tipos de evento...");
      const eventTypesData = await eventTypeRepository.getAll();
      console.log("[EventsContext] Tipos de evento encontrados:", eventTypesData);
      setEventTypes(eventTypesData);
    } catch (err: any) {
      console.error("[EventsContext] Erro ao buscar tipos de evento:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchEvents(), fetchEventTypes()]);
    };
    loadData();
  }, []);

  return (
    <EventsContext.Provider 
      value={{ 
        events, 
        eventTypes, 
        isLoading, 
        error, 
        refetchEvents: fetchEvents, 
        refetchEventTypes: fetchEventTypes 
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error("useEvents deve ser usado dentro de EventsProvider");
  return ctx;
}


