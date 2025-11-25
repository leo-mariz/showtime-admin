
import { useState } from "react";
import { EventsGrid } from "@/presentation/components/events/EventsGrid";
import { SearchBar } from "@/core/presentation/components/shared/SearchBar";
import { FilterSelect } from "@/core/presentation/components/shared/FilterSelect";
import { ColumnSelector } from "@/core/presentation/components/shared/ColumnSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/presentation/components/ui/tabs";
import { mockEvents } from "@/utils/mockData";

const Events = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visibleColumns, setVisibleColumns] = useState([
    "name", "date", "location", "clientName", "artistName", "status"
  ]);

  const availableColumns = [
    { id: "name", label: "Nome" },
    { id: "date", label: "Data" },
    { id: "location", label: "Local" },
    { id: "clientName", label: "Cliente" },
    { id: "artistName", label: "Artista" },
    { id: "status", label: "Status" },
    { id: "duration", label: "Duração" },
    { id: "attendees", label: "Convidados" },
    { id: "value", label: "Valor" },
  ];

  const activeEvents = mockEvents.filter(
    (event) => event.status === "Agendado" || event.status === "Em Andamento"
  );

  const completedEvents = mockEvents.filter(
    (event) => event.status === "Concluído"
  );

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.artistName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Eventos</h1>
          <p className="text-muted-foreground">
            Gerencie eventos da plataforma
          </p>
        </div>
        <div className="flex gap-2">
          <SearchBar 
            placeholder="Buscar eventos..." 
            onSearch={setSearchQuery} 
          />
          <FilterSelect
            value={statusFilter}
            onValueChange={setStatusFilter}
            options={[
              { value: "all", label: "Todos os status" },
              { value: "Agendado", label: "Agendado" },
              { value: "Em Andamento", label: "Em Andamento" },
              { value: "Concluído", label: "Concluído" },
              { value: "Cancelado", label: "Cancelado" },
            ]}
          />
          <ColumnSelector
            availableColumns={availableColumns}
            visibleColumns={visibleColumns}
            onColumnsChange={setVisibleColumns}
          />
        </div>
      </div>

      {searchQuery || statusFilter !== "all" ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Resultados da busca ({filteredEvents.length})
          </h2>
          <EventsGrid 
            events={filteredEvents} 
            visibleColumns={visibleColumns}
          />
        </div>
      ) : (
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">
              Eventos Ativos ({activeEvents.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Concluídos ({completedEvents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            <EventsGrid 
              events={activeEvents} 
              visibleColumns={visibleColumns}
            />
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <EventsGrid 
              events={completedEvents} 
              visibleColumns={visibleColumns}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Events;
