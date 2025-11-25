import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/core/presentation/components/ui/dialog";
import { Badge } from "@/core/presentation/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/presentation/components/ui/card";
import { useAdminUsersConfig } from "../context/AdminUsersConfigContext";
import { User, Shield, Mail, Calendar, Clock, UserCheck } from "lucide-react";

interface AdminUserModalProps {
  adminUid: string | null;
  open: boolean;
  onClose: () => void;
}

export const AdminUserModal = ({ adminUid, open, onClose }: AdminUserModalProps) => {
  const { adminUsers, roles } = useAdminUsersConfig();
  const adminUser = adminUsers.find(a => a.uid === adminUid);
  const isCreating = !adminUid;

  if (isCreating) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Novo Administrador</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Formulário de criação de administrador em desenvolvimento.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!adminUser) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Administrador não encontrado</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const role = roles.find(r => r.id === adminUser.roleId);

  const formatDate = (date?: Date) => {
    if (!date) return "Nunca";
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };

  const formatDateOnly = (date?: Date) => {
    if (!date) return "Não informado";
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(date);
  };

  const getStatusBadge = () => {
    if (!adminUser.isActive) {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
          Inativo
        </Badge>
      );
    }
    
    if (adminUser.isOnline()) {
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

  const getRoleIcon = () => {
    if (adminUser.roleId === 'super-admin') return <Shield className="h-5 w-5 text-red-500" />;
    return <UserCheck className="h-5 w-5 text-blue-500" />;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-6 w-6" />
              <DialogTitle>{adminUser.name}</DialogTitle>
            </div>
            {getStatusBadge()}
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nome</label>
                <p className="font-medium">{adminUser.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{adminUser.email}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Status da Conta</label>
                <p className="font-medium">{adminUser.getStatusLabel()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Papel e Permissões */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getRoleIcon()}
                Papel e Permissões
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Papel</label>
                <p className="font-medium">{role?.name || adminUser.roleId}</p>
              </div>
              
              {role?.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                  <p className="text-sm">{role.description}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground">Permissões</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {role?.permissions.map((permission, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {permission}
                    </Badge>
                  )) || <p className="text-sm text-muted-foreground">Nenhuma permissão</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Atividade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Atividade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Último Acesso</label>
                <p className="font-medium">{formatDate(adminUser.lastLogin)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status Online</label>
                <p className="font-medium">
                  {adminUser.isOnline() ? "Online agora" : "Offline"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Metadados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Informações de Auditoria
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Criado por</label>
                <p className="font-medium">{adminUser.createdBy || "Sistema"}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Data de criação</label>
                <p className="font-medium">{formatDateOnly(adminUser.createdAt)}</p>
              </div>

              {adminUser.updatedBy && (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Atualizado por</label>
                    <p className="font-medium">{adminUser.updatedBy}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Data de atualização</label>
                    <p className="font-medium">{formatDateOnly(adminUser.updatedAt)}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Informações Técnicas */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Informações Técnicas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-muted-foreground">UID do Administrador</label>
                  <p className="font-mono bg-muted p-1 rounded text-xs break-all">{adminUser.uid}</p>
                </div>
                <div>
                  <label className="text-muted-foreground">ID do Papel</label>
                  <p className="font-mono bg-muted p-1 rounded text-xs break-all">{adminUser.roleId}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
