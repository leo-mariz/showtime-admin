
import { useState } from "react";
import { SearchBar } from "@/core/presentation/components/shared/SearchBar";
import { FilterSelect } from "@/core/presentation/components/shared/FilterSelect";
import { Button } from "@/core/presentation/components/ui/button";
import { Plus } from "lucide-react";
import { AdminRegistrationModal } from "@/presentation/components/users/AdminRegistrationModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/presentation/components/ui/table";
import { Badge } from "@/core/presentation/components/ui/badge";

// Mock data for admin users only
const mockAdminUsers = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@showtime.com",
    role: "Administrador",
    department: "Administrativo",
    status: "Ativo",
    lastLogin: "2023-12-01T10:30:00Z",
    permissions: ["Gerenciar Usuários", "Configurações do Sistema"]
  },
  {
    id: "2", 
    name: "Maria Santos",
    email: "maria@showtime.com",
    role: "Gerente",
    department: "Comercial",
    status: "Ativo",
    lastLogin: "2023-12-01T09:15:00Z",
    permissions: ["Gerenciar Artistas", "Gerenciar Clientes"]
  },
  {
    id: "3",
    name: "Carlos Oliveira", 
    email: "carlos@showtime.com",
    role: "Analista",
    department: "Suporte",
    status: "Inativo",
    lastLogin: "2023-11-28T14:20:00Z",
    permissions: ["Gerenciar Suporte"]
  }
];

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const filteredUsers = mockAdminUsers.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleCreateUser = () => {
    setShowRegistrationModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Usuários do Sistema</h1>
          <p className="text-muted-foreground">
            Gerencie administradores e funcionários da plataforma
          </p>
        </div>
        <div className="flex gap-2">
          <SearchBar
            placeholder="Buscar usuários..."
            onSearch={setSearchQuery}
          />
          <FilterSelect
            value={roleFilter}
            onValueChange={setRoleFilter}
            options={[
              { value: "all", label: "Todos os cargos" },
              { value: "Administrador", label: "Administrador" },
              { value: "Gerente", label: "Gerente" },
              { value: "Supervisor", label: "Supervisor" },
              { value: "Analista", label: "Analista" },
              { value: "Assistente", label: "Assistente" },
              { value: "Suporte", label: "Suporte" },
            ]}
          />
          <Button 
            onClick={handleCreateUser}
            className="bg-gradient-showtime hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Cadastrar Usuário
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredUsers.length > 0 ? (
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === "Ativo" ? "default" : "secondary"}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(user.lastLogin)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground">Nenhum usuário encontrado</p>
          </div>
        )}
      </div>

      <AdminRegistrationModal
        open={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
      />
    </div>
  );
};

export default Users;
