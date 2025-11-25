import { AddressInfoEntity } from "@/core/addresses/entities/AddressInfoEntity";
import { EventTypeEntity } from "./EventTypeEntity";

export class EventEntity {
  constructor(
    public date: Date,
    public time: string,
    public duration: number, // em horas
    public address: AddressInfoEntity,
    public status: string = "PENDING",
    public statusPayment: string = "PENDING",
    public value?: number,
    public linkPayment?: string,
    public uid?: string,
    public refArtist?: string,
    public refContractor?: string,
    public nameArtist?: string,
    public nameContractor?: string,
    public eventType?: EventTypeEntity
  ) {}

  static defaultEvent(): EventEntity {
    return new EventEntity(
      new Date(),
      "18:00",
      2, // 2 horas
      new AddressInfoEntity(),
      "PENDING",
      "PENDING"
    );
  }

  // Status do Evento (temporários - ajustar quando tiver definição final)
  static readonly EVENT_STATUS = {
    PENDING: "PENDING", // Evento solicitado pelo cliente
    ACCEPTED: "ACCEPTED", // Artista aceitou
    REFUSED: "REFUSED", // Artista recusou
    CONFIRMED: "CONFIRMED", // Evento confirmado
    IN_PROGRESS: "IN_PROGRESS", // Em andamento
    FINISHED: "FINISHED", // Finalizado
    CANCELLED: "CANCELLED" // Cancelado
  } as const;

  // Status do Pagamento (temporários - ajustar quando tiver definição final)
  static readonly PAYMENT_STATUS = {
    PENDING: "PENDING", // Aguardando pagamento
    PAID: "PAID", // Pago
    REFUNDED: "REFUNDED", // Reembolsado
    CANCELLED: "CANCELLED" // Cancelado
  } as const;

  // Campos para exibição/filtros
  static readonly FIELDS = [
    'uid',
    'date', 
    'time',
    'duration',
    'address',
    'type',
    'status',
    'statusPayment',
    'value',
    'nameArtist',
    'nameContractor'
  ] as const;
}
