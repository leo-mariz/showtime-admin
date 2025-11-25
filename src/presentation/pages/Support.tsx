
import { useState } from "react";
import { TicketsTable } from "@/presentation/components/support/TicketsTable";
import { SearchBar } from "@/core/presentation/components/shared/SearchBar";
import { FilterSelect } from "@/core/presentation/components/shared/FilterSelect";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/presentation/components/ui/tabs";
import { mockTickets } from "@/utils/mockData";

const Support = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const openTickets = mockTickets.filter(
    (ticket) => ticket.status === "Aberto" || ticket.status === "Em Andamento"
  );

  const resolvedTickets = mockTickets.filter(
    (ticket) => ticket.status === "Resolvido"
  );

  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Suporte</h1>
          <p className="text-muted-foreground">
            Gerencie tickets de suporte dos clientes e artistas
          </p>
        </div>
        <div className="flex gap-2">
          <SearchBar
            placeholder="Buscar por assunto, nome ou email..."
            onSearch={setSearchQuery}
          />
          <FilterSelect
            value={statusFilter}
            onValueChange={setStatusFilter}
            options={[
              { value: "all", label: "Todos os status" },
              { value: "Aberto", label: "Em Aberto" },
              { value: "Em Andamento", label: "Em Andamento" },
              { value: "Resolvido", label: "Finalizado" },
            ]}
          />
        </div>
      </div>

      {searchQuery || statusFilter !== "all" ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Resultados da busca ({filteredTickets.length})
          </h2>
          <TicketsTable tickets={filteredTickets} />
        </div>
      ) : (
        <Tabs defaultValue="open">
          <TabsList>
            <TabsTrigger value="open">
              Tickets Abertos ({openTickets.length})
            </TabsTrigger>
            <TabsTrigger value="resolved">
              Finalizados ({resolvedTickets.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="open" className="mt-6">
            <TicketsTable tickets={openTickets} />
          </TabsContent>

          <TabsContent value="resolved" className="mt-6">
            <TicketsTable tickets={resolvedTickets} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Support;
