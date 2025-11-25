import React from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { Alert, AlertDescription } from '@/core/presentation/components/ui/alert';
import { ShieldX } from 'lucide-react';

interface PermissionGuardProps {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean; // Se true, requer todas as permissões. Se false, requer pelo menos uma
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  permissions = [],
  requireAll = false,
  fallback,
  children
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, isLoading } = usePermissions();

  // Enquanto carrega, não mostra nada
  if (isLoading) {
    return null;
  }

  // Determina se o usuário tem as permissões necessárias
  let hasAccess = false;

  if (permission) {
    // Verifica uma permissão específica
    hasAccess = hasPermission(permission);
  } else if (permissions.length > 0) {
    // Verifica múltiplas permissões
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  } else {
    // Se não especificar permissões, permite acesso
    hasAccess = true;
  }

  // Se não tem acesso, mostra o fallback ou uma mensagem padrão
  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Alert variant="destructive" className="m-4">
        <ShieldX className="h-4 w-4" />
        <AlertDescription>
          Você não tem permissão para acessar esta seção.
        </AlertDescription>
      </Alert>
    );
  }

  // Se tem acesso, renderiza os children
  return <>{children}</>;
};

// Componente para uso mais simples
interface RequirePermissionProps {
  permission: string;
  children: React.ReactNode;
}

export const RequirePermission: React.FC<RequirePermissionProps> = ({ 
  permission, 
  children 
}) => {
  return (
    <PermissionGuard permission={permission}>
      {children}
    </PermissionGuard>
  );
};

// HOC para proteger componentes inteiros
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  permission: string
) {
  return function ProtectedComponent(props: P) {
    return (
      <RequirePermission permission={permission}>
        <Component {...props} />
      </RequirePermission>
    );
  };
}
