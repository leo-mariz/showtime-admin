import { createContext, useContext, useEffect, useState } from "react";
import { PermissionEntity } from "@/features/adminUsersConfig/domain/entities/PermissionEntity";
import { RoleEntity } from "@/features/adminUsersConfig/domain/entities/RoleEntity";
import { AdminUserEntity } from "@/features/adminUsersConfig/domain/entities/AdminUserEntity";
import { PermissionRepository } from "@/features/adminUsersConfig/data/repositories/PermissionRepository";
import { RoleRepository } from "@/features/adminUsersConfig/data/repositories/RoleRepository";
import { AdminUserRepository } from "@/features/adminUsersConfig/data/repositories/AdminUserRepository";
import { PermissionLocalDataSource } from "@/features/adminUsersConfig/data/datasources/PermissionLocalDataSource";
import { PermissionRemoteDataSource } from "@/features/adminUsersConfig/data/datasources/PermissionRemoteDataSource";
import { RoleLocalDataSource } from "@/features/adminUsersConfig/data/datasources/RoleLocalDataSource";
import { RoleRemoteDataSource } from "@/features/adminUsersConfig/data/datasources/RoleRemoteDataSource";
import { AdminUserLocalDataSource } from "@/features/adminUsersConfig/data/datasources/AdminUserLocalDataSource";
import { AdminUserRemoteDataSource } from "@/features/adminUsersConfig/data/datasources/AdminUserRemoteDataSource";
import { cacheService } from "@/core/services/LocalCacheServices";
import { CreateAdminUseCase, CreateAdminInput, CreateAdminOutput } from "@/features/adminUsersConfig/domain/usecases/CreateAdminUseCase";
import { AdminRepository } from "@/core/users/admins/data/repositories/AdminRepository";
import { AdminRemoteDataSource } from "@/core/users/admins/data/datasources/AdminRemoteDataSource";
import { AdminLocalDataSource } from "@/core/users/admins/data/datasources/AdminLocalDataSource";
import { authService } from "@/core/services/AuthServices";
import { emailService } from "@/core/services/EmailServices";
import { UsersRepository } from "@/core/users/data/repositories/UsersRepository";
import { UserRemoteDataSource } from "@/core/users/data/datasources/UsersRemoteDataSource";
import { UserLocalDataSource } from "@/core/users/data/datasources/UsersLocalDataSource";

type AdminUsersConfigContextType = {
  // Permissions
  permissions: PermissionEntity[];
  permissionsLoading: boolean;
  permissionsError: string | null;
  
  // Roles
  roles: RoleEntity[];
  rolesLoading: boolean;
  rolesError: string | null;
  
  // Admin Users
  adminUsers: AdminUserEntity[];
  adminUsersLoading: boolean;
  adminUsersError: string | null;
  
  // Actions
  refetchPermissions: () => Promise<void>;
  refetchRoles: () => Promise<void>;
  refetchAdminUsers: () => Promise<void>;
  
  // CRUD Operations
  createRole: (role: RoleEntity) => Promise<RoleEntity>;
  updateRole: (id: string, changes: Partial<RoleEntity>) => Promise<void>;
  deleteRole: (id: string) => Promise<void>;
  
  createAdminUser: (adminUser: AdminUserEntity) => Promise<AdminUserEntity>;
  updateAdminUser: (uid: string, changes: Partial<AdminUserEntity>) => Promise<void>;
  deleteAdminUser: (uid: string) => Promise<void>;
  
  // Create New Admin with Auth (UseCase)
  createNewAdmin: (input: CreateAdminInput) => Promise<CreateAdminOutput>;
};

const AdminUsersConfigContext = createContext<AdminUsersConfigContextType | undefined>(undefined);

// Instâncias dos repositories
const permissionRepository = new PermissionRepository(
  new PermissionLocalDataSource(cacheService),
  new PermissionRemoteDataSource()
);

const roleRepository = new RoleRepository(
  new RoleLocalDataSource(cacheService),
  new RoleRemoteDataSource()
);

const adminUserRepository = new AdminUserRepository(
  new AdminUserLocalDataSource(cacheService),
  new AdminUserRemoteDataSource()
);

// Repository e UseCase para criação de admin com autenticação
const adminRepository = new AdminRepository(
  new AdminRemoteDataSource(),
  new AdminLocalDataSource()
);

const usersRepository = new UsersRepository(
  new UserRemoteDataSource(),
  new UserLocalDataSource()
);

const createAdminUseCase = new CreateAdminUseCase(
  adminRepository,
  authService,
  emailService,
  usersRepository
);

export function AdminUsersConfigProvider({ children }: { children: React.ReactNode }) {
  // Permissions State
  const [permissions, setPermissions] = useState<PermissionEntity[]>([]);
  const [permissionsLoading, setPermissionsLoading] = useState(true);
  const [permissionsError, setPermissionsError] = useState<string | null>(null);
  
  // Roles State
  const [roles, setRoles] = useState<RoleEntity[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState<string | null>(null);
  
  // Admin Users State
  const [adminUsers, setAdminUsers] = useState<AdminUserEntity[]>([]);
  const [adminUsersLoading, setAdminUsersLoading] = useState(true);
  const [adminUsersError, setAdminUsersError] = useState<string | null>(null);

  // Fetch Permissions
  const fetchPermissions = async () => {
    try {
      setPermissionsLoading(true);
      setPermissionsError(null);
      console.log("[AdminUsersConfigContext] Buscando permissões...");
      
      // Inicializa permissões do sistema se necessário
      await permissionRepository.initializeSystemPermissions();
      
      const permissionsData = await permissionRepository.getAll();
      console.log("[AdminUsersConfigContext] Permissões encontradas:", permissionsData);
      setPermissions(permissionsData);
    } catch (err: any) {
      console.error("[AdminUsersConfigContext] Erro ao buscar permissões:", err);
      setPermissionsError(err.message || "Erro ao buscar permissões");
    } finally {
      setPermissionsLoading(false);
    }
  };

  // Fetch Roles
  const fetchRoles = async () => {
    try {
      setRolesLoading(true);
      setRolesError(null);
      console.log("[AdminUsersConfigContext] Buscando papéis...");
      
      // Inicializa papéis do sistema se necessário
      await roleRepository.initializeSystemRoles();
      
      const rolesData = await roleRepository.getAll();
      console.log("[AdminUsersConfigContext] Papéis encontrados:", rolesData);
      setRoles(rolesData);
    } catch (err: any) {
      console.error("[AdminUsersConfigContext] Erro ao buscar papéis:", err);
      setRolesError(err.message || "Erro ao buscar papéis");
    } finally {
      setRolesLoading(false);
    }
  };

  // Fetch Admin Users
  const fetchAdminUsers = async () => {
    try {
      setAdminUsersLoading(true);
      setAdminUsersError(null);
      console.log("[AdminUsersConfigContext] Buscando administradores...");
      const adminUsersData = await adminUserRepository.getAll();
      console.log("[AdminUsersConfigContext] Administradores encontrados:", adminUsersData);
      setAdminUsers(adminUsersData);
    } catch (err: any) {
      console.error("[AdminUsersConfigContext] Erro ao buscar administradores:", err);
      setAdminUsersError(err.message || "Erro ao buscar administradores");
    } finally {
      setAdminUsersLoading(false);
    }
  };

  // CRUD Operations for Roles
  const createRole = async (role: RoleEntity): Promise<RoleEntity> => {
    const createdRole = await roleRepository.create(role);
    await fetchRoles(); // Refresh data
    return createdRole;
  };

  const updateRole = async (id: string, changes: Partial<RoleEntity>): Promise<void> => {
    await roleRepository.update(id, changes);
    await fetchRoles(); // Refresh data
  };

  const deleteRole = async (id: string): Promise<void> => {
    await roleRepository.delete(id);
    await fetchRoles(); // Refresh data
  };

  // CRUD Operations for Admin Users
  const createAdminUser = async (adminUser: AdminUserEntity): Promise<AdminUserEntity> => {
    const createdAdminUser = await adminUserRepository.create(adminUser);
    await fetchAdminUsers(); // Refresh data
    return createdAdminUser;
  };

  const updateAdminUser = async (uid: string, changes: Partial<AdminUserEntity>): Promise<void> => {
    await adminUserRepository.update(uid, changes);
    await fetchAdminUsers(); // Refresh data
  };

  const deleteAdminUser = async (uid: string): Promise<void> => {
    await adminUserRepository.delete(uid);
    await fetchAdminUsers(); // Refresh data
  };

  // Create New Admin usando UseCase (com autenticação)
  const createNewAdmin = async (input: CreateAdminInput): Promise<CreateAdminOutput> => {
    const result = await createAdminUseCase.execute(input);
    await fetchAdminUsers(); // Refresh data
    return result;
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchPermissions(),
        fetchRoles(),
        fetchAdminUsers()
      ]);
    };
    loadData();
  }, []);

  return (
    <AdminUsersConfigContext.Provider 
      value={{ 
        // Permissions
        permissions, 
        permissionsLoading, 
        permissionsError,
        refetchPermissions: fetchPermissions,
        
        // Roles
        roles, 
        rolesLoading, 
        rolesError,
        refetchRoles: fetchRoles,
        createRole,
        updateRole,
        deleteRole,
        
        // Admin Users
        adminUsers, 
        adminUsersLoading, 
        adminUsersError,
        refetchAdminUsers: fetchAdminUsers,
        createAdminUser,
        updateAdminUser,
        deleteAdminUser,
        
        // Create New Admin with Auth
        createNewAdmin
      }}
    >
      {children}
    </AdminUsersConfigContext.Provider>
  );
}

export function useAdminUsersConfig() {
  const ctx = useContext(AdminUsersConfigContext);
  if (!ctx) throw new Error("useAdminUsersConfig deve ser usado dentro de AdminUsersConfigProvider");
  return ctx;
}
