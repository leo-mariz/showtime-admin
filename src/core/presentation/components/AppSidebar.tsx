
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/utils/utils";
import {
  Home,
  Users,
  Calendar,
  Settings,
  User,
  UserCheck,
  UsersRound,
  LogOut,
  HeadphonesIcon,
  CreditCard,
  List
} from "lucide-react";
import { useAuth } from "@/features/authentication/presentation/context/AuthContext";
import { usePermissions } from "@/features/adminUsersConfig/presentation/hooks/usePermissions";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/core/presentation/components/ui/sidebar";
import { Button } from "@/core/presentation/components/ui/button";
import { toast } from "sonner";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home, permission: "dashboard" },
  { name: "Artistas", href: "/artists", icon: User, permission: "artists" },
  { name: "Anfitriões", href: "/clients", icon: UserCheck, permission: "clients" },
  { name: "Eventos", href: "/events", icon: Calendar, permission: "events" },
  { name: "Pagamentos", href: "/payments", icon: CreditCard, permission: "payments" },
  { name: "Gestão de Admins", href: "/admin-management", icon: Settings, permission: "admin_management" },
  { name: "Parâmetros do App", href: "/app-parameters", icon: List, permission: "app_parameters" },
  // { name: "Conjuntos", href: "/groups", icon: UsersRound },
  // { name: "Suporte", href: "/support", icon: HeadphonesIcon },
  // { name: "Usuários", href: "/users", icon: Users },
  // { name: "Configurações", href: "/settings", icon: Settings },
];

export const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAuth();
  const { hasPermission, isReady } = usePermissions();

  // Filtrar navegação com base nas permissões
  const visibleNavigation = navigation.filter(item => {
    if (!item.permission) return true; // Itens sem permissão são sempre visíveis
    if (!isReady) return false; // Não mostra nada enquanto não está pronto
    return hasPermission(item.permission);
  });
  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await logout();
      toast.success("Logout realizado com sucesso!");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Falha ao realizar logout");
    }
  };

  return (
    <Sidebar className="bg-showtime-dark-gray border-r-0">
      <SidebarHeader className="border-b border-white/10 p-4">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/lovable-uploads/af3ef615-ccbb-43e9-bb59-c91badb8813d.png" 
            alt="ShowTime Logo"
            className="h-8"
          />
          <span className="text-xl font-bold text-white">ShowTime</span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-2">
              {visibleNavigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.href}
                    className={cn(
                      "text-white hover:bg-white/10 data-[active=true]:bg-showtime-orange data-[active=true]:text-white",
                      "group-data-[collapsible=icon]:justify-center"
                    )}
                  >
                    <Link to={item.href} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {item.name}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-showtime flex items-center justify-center text-white font-bold">
            {admin?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="flex-1 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium text-white">{admin?.name || "Admin ShowTime"}</p>
            <p className="text-xs text-white/60">{admin?.email || "admin@showtime.com"}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            className="text-white hover:bg-white/10"
            title="Sair"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
