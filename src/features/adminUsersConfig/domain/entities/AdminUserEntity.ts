export class AdminUserEntity {
  constructor(
    public uid: string,
    public name: string,
    public email: string,
    public roleId: string, // Referência ao papel
    public isActive: boolean = true,
    public isFirstAccess: boolean = true, // Indica se é o primeiro acesso do admin
    public lastLogin?: Date,
    public createdBy?: string,
    public createdAt?: Date,
    public updatedBy?: string,
    public updatedAt?: Date
  ) {}

  static defaultAdminUser(): AdminUserEntity {
    return new AdminUserEntity("", "", "", "", true);
  }

  // Status do usuário administrativo
  static readonly STATUS = {
    ACTIVE: true,
    INACTIVE: false
  } as const;

  // Tipos de administrador (baseado no papel)
  static readonly ADMIN_TYPES = {
    SUPER_ADMIN: "super-admin",
    ADMIN_GERAL: "admin-geral", 
    TIME_FRAUDE: "time-fraude",
    FINANCEIRO: "financeiro",
    SUPORTE: "suporte"
  } as const;

  // Métodos auxiliares
  isOnline(): boolean {
    if (!this.lastLogin) return false;
    const now = new Date();
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
    return this.lastLogin > thirtyMinutesAgo;
  }

  getStatusLabel(): string {
    if (!this.isActive) return "Inativo";
    return this.isOnline() ? "Online" : "Offline";
  }

  canBeEditedBy(editorRoleId: string): boolean {
    // Super admin pode editar qualquer um
    if (editorRoleId === AdminUserEntity.ADMIN_TYPES.SUPER_ADMIN) return true;
    
    // Outros não podem editar super admins
    if (this.roleId === AdminUserEntity.ADMIN_TYPES.SUPER_ADMIN) return false;
    
    // Admin geral pode editar papéis menores
    if (editorRoleId === AdminUserEntity.ADMIN_TYPES.ADMIN_GERAL) {
      return ![AdminUserEntity.ADMIN_TYPES.SUPER_ADMIN, AdminUserEntity.ADMIN_TYPES.ADMIN_GERAL].includes(this.roleId as any);
    }
    
    return false;
  }
}
