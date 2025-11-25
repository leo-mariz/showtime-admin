export class RoleEntity {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public permissions: string[], // Array de IDs de permissões
    public isActive: boolean = true,
    public createdBy?: string,
    public createdAt?: Date,
    public updatedBy?: string,
    public updatedAt?: Date
  ) {}

  static defaultRole(): RoleEntity {
    return new RoleEntity("", "", "", [], true);
  }

  // Papéis pré-definidos do sistema
  static readonly SYSTEM_ROLES = {
    SUPER_ADMIN: {
      id: "super-admin",
      name: "Super Administrador", 
      description: "Acesso total ao sistema",
      permissions: ["dashboard", "artists", "clients", "events", "app_parameters", "admin_management", "payments", "support", "reports"]
    },
    ADMIN_GERAL: {
      id: "admin-geral",
      name: "Administrador Geral",
      description: "Acesso às principais funcionalidades",
      permissions: ["dashboard", "artists", "clients", "events", "app_parameters"]
    },
    TIME_FRAUDE: {
      id: "time-fraude", 
      name: "Time Fraude",
      description: "Equipe responsável por validações e moderação",
      permissions: ["artists", "events"]
    },
    FINANCEIRO: {
      id: "financeiro",
      name: "Financeiro",
      description: "Equipe responsável por pagamentos e relatórios",
      permissions: ["dashboard", "payments", "reports"]
    },
    SUPORTE: {
      id: "suporte",
      name: "Suporte",
      description: "Equipe de atendimento ao cliente",
      permissions: ["clients", "support", "events"]
    }
  } as const;

  // Status do papel
  static readonly STATUS = {
    ACTIVE: true,
    INACTIVE: false
  } as const;

  // Métodos auxiliares
  hasPermission(permissionId: string): boolean {
    return this.permissions.includes(permissionId);
  }

  addPermission(permissionId: string): void {
    if (!this.hasPermission(permissionId)) {
      this.permissions.push(permissionId);
    }
  }

  removePermission(permissionId: string): void {
    this.permissions = this.permissions.filter(p => p !== permissionId);
  }
}
