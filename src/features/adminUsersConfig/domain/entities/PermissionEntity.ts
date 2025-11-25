export class PermissionEntity {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public section: string, // "users" | "content" | "admin" | "financial"
    public isActive: boolean = true
  ) {}

  static defaultPermission(): PermissionEntity {
    return new PermissionEntity("", "", "", "users", true);
  }

  // Permissões pré-definidas do sistema
  static readonly SYSTEM_PERMISSIONS = {
    // Seções principais
    DASHBOARD: { id: "dashboard", name: "Dashboard", description: "Visualizar dashboard e estatísticas", section: "content" },
    ARTISTS: { id: "artists", name: "Artistas", description: "Gerenciar artistas da plataforma", section: "users" },
    CLIENTS: { id: "clients", name: "Clientes", description: "Gerenciar clientes da plataforma", section: "users" },
    EVENTS: { id: "events", name: "Eventos", description: "Visualizar e monitorar eventos", section: "content" },
    APP_PARAMETERS: { id: "app_parameters", name: "Parâmetros do App", description: "Gerenciar listas e configurações", section: "admin" },
    ADMIN_MANAGEMENT: { id: "admin_management", name: "Gestão de Admins", description: "Gerenciar administradores e permissões", section: "admin" },
    
    // Seções futuras
    PAYMENTS: { id: "payments", name: "Pagamentos", description: "Gerenciar transações e pagamentos", section: "financial" },
    SUPPORT: { id: "support", name: "Suporte", description: "Atender tickets de suporte", section: "content" },
    REPORTS: { id: "reports", name: "Relatórios", description: "Visualizar relatórios e análises", section: "content" }
  } as const;

  // Seções disponíveis
  static readonly SECTIONS = {
    USERS: "users",
    CONTENT: "content", 
    ADMIN: "admin",
    FINANCIAL: "financial"
  } as const;
}
