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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/presentation/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/presentation/components/ui/card";
import { Alert, AlertDescription } from "@/core/presentation/components/ui/alert";
import { useAdminUsersConfig } from "../context/AdminUsersConfigContext";
import { toast } from "sonner";
import { UserPlus, Save, X, AlertCircle } from "lucide-react";

interface AdminUserCreateModalProps {
  open: boolean;
  onClose: () => void;
}

export const AdminUserCreateModal = ({ open, onClose }: AdminUserCreateModalProps) => {
  const { roles, createNewAdmin } = useAdminUsersConfig();

  // Estado do formulário
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    roleId: "",
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "creating">("form");

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setFormData({
        name: "",
        email: "",
        roleId: "",
        isActive: true
      });
      setStep("form");
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStep("creating");

    try {
      // Chamar função do contexto que internamente usa o usecase
      await createNewAdmin({
        email: formData.email,
        name: formData.name,
        roleId: formData.roleId
      });

      // Mensagem genérica de sucesso
      toast.success(
        "Administrador adicionado com sucesso! As instruções de acesso foram enviadas por email."
      );
      
      // Fechar o modal
      onClose();
      
    } catch (error: any) {
      console.error("❌ Erro ao criar usuário admin:", error);
      toast.error(error.message || "Erro ao criar usuário admin");
      setStep("form");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const activeRoles = roles.filter(role => role.isActive);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <UserPlus className="h-6 w-6 text-blue-500" />
            <DialogTitle>Adicionar Novo Usuário Admin</DialogTitle>
          </div>
        </DialogHeader>

        {step === "form" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                O novo administrador receberá as instruções de acesso por email.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Informações do Usuário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome completo do usuário"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@exemplo.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roleId">Papel *</Label>
                  <Select
                    value={formData.roleId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, roleId: value }))}
                    required
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
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isActive">Usuário ativo</Label>
                </div>
              </CardContent>
            </Card>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={loading || !formData.name.trim() || !formData.email.trim() || !formData.roleId}
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Criando..." : "Criar Usuário"}
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === "creating" && (
          <div className="space-y-6 text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <div>
              <h3 className="text-lg font-medium">Adicionando administrador...</h3>
              <p className="text-muted-foreground">
                Configurando acesso e enviando instruções por email
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
