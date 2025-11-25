import { useState } from "react";
import { useAuth } from "@/features/authentication/presentation/context/AuthContext";
import { Button } from "@/core/presentation/components/ui/button";
import { Input } from "@/core/presentation/components/ui/input";
import { Label } from "@/core/presentation/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const admin = await login(email, password);
      
      // Verificar se é o primeiro acesso
      if (admin && admin.isFirstAccess) {
        toast.info("Primeiro acesso detectado. Por favor, defina uma nova senha.");
        navigate("/set-new-password");
      } else {
        toast.success("Login realizado com sucesso!");
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || "Falha ao realizar login");
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Por favor, digite seu e-mail para recuperar a senha");
      return;
    }
    // Aqui você pode chamar um usecase ou método do contexto para forgot password futuramente
    toast.info("Funcionalidade de recuperação de senha ainda não implementada.");
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
            Faça login para acessar o painel administrativo
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <a
                  href="#"
                  className="text-sm font-medium text-showtime-orange hover:underline"
                  onClick={handleForgotPassword}
                >
                  Esqueceu a senha?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                required
                autoComplete="current-password"
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
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
          {/* Exibe erro vindo do contexto, se houver */}
          {error && (
            <div className="mt-2 text-red-600 text-sm text-center">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
