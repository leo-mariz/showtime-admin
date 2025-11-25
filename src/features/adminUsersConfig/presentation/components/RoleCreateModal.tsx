import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/core/presentation/components/ui/dialog";
import { Button } from "@/core/presentation/components/ui/button";
import { Input } from "@/core/presentation/components/ui/input";
import { Label } from "@/core/presentation/components/ui/label";
import { Checkbox } from "@/core/presentation/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/presentation/components/ui/card";
import { Badge } from "@/core/presentation/components/ui/badge";
import { useAdminUsersConfig } from "../context/AdminUsersConfigContext";
import { RoleEntity } from "@/features/adminUsersConfig/domain/entities/RoleEntity";
import { toast } from "sonner";
import { Shield, UserCog, Save, X } from "lucide-react";

interface RoleCreateModalProps {
  roleId: string | null; // null = criar novo, string = editar existente
  open: boolean;
  onClose: () => void;
}

export const RoleCreateModal = ({ roleId, open, onClose }: RoleCreateModalProps) => {
  const { roles, permissions, createRole, updateRole } = useAdminUsersConfig();
  const role = roles.find(r => r.id === roleId);
  const isCreating = !roleId;

  // Estado do formulário
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
    isActive: true
  });
  const [loading, setLoading] = useState(false);

  // Carregar dados do papel quando editar
  useEffect(() => {
    if (role && !isCreating) {
      setFormData({
        name: role.name,
        description: role.description || "",
        permissions: role.permissions || [],
        isActive: role.isActive
      });
    } else {
      setFormData({
        name: "",
        description: "",
        permissions: [],
        isActive: true
      });
    }
  }, [role, isCreating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isCreating) {
        // Gerar ID único para o papel
        const newRoleId = `role_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const newRole = new RoleEntity(
          newRoleId,
          formData.name,
          formData.description,
          formData.permissions,
          formData.isActive
        );

        await createRole(newRole);
        toast.success("Papel criado com sucesso!");
      } else {
        if (!role) throw new Error("Papel não encontrado");
        
        await updateRole(role.id, {
          name: formData.name,
          description: formData.description,
          permissions: formData.permissions,
          isActive: formData.isActive
        });
        toast.success("Papel atualizado com sucesso!");
      }
      
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar papel");
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const groupedPermissions = permissions.reduce((groups, permission) => {
    const category = permission.category || "Geral";
    if (!groups[category]) groups[category] = [];
    groups[category].push(permission);
    return groups;
  }, {} as Record<string, typeof permissions>);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {isCreating ? (
              <UserCog className="h-6 w-6 text-blue-500" />
            ) : (
              <Shield className="h-6 w-6 text-red-500" />
            )}
            <DialogTitle>
              {isCreating ? "Criar Novo Papel" : `Editar Papel: ${role?.name}`}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Papel *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Administrador Geral"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição do papel"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, isActive: checked as boolean }))
                  }
                />
                <Label htmlFor="isActive">Papel ativo</Label>
              </div>
            </CardContent>
          </Card>

          {/* Permissões */}
          <Card>
            <CardHeader>
              <CardTitle>Permissões</CardTitle>
              <p className="text-sm text-muted-foreground">
                Selecione as permissões que este papel terá acesso
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                <div key={category} className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    {category}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categoryPermissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission.id}
                          checked={formData.permissions.includes(permission.id)}
                          onCheckedChange={() => handlePermissionToggle(permission.id)}
                        />
                        <Label htmlFor={permission.id} className="text-sm cursor-pointer">
                          {permission.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {formData.permissions.length > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">
                    Permissões selecionadas ({formData.permissions.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.permissions.map(permissionId => {
                      const permission = permissions.find(p => p.id === permissionId);
                      return (
                        <Badge key={permissionId} variant="secondary" className="text-xs">
                          {permission?.name || permissionId}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !formData.name.trim()}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Salvando..." : (isCreating ? "Criar Papel" : "Atualizar Papel")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
