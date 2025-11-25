import { createContext, useContext, useEffect, useState } from "react";
import { EventTypeEntity } from "@/features/events/domain/entities/EventTypeEntity";
import { EventTypeRepository } from "@/features/events/data/repositories/EventTypeRepository";
import { EventTypeLocalDataSource } from "@/features/events/data/datasources/EventTypeLocalDataSource";
import { EventTypeRemoteDataSource } from "@/features/events/data/datasources/EventTypeRemoteDataSource";
import { cacheService } from "@/core/services/LocalCacheServices";

type EventTypesContextType = {
  eventTypes: EventTypeEntity[];
  isLoading: boolean;
  addEventType: (name: string) => Promise<void>;
  removeEventType: (uid: string) => Promise<void>;
  updateEventType: (uid: string, changes: Partial<EventTypeEntity>) => Promise<void>;
  refetch: () => Promise<void>;
};

const EventTypesContext = createContext<EventTypesContextType | undefined>(
  undefined
);

const eventTypeRepository = new EventTypeRepository(
  new EventTypeLocalDataSource(cacheService),
  new EventTypeRemoteDataSource()
);

export function EventTypesProvider({ children }: { children: React.ReactNode }) {
  const [eventTypes, setEventTypes] = useState<EventTypeEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEventTypes = async () => {
    setIsLoading(true);
    console.log("[EventTypesContext] Buscando tipos de eventos...");
    try {
      const data = await eventTypeRepository.getAll();
      console.log("[EventTypesContext] Tipos de eventos carregados:", data);
      setEventTypes(data);
    } catch (error) {
      console.error("[EventTypesContext] Erro ao buscar tipos de eventos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEventTypes();
  }, []);

  const addEventType = async (name: string) => {
    console.log("[EventTypesContext] Adicionando tipo de evento:", name);
    try {
      // Gera um uid temporário (será substituído pelo Firebase)
      const newEventType = new EventTypeEntity("", name, true);
      await eventTypeRepository.create(newEventType);
      await fetchEventTypes();
    } catch (error) {
      console.error("[EventTypesContext] Erro ao adicionar tipo de evento:", error);
      throw error;
    }
  };

  const removeEventType = async (uid: string) => {
    console.log("[EventTypesContext] Removendo tipo de evento:", uid);
    try {
      await eventTypeRepository.delete(uid);
      await fetchEventTypes();
    } catch (error) {
      console.error("[EventTypesContext] Erro ao remover tipo de evento:", error);
      throw error;
    }
  };

  const updateEventType = async (uid: string, changes: Partial<EventTypeEntity>) => {
    console.log("[EventTypesContext] Atualizando tipo de evento:", uid, changes);
    try {
      await eventTypeRepository.update(uid, changes);
      await fetchEventTypes();
    } catch (error) {
      console.error("[EventTypesContext] Erro ao atualizar tipo de evento:", error);
      throw error;
    }
  };

  return (
    <EventTypesContext.Provider
      value={{
        eventTypes,
        isLoading,
        addEventType,
        removeEventType,
        updateEventType,
        refetch: fetchEventTypes,
      }}
    >
      {children}
    </EventTypesContext.Provider>
  );
}

export function useEventTypes() {
  const ctx = useContext(EventTypesContext);
  if (!ctx)
    throw new Error(
      "useEventTypes deve ser usado dentro de EventTypesProvider"
    );
  return ctx;
}

