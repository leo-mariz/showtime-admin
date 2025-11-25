import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/core/presentation/components/ui/dialog";
import { Badge } from "@/core/presentation/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/presentation/components/ui/card";
import { useAdminUsersConfig } from "../context/AdminUsersConfigContext";
import { UserCog, Shield, Calendar, User } from "lucide-react";

interface RoleModalProps {
  roleId: string | null;
  open: boolean;
  onClose: () => void;
}

export const RoleModal = ({ roleId, open, onClose }: RoleModalProps) => {
  const { roles, permissions } = useAdminUsersConfig();
  const role = roles.find(r => r.id === roleId);
  const isCreating = !roleId;

  if (isCreating) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Novo Papel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Formulário de criação de papel em desenvolvimento.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!role) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Papel não encontrado</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const formatDate = (date?: Date) => {
    if (!date) return "Não informado";
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };

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

  const getRoleIcon = () => {
    if (role.id === 'super-admin') return <Shield className="h-6 w-6 text-red-500" />;
    return <UserCog className="h-6 w-6 text-blue-500" />;
  };

  const getPermissionNames = (permissionIds: string[]) => {
    return permissionIds.map(id => {
      const permission = permissions.find(p => p.id === id);
      return permission?.name || id;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getRoleIcon()}
              <DialogTitle>{role.name}</DialogTitle>
            </div>
            {getStatusBadge(role.isActive)}
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5" />
                Informações do Papel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nome</label>
                <p className="font-medium">{role.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                <p className="font-medium">{role.description || "Sem descrição"}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">ID do Sistema</label>
                <p className="font-mono text-xs bg-muted p-2 rounded">{role.id}</p>
              </div>
            </CardContent>
          </Card>

          {/* Permissões */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Permissões ({role.permissions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {role.permissions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {getPermissionNames(role.permissions).map((permissionName, idx) => (
                      <Badge key={idx} variant="secondary">
                        {permissionName}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Nenhuma permissão atribuída</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Metadados */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Informações de Auditoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-muted-foreground">Criado por</label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <p className="font-medium">{role.createdBy || "Sistema"}</p>
                  </div>
                </div>
                <div>
                  <label className="text-muted-foreground">Data de criação</label>
                  <p className="font-medium">{formatDate(role.createdAt)}</p>
                </div>
                {role.updatedBy && (
                  <>
                    <div>
                      <label className="text-muted-foreground">Atualizado por</label>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <p className="font-medium">{role.updatedBy}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-muted-foreground">Data de atualização</label>
                      <p className="font-medium">{formatDate(role.updatedAt)}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
