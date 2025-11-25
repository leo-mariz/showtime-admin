import { useState } from "react";
import { ClientsTable } from "../components/ClientsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/presentation/components/ui/tabs";
import { useUsers } from "@/core/users/presentation/context/UsersContext";
import { UserAggregatedInfoEntity } from "@/core/users/domain/entities/UsersAggregatedInfo/UsersAggregatedInfoEntity";

const Clients = () => {
  const { users, isLoading } = useUsers();
  console.dir(users, { depth: null });
  const [visibleColumns, setVisibleColumns] = useState([
    "clientName", "email", "cpfOrCnpj", "type", "registrationDate", "preferences", "active"
  ]);

  // Filtra apenas os usuários que têm info de cliente
  const clients = users.filter(u => u.clientInfo);

  // Ordena por nome (alfabético)
  const sortByClientName = (arr: typeof clients) =>
    arr.slice().sort((a, b) => {
      const getClientName = (client: UserAggregatedInfoEntity) => {
        if (client.userInfo?.cpfUser) {
          return `${client.userInfo.cpfUser.firstName} ${client.userInfo.cpfUser.lastName}`;
        }
        if (client.userInfo?.cnpjUser) {
          return client.userInfo.cnpjUser.fantasyName || client.userInfo.cnpjUser.companyName || "";
        }
        return "";
      };
      
      const nameA = getClientName(a).toLowerCase();
      const nameB = getClientName(b).toLowerCase();
      return nameA.localeCompare(nameB);
    });

  const allClients = sortByClientName(clients);
  const activeClients = sortByClientName(
    clients.filter(u => u.userInfo?.isActive === true)
  );
  const inactiveClients = sortByClientName(
    clients.filter(u => u.userInfo?.isActive === false)
  );

  return (
    <div className="space-y-2">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Anfitriões</h1>
        <p className="text-muted-foreground">
          Gerencie anfitriões cadastrados na plataforma
        </p>
      </div>
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="inactive">Inativos</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <ClientsTable
            clients={allClients}
            title="Todos os Clientes"
            emptyMessage="Nenhum cliente encontrado"
            visibleColumns={visibleColumns}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="active">
          <ClientsTable
            clients={activeClients}
            title="Clientes Ativos"
            emptyMessage="Nenhum cliente ativo encontrado"
            visibleColumns={visibleColumns}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="inactive">
          <ClientsTable
            clients={inactiveClients}
            title="Clientes Inativos"
            emptyMessage="Nenhum cliente inativo encontrado"
            visibleColumns={visibleColumns}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Clients;
