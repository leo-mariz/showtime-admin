import { MockDashboardDataService } from "../../data/services/MockDashboardDataService";
import { MetricCard } from "../components/MetricCard";
import { RevenueChart } from "../components/RevenueChart";
import { ConversionFunnel } from "../components/ConversionFunnel";
import { TopArtistsCard } from "../components/TopArtistsCard";
import { AlertsSection } from "../components/AlertsSection";
import { UpcomingEventsCard } from "../components/UpcomingEventsCard";
import { ArtistsSection } from "../components/ArtistsSection";
import { ClientsSection } from "../components/ClientsSection";
import { EventsSection } from "../components/EventsSection";
import { PaymentsSection } from "../components/PaymentsSection";
import { EventsStatusChart } from "../components/EventsStatusChart";
import { PaymentsStatusChart } from "../components/PaymentsStatusChart";
import { PaymentTimeline } from "../components/PaymentTimeline";
import {
  DollarSign,
  Calendar,
  Users,
  CreditCard,
  Home,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent } from "@/core/presentation/components/ui/card";

const Dashboard = () => {
  // Busca dados mockados
  const metrics = MockDashboardDataService.getMockData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Home className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Visão geral do desempenho da plataforma ShowTime
              </p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Atualizado em: {new Date().toLocaleString("pt-BR")}
          </div>
        </div>
      </div>

      {/* Métricas Principais - 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Receita Total"
          value={formatCurrency(metrics.financial.totalRevenueMonth)}
          subtitle={`Take Rate: ${formatCurrency(metrics.getTakeRate())}`}
          icon={DollarSign}
          trend={{
            value: metrics.financial.revenueGrowth,
            isPositive: metrics.financial.revenueGrowth > 0,
          }}
          iconColor="text-green-600"
          iconBgColor="bg-green-100 dark:bg-green-900/20"
        />

        <MetricCard
          title="Pagamentos Pendentes"
          value={formatCurrency(metrics.financial.pendingPayments)}
          subtitle={`${metrics.operational.paymentsDueToday} para hoje`}
          icon={CreditCard}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100 dark:bg-orange-900/20"
        />

        <MetricCard
          title="Total de Usuários"
          value={metrics.users.activeArtists + metrics.users.activeClients}
          subtitle={`${metrics.users.activeArtists} artistas • ${metrics.users.activeClients} clientes`}
          icon={Users}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100 dark:bg-purple-900/20"
        />

        <MetricCard
          title="Eventos do Mês"
          value={metrics.events.totalEventsMonth}
          subtitle={`Taxa de conversão: ${metrics.events.conversionRate.toFixed(1)}%`}
          icon={Calendar}
          trend={{
            value: metrics.events.eventsGrowth,
            isPositive: metrics.events.eventsGrowth > 0,
          }}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100 dark:bg-blue-900/20"
        />
      </div>

      {/* Alertas Críticos */}
      {metrics.alerts.filter((a) => a.type === "error").length > 0 && (
        <AlertsSection alerts={metrics.alerts} />
      )}

      {/* Gráficos Principais - Receita e Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={metrics.revenueHistory} />
        <ConversionFunnel metrics={metrics.events} />
      </div>

      {/* Gráficos de Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EventsStatusChart eventsByStatus={metrics.events.eventsByStatus} />
        <PaymentsStatusChart
          overdue={metrics.payments.overdue}
          contested={metrics.payments.contested}
          pending={metrics.payments.pending}
          paid={metrics.payments.paid}
        />
      </div>

      {/* Seções Detalhadas */}
      <div className="space-y-6">
        {/* Artistas */}
        <ArtistsSection
          total={metrics.artists.total}
          active={metrics.artists.active}
          incomplete={metrics.artists.incomplete}
          incompleteBreakdown={metrics.artists.incompleteBreakdown}
          topArtists={metrics.topArtists}
        />

        {/* Anfitriões */}
        <ClientsSection
          total={metrics.clients.total}
          active={metrics.clients.active}
          withEvents={metrics.clients.withEvents}
          recurrent={metrics.clients.recurrent}
        />

        {/* Eventos */}
        <EventsSection
          total={metrics.events.total}
          upcoming={metrics.events.upcoming}
          finished={metrics.events.finished}
          requests={metrics.events.requests}
          eventsByStatus={metrics.events.eventsByStatus}
        />

        {/* Pagamentos */}
        <PaymentsSection
          overdue={metrics.payments.overdue}
          contested={metrics.payments.contested}
          dueToday={metrics.payments.dueToday}
          pending={metrics.payments.pending}
          paid={metrics.payments.paid}
          overdueAmount={metrics.payments.overdueAmount}
          pendingAmount={metrics.payments.pendingAmount}
        />
      </div>

      {/* Timeline de Pagamentos e Eventos Próximos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PaymentTimeline payments={metrics.paymentTimeline} />
        <UpcomingEventsCard events={metrics.upcomingEvents} />
      </div>

      {/* Métricas Secundárias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Ticket Médio</div>
            <div className="text-2xl font-bold mt-1">
              {formatCurrency(metrics.financial.averageTicket)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Por evento confirmado
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Tempo Médio de Resposta</div>
            <div className="text-2xl font-bold mt-1">
              {metrics.operational.averageResponseTime.toFixed(1)}h
            </div>
            <div className="text-xs text-muted-foreground mt-1">Meta: &lt; 24h</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Taxa de Retenção</div>
            <div className="text-2xl font-bold mt-1 text-green-600">
              {metrics.users.retentionRate.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">Clientes recorrentes</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
