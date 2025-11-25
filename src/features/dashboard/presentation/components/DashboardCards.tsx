
import { StatsCard } from "@/core/presentation/components/shared/StatsCard";
import { Calendar, MessageSquare, User, DollarSign } from "lucide-react";
import { mockDashboardMetrics } from "@/utils/mockData";

export const DashboardCards = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Eventos Ativos"
        value={mockDashboardMetrics.activeEvents}
        icon={<Calendar className="h-5 w-5 text-showtime-orange" />}
        trend={{ value: 12, isPositive: true }}
      />
      <StatsCard
        title="Artistas Pendentes"
        value={mockDashboardMetrics.pendingArtists}
        icon={<User className="h-5 w-5 text-showtime-orange" />}
        trend={{ value: 5, isPositive: false }}
      />
      <StatsCard
        title="Tickets de Suporte"
        value={mockDashboardMetrics.openTickets}
        icon={<MessageSquare className="h-5 w-5 text-showtime-orange" />}
        trend={{ value: 8, isPositive: true }}
      />
      <StatsCard
        title="Receita Mensal"
        value={formatCurrency(mockDashboardMetrics.monthlyRevenue)}
        icon={<DollarSign className="h-5 w-5 text-showtime-orange" />}
        trend={{ value: 15, isPositive: true }}
      />
    </div>
  );
};
