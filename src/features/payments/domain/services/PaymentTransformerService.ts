import { EventEntity } from "@/features/events/domain/entities/EventEntity";
import { PaymentEntity } from "../entities/PaymentEntity";

export class PaymentTransformerService {
  /**
   * Transforma eventos finalizados em entidades de pagamento
   * Apenas eventos com status FINISHED são considerados para pagamento
   */
  static transformEventToPayment(event: EventEntity): PaymentEntity | null {
    // Só processa eventos finalizados
    if (event.status !== "FINISHED") {
      return null;
    }

    // Calcula a data/hora de finalização do evento
    const finishedAt = this.calculateFinishedAt(event);
    
    // Calcula o deadline (72 horas após a finalização)
    const paymentDeadline = new Date(finishedAt.getTime() + 72 * 60 * 60 * 1000);
    
    // Calcula horas restantes até o deadline
    const hoursRemaining = this.calculateHoursRemaining(paymentDeadline);
    
    // Calcula valores
    const valuePaid = event.value || 0;
    const valueToTransfer = valuePaid * 0.8; // 80% do valor pago
    
    // Determina o status do pagamento
    let status = "PENDING";
    if (event.statusPayment === "PAID") {
      status = "PAID";
    } else if (hoursRemaining < 0) {
      status = "OVERDUE";
    }

    return new PaymentEntity(
      event.uid || "",
      event.date,
      event.time,
      event.duration,
      event.nameArtist || "Não informado",
      event.nameContractor || "Não informado",
      valuePaid,
      valueToTransfer,
      status,
      finishedAt,
      paymentDeadline,
      hoursRemaining,
      event.refArtist,
      event.refContractor
    );
  }

  /**
   * Transforma múltiplos eventos em pagamentos
   */
  static transformEventsToPayments(events: EventEntity[]): PaymentEntity[] {
    return events
      .map(event => this.transformEventToPayment(event))
      .filter((payment): payment is PaymentEntity => payment !== null);
  }

  /**
   * Calcula a data/hora de finalização do evento
   * Data do evento + hora de início + duração
   */
  private static calculateFinishedAt(event: EventEntity): Date {
    const eventDate = new Date(event.date);
    
    // Parse da hora (formato: "HH:MM")
    const [hours, minutes] = event.time.split(':').map(Number);
    
    // Adiciona hora de início
    eventDate.setHours(hours || 0, minutes || 0, 0, 0);
    
    // Adiciona duração (em horas)
    eventDate.setHours(eventDate.getHours() + event.duration);
    
    return eventDate;
  }

  /**
   * Calcula horas restantes até o deadline
   */
  private static calculateHoursRemaining(deadline: Date): number {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    return Math.floor(diff / (1000 * 60 * 60)); // Converte para horas
  }

  /**
   * Ordena pagamentos por urgência (mais urgente primeiro)
   */
  static sortByUrgency(payments: PaymentEntity[]): PaymentEntity[] {
    return [...payments].sort((a, b) => a.getUrgencyScore() - b.getUrgencyScore());
  }

  /**
   * Filtra pagamentos para hoje
   */
  static filterToday(payments: PaymentEntity[]): PaymentEntity[] {
    return payments.filter(p => p.isToday());
  }

  /**
   * Filtra pagamentos pendentes
   */
  static filterPending(payments: PaymentEntity[]): PaymentEntity[] {
    return payments.filter(p => p.status === "PENDING" || p.status === "OVERDUE");
  }

  /**
   * Filtra pagamentos concluídos
   */
  static filterCompleted(payments: PaymentEntity[]): PaymentEntity[] {
    return payments.filter(p => p.status === "PAID");
  }

  /**
   * Filtra pagamentos em contestação
   */
  static filterContested(payments: PaymentEntity[]): PaymentEntity[] {
    return payments.filter(p => p.status === "CONTESTED");
  }
}

