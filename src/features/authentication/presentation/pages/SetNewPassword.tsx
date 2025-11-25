import { useState } from "react";
import { Button } from "@/core/presentation/components/ui/button";
import { Input } from "@/core/presentation/components/ui/input";
import { Label } from "@/core/presentation/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/authentication/presentation/context/AuthContext";

const SetNewPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { changePasswordFirstAccess, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (password.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    try {
      // Chamar função do contexto que internamente usa o usecase
      await changePasswordFirstAccess(password);
      
      toast.success("Senha alterada com sucesso!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Erro ao alterar senha");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center justify-center">
          <img
            src="/lovable-uploads/af3ef615-ccbb-43e9-bb59-c91badb8813d.png"
            alt="ShowTime Logo"
            className="h-12"
          />
          <h2 className="mt-2 text-3xl font-bold text-gray-900">ShowTime</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Defina sua nova senha
          </p>
          <p className="mt-1 text-center text-xs text-gray-500">
            Este é seu primeiro acesso. Por favor, defina uma nova senha para continuar.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                required
                autoComplete="new-password"
                minLength={6}
              />
              <p className="text-xs text-gray-500">
                A senha deve ter no mínimo 6 caracteres
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••"
                required
                autoComplete="new-password"
                minLength={6}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-showtime-orange hover:bg-orange-600"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Alterando senha...
              </>
            ) : (
              "Alterar Senha"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SetNewPassword;

