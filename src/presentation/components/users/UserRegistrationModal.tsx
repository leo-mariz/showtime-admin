
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
import { Textarea } from "@/core/presentation/components/ui/textarea";
import { toast } from "sonner";

interface UserRegistrationModalProps {
  open: boolean;
  onClose: () => void;
}

export const UserRegistrationModal = ({ open, onClose }: UserRegistrationModalProps) => {
  const [userType, setUserType] = useState("");
  const [personType, setPersonType] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Dados básicos
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    
    // Dados CPF
    cpf: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    
    // Dados CNPJ
    cnpj: "",
    companyName: "",
    fantasyName: "",
    stateRegistration: "",
    
    // Dados do artista
    artistName: "",
    talent: "",
    specialty: "",
    hourlyRate: "",
    bio: "",
    
    // Dados do cliente
    profilePicture: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log("Criando usuário:", {
        userType,
        personType,
        formData
      });

      // Simulação de criação de usuário
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Sucesso",
        description: `Usuário ${userType} criado com sucesso!`,
      });

      onClose();
      resetForm();
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao criar usuário",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      cpf: "",
      firstName: "",
      lastName: "",
      birthDate: "",
      gender: "",
      cnpj: "",
      companyName: "",
      fantasyName: "",
      stateRegistration: "",
      artistName: "",
      talent: "",
      specialty: "",
      hourlyRate: "",
      bio: "",
      profilePicture: "",
    });
    setUserType("");
    setPersonType("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Usuário</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userType">Tipo de Usuário</Label>
              <Select value={userType} onValueChange={setUserType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="artista">Artista</SelectItem>
                  <SelectItem value="cliente">Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="personType">Tipo de Pessoa</Label>
              <Select value={personType} onValueChange={setPersonType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cpf">Pessoa Física (CPF)</SelectItem>
                  <SelectItem value="cnpj">Pessoa Jurídica (CNPJ)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dados básicos */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          {/* Dados específicos por tipo de pessoa */}
          {personType === "cpf" && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nome</Label>
                  <Input
                    id="firstName"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Sobrenome</Label>
                  <Input
                    id="lastName"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    required
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    required
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gênero</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {personType === "cnpj" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    required
                    value={formData.cnpj}
                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stateRegistration">Inscrição Estadual</Label>
                  <Input
                    id="stateRegistration"
                    value={formData.stateRegistration}
                    onChange={(e) => setFormData({ ...formData, stateRegistration: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Razão Social</Label>
                  <Input
                    id="companyName"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fantasyName">Nome Fantasia</Label>
                  <Input
                    id="fantasyName"
                    value={formData.fantasyName}
                    onChange={(e) => setFormData({ ...formData, fantasyName: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}

          {/* Dados específicos do artista */}
          {userType === "artista" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="artistName">Nome Artístico</Label>
                  <Input
                    id="artistName"
                    required
                    value={formData.artistName}
                    onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="talent">Talento</Label>
                  <Input
                    id="talent"
                    required
                    value={formData.talent}
                    onChange={(e) => setFormData({ ...formData, talent: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidade</Label>
                  <Input
                    id="specialty"
                    required
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Valor/Hora</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  placeholder="Conte um pouco sobre você..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>
            </>
          )}

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
