export class PaymentEntity {
  constructor(
    public eventUid: string,
    public eventDate: Date,
    public eventTime: string,
    public eventDuration: number, // em horas
    public artistName: string,
    public clientName: string,
    public valuePaid: number,
    public valueToTransfer: number, // 80% do valor pago
    public status: string = "PENDING",
    public finishedAt: Date, // Data/hora que o evento finalizou
    public paymentDeadline: Date, // Data limite (72h após finalização)
    public hoursRemaining: number, // Horas restantes até o deadline
    public refArtist?: string,
    public refContractor?: string,
    public invoiceUrl?: string,
    public contestationReason?: string
  ) {}

  // Status possíveis
  static readonly STATUS = {
    PENDING: "PENDING", // Aguardando pagamento (dentro das 72h)
    PAID: "PAID", // Pagamento realizado
    CONTESTED: "CONTESTED", // Em contestação
    OVERDUE: "OVERDUE" // Prazo vencido
  } as const;

  // Calcula se o pagamento está atrasado
  isOverdue(): boolean {
    return this.hoursRemaining < 0 && this.status === "PENDING";
  }

  // Calcula se o pagamento é para hoje
  isToday(): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(this.paymentDeadline);
    deadline.setHours(0, 0, 0, 0);
    return deadline.getTime() === today.getTime();
  }

  // Calcula a urgência (menor = mais urgente)
  getUrgencyScore(): number {
    return this.hoursRemaining;
  }
}

