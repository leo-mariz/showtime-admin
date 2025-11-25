
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/core/presentation/components/ui/dialog";
import { Button } from "@/core/presentation/components/ui/button";
import { Input } from "@/core/presentation/components/ui/input";
import { Label } from "@/core/presentation/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/presentation/components/ui/select";
import { Checkbox } from "@/core/presentation/components/ui/checkbox";
import { toast } from "sonner";

interface AdminRegistrationModalProps {
  open: boolean;
  onClose: () => void;
}

export const AdminRegistrationModal = ({ open, onClose }: AdminRegistrationModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    department: "",
    permissions: {
      manageUsers: false,
      manageArtists: false,
      manageClients: false,
      manageGroups: false,
      manageEvents: false,
      manageSupport: false,
      managePayments: false,
      viewReports: false,
      systemSettings: false,
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (!formData.role) {
      toast.error("Por favor, selecione um cargo");
      return;
    }

    setLoading(true);

    try {
      // Simular criação de usuário administrativo
      console.log("Criando usuário administrativo:", {
        ...formData,
        userType: "admin"
      });

      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success(`Usuário ${formData.role} criado com sucesso!`);
      onClose();
      resetForm();
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      toast.error("Erro ao criar usuário");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      department: "",
      permissions: {
        manageUsers: false,
        manageArtists: false,
        manageClients: false,
        manageGroups: false,
        manageEvents: false,
        manageSupport: false,
        managePayments: false,
        viewReports: false,
        systemSettings: false,
      }
    });
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: checked
      }
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Administrador/Funcionário</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Informações Básicas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Senha *</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          {/* Cargo e Departamento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Cargo *</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cargo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="administrador">Administrador</SelectItem>
                  <SelectItem value="gerente">Gerente</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="analista">Analista</SelectItem>
                  <SelectItem value="assistente">Assistente</SelectItem>
                  <SelectItem value="suporte">Suporte</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="administrativo">Administrativo</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                  <SelectItem value="operacional">Operacional</SelectItem>
                  <SelectItem value="suporte">Suporte ao Cliente</SelectItem>
                  <SelectItem value="ti">Tecnologia da Informação</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Permissões */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Permissões do Sistema</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manageUsers"
                    checked={formData.permissions.manageUsers}
                    onCheckedChange={(checked) => handlePermissionChange("manageUsers", checked as boolean)}
                  />
                  <Label htmlFor="manageUsers">Gerenciar Usuários</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manageArtists"
                    checked={formData.permissions.manageArtists}
                    onCheckedChange={(checked) => handlePermissionChange("manageArtists", checked as boolean)}
                  />
                  <Label htmlFor="manageArtists">Gerenciar Artistas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manageClients"
                    checked={formData.permissions.manageClients}
                    onCheckedChange={(checked) => handlePermissionChange("manageClients", checked as boolean)}
                  />
                  <Label htmlFor="manageClients">Gerenciar Clientes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manageGroups"
                    checked={formData.permissions.manageGroups}
                    onCheckedChange={(checked) => handlePermissionChange("manageGroups", checked as boolean)}
                  />
                  <Label htmlFor="manageGroups">Gerenciar Conjuntos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manageEvents"
                    checked={formData.permissions.manageEvents}
                    onCheckedChange={(checked) => handlePermissionChange("manageEvents", checked as boolean)}
                  />
                  <Label htmlFor="manageEvents">Gerenciar Eventos</Label>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manageSupport"
                    checked={formData.permissions.manageSupport}
                    onCheckedChange={(checked) => handlePermissionChange("manageSupport", checked as boolean)}
                  />
                  <Label htmlFor="manageSupport">Gerenciar Suporte</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="managePayments"
                    checked={formData.permissions.managePayments}
                    onCheckedChange={(checked) => handlePermissionChange("managePayments", checked as boolean)}
                  />
                  <Label htmlFor="managePayments">Gerenciar Pagamentos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="viewReports"
                    checked={formData.permissions.viewReports}
                    onCheckedChange={(checked) => handlePermissionChange("viewReports", checked as boolean)}
                  />
                  <Label htmlFor="viewReports">Visualizar Relatórios</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="systemSettings"
                    checked={formData.permissions.systemSettings}
                    onCheckedChange={(checked) => handlePermissionChange("systemSettings", checked as boolean)}
                  />
                  <Label htmlFor="systemSettings">Configurações do Sistema</Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => { onClose(); resetForm(); }}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-showtime hover:opacity-90"
              disabled={loading}
            >
              {loading ? "Cadastrando..." : "Cadastrar Usuário"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
