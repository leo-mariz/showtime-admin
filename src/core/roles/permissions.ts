export const PERMISSIONS = [
  { id: 'view_dashboard', description: 'Ver métricas do app' },
  { id: 'manage_artists', description: 'Gerenciar artistas e conjuntos' },
  { id: 'manage_clients', description: 'Gerenciar clientes' },
  { id: 'view_events', description: 'Consultar eventos' },
  { id: 'manage_support', description: 'Gerenciar mensagens de suporte' },
  { id: 'manage_payments', description: 'Extorno, pagamentos, notas fiscais' },
  { id: 'manage_admins', description: 'Gerenciar usuários do painel' },
  { id: 'manage_categories', description: 'Gerenciar categorias e listas' },
  // ...adicione mais conforme necessário
] as const;

export type PermissionId = typeof PERMISSIONS[number]['id'];