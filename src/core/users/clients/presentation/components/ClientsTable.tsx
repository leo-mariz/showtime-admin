import { useMemo, useState } from "react";
import { UserAggregatedInfoEntity } from "@/core/users/domain/entities/UsersAggregatedInfo/UsersAggregatedInfoEntity";
import { Button } from "@/core/presentation/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/presentation/components/ui/table";
import { Badge } from "@/core/presentation/components/ui/badge";
import { ClientModal } from "./ClientModal";
import { Loader2 } from "lucide-react";
import { SearchBar } from "@/core/presentation/components/shared/SearchBar";

interface ClientsTableProps {
  clients: UserAggregatedInfoEntity[];
  title: string;
  emptyMessage?: string;
  visibleColumns: string[];
  isLoading?: boolean;
}

export const ClientsTable = ({
  clients,
  title,
  emptyMessage = "Nenhum cliente encontrado",
  visibleColumns,
  isLoading = false,
}: ClientsTableProps) => {
  const [selectedClientUid, setSelectedClient] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Função utilitária para normalizar strings (remover acentos, espaços, pontuação)
  const normalize = (str?: string) =>
    (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/gi, "");

  // Filtragem dos clientes
  const filteredClients = useMemo(() => {
    if (!search.trim()) return clients;
    const s = normalize(search);
    return clients.filter((client) => {
      const firstName = normalize(client.userInfo?.cpfUser?.firstName);
      const lastName = normalize(client.userInfo?.cpfUser?.lastName);
      const fantasyName = normalize(client.userInfo?.cnpjUser?.fantasyName);
      const cpf = normalize(client.userInfo?.cpfUser?.cpf);
      const cnpj = normalize(client.userInfo?.cnpjUser?.cnpj);
      const email = normalize(client.userInfo?.email);

      return (
        (firstName + lastName).includes(s) ||
        fantasyName.includes(s) ||
        cpf.includes(s) ||
        cnpj.includes(s) ||
        email.includes(s)
      );
    });
  }, [clients, search]);

  const getActiveBadge = (isActive?: boolean) => {
    if (isActive === true) {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
          Ativo
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
        Inativo
      </Badge>
    );
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return "-";
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d);
  };

  const getClientName = (client: UserAggregatedInfoEntity) => {
    if (client.userInfo?.cpfUser) {
      return `${client.userInfo.cpfUser.firstName} ${client.userInfo.cpfUser.lastName}`;
    }
    if (client.userInfo?.cnpjUser) {
      return client.userInfo.cnpjUser.fantasyName || client.userInfo.cnpjUser.companyName;
    }
    return "-";
  };

  const getClientType = (client: UserAggregatedInfoEntity) => {
    if (client.userInfo?.cpfUser) return "Pessoa Física";
    if (client.userInfo?.cnpjUser) return "Pessoa Jurídica";
    return "-";
  };

  const getClientDocument = (client: UserAggregatedInfoEntity) => {
    if (client.userInfo?.cpfUser) return client.userInfo.cpfUser.cpf;
    if (client.userInfo?.cnpjUser) return client.userInfo.cnpjUser.cnpj;
    return "-";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar
          placeholder="Buscar cliente por nome, CPF, CNPJ ou email..."
          onSearch={setSearch}
          className="w-full sm:w-80"
        />
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Carregando clientes...</span>
        </div>
      ) : filteredClients.length > 0 ? (
        <div className="overflow-hidden rounded-lg border">
          <div className="bg-muted/50 px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="text-sm">
                {visibleColumns.includes("clientName") && <TableHead>Nome</TableHead>}
                {visibleColumns.includes("email") && <TableHead>Email</TableHead>}
                {visibleColumns.includes("cpfOrCnpj") && <TableHead>CPF/CNPJ</TableHead>}
                {visibleColumns.includes("type") && <TableHead>Tipo</TableHead>}
                {visibleColumns.includes("registrationDate") && <TableHead>Data de Cadastro</TableHead>}
                {visibleColumns.includes("preferences") && <TableHead>Preferências</TableHead>}
                {visibleColumns.includes("active") && <TableHead>Status</TableHead>}
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client, idx) => (
                <TableRow key={client.userInfo?.uid || idx} className="hover:bg-muted/50 text-sm">
                  {visibleColumns.includes("clientName") && (
                    <TableCell className="py-1 px-2">
                      {getClientName(client)}
                    </TableCell>
                  )}
                  {visibleColumns.includes("email") && (
                    <TableCell className="py-1 px-2">
                      {client.userInfo?.email || "-"}
                    </TableCell>
                  )}
                  {visibleColumns.includes("cpfOrCnpj") && (
                    <TableCell className="py-1 px-2">
                      {getClientDocument(client)}
                    </TableCell>
                  )}
                  {visibleColumns.includes("type") && (
                    <TableCell className="py-1 px-2">
                      {getClientType(client)}
                    </TableCell>
                  )}
                  {visibleColumns.includes("registrationDate") && (
                    <TableCell className="py-1 px-2">
                      {formatDate(client.clientInfo?.dateRegistered)}
                    </TableCell>
                  )}
                  {visibleColumns.includes("preferences") && (
                    <TableCell className="py-1 px-2">
                      {client.clientInfo?.preferences?.join(", ") || "-"}
                    </TableCell>
                  )}
                  {visibleColumns.includes("active") && (
                    <TableCell className="py-1 px-2">
                      {getActiveBadge(client.userInfo?.isActive)}
                    </TableCell>
                  )}
                  <TableCell className="text-right py-1 px-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedClient(client.clientInfo?.uid)}
                    >
                      Ver Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      )}

      <ClientModal
        clientUid={selectedClientUid}
        open={!!selectedClientUid}
        onClose={() => setSelectedClient(null)}
      />
    </div>
  );
};