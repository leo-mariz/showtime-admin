import { DashboardMetricsEntity } from "../../domain/entities/DashboardMetricsEntity";

export interface ArtistIncompleteBreakdown {
  section: string;
  count: number;
  artists: string[];
}

export interface PaymentTimeline {
  id: string;
  artistName: string;
  clientName: string;
  value: number;
  deadline: Date;
  hoursRemaining: number;
  status: string;
}

export interface ExtendedDashboardData {
  // Propriedades do DashboardMetricsEntity
  financial: {
    totalRevenueMonth: number;
    revenueGrowth: number;
    predictedRevenue: number;
    pendingPayments: number;
    overduePayments: number;
    averageTicket: number;
  };
  events: {
    totalEventsMonth: number;
    eventsGrowth: number;
    conversionRate: number;
    cancellationRate: number;
    pendingEvents: number;
    eventsByStatus: {
      pending: number;
      accepted: number;
      confirmed: number;
      finished: number;
      cancelled: number;
    };
    // Dados estendidos
    total: number;
    upcoming: number;
    finished: number;
    requests: number;
  };
  users: {
    activeArtists: number;
    activeClients: number;
    newRegistrations: number;
    retentionRate: number;
  };
  operational: {
    averageResponseTime: number;
    openContestations: number;
    paymentsDueToday: number;
  };
  topArtists: Array<{ name: string; revenue: number; eventsCount: number }>;
  revenueHistory: Array<{ month: string; revenue: number }>;
  alerts: Array<{
    id: string;
    type: 'error' | 'warning' | 'info';
    title: string;
    description: string;
    count?: number;
    action?: string;
    link?: string;
  }>;
  upcomingEvents: Array<{
    id: string;
    artistName: string;
    clientName: string;
    date: Date;
    time: string;
    eventType: string;
    value: number;
    status: string;
  }>;
  // Métodos do DashboardMetricsEntity
  getGMV: () => number;
  getTakeRate: () => number;
  getCriticalAlerts: () => Array<{
    id: string;
    type: 'error' | 'warning' | 'info';
    title: string;
    description: string;
    count?: number;
    action?: string;
    link?: string;
  }>;
  getWarningAlerts: () => Array<{
    id: string;
    type: 'error' | 'warning' | 'info';
    title: string;
    description: string;
    count?: number;
    action?: string;
    link?: string;
  }>;
  // Dados estendidos
  artists: {
    total: number;
    active: number;
    incomplete: number;
    incompleteBreakdown: ArtistIncompleteBreakdown[];
  };
  clients: {
    total: number;
    active: number;
    withEvents: number;
    recurrent: number;
  };
  payments: {
    overdue: number;
    contested: number;
    dueToday: number;
    pending: number;
    paid: number;
    overdueAmount: number;
    pendingAmount: number;
  };
  paymentTimeline: PaymentTimeline[];
}

export class MockDashboardDataService {
  static getMockData(): ExtendedDashboardData {
    const baseMetrics = new DashboardMetricsEntity(
      // Financial Metrics
      {
        totalRevenueMonth: 127500.00,
        revenueGrowth: 18.5,
        predictedRevenue: 89300.00,
        pendingPayments: 24500.00,
        overduePayments: 3200.00,
        averageTicket: 2125.00
      },
      // Event Metrics
      {
        totalEventsMonth: 60,
        eventsGrowth: 12.3,
        conversionRate: 78.5,
        cancellationRate: 5.2,
        pendingEvents: 8,
        eventsByStatus: {
          pending: 8,
          accepted: 12,
          confirmed: 15,
          finished: 45,
          cancelled: 3
        }
      },
      // User Metrics
      {
        activeArtists: 142,
        activeClients: 89,
        newRegistrations: 23,
        retentionRate: 67.8
      },
      // Operational Metrics
      {
        averageResponseTime: 4.2,
        openContestations: 2,
        paymentsDueToday: 12
      },
      // Top Artists
      [
        { name: "Leonardo DJ", revenue: 12500, eventsCount: 8 },
        { name: "Maria Silva", revenue: 9800, eventsCount: 6 },
        { name: "João Santos", revenue: 8300, eventsCount: 5 },
        { name: "Ana Costa", revenue: 7600, eventsCount: 4 },
        { name: "Pedro Oliveira", revenue: 6900, eventsCount: 4 }
      ],
      // Revenue History (últimos 6 meses)
      [
        { month: "Set", revenue: 95000 },
        { month: "Out", revenue: 102000 },
        { month: "Nov", revenue: 108000 },
        { month: "Dez", revenue: 125000 },
        { month: "Jan", revenue: 115000 },
        { month: "Fev", revenue: 127500 }
      ],
      // Alerts
      [
        {
          id: "1",
          type: "error",
          title: "Pagamentos Atrasados",
          description: "3 pagamentos estão atrasados e requerem atenção imediata",
          count: 3,
          action: "Ver Pagamentos",
          link: "/payments"
        },
        {
          id: "2",
          type: "warning",
          title: "Pagamentos para Hoje",
          description: "12 pagamentos precisam ser processados hoje",
          count: 12,
          action: "Processar",
          link: "/payments"
        },
        {
          id: "3",
          type: "warning",
          title: "Contestações Pendentes",
          description: "2 contestações aguardando resolução",
          count: 2,
          action: "Revisar",
          link: "/payments"
        },
        {
          id: "4",
          type: "info",
          title: "Eventos Pendentes",
          description: "8 eventos aguardando resposta do artista há mais de 48h",
          count: 8,
          action: "Verificar",
          link: "/events"
        }
      ],
      // Upcoming Events
      [
        {
          id: "evt1",
          artistName: "Leonardo DJ",
          clientName: "João Silva",
          date: new Date(2025, 9, 30, 18, 0),
          time: "18:00",
          eventType: "Casamento",
          value: 2500,
          status: "CONFIRMED"
        },
        {
          id: "evt2",
          artistName: "Maria Silva",
          clientName: "Ana Costa",
          date: new Date(2025, 9, 31, 20, 0),
          time: "20:00",
          eventType: "Aniversário",
          value: 1800,
          status: "CONFIRMED"
        },
        {
          id: "evt3",
          artistName: "João Santos",
          clientName: "Pedro Oliveira",
          date: new Date(2025, 10, 1, 19, 0),
          time: "19:00",
          eventType: "Corporativo",
          value: 3200,
          status: "CONFIRMED"
        },
        {
          id: "evt4",
          artistName: "Ana Costa",
          clientName: "Maria Santos",
          date: new Date(2025, 10, 2, 21, 0),
          time: "21:00",
          eventType: "Festa",
          value: 2000,
          status: "CONFIRMED"
        },
        {
          id: "evt5",
          artistName: "Pedro Oliveira",
          clientName: "Carlos Lima",
          date: new Date(2025, 10, 3, 17, 0),
          time: "17:00",
          eventType: "Casamento",
          value: 2800,
          status: "CONFIRMED"
        }
      ]
    );

    // Dados estendidos
    return {
      // Propriedades do baseMetrics
      financial: baseMetrics.financial,
      events: {
        ...baseMetrics.events,
        // Dados estendidos
        total: 245,
        upcoming: 28,
        finished: 145,
        requests: 12
      },
      users: baseMetrics.users,
      operational: baseMetrics.operational,
      topArtists: baseMetrics.topArtists,
      revenueHistory: baseMetrics.revenueHistory,
      alerts: baseMetrics.alerts,
      upcomingEvents: baseMetrics.upcomingEvents,
      // Métodos do baseMetrics
      getGMV: () => baseMetrics.getGMV(),
      getTakeRate: () => baseMetrics.getTakeRate(),
      getCriticalAlerts: () => baseMetrics.getCriticalAlerts(),
      getWarningAlerts: () => baseMetrics.getWarningAlerts(),
      // Dados estendidos
      artists: {
        total: 185,
        active: 142,
        incomplete: 43,
        incompleteBreakdown: [
          {
            section: "Foto de Perfil",
            count: 12,
            artists: ["Artista A", "Artista B", "Artista C", "..."]
          },
          {
            section: "Informações Profissionais",
            count: 8,
            artists: ["Artista D", "Artista E", "..."]
          },
          {
            section: "Endereço",
            count: 15,
            artists: ["Artista F", "Artista G", "..."]
          },
          {
            section: "Conta Bancária",
            count: 10,
            artists: ["Artista H", "Artista I", "..."]
          },
          {
            section: "Documentos",
            count: 18,
            artists: ["Artista J", "Artista K", "..."]
          }
        ]
      },
      clients: {
        total: 127,
        active: 89,
        withEvents: 67,
        recurrent: 34
      },
      payments: {
        overdue: 3,
        contested: 2,
        dueToday: 12,
        pending: 45,
        paid: 120,
        overdueAmount: 3200.00,
        pendingAmount: 24500.00
      },
      paymentTimeline: [
        {
          id: "p1",
          artistName: "Leonardo DJ",
          clientName: "João Silva",
          value: 2500,
          deadline: new Date(2025, 1, 15, 18, 0),
          hoursRemaining: 2,
          status: "PENDING"
        },
        {
          id: "p2",
          artistName: "Maria Silva",
          clientName: "Ana Costa",
          value: 1800,
          deadline: new Date(2025, 1, 15, 20, 0),
          hoursRemaining: 4,
          status: "PENDING"
        },
        {
          id: "p3",
          artistName: "João Santos",
          clientName: "Pedro Oliveira",
          value: 3200,
          deadline: new Date(2025, 1, 16, 10, 0),
          hoursRemaining: 18,
          status: "PENDING"
        },
        {
          id: "p4",
          artistName: "Ana Costa",
          clientName: "Maria Santos",
          value: 2000,
          deadline: new Date(2025, 1, 17, 14, 0),
          hoursRemaining: 46,
          status: "PENDING"
        }
      ]
    };
  }
}

