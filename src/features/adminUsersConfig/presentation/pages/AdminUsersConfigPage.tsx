import { useState } from "react";
import { RolesTable } from "../components/RolesTable";
import { AdminUsersTable } from "../components/AdminUsersTable";
import { RoleCreateModal } from "../components/RoleCreateModal";
import { AdminUserCreateModal } from "../components/AdminUserCreateModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/presentation/components/ui/tabs";
import { Button } from "@/core/presentation/components/ui/button";
import { useAdminUsersConfig } from "../context/AdminUsersConfigContext";
import { Alert, AlertDescription } from "@/core/presentation/components/ui/alert";
import { AlertCircle, Shield, Users, UserCog, Plus } from "lucide-react";

const AdminUsersConfigPage = () => {
  const { 
    roles, rolesLoading, rolesError,
    adminUsers, adminUsersLoading, adminUsersError,
    permissions
  } = useAdminUsersConfig();

  // Estados dos modais
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [adminUserModalOpen, setAdminUserModalOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("admins");

  const [visibleRoleColumns] = useState([
    "name", "description", "permissions", "createdBy", "createdAt", "status"
  ]);

  const [visibleAdminColumns] = useState([
    "name", "email", "role", "status", "lastLogin", "createdAt"
  ]);

  // Filtra papéis por status
  const activeRoles = roles.filter(role => role.isActive);
  const inactiveRoles = roles.filter(role => !role.isActive);

  // Filtra admins por status
  const activeAdmins = adminUsers.filter(admin => admin.isActive);
  const inactiveAdmins = adminUsers.filter(admin => !admin.isActive);

  if (rolesError || adminUsersError) {
    return (
      <div className="space-y-2">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <Shield className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Gestão de Administradores</h1>
          </div>
          <p className="text-muted-foreground">
            Gerencie administradores, papéis e permissões do sistema
          </p>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar dados: {rolesError || adminUsersError}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <Shield className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Gestão de Administradores</h1>
          </div>
          <p className="text-muted-foreground">
            Gerencie administradores, papéis e permissões do sistema
          </p>
        </div>

        {/* Estatísticas rápidas */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg p-4 border">
            <div className="text-2xl font-bold">{permissions.length}</div>
            <div className="text-sm text-muted-foreground">Permissões</div>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <div className="text-2xl font-bold text-blue-600">{activeRoles.length}</div>
            <div className="text-sm text-muted-foreground">Papéis Ativos</div>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <div className="text-2xl font-bold text-green-600">{activeAdmins.length}</div>
            <div className="text-sm text-muted-foreground">Admins Ativos</div>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <div className="text-2xl font-bold text-gray-600">{adminUsers.length}</div>
            <div className="text-sm text-muted-foreground">Total Admins</div>
          </div>
        </div> */}

        <Tabs defaultValue="admins" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="admins" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Administradores ({adminUsers.length})
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              Papéis ({roles.length})
            </TabsTrigger>
          </TabsList>
          
          {/* Botões de ação - aparecem apenas na aba ativa */}
          {activeTab === "admins" && (
            <div className="flex justify-end gap-2 mb-4">
              <Button
                size="sm"
                onClick={() => setAdminUserModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Admin
              </Button>
            </div>
          )}
          
          {activeTab === "roles" && (
            <div className="flex justify-end gap-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedRoleId(null);
                  setRoleModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Papel
              </Button>
            </div>
          )}
          
          <TabsContent value="admins">
            <Tabs defaultValue="active-admins">
              <TabsList className="mb-4">
                <TabsTrigger value="active-admins">Ativos ({activeAdmins.length})</TabsTrigger>
                <TabsTrigger value="inactive-admins">Inativos ({inactiveAdmins.length})</TabsTrigger>
                <TabsTrigger value="all-admins">Todos ({adminUsers.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active-admins">
                <AdminUsersTable
                  adminUsers={activeAdmins}
                  title="Administradores Ativos"
                  emptyMessage="Nenhum administrador ativo encontrado"
                  visibleColumns={visibleAdminColumns}
                  isLoading={adminUsersLoading}
                />
              </TabsContent>
              
              <TabsContent value="inactive-admins">
                <AdminUsersTable
                  adminUsers={inactiveAdmins}
                  title="Administradores Inativos"
                  emptyMessage="Nenhum administrador inativo encontrado"
                  visibleColumns={visibleAdminColumns}
                  isLoading={adminUsersLoading}
                />
              </TabsContent>
              
              <TabsContent value="all-admins">
                <AdminUsersTable
                  adminUsers={adminUsers}
                  title="Todos os Administradores"
                  emptyMessage="Nenhum administrador encontrado"
                  visibleColumns={visibleAdminColumns}
                  isLoading={adminUsersLoading}
                />
              </TabsContent>
            </Tabs>
          </TabsContent>
          
          <TabsContent value="roles">
            <Tabs defaultValue="active-roles">
              <TabsList className="mb-4">
                <TabsTrigger value="active-roles">Ativos ({activeRoles.length})</TabsTrigger>
                <TabsTrigger value="inactive-roles">Inativos ({inactiveRoles.length})</TabsTrigger>
                <TabsTrigger value="all-roles">Todos ({roles.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active-roles">
                <RolesTable
                  roles={activeRoles}
                  title="Papéis Ativos"
                  emptyMessage="Nenhum papel ativo encontrado"
                  visibleColumns={visibleRoleColumns}
                  isLoading={rolesLoading}
                  onEditRole={(roleId) => {
                    setSelectedRoleId(roleId);
                    setRoleModalOpen(true);
                  }}
                />
              </TabsContent>
              
              <TabsContent value="inactive-roles">
                <RolesTable
                  roles={inactiveRoles}
                  title="Papéis Inativos"
                  emptyMessage="Nenhum papel inativo encontrado"
                  visibleColumns={visibleRoleColumns}
                  isLoading={rolesLoading}
                  onEditRole={(roleId) => {
                    setSelectedRoleId(roleId);
                    setRoleModalOpen(true);
                  }}
                />
              </TabsContent>
              
              <TabsContent value="all-roles">
                <RolesTable
                  roles={roles}
                  title="Todos os Papéis"
                  emptyMessage="Nenhum papel encontrado"
                  visibleColumns={visibleRoleColumns}
                  isLoading={rolesLoading}
                  onEditRole={(roleId) => {
                    setSelectedRoleId(roleId);
                    setRoleModalOpen(true);
                  }}
                />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>

        {/* Modais */}
        <RoleCreateModal
          roleId={selectedRoleId}
          open={roleModalOpen}
          onClose={() => {
            setRoleModalOpen(false);
            setSelectedRoleId(null);
          }}
        />
        
        <AdminUserCreateModal
          open={adminUserModalOpen}
          onClose={() => setAdminUserModalOpen(false)}
        />
      </div>
  );
};

export default AdminUsersConfigPage;
