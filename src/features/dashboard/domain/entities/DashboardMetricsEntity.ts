export interface FinancialMetrics {
  totalRevenueMonth: number;
  revenueGrowth: number; // Percentual em relação ao mês anterior
  predictedRevenue: number;
  pendingPayments: number;
  overduePayments: number;
  averageTicket: number;
}

export interface EventMetrics {
  totalEventsMonth: number;
  eventsGrowth: number; // Percentual
  conversionRate: number; // Percentual
  cancellationRate: number; // Percentual
  pendingEvents: number;
  eventsByStatus: {
    pending: number;
    accepted: number;
    confirmed: number;
    finished: number;
    cancelled: number;
  };
}

export interface UserMetrics {
  activeArtists: number;
  activeClients: number;
  newRegistrations: number;
  retentionRate: number; // Percentual
}

export interface OperationalMetrics {
  averageResponseTime: number; // Em horas
  openContestations: number;
  paymentsDueToday: number;
}

export interface TopArtist {
  name: string;
  revenue: number;
  eventsCount: number;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
}

export interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  count?: number;
  action?: string;
  link?: string;
}

export interface UpcomingEvent {
  id: string;
  artistName: string;
  clientName: string;
  date: Date;
  time: string;
  eventType: string;
  value: number;
  status: string;
}

export class DashboardMetricsEntity {
  constructor(
    public financial: FinancialMetrics,
    public events: EventMetrics,
    public users: UserMetrics,
    public operational: OperationalMetrics,
    public topArtists: TopArtist[],
    public revenueHistory: RevenueDataPoint[],
    public alerts: Alert[],
    public upcomingEvents: UpcomingEvent[]
  ) {}

  // Calcula GMV (Gross Merchandise Value)
  getGMV(): number {
    return this.financial.totalRevenueMonth;
  }

  // Calcula Take Rate (sua comissão - 20%)
  getTakeRate(): number {
    return this.financial.totalRevenueMonth * 0.2;
  }

  // Retorna alertas críticos (type: error)
  getCriticalAlerts(): Alert[] {
    return this.alerts.filter(alert => alert.type === 'error');
  }

  // Retorna alertas de aviso (type: warning)
  getWarningAlerts(): Alert[] {
    return this.alerts.filter(alert => alert.type === 'warning');
  }
}

