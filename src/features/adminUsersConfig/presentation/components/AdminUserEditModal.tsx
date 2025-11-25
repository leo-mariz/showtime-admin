import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/core/presentation/components/ui/dialog";
import { Button } from "@/core/presentation/components/ui/button";
import { Label } from "@/core/presentation/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/presentation/components/ui/select";
import { useAdminUsersConfig } from "../context/AdminUsersConfigContext";
import { Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/features/authentication/presentation/context/AuthContext";

interface AdminUserEditModalProps {
  adminUid: string | null;
  open: boolean;
  onClose: () => void;
}

export const AdminUserEditModal = ({ adminUid, open, onClose }: AdminUserEditModalProps) => {
  const { adminUsers, roles, updateAdminUser } = useAdminUsersConfig();
  const { admin: currentAdmin } = useAuth();
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const adminUser = adminUsers.find(a => a.uid === adminUid);

  useEffect(() => {
    if (adminUser) {
      setSelectedRoleId(adminUser.roleId);
    }
  }, [adminUser]);

  if (!adminUser) {
    return null;
  }

  const handleSave = async () => {
    if (!selectedRoleId) {
      toast.error("Selecione um papel");
      return;
    }

    if (selectedRoleId === adminUser.roleId) {
      toast.info("Nenhuma alteração foi feita");
      onClose();
      return;
    }

    try {
      setLoading(true);
      await updateAdminUser(adminUser.uid, {
        roleId: selectedRoleId,
        updatedBy: currentAdmin?.email || "Sistema",
        updatedAt: new Date()
      });
      toast.success("Papel do administrador atualizado com sucesso!");
      onClose();
    } catch (error: any) {
      console.error("Erro ao atualizar administrador:", error);
      toast.error(error.message || "Erro ao atualizar administrador");
    } finally {
      setLoading(false);
    }
  };

  const activeRoles = roles.filter(r => r.isActive);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Administrador
          </DialogTitle>
          <DialogDescription>
            Altere o papel/função do administrador {adminUser.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="admin-name">Nome</Label>
            <div className="p-2 bg-muted rounded-md text-sm">
              {adminUser.name}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <div className="p-2 bg-muted rounded-md text-sm">
              {adminUser.email}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Papel / Função *</Label>
            <Select
              value={selectedRoleId}
              onValueChange={setSelectedRoleId}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um papel" />
              </SelectTrigger>
              <SelectContent>
                {activeRoles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              O papel define as permissões do administrador no sistema
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || !selectedRoleId}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


