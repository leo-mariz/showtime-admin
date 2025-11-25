import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { AdminEntity } from "@/core/users/admins/domain/entities/AdminEntity";
import { AuthRepository } from "@/features/authentication/data/repositories/AuthRepository";
import { IAuthRemoteDataSource } from "@/features/authentication/data/datasources/AuthRemoteDataSource";
import { IAuthLocalDataSource } from "@/features/authentication/data/datasources/AuthLocalDataSource";
import { ChangePasswordUseCase } from "@/core/users/admins/domain/usecases/ChangePasswordUseCase";
import { AdminRepository } from "@/core/users/admins/data/repositories/AdminRepository";
import { AdminRemoteDataSource } from "@/core/users/admins/data/datasources/AdminRemoteDataSource";
import { AdminLocalDataSource } from "@/core/users/admins/data/datasources/AdminLocalDataSource";
import { authService } from "@/core/services/AuthServices";
// Removendo import para evitar dependência circular
// A integração será feita no usePermissions

// Estado e métodos expostos pelo contexto
export type AuthContextType = {
  admin: AdminEntity | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<AdminEntity>;
  logout: () => Promise<void>;
  changePasswordFirstAccess: (newPassword: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export type AuthProviderProps = {
  remote: IAuthRemoteDataSource;
  local: IAuthLocalDataSource;
  children: React.ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ remote, local, children }) => {
  const [admin, setAdmin] = useState<AdminEntity | null>(null);
  const [loading, setLoading] = useState(true); // Começa como true!
  const [error, setError] = useState<string | null>(null);

  const authRepo = new AuthRepository(remote, local);
  
  // Repository e UseCase para mudança de senha
  const adminRepository = new AdminRepository(
    new AdminRemoteDataSource(),
    new AdminLocalDataSource()
  );
  
  const changePasswordUseCase = new ChangePasswordUseCase(
    adminRepository,
    authService
  );

  // Carrega o admin do cache local ao iniciar
  useEffect(() => {
    async function loadAdminFromCache() {
      setLoading(true);
      try {
        const cachedAdmin = await local.getAdmin?.(); // método do seu AuthLocalDataSource
        setAdmin(cachedAdmin ?? null);
      } catch (err) {
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    }
    loadAdminFromCache();
  }, [local]);

  const login = useCallback(async (email: string, password: string): Promise<AdminEntity> => {
    setLoading(true);
    setError(null);
    try {
      const admin = await authRepo.login(email, password);
      setAdmin(admin);
      return admin;
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
      setAdmin(null);
      throw err; // Propaga o erro para a UI poder tratar (toast, navegação, etc)
    } finally {
      setLoading(false);
    }
  }, [authRepo]);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await authRepo.logout?.(); // Chama se existir
    } catch (err: any) {
      setError(err.message || "Erro ao fazer logout");
    } finally {
      setAdmin(null);
      setLoading(false);
    }
  }, [authRepo]);

  const changePasswordFirstAccess = useCallback(async (newPassword: string) => {
    if (!admin) {
      throw new Error("Nenhum usuário autenticado");
    }
    
    setLoading(true);
    setError(null);
    try {
      await changePasswordUseCase.execute(admin.uid, newPassword);
      
      // Atualizar o estado local do admin para refletir que não é mais primeiro acesso
      const updatedAdmin = { ...admin, isFirstAccess: false };
      setAdmin(updatedAdmin);
      await local.setAdmin?.(updatedAdmin);
    } catch (err: any) {
      setError(err.message || "Erro ao alterar senha");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [admin, changePasswordUseCase, local]);

  return (
    <AuthContext.Provider value={{ admin, loading, error, login, logout, changePasswordFirstAccess }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
} 