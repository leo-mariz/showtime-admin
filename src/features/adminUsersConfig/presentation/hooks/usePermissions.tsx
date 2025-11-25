import { useAuth } from "@/features/authentication/presentation/context/AuthContext";
import { useAdminUsersConfig } from "../context/AdminUsersConfigContext";
import { useMemo } from "react";

export interface PermissionsHook {
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  getUserPermissions: () => string[];
  getUserRole: () => string | null;
  isLoading: boolean;
  isReady: boolean; // Indica se o sistema de permissões está pronto
}

export function usePermissions(): PermissionsHook {
  const { admin } = useAuth();
  const { roles, rolesLoading } = useAdminUsersConfig();

  // Encontra o papel do admin atual
  const userRole = useMemo(() => {
    if (!admin?.uid || !roles.length) return null;
    
    // Busca o papel do admin usando o roleId
    if (admin.roleId) {
      return roles.find(role => role.id === admin.roleId) || null;
    }
    
    // Fallback para desenvolvimento: emails conhecidos
    if (admin.email?.includes('admin') || admin.email?.includes('leomariz')) {
      return roles.find(role => role.id === 'super_admin') || null;
    }
    
    return null;
  }, [admin, roles]);

  // Lista de permissões do usuário
  const userPermissions = useMemo(() => {
    if (!userRole) return [];
    return userRole.permissions || [];
  }, [userRole]);

  const hasPermission = (permission: string): boolean => {
    if (!admin) return false;
    
    // Enquanto os dados estão carregando, aguarda
    if (rolesLoading) return false;
    
    // Se não há roles carregados, verifica emails conhecidos para desenvolvimento
    if (!roles.length) {
      if (admin.email?.includes('leomariz') || admin.email?.includes('admin')) {
        return true;
      }
      return false;
    }
    
    // Super admin tem todas as permissões
    if (userRole?.id === 'super_admin') return true;
    
    // Verifica se o admin tem roleId definido
    if (!admin.roleId) {
      // Fallback para desenvolvimento
      if (admin.email?.includes('leomariz') || admin.email?.includes('admin')) {
        return true;
      }
      return false;
    }
    
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (rolesLoading) return false;
    if (!admin) return false;
    
    // Super admin tem todas as permissões
    if (userRole?.id === 'super_admin') return true;
    
    return permissions.some(permission => userPermissions.includes(permission));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (rolesLoading) return false;
    if (!admin) return false;
    
    // Super admin tem todas as permissões
    if (userRole?.id === 'super_admin') return true;
    
    return permissions.every(permission => userPermissions.includes(permission));
  };

  const getUserPermissions = (): string[] => {
    return userPermissions;
  };

  const getUserRole = (): string | null => {
    return userRole?.id || null;
  };

  // Sistema está pronto quando não está carregando e tem dados ou fallback
  const isReady = !rolesLoading && (roles.length > 0 || admin?.email?.includes('leomariz') || admin?.email?.includes('admin'));

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getUserPermissions,
    getUserRole,
    isLoading: rolesLoading,
    isReady
  };
}
