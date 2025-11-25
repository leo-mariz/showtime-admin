import { useMemo, useState } from "react";
import { RoleEntity } from "../../domain/entities/RoleEntity";
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
import { RoleModal } from "./RoleModal";
import { Loader2, Plus, UserCog, Shield } from "lucide-react";
import { SearchBar } from "@/core/presentation/components/shared/SearchBar";

interface RolesTableProps {
  roles: RoleEntity[];
  title: string;
  emptyMessage?: string;
  visibleColumns: string[];
  isLoading?: boolean;
  onEditRole?: (roleId: string) => void;
}

export const RolesTable = ({
  roles,
  title,
  emptyMessage = "Nenhum papel encontrado",
  visibleColumns,
  isLoading = false,
  onEditRole,
}: RolesTableProps) => {
  const [selectedRoleId, setSelectedRole] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [search, setSearch] = useState("");

  // Função utilitária para normalizar strings (remover acentos, espaços, pontuação)
  const normalize = (str?: string) =>
    (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/gi, "");

  // Filtragem dos papéis
  const filteredRoles = useMemo(() => {
    if (!search.trim()) return roles;
    const s = normalize(search);
    return roles.filter((role) => {
      const name = normalize(role.name);
      const description = normalize(role.description);
      const createdBy = normalize(role.createdBy);

      return (
        name.includes(s) ||
        description.includes(s) ||
        createdBy.includes(s)
      );
    });
  }, [roles, search]);

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
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

  const formatPermissions = (permissions: string[]) => {
    if (!permissions || permissions.length === 0) return "-";
    if (permissions.length <= 3) {
      return permissions.join(", ");
    }
    return `${permissions.slice(0, 3).join(", ")} +${permissions.length - 3}`;
  };

  const getRoleTypeIcon = (roleId: string) => {
    if (roleId === 'super-admin') return <Shield className="h-4 w-4 text-red-500" />;
    return <UserCog className="h-4 w-4 text-blue-500" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar
          placeholder="Buscar papel por nome, descrição ou criador..."
          onSearch={setSearch}
          className="w-full sm:w-80"
        />
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Carregando papéis...</span>
        </div>
      ) : filteredRoles.length > 0 ? (
        <div className="overflow-hidden rounded-lg border">
          <div className="bg-muted/50 px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="text-sm">
                {visibleColumns.includes("name") && <TableHead>Nome</TableHead>}
                {visibleColumns.includes("description") && <TableHead>Descrição</TableHead>}
                {visibleColumns.includes("permissions") && <TableHead>Permissões</TableHead>}
                {visibleColumns.includes("createdBy") && <TableHead>Criado Por</TableHead>}
                {visibleColumns.includes("createdAt") && <TableHead>Data de Criação</TableHead>}
                {visibleColumns.includes("status") && <TableHead>Status</TableHead>}
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role, idx) => (
                <TableRow key={role.id || idx} className="hover:bg-muted/50 text-sm">
                  {visibleColumns.includes("name") && (
                    <TableCell className="py-1 px-2">
                      <div className="flex items-center gap-2">
                        {getRoleTypeIcon(role.id)}
                        <span className="font-medium">{role.name}</span>
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.includes("description") && (
                    <TableCell className="py-1 px-2 max-w-xs">
                      <div className="truncate" title={role.description}>
                        {role.description || "-"}
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.includes("permissions") && (
                    <TableCell className="py-1 px-2">
                      <div className="text-xs" title={role.permissions.join(", ")}>
                        {formatPermissions(role.permissions)}
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.includes("createdBy") && (
                    <TableCell className="py-1 px-2">
                      {role.createdBy || "-"}
                    </TableCell>
                  )}
                  {visibleColumns.includes("createdAt") && (
                    <TableCell className="py-1 px-2">
                      {formatDate(role.createdAt)}
                    </TableCell>
                  )}
                  {visibleColumns.includes("status") && (
                    <TableCell className="py-1 px-2">
                      {getStatusBadge(role.isActive)}
                    </TableCell>
                  )}
                  <TableCell className="text-right py-1 px-2">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedRole(role.id)}
                      >
                        Ver
                      </Button>
                      {onEditRole && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditRole(role.id)}
                        >
                          Editar
                        </Button>
                      )}
                    </div>
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

      <RoleModal
        roleId={selectedRoleId}
        open={!!selectedRoleId}
        onClose={() => setSelectedRole(null)}
      />

      <RoleModal
        roleId={null}
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};
