import { useState } from "react";
import { SearchBar } from "@/core/presentation/components/shared/SearchBar";
import { FilterSelect } from "@/core/presentation/components/shared/FilterSelect";
import { ColumnSelector } from "@/core/presentation/components/shared/ColumnSelector";
import { GroupsTable } from "@/core/users/artists/presentation/groups/components/GroupsTable";
import { GroupCreateModal } from "@/core/users/artists/presentation/groups/components/GroupCreateModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/presentation/components/ui/tabs";
import { Button } from "@/core/presentation/components/ui/button";
import { Plus } from "lucide-react";
import { mockGroups } from "@/utils/mockData";

const Groups = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visibleColumns, setVisibleColumns] = useState([
    "name", "type", "members", "events", "registrationDate", "status"
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const availableColumns = [
    { id: "name", label: "Nome" },
    { id: "type", label: "Tipo" },
    { id: "members", label: "Membros" },
    { id: "events", label: "Eventos" },
    { id: "registrationDate", label: "Data de Cadastro" },
    { id: "status", label: "Status" },
  ];

  const activeGroups = mockGroups.filter(
    (group) => group.status === "Ativo"
  );

  const inactiveGroups = mockGroups.filter(
    (group) => group.status === "Inativo"
  );

  const filteredGroups = mockGroups.filter((group) => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || group.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateGroup = () => {
    setShowCreateModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Conjuntos</h1>
          <p className="text-muted-foreground">
            Gerencie conjuntos artísticos cadastrados na plataforma
          </p>
        </div>
        <div className="flex gap-2">
          <SearchBar
            placeholder="Buscar conjuntos..."
            onSearch={setSearchQuery}
          />
          <FilterSelect
            value={statusFilter}
            onValueChange={setStatusFilter}
            options={[
              { value: "all", label: "Todos os status" },
              { value: "Ativo", label: "Ativo" },
              { value: "Inativo", label: "Inativo" },
            ]}
          />
          <ColumnSelector
            availableColumns={availableColumns}
            visibleColumns={visibleColumns}
            onColumnsChange={setVisibleColumns}
          />
          <Button 
            onClick={handleCreateGroup}
            className="bg-gradient-showtime hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Conjunto
          </Button>
        </div>
      </div>

      {searchQuery || statusFilter !== "all" ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Resultados da busca ({filteredGroups.length})
          </h2>
          <GroupsTable 
            groups={filteredGroups} 
            visibleColumns={visibleColumns}
          />
        </div>
      ) : (
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">
              Conjuntos Ativos ({activeGroups.length})
            </TabsTrigger>
            <TabsTrigger value="inactive">
              Inativos ({inactiveGroups.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            <GroupsTable 
              groups={activeGroups} 
              visibleColumns={visibleColumns}
            />
          </TabsContent>

          <TabsContent value="inactive" className="mt-6">
            <GroupsTable 
              groups={inactiveGroups} 
              visibleColumns={visibleColumns}
            />
          </TabsContent>
        </Tabs>
      )}

      <GroupCreateModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};

export default Groups;
