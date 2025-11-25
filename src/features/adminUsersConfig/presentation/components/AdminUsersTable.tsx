import { useMemo, useState } from "react";
import { AdminUserEntity } from "../../domain/entities/AdminUserEntity";
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
import { AdminUserModal } from "./AdminUserModal";
import { AdminUserEditModal } from "./AdminUserEditModal";
import { AdminUserDeleteDialog } from "./AdminUserDeleteDialog";
import { Loader2, Plus, Shield, UserCheck, Clock, Edit, Trash2, Eye } from "lucide-react";
import { SearchBar } from "@/core/presentation/components/shared/SearchBar";
import { useAdminUsersConfig } from "../context/AdminUsersConfigContext";

interface AdminUsersTableProps {
  adminUsers: AdminUserEntity[];
  title: string;
  emptyMessage?: string;
  visibleColumns: string[];
  isLoading?: boolean;
}

export const AdminUsersTable = ({
  adminUsers,
  title,
  emptyMessage = "Nenhum administrador encontrado",
  visibleColumns,
  isLoading = false,
}: AdminUsersTableProps) => {
  const { roles } = useAdminUsersConfig();
  const [selectedAdminUid, setSelectedAdmin] = useState<string | null>(null);
  const [editAdminUid, setEditAdminUid] = useState<string | null>(null);
  const [deleteAdminUid, setDeleteAdminUid] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [search, setSearch] = useState("");

  // Função utilitária para normalizar strings (remover acentos, espaços, pontuação)
  const normalize = (str?: string) =>
    (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/gi, "");

  // Filtragem dos administradores
  const filteredAdminUsers = useMemo(() => {
    if (!search.trim()) return adminUsers;
    const s = normalize(search);
    return adminUsers.filter((admin) => {
      const name = normalize(admin.name);
      const email = normalize(admin.email);
      const role = roles.find(r => r.id === admin.roleId);
      const roleName = normalize(role?.name);

      return (
        name.includes(s) ||
        email.includes(s) ||
        roleName.includes(s)
      );
    });
  }, [adminUsers, search, roles]);

  const getStatusBadge = (admin: AdminUserEntity) => {
    if (!admin.isActive) {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
          Inativo
        </Badge>
      );
    }
    
    if (admin.isOnline()) {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
          Online
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
        Offline
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
      hour: "2-digit",
      minute: "2-digit"
    }).format(d);
  };

  const formatDateOnly = (date?: Date | string) => {
    if (!date) return "-";
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d);
  };

  const getRoleName = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role?.name || roleId;
  };

  const getRoleIcon = (roleId: string) => {
    if (roleId === 'super-admin') return <Shield className="h-4 w-4 text-red-500" />;
    return <UserCheck className="h-4 w-4 text-blue-500" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar
          placeholder="Buscar administrador por nome, email ou papel..."
          onSearch={setSearch}
          className="w-full sm:w-80"
        />
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Carregando administradores...</span>
        </div>
      ) : filteredAdminUsers.length > 0 ? (
        <div className="overflow-hidden rounded-lg border">
          <div className="bg-muted/50 px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="text-sm">
                {visibleColumns.includes("name") && <TableHead>Nome</TableHead>}
                {visibleColumns.includes("email") && <TableHead>Email</TableHead>}
                {visibleColumns.includes("role") && <TableHead>Papel</TableHead>}
                {visibleColumns.includes("status") && <TableHead>Status</TableHead>}
                {visibleColumns.includes("lastLogin") && <TableHead>Último Acesso</TableHead>}
                {visibleColumns.includes("createdAt") && <TableHead>Data de Criação</TableHead>}
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdminUsers.map((admin, idx) => (
                <TableRow key={admin.uid || idx} className="hover:bg-muted/50 text-sm">
                  {visibleColumns.includes("name") && (
                    <TableCell className="py-1 px-2">
                      <div className="font-medium">{admin.name}</div>
                    </TableCell>
                  )}
                  {visibleColumns.includes("email") && (
                    <TableCell className="py-1 px-2">
                      {admin.email}
                    </TableCell>
                  )}
                  {visibleColumns.includes("role") && (
                    <TableCell className="py-1 px-2">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(admin.roleId)}
                        <span>{getRoleName(admin.roleId)}</span>
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.includes("status") && (
                    <TableCell className="py-1 px-2">
                      {getStatusBadge(admin)}
                    </TableCell>
                  )}
                  {visibleColumns.includes("lastLogin") && (
                    <TableCell className="py-1 px-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs">{formatDate(admin.lastLogin)}</span>
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.includes("createdAt") && (
                    <TableCell className="py-1 px-2">
                      {formatDateOnly(admin.createdAt)}
                    </TableCell>
                  )}
                  <TableCell className="text-right py-1 px-2">
                    <div className="flex gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedAdmin(admin.uid)}
                        title="Ver detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditAdminUid(admin.uid)}
                        title="Editar papel"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteAdminUid(admin.uid)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Excluir administrador"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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

      <AdminUserModal
        adminUid={selectedAdminUid}
        open={!!selectedAdminUid}
        onClose={() => setSelectedAdmin(null)}
      />

      <AdminUserEditModal
        adminUid={editAdminUid}
        open={!!editAdminUid}
        onClose={() => setEditAdminUid(null)}
      />

      <AdminUserDeleteDialog
        adminUid={deleteAdminUid}
        open={!!deleteAdminUid}
        onClose={() => setDeleteAdminUid(null)}
      />

      <AdminUserModal
        adminUid={null}
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};
